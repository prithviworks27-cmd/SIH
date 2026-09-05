import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

function mapCertification(c) {
  return {
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    date: c.issued_date,
    relatedSkill: c.related_skill,
    fileUrl: c.file_url,
    fileName: c.file_name,
    verificationStatus: c.verification_status,
  };
}

// GET /api/portfolio/public/:userId — UNAUTHENTICATED. Backs the real
// /passport/:userId share link (replaces the old fake
// https://skillbridge.edu/passport/{...} URL, which pointed at a domain and
// route that never existed). Respects the student's own Portfolio Visibility
// preference (Settings > Privacy) — 'Private' or 'Institution Only' both
// decline here since this route has no institution-membership concept to
// check; only 'Public' (the default) actually serves data. Certificate file
// URLs are omitted for pending/rejected/unverified certs — an outside viewer
// only ever sees a certificate as evidence once it's actually verified.
export const getPublicPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error: userError } = await supabase.from("users").select("id, name").eq("id", userId).maybeSingle();
    if (userError) {
      console.error("Fetch public portfolio user error:", userError);
      return res.status(500).json({ error: "Failed to load portfolio" });
    }
    if (!user) return res.status(404).json({ error: "Portfolio not found" });

    const { data: prefs } = await supabase.from("notification_preferences").select("portfolio_visibility").eq("user_id", userId).maybeSingle();
    if (prefs && prefs.portfolio_visibility !== "Public") {
      return res.status(403).json({ error: "This portfolio is not publicly shared." });
    }

    const [basics, projects, certifications, internships, achievements] = await Promise.all([
      supabase.from("portfolio_basics").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("portfolio_projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_certifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_internships").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("portfolio_achievements").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    for (const result of [basics, projects, certifications, internships, achievements]) {
      if (result.error) {
        console.error("Fetch public portfolio error:", result.error);
        return res.status(500).json({ error: "Failed to load portfolio" });
      }
    }

    res.status(200).json({
      name: user.name,
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
      certifications: certifications.data.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        date: c.issued_date,
        relatedSkill: c.related_skill,
        verificationStatus: c.verification_status,
        fileUrl: c.verification_status === "verified" ? c.file_url : null,
      })),
      internships: internships.data.map((i) => ({ id: i.id, role: i.role, company: i.company, period: i.period, note: i.note })),
      achievements: achievements.data.map((a) => a.description),
    });
  } catch (error) {
    console.error("Get public portfolio error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
      certifications: certifications.data.map(mapCertification),
      internships: internships.data.map((i) => ({ id: i.id, role: i.role, company: i.company, period: i.period, note: i.note })),
      achievements: achievements.data.map((a) => ({ id: a.id, description: a.description })),
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/portfolio/basics — creates/updates the one-row-per-user basics
// record. Used both for real edits (DigitalPortfolioEdit) and to create the
// initial EMPTY row for a brand-new user (see initPortfolio below) — an
// upsert either way, so there's no separate "create" vs "update" path.
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

// POST /api/portfolio/avatar — multipart upload handled by multer
// (memoryStorage, see portfolioRoutes.js), stored in the "avatars" Supabase
// Storage bucket under {userId}/{timestamp}-{filename}, then upserted into
// portfolio_basics.avatar_url. No profile picture is ever set by default —
// this is the only path that writes a non-null avatar_url.
export const uploadAvatar = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${userId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

    if (uploadError) {
      console.error("Upload avatar error:", uploadError);
      return res.status(500).json({ error: `Failed to upload photo: ${uploadError.message}` });
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(storagePath);

    const { error } = await supabase
      .from("portfolio_basics")
      .upsert({ user_id: userId, avatar_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) {
      console.error("Save avatar url error:", error);
      return res.status(500).json({ error: "Failed to save photo" });
    }

    res.status(200).json({ avatarUrl: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/portfolio/avatar — clears avatar_url so the portfolio goes
// back to showing no profile picture (the default state). Doesn't bother
// deleting the old Storage object — same lightweight approach as
// certificate re-uploads, which also never clean up the previous file.
export const removeAvatar = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { error } = await supabase
      .from("portfolio_basics")
      .upsert({ user_id: userId, avatar_url: null, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) {
      console.error("Remove avatar error:", error);
      return res.status(500).json({ error: "Failed to remove photo" });
    }

    res.status(200).json({ avatarUrl: null });
  } catch (error) {
    console.error("Remove avatar error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/portfolio/init — replaces the old seedPortfolio. A brand-new
// user has no portfolio_basics row yet; this creates an EMPTY one (no fake
// DEFAULT_PORTFOLIO projects/certifications/internships/achievements are
// ever written) so getPortfolio() has a real row to read going forward and
// the frontend knows onboarding is done. No-ops safely if a row already
// exists (upsert), matching the old double-seed guard's intent without
// needing the existence check that guard required.
export const initPortfolio = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { headline, bio, institution, expectedGraduation } = req.body ?? {};

    const { error } = await supabase.from("portfolio_basics").upsert(
      {
        user_id: userId,
        headline: headline ?? null,
        bio: bio ?? null,
        avatar_url: null,
        institution: institution ?? null,
        expected_graduation: expectedGraduation ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id", ignoreDuplicates: false }
    );

    if (error) {
      console.error("Init portfolio error:", error);
      return res.status(500).json({ error: "Failed to initialize portfolio" });
    }

    res.status(201).json({ initialized: true });
  } catch (error) {
    console.error("Init portfolio error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Generic per-child-table CRUD helper -------------------------------
// The four child tables (projects/certifications/internships/achievements)
// all follow the exact same ownership-scoped CRUD shape: insert with
// user_id, update/delete WHERE id AND user_id (so one user can never edit
// another's row even if they guess an id). Factored into one helper instead
// of four near-identical copies of the same three handlers.

function makeChildTableHandlers(table, { toRow, fromRow, requiredFields = [] }) {
  const create = async (req, res) => {
    try {
      const userId = await resolveUserId(req);
      if (!userId) return res.status(404).json({ error: "User not found" });

      for (const field of requiredFields) {
        if (!req.body?.[field]) return res.status(400).json({ error: `${field} is required` });
      }

      const { data, error } = await supabase
        .from(table)
        .insert({ user_id: userId, ...toRow(req.body) })
        .select()
        .single();

      if (error) {
        console.error(`Create ${table} error:`, error);
        return res.status(500).json({ error: `Failed to add entry: ${error.message}` });
      }

      res.status(201).json({ entry: fromRow(data) });
    } catch (error) {
      console.error(`Create ${table} error:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const update = async (req, res) => {
    try {
      const userId = await resolveUserId(req);
      if (!userId) return res.status(404).json({ error: "User not found" });

      const { id } = req.params;
      const { data, error } = await supabase
        .from(table)
        .update(toRow(req.body))
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error(`Update ${table} error:`, error);
        return res.status(500).json({ error: `Failed to update entry: ${error.message}` });
      }
      if (!data) return res.status(404).json({ error: "Entry not found" });

      res.status(200).json({ entry: fromRow(data) });
    } catch (error) {
      console.error(`Update ${table} error:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const remove = async (req, res) => {
    try {
      const userId = await resolveUserId(req);
      if (!userId) return res.status(404).json({ error: "User not found" });

      const { id } = req.params;
      const { data, error } = await supabase.from(table).delete().eq("id", id).eq("user_id", userId).select().maybeSingle();

      if (error) {
        console.error(`Delete ${table} error:`, error);
        return res.status(500).json({ error: `Failed to delete entry: ${error.message}` });
      }
      if (!data) return res.status(404).json({ error: "Entry not found" });

      res.status(200).json({ deleted: true, id });
    } catch (error) {
      console.error(`Delete ${table} error:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  return { create, update, remove };
}

// --- Projects ---
const projectHandlers = makeChildTableHandlers("portfolio_projects", {
  requiredFields: ["title"],
  toRow: (b) => ({
    ...(b.title !== undefined && { title: b.title }),
    ...(b.description !== undefined && { description: b.description }),
    ...(b.skills !== undefined && { skills: b.skills ?? [] }),
  }),
  fromRow: (p) => ({ id: p.id, title: p.title, description: p.description, skills: p.skills, trustLevel: p.trust_level }),
});
export const createProject = projectHandlers.create;
export const updateProject = projectHandlers.update;
export const deleteProject = projectHandlers.remove;

// --- Certifications ---
// Note: file_url/file_name/verification_status are NOT accepted here — a
// certification starts as a plain self-report ('unverified'). Attaching a
// file is a separate endpoint (uploadCertificateFile below) that also moves
// verification_status to 'pending', and approving/rejecting is restricted to
// the admin review endpoints — neither is reachable through this generic
// update, so a student can never self-mark their own certification verified.
const certificationHandlers = makeChildTableHandlers("portfolio_certifications", {
  requiredFields: ["title"],
  toRow: (b) => ({
    ...(b.title !== undefined && { title: b.title }),
    ...(b.issuer !== undefined && { issuer: b.issuer }),
    ...(b.date !== undefined && { issued_date: b.date }),
    ...(b.relatedSkill !== undefined && { related_skill: b.relatedSkill }),
  }),
  fromRow: mapCertification,
});
export const createCertification = certificationHandlers.create;
export const updateCertification = certificationHandlers.update;
export const deleteCertification = certificationHandlers.remove;

// --- Internships ---
const internshipHandlers = makeChildTableHandlers("portfolio_internships", {
  requiredFields: ["role"],
  toRow: (b) => ({
    ...(b.role !== undefined && { role: b.role }),
    ...(b.company !== undefined && { company: b.company }),
    ...(b.period !== undefined && { period: b.period }),
    ...(b.note !== undefined && { note: b.note }),
  }),
  fromRow: (i) => ({ id: i.id, role: i.role, company: i.company, period: i.period, note: i.note }),
});
export const createInternship = internshipHandlers.create;
export const updateInternship = internshipHandlers.update;
export const deleteInternship = internshipHandlers.remove;

// --- Achievements ---
const achievementHandlers = makeChildTableHandlers("portfolio_achievements", {
  requiredFields: ["description"],
  toRow: (b) => ({ ...(b.description !== undefined && { description: b.description }) }),
  fromRow: (a) => ({ id: a.id, description: a.description }),
});
export const createAchievement = achievementHandlers.create;
export const updateAchievement = achievementHandlers.update;
export const deleteAchievement = achievementHandlers.remove;

// --- Certificate file upload -------------------------------------------
// POST /api/portfolio/certifications/:id/file — multipart upload handled by
// multer (memoryStorage, see portfolioRoutes.js), stored in the "certificates"
// Supabase Storage bucket under {userId}/{certId}-{filename}, then the
// certification row is updated with file_url/file_name and moved to
// 'pending' so it enters the admin review queue.
export const uploadCertificateFile = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const { data: existing, error: fetchError } = await supabase
      .from("portfolio_certifications")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();
    if (fetchError) {
      console.error("Fetch certification for upload error:", fetchError);
      return res.status(500).json({ error: "Failed to load certification" });
    }
    if (!existing) return res.status(404).json({ error: "Certification not found" });

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${userId}/${id}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

    if (uploadError) {
      console.error("Upload certificate file error:", uploadError);
      return res.status(500).json({ error: `Failed to upload file: ${uploadError.message}` });
    }

    const { data: publicUrlData } = supabase.storage.from("certificates").getPublicUrl(storagePath);

    const { data, error } = await supabase
      .from("portfolio_certifications")
      .update({
        file_url: publicUrlData.publicUrl,
        file_name: req.file.originalname,
        verification_status: "pending",
        reviewed_by: null,
        reviewed_at: null,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Save certificate file metadata error:", error);
      return res.status(500).json({ error: "Failed to save certificate file" });
    }

    res.status(200).json({ entry: mapCertification(data) });
  } catch (error) {
    console.error("Upload certificate file error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin-only guard shared by the two review endpoints below. Not using the
// route-level roleMiddleware here — it reads req.user.role, which is only
// ever populated for the legacy JWT login path (authController signs
// {id,email,role} into the token); a Supabase-session user's req.user is
// just {id,email} with no role, so roleMiddleware would wrongly 403 a real
// admin who logged in that way. Looking role up from the users table via
// the already-resolved userId works for both auth paths.
async function requireAdmin(req, res) {
  const userId = await resolveUserId(req);
  if (!userId) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single();
  if (error || !data) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  if (data.role !== "admin") {
    res.status(403).json({ error: "Forbidden: admin access required" });
    return null;
  }
  return userId;
}

// GET /api/portfolio/certifications/pending-review — admin/institution
// review queue: every certification with an uploaded file awaiting review.
// Two queries (not a join) to avoid depending on Postgres's auto-generated
// FK constraint name for an embedded select — same reasoning as the
// applications<->opportunities join in industryController.js.
export const getPendingCertifications = async (req, res) => {
  try {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;

    const { data: certifications, error } = await supabase
      .from("portfolio_certifications")
      .select("*")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch pending certifications error:", error);
      return res.status(500).json({ error: "Failed to load pending certifications" });
    }

    const studentIds = [...new Set(certifications.map((c) => c.user_id))];
    const { data: students, error: studentError } = studentIds.length
      ? await supabase.from("users").select("id, name, email").in("id", studentIds)
      : { data: [], error: null };

    if (studentError) {
      console.error("Fetch students for pending certifications error:", studentError);
      return res.status(500).json({ error: "Failed to load pending certifications" });
    }

    const studentById = new Map(students.map((s) => [s.id, s]));

    res.status(200).json({
      certifications: certifications.map((c) => ({
        ...mapCertification(c),
        studentName: studentById.get(c.user_id)?.name ?? "Unknown Student",
        studentEmail: studentById.get(c.user_id)?.email ?? null,
      })),
    });
  } catch (error) {
    console.error("Get pending certifications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/portfolio/certifications/:id/review — admin approve/reject.
export const reviewCertification = async (req, res) => {
  try {
    const reviewerId = await requireAdmin(req, res);
    if (!reviewerId) return;

    const { id } = req.params;
    const { status } = req.body;
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ error: "status must be 'verified' or 'rejected'" });
    }

    const { data, error } = await supabase
      .from("portfolio_certifications")
      .update({ verification_status: status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Review certification error:", error);
      return res.status(500).json({ error: "Failed to update review status" });
    }
    if (!data) return res.status(404).json({ error: "Certification not found" });

    res.status(200).json({ entry: mapCertification(data) });
  } catch (error) {
    console.error("Review certification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
