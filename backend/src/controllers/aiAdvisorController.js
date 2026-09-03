const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free-tier OpenRouter models, tried in order. OpenRouter's free models sit
// behind a SHARED upstream rate-limit pool per provider — under load a model
// can 429 for reasons that have nothing to do with this app's own usage —
// so a single model name isn't reliable enough on its own. Kept as an
// ordered list (not one constant) so a saturated/retired model degrades to
// the next rather than failing the whole request. Verified working
// 2026-09-03 — check GET https://openrouter.ai/api/v1/models for current
// `:free`-suffixed entries if all of these start failing.
const MODELS = ["z-ai/glm-5.2:free", "minimax/minimax-m3:free", "nvidia/nemotron-3-super-120b-a12b:free"];

const SYSTEM_PROMPT = `You are the AI Career Advisor inside AcademiaLink, a student skill-and-placement platform.

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
    const apiKey = process.env.OPENROUTER_API_KEY;
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
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Student's current data:\n${contextSummary}` },
      { role: "user", content: message.trim() },
    ];

    const { reply, error: upstreamError } = await callOpenRouterWithFallback(apiKey, messages);
    if (!reply) {
      console.error("All OpenRouter models failed:", upstreamError);
      return res.status(502).json({ error: "AI Career Advisor is temporarily unavailable. Please try again in a moment." });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI advisor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Tries each free model in order, moving to the next on a 429 (rate-limited)
// or 404 (model retired) rather than failing the whole request — the point
// of a fallback list instead of one hardcoded model.
async function callOpenRouterWithFallback(apiKey, messages) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "AcademiaLink AI Career Advisor",
        },
        body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 500 }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        lastError = `${model} -> ${response.status}: ${errText.slice(0, 300)}`;
        console.warn("OpenRouter model unavailable, trying next:", lastError);
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return { reply };
      lastError = `${model} -> empty response`;
    } catch (err) {
      lastError = `${model} -> ${err.message}`;
      console.warn("OpenRouter request failed, trying next:", lastError);
    }
  }

  return { reply: null, error: lastError };
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
