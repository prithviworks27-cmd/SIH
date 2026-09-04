import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

// How many prior turns (user+assistant messages combined) to replay to
// Gemini as conversation history so a follow-up like "tell me more about
// that" resolves with context, without the prompt growing unbounded.
const HISTORY_TURNS = 8;

const SYSTEM_PROMPT = `You are the AI Career Advisor inside SkillBridge, a student skill-and-placement platform.

You are given the student's REAL current data: their verified skill profile, their selected target role and its readiness breakdown, and the specific skills they have vs. still need for that role. Never invent skills, scores, or roles that aren't in the provided data.

Ground rules:
- Be concise and encouraging, not generic. Reference the student's actual numbers (e.g. "You're at 72% readiness for Data Analyst").
- Structure your answer roughly as: current readiness -> skills they already have -> skills they still need -> 2-4 concrete recommended next steps (in priority order).
- If they ask about a role that isn't in the provided target-role data, say you can only give a data-backed answer for a role they've selected as their target on the platform, and suggest they set it there first.
- You RECOMMEND. You do not verify skills or make placement decisions — final verification always comes from real assessments, projects, or institution/industry review, not from you. Say this if it's relevant to the question.
- Keep responses under ~180 words unless the student asks for more detail.
- Reply in PLAIN TEXT only — no markdown (no **bold**, no # headers, no markdown bullet syntax). Use line breaks and plain "-" or numbered lists if you need structure; the UI renders your response as plain text exactly as written.`;

