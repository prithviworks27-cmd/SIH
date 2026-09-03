import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

// --- Company profile (companyProfileService.js) ---

export const getCompanyProfile = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase.from("company_profiles").select("*").eq("user_id", userId).maybeSingle();

    if (error) {
      console.error("Fetch company profile error:", error);
      return res.status(500).json({ error: "Failed to load company profile" });
    }

    res.status(200).json({
      profile: data
        ? { name: data.name, industry: data.industry, website: data.website, description: data.description, logoUrl: data.logo_url }
        : null,
    });
  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const saveCompanyProfile = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { name, industry, website, description, logoUrl } = req.body;

    const { error } = await supabase.from("company_profiles").upsert(
      { user_id: userId, name, industry, website, description, logo_url: logoUrl, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Save company profile error:", error);
      return res.status(500).json({ error: "Failed to save company profile" });
    }

    res.status(200).json({ profile: { name, industry, website, description, logoUrl } });
  } catch (error) {
    console.error("Save company profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Opportunities (internshipsService.js posted-opportunity side + opportunitiesService.js) ---

function mapOpportunityRow(o) {
  return {
    id: o.id,
    title: o.title,
    company: o.company,
    type: o.type,
    location: o.location,
    duration: o.duration,
    stipend: o.stipend,
    commitment: o.commitment,
    overview: o.overview,
    skills: o.skills,
    eligibility: o.eligibility,
    status: o.status,
    postedAt: o.created_at,
  };
}

// Public — any authenticated user can see active posted opportunities
// (students browsing /internships need this alongside the seed catalog).
export const getPostedOpportunities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch opportunities error:", error);
      return res.status(500).json({ error: "Failed to load opportunities" });
    }

    res.status(200).json({ opportunities: data.map(mapOpportunityRow) });
  } catch (error) {
    console.error("Get posted opportunities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createOpportunity = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { title, company, type, location, duration, stipend, commitment, overview, skills, eligibility } = req.body;
    if (!title || !location) {
      return res.status(400).json({ error: "title and location are required" });
    }

    const { data, error } = await supabase
      .from("opportunities")
      .insert({
        posted_by: userId,
        title,
        company,
        type,
        location,
        duration,
        stipend,
        commitment,
        overview: overview ?? [],
        skills: skills ?? [],
        eligibility: eligibility ?? [],
        status: "Active",
      })
      .select()
      .single();

    if (error) {
      console.error("Create opportunity error:", error);
      return res.status(500).json({ error: "Failed to post opportunity" });
    }

    res.status(201).json({ opportunity: mapOpportunityRow(data) });
  } catch (error) {
    console.error("Create opportunity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOpportunityStatus = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });

    const { data, error } = await supabase
      .from("opportunities")
      .update({ status })
      .eq("id", id)
      .eq("posted_by", userId)
      .select()
      .single();

    if (error) {
      console.error("Update opportunity status error:", error);
      return res.status(500).json({ error: "Failed to update opportunity" });
    }
    if (!data) return res.status(404).json({ error: "Opportunity not found" });

    res.status(200).json({ opportunity: mapOpportunityRow(data) });
  } catch (error) {
    console.error("Update opportunity status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Pipeline stage overrides (pipelineService.js) ---

export const getPipelineOverrides = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("pipeline_stage_overrides")
      .select("pipeline_entry_id, stage")
      .eq("updated_by", userId);

    if (error) {
      console.error("Fetch pipeline overrides error:", error);
      return res.status(500).json({ error: "Failed to load pipeline" });
    }

    const overrides = Object.fromEntries(data.map((row) => [row.pipeline_entry_id, row.stage]));
    res.status(200).json({ overrides });
  } catch (error) {
    console.error("Get pipeline overrides error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const setPipelineStage = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { entryId, stage } = req.body;
    if (!entryId || !stage) return res.status(400).json({ error: "entryId and stage are required" });

    const { error } = await supabase
      .from("pipeline_stage_overrides")
      .upsert(
        { updated_by: userId, pipeline_entry_id: entryId, stage, updated_at: new Date().toISOString() },
        { onConflict: "updated_by,pipeline_entry_id" }
      );

    if (error) {
      console.error("Set pipeline stage error:", error);
      return res.status(500).json({ error: "Failed to update pipeline stage" });
    }

    res.status(200).json({ entryId, stage });
  } catch (error) {
    console.error("Set pipeline stage error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Skill development programs (skillProgramsService.js) ---

function mapProgramRow(p) {
  return {
    id: p.id,
    title: p.title,
    company: p.company,
    durationWeeks: p.duration_weeks,
    skills: p.skills,
    weeks: p.weeks,
    createdAt: p.created_at,
  };
}

// Public — students need to see every created program on their Learning page
// (learningPathsService.getIndustryPrograms), same as the seed catalog.
export const getAllSkillPrograms = async (req, res) => {
  try {
    const { data, error } = await supabase.from("skill_programs").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch skill programs error:", error);
      return res.status(500).json({ error: "Failed to load skill programs" });
    }

    res.status(200).json({ programs: data.map(mapProgramRow) });
  } catch (error) {
    console.error("Get skill programs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSkillProgram = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { title, company, skills, weeks } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Program title is required." });
    if (!Array.isArray(skills) || skills.length === 0) return res.status(400).json({ error: "Select at least one target skill." });
    if (!Array.isArray(weeks) || weeks.length === 0) return res.status(400).json({ error: "Add at least one week." });

    const { data, error } = await supabase
      .from("skill_programs")
      .insert({
        created_by: userId,
        title: title.trim(),
        company,
        duration_weeks: weeks.length,
        skills,
        weeks,
      })
      .select()
      .single();

    if (error) {
      console.error("Create skill program error:", error);
      return res.status(500).json({ error: "Failed to create program" });
    }

    res.status(201).json({ program: mapProgramRow(data) });
  } catch (error) {
    console.error("Create skill program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
