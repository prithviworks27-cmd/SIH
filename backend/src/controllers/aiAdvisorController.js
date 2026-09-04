import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

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

async function callGemini(apiKey, prompt, history = []) {
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