// GET /api/ai-advisor/history — the persisted conversation, oldest first, so
// reopening /ai-advisor renders where the student left off instead of always
// starting empty.
export const getConversationHistory = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("ai_advisor_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch AI advisor history error:", error);
      return res.status(500).json({ error: "Failed to load conversation history" });
    }

    res.status(200).json({
      messages: data.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.created_at })),
    });
  } catch (error) {
    console.error("Get AI advisor history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// The frontend sends the student's real data (readiness %, matched/missing
// skills, target role) rather than the backend re-deriving it — that data
// lives in the frontend's skill-profile/career-role services (localStorage +
// Supabase-backed skill tests), not in a backend table the server can query
// independently. This keeps the advisor grounded in real numbers without
// requiring a second copy of that logic server-side.
export const askCareerAdvisor = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI Career Advisor is not configured on the server." });
    }

    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { message, context } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A message is required." });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message is too long (max 1000 characters)." });
    }
    const trimmedMessage = message.trim();

    // Recent turns for context, oldest-first, capped at HISTORY_TURNS so the
    // request doesn't grow unbounded over a long-running conversation.
    const { data: recentHistory, error: historyError } = await supabase
      .from("ai_advisor_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_TURNS);
    if (historyError) console.error("Fetch AI advisor recent history error:", historyError); // non-fatal — fall back to no history

    const history = (recentHistory ?? []).slice().reverse();

    const contextSummary = buildContextSummary(context);
    const prompt = `Student's current data:\n${contextSummary}\n\nStudent's question:\n${trimmedMessage}`;
    const { reply, error: upstreamError } = await callGemini(apiKey, prompt, history);
    if (!reply) {
      console.error("Gemini request failed:", upstreamError);
      return res.status(502).json({ error: "AI Career Advisor is temporarily unavailable. Please try again in a moment." });
    }

    // Persist both turns. Best-effort: if this fails the student still gets
    // their reply, they just won't see it on next reload — not worth
    // failing an otherwise-successful answer over.
    const { error: saveError } = await supabase.from("ai_advisor_messages").insert([
      { user_id: userId, role: "user", content: trimmedMessage },
      { user_id: userId, role: "assistant", content: reply },
    ]);
    if (saveError) console.error("Save AI advisor turn error:", saveError);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI advisor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const generateSkillRoadmap = async (req, res) => {
  try {
    const { skill, currentLevel, format = "roadmap" } = req.body;
    if (!skill || typeof skill !== "string" || skill.length > 150) {
      return res.status(400).json({ error: "A valid skill is required." });
    }
    if (!["module", "roadmap"].includes(format)) {
      return res.status(400).json({ error: "Format must be module or roadmap." });
    }

    const skillName = skill.trim();
    const prompt = buildRoadmapPrompt(skillName, currentLevel, format);
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    let roadmap = null;
    let upstreamError = null;

    if (openRouterKey) {
      ({ roadmap, error: upstreamError } = await callOpenRouter(openRouterKey, prompt));
    }
    if (!roadmap && geminiKey) {
      ({ roadmap, error: upstreamError } = await callGeminiRoadmap(geminiKey, prompt));
    }
    if (!roadmap) {
      console.error("Roadmap generation failed:", upstreamError);
      return res.status(503).json({ error: "Roadmap generation is temporarily unavailable." });
    }

    const provider = openRouterKey ? "openrouter" : "gemini";
    const model = openRouterKey ? OPENROUTER_MODEL : GEMINI_MODEL;
    res.status(200).json({ roadmap, provider, model, cached: false });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// How close together (ms) two skill_test_results rows' completed_at values
// must be to count as the "same run" — DynamicTestRun submits every
// selected skill within milliseconds of each other (Promise.all), so a
// generous 2-minute window comfortably covers one run without pulling in an
// unrelated earlier retake of some other skill.
const SAME_RUN_WINDOW_MS = 2 * 60 * 1000;

// GET /api/ai-advisor/analyze-latest-run
// Analyzes the student's most recently completed skill-test run (one or more
// skills submitted together from DynamicTestRun.jsx) — strengths, weaknesses,
// and an improvement roadmap grounded in the actual scores and per-level
// (beginner/intermediate/advanced) breakdowns, never invented. Reuses the
// same OpenRouter/Gemini JSON-mode call path as generateSkillRoadmap.
export const analyzeLatestSkillRun = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data: recent, error: fetchError } = await supabase
      .from("skill_test_results")
      .select("skill_name, score_percent, passing_score, passed, level_breakdown, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(30);

    if (fetchError) {
      console.error("Fetch latest skill run error:", fetchError);
      return res.status(500).json({ error: "Failed to load your assessment results" });
    }

    if (!recent || recent.length === 0) {
      return res.status(404).json({ error: "Take a skill assessment first to get an analysis of your results." });
    }

    // Cluster the newest row together with every row within SAME_RUN_WINDOW_MS
    // of it — that's "this run", whether it was one skill or several.
    const latestTime = new Date(recent[0].completed_at).getTime();
    const batch = recent.filter((r) => latestTime - new Date(r.completed_at).getTime() <= SAME_RUN_WINDOW_MS);

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!openRouterKey && !geminiKey) {
      return res.status(503).json({ error: "AI skill analysis is not configured on the server." });
    }

    const prompt = buildAnalysisPrompt(batch);
    let analysis = null;
    let upstreamError = null;

    if (openRouterKey) {
      ({ analysis, error: upstreamError } = await callOpenRouterAnalysis(openRouterKey, prompt));
    }
    if (!analysis && geminiKey) {
      ({ analysis, error: upstreamError } = await callGeminiAnalysis(geminiKey, prompt));
    }
    if (!analysis) {
      console.error("Skill analysis generation failed:", upstreamError);
      return res.status(503).json({ error: "Skill analysis is temporarily unavailable. Please try again in a moment." });
    }

    const provider = openRouterKey ? "openrouter" : "gemini";
    const model = openRouterKey ? OPENROUTER_MODEL : GEMINI_MODEL;
    res.status(200).json({
      analysis,
      basedOn: batch.map((r) => ({ skillName: r.skill_name, scorePercent: r.score_percent, passed: r.passed })),
      provider,
      model,
    });
  } catch (error) {
    console.error("Analyze latest skill run error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function buildAnalysisPrompt(batch) {
  const dataLines = batch
    .map((r) => {
      const levelPart = Array.isArray(r.level_breakdown) && r.level_breakdown.length > 0
        ? " Level breakdown: " +
          r.level_breakdown.map((lb) => `${lb.level} ${lb.correct}/${lb.total} (${lb.scorePercent}%)`).join(", ") + "."
        : "";
      return `- ${r.skill_name}: ${r.score_percent}% overall (passing score ${r.passing_score}%, ${r.passed ? "passed" : "not passed"}).${levelPart}`;
    })
    .join("\n");

  return `A student just completed a skill assessment run. Here is their REAL, exact data — do not invent any skill, number, or level not listed here:
${dataLines}

Analyze this data and respond with strict JSON only, no markdown, no commentary outside the JSON, in this exact shape:
{"strengths":[{"skill":"...","note":"one sentence, reference the actual score/level"}],"weaknesses":[{"skill":"...","note":"one sentence, reference the actual score/level"}],"roadmap":[{"title":"...","focus":"which skill/level this step targets","steps":["concrete action 1","concrete action 2","concrete action 3"]}]}

Rules:
- strengths: skills or levels within a skill that scored well (e.g. high overall %, or a specific level like "advanced" scoring highest) — 1 to 4 entries, only ones justified by the data above.
- weaknesses: skills or levels that scored lowest or failed — 1 to 4 entries, only ones justified by the data above. If a skill has a level_breakdown, prefer calling out the specific weak level (e.g. "advanced JavaScript" rather than just "JavaScript") over the whole skill when only one level is weak.
- roadmap: 3 to 5 ordered steps, each targeting the weakest areas first, with concrete, actionable steps a student can start this week (specific topics/practice, not vague advice like "practice more").
- Every claim must be traceable to a number in the data above. Do not mention skills that aren't listed.`;
}

async function callOpenRouterAnalysis(apiKey, prompt) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173",
        "X-Title": "SIH Student Portal",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You analyze student assessment data and return valid JSON only, grounded strictly in the provided numbers." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) return { analysis: null, error: `${response.status}: ${(await response.text()).slice(0, 300)}` };
    const data = await response.json();
    return parseAnalysis(data?.choices?.[0]?.message?.content);
  } catch (error) {
    return { analysis: null, error: error.message };
  }
}

