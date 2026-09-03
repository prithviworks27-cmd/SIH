import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

// GET /api/portfolio — basics + all child collections in one response,
// matching the shape portfolioService.getPortfolio() already returns to the
// rest of the frontend (headline/bio/avatarUrl/institution/... + arrays).
export const getPortfolio = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const [basics, projects, certifications, internships, achievements] = await Promise.all([
      supabase.from("portfolio_basics").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("portfolio_projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_certifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_internships").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_achievements").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    for (const [label, result] of Object.entries({ basics, projects, certifications, internships, achievements })) {
      if (result.error) {
        console.error(`Fetch portfolio ${label} error:`, result.error);
        return res.status(500).json({ error: "Failed to load portfolio" });
      }
    }

    res.status(200).json({
      basics: basics.data
        ? {
            headline: basics.data.headline,
            bio: basics.data.bio,
            avatarUrl: basics.data.avatar_url,
            institution: basics.data.institution,
            expectedGraduation: basics.data.expected_graduation,
          }
        : null,
      projects: projects.data.map((p) => ({ id: p.id, title: p.title, description: p.description, skills: p.skills, trustLevel: p.trust_level })),
      certifications: certifications.data.map((c) => ({ id: c.id, title: c.title, issuer: c.issuer, date: c.issued_date, relatedSkill: c.related_skill })),
      internships: internships.data.map((i) => ({ id: i.id, role: i.role, company: i.company, period: i.period, note: i.note })),
      achievements: achievements.data.map((a) => a.description),
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/portfolio/basics — only the editable fields, matching
// portfolioService.savePortfolioBasics(). Projects/certifications/
// internships/achievements aren't editable from the UI yet (same as before
// this migration), so no write endpoints for those child tables yet either —
// they're seeded once from DEFAULT_PORTFOLIO by the frontend on first save.
export const savePortfolioBasics = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { headline, bio, avatarUrl, institution, expectedGraduation } = req.body;

    const { error } = await supabase.from("portfolio_basics").upsert(
      {
        user_id: userId,
        headline,
        bio,
        avatar_url: avatarUrl,
        institution,
        expected_graduation: expectedGraduation,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Save portfolio basics error:", error);
      return res.status(500).json({ error: "Failed to save portfolio" });
    }

    res.status(200).json({ headline, bio, avatarUrl, institution, expectedGraduation });
  } catch (error) {
    console.error("Save portfolio basics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/portfolio/seed — one-time helper: if a user has no portfolio row
// yet, seed all 5 tables from the DEFAULT_PORTFOLIO the frontend already
// ships (mockData/portfolio.js), so a first-time user sees the same rich
// demo content the localStorage version showed instead of an empty page.
// Frontend calls this once, guarded by "basics === null" from getPortfolio.
export const seedPortfolio = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { basics, projects, certifications, internships, achievements } = req.body;
    if (!basics) return res.status(400).json({ error: "basics is required" });

    // Guard against double-seeding (e.g. React StrictMode's double-invoked
    // effects in dev, or a slow-network double-click) inserting the child
    // rows twice — portfolio_basics is upsert-safe on its own (PK = user_id),
    // but portfolio_projects/certifications/internships/achievements have no
    // natural unique key, so a second insert would duplicate them. If a
    // basics row already exists, treat this as already-seeded and no-op.
    const { data: existing } = await supabase.from("portfolio_basics").select("user_id").eq("user_id", userId).maybeSingle();
    if (existing) {
      return res.status(200).json({ seeded: false, alreadyExisted: true });
    }

    const { error: basicsError } = await supabase.from("portfolio_basics").upsert(
      {
        user_id: userId,
        headline: basics.headline,
        bio: basics.bio,
        avatar_url: basics.avatarUrl,
        institution: basics.institution,
        expected_graduation: basics.expectedGraduation,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (basicsError) throw basicsError;

    if (Array.isArray(projects) && projects.length > 0) {
      const { error } = await supabase.from("portfolio_projects").insert(
        projects.map((p) => ({ user_id: userId, title: p.title, description: p.description, skills: p.skills ?? [], trust_level: p.trustLevel }))
      );
      if (error) throw error;
    }
    if (Array.isArray(certifications) && certifications.length > 0) {
      const { error } = await supabase.from("portfolio_certifications").insert(
        certifications.map((c) => ({ user_id: userId, title: c.title, issuer: c.issuer, issued_date: c.date, related_skill: c.relatedSkill }))
      );
      if (error) throw error;
    }
    if (Array.isArray(internships) && internships.length > 0) {
      const { error } = await supabase.from("portfolio_internships").insert(
        internships.map((i) => ({ user_id: userId, role: i.role, company: i.company, period: i.period, note: i.note }))
      );
      if (error) throw error;
    }
    if (Array.isArray(achievements) && achievements.length > 0) {
      const { error } = await supabase.from("portfolio_achievements").insert(achievements.map((description) => ({ user_id: userId, description })));
      if (error) throw error;
    }

    res.status(201).json({ seeded: true });
  } catch (error) {
    console.error("Seed portfolio error:", error);
    res.status(500).json({ error: "Failed to seed portfolio" });
  }
};
