const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

const SYSTEM_PROMPT = `You are the AI Career Advisor inside SkillBridge, a student skill-and-placement platform.

You are given the student's REAL current data: their verified skill profile, their selected target role and its readiness breakdown, and the specific skills they have vs. still need for that role. Never invent skills, scores, or roles that aren't in the provided data.

Ground rules:
- Be concise and encouraging, not generic. Reference the student's actual numbers (e.g. "You're at 72% readiness for Data Analyst").
- Structure your answer roughly as: current readiness -> skills they already have -> skills they still need -> 2-4 concrete recommended next steps (in priority order).
- If they ask about a role that isn't in the provided target-role data, say you can only give a data-backed answer for a role they've selected as their target on the platform, and suggest they set it there first.
- You RECOMMEND. You do not verify skills or make placement decisions — final verification always comes from real assessments, projects, or institution/industry review, not from you. Say this if it's relevant to the question.
- Keep responses under ~180 words unless the student asks for more detail.
- Reply in PLAIN TEXT only — no markdown (no **bold**, no # headers, no markdown bullet syntax). Use line breaks and plain "-" or numbered lists if you need structure; the UI renders your response as plain text exactly as written.`;

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

    const { message, context } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A message is required." });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message is too long (max 1000 characters)." });
    }

    const contextSummary = buildContextSummary(context);
    const prompt = `Student's current data:\n${contextSummary}\n\nStudent's question:\n${message.trim()}`;
    const { reply, error: upstreamError } = await callGemini(apiKey, prompt);
    if (!reply) {
      console.error("Gemini request failed:", upstreamError);
      return res.status(502).json({ error: "AI Career Advisor is temporarily unavailable. Please try again in a moment." });
    }

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
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
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