async function callGeminiAnalysis(apiKey, prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Return valid JSON only for the requested skill analysis." }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200, responseMimeType: "application/json" },
      }),
    });
    if (!response.ok) return { analysis: null, error: `${response.status}: ${(await response.text()).slice(0, 300)}` };
    const data = await response.json();
    return parseAnalysis(data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n"));
  } catch (error) {
    return { analysis: null, error: error.message };
  }
}

function parseAnalysis(content) {
  try {
    const analysis = JSON.parse(content);
    if (!Array.isArray(analysis?.strengths) || !Array.isArray(analysis?.weaknesses) || !Array.isArray(analysis?.roadmap)) {
      return { analysis: null, error: "The model returned an incomplete analysis" };
    }
    return { analysis, error: null };
  } catch {
    return { analysis: null, error: "The model returned invalid JSON" };
  }
}

function buildRoadmapPrompt(skill, currentLevel, format) {
  return `Create a practical ${format} learning roadmap for the specific skill "${skill}"${currentLevel ? `, considering the student's current level "${currentLevel}"` : ""}.
The roadmap must take a complete beginner to advanced/expert capability in a logical sequence. Cover these progression stages in order: Beginner fundamentals, Core foundations, Intermediate application, Advanced engineering or analysis, and Expert-level production practice. Do not skip foundations or assume prior knowledge. Every step must focus only on "${skill}" and must contain concrete topics, a learning activity, a practice exercise, and an applied task.
Return valid JSON only with this shape:
{"title":"...","summary":"...","steps":[{"title":"...","topics":["..."],"learn":"...","practice":"...","apply":"..."}],"project":{"title":"...","description":"..."},"resources":[{"type":"documentation","label":"...","url":"https://..."},{"type":"free-course","label":"...","url":"https://..."}]}
Use official documentation and genuinely free learning resources. Include exactly 5 ordered steps, one for each progression stage, and finish with a practical production-style project. Keep URLs direct and relevant to "${skill}". Do not include markdown or commentary outside the JSON.`;
}

async function callOpenRouter(apiKey, prompt) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173",
        "X-Title": "SIH Student Portal",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You create accurate, structured learning roadmaps. Return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1800,
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) return { roadmap: null, error: `${response.status}: ${(await response.text()).slice(0, 300)}` };
    const data = await response.json();
    return parseRoadmap(data?.choices?.[0]?.message?.content);
  } catch (error) {
    return { roadmap: null, error: error.message };
  }
}

async function callGeminiRoadmap(apiKey, prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Return valid JSON only for the requested learning roadmap." }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1800, responseMimeType: "application/json" },
      }),
    });
    if (!response.ok) return { roadmap: null, error: `${response.status}: ${(await response.text()).slice(0, 300)}` };
    const data = await response.json();
    return parseRoadmap(data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n"));
  } catch (error) {
    return { roadmap: null, error: error.message };
  }
}

function parseRoadmap(content) {
  try {
    const roadmap = JSON.parse(content);
    if (!roadmap?.title || !Array.isArray(roadmap.steps) || roadmap.steps.length === 0) {
      return { roadmap: null, error: "The model returned an incomplete roadmap" };
    }
    return { roadmap, error: null };
  } catch {
    return { roadmap: null, error: "The model returned invalid JSON" };
  }
}

async function callGemini(apiKey, prompt) {
  try {
    // Prior turns come first (each mapped to Gemini's role names — its API
    // uses "model" for the assistant, not "assistant"), then the current
    // question as the final "user" turn — a single multi-turn contents
    // array, not a single-message request, so follow-ups actually resolve
    // against what was said before.
    const contents = [
      ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      { role: "user", parts: [{ text: prompt }] },
    ];

    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return { reply: null, error: `${response.status}: ${errorText.slice(0, 300)}` };
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    return reply ? { reply } : { reply: null, error: "Gemini returned an empty response" };
  } catch (error) {
    return { reply: null, error: error.message };
  }
}

function buildContextSummary(context) {
  if (!context || typeof context !== "object") return "No profile data was provided.";

  const lines = [];

  if (context.targetRole) {
    lines.push(`Target role: ${context.targetRole}`);
  }
  if (typeof context.readinessPercent === "number") {
    lines.push(`Readiness for target role: ${context.readinessPercent}%`);
  }
  if (Array.isArray(context.matchedSkills) && context.matchedSkills.length > 0) {
    lines.push(`Skills already verified for this role: ${context.matchedSkills.map((s) => s.name ?? s).join(", ")}`);
  }
  if (Array.isArray(context.missingSkills) && context.missingSkills.length > 0) {
    lines.push(`Skills still missing for this role: ${context.missingSkills.map((s) => s.name ?? s).join(", ")}`);
  }
  if (Array.isArray(context.allSkills) && context.allSkills.length > 0) {
    const summary = context.allSkills.map((s) => `${s.name} (${s.currentScore}%, ${s.trustLevel})`).join("; ");
    lines.push(`Full verified skill profile: ${summary}`);
  }

  return lines.length > 0 ? lines.join("\n") : "No profile data was provided.";
}
