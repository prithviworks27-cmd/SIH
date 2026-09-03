import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

export const getApplications = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Fetch applications error:", error);
      return res.status(500).json({ error: "Failed to load applications" });
    }

    res.status(200).json({
      applications: data.map((a) => ({
        id: a.id,
        opportunityId: a.opportunity_id,
        companyName: a.company_name,
        department: a.department,
        role: a.role,
        roleSubtext: a.role_subtext,
        status: a.status,
        dateApplied: a.applied_at,
      })),
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const applyToOpportunity = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { opportunityId, companyName, department, role, roleSubtext } = req.body;
    if (!opportunityId) return res.status(400).json({ error: "opportunityId is required" });

    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "You've already applied to this opportunity." });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        opportunity_id: opportunityId,
        company_name: companyName,
        department,
        role,
        role_subtext: roleSubtext,
        status: "Applied",
      })
      .select()
      .single();

    if (error) {
      console.error("Apply to opportunity error:", error);
      return res.status(500).json({ error: "Failed to submit application" });
    }

    res.status(201).json({
      application: {
        id: data.id,
        opportunityId: data.opportunity_id,
        companyName: data.company_name,
        department: data.department,
        role: data.role,
        roleSubtext: data.role_subtext,
        status: data.status,
        dateApplied: data.applied_at,
      },
    });
  } catch (error) {
    console.error("Apply to opportunity error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
