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

    // Every real application auto-creates a student<->recruiter conversation
    // (see applyToOpportunity), so "Message this company" just needs to know
    // which conversation belongs to which application — resolved here via
    // opportunity -> recruiter (posted_by) -> conversation, in two batched
    // lookups rather than one join per application.
    const opportunityIds = [...new Set(data.map((a) => a.opportunity_id).filter(Boolean))];
    const { data: opportunities } = opportunityIds.length
      ? await supabase.from("opportunities").select("id, posted_by").in("id", opportunityIds)
      : { data: [] };
    const industryIdByOpportunity = new Map((opportunities ?? []).map((o) => [o.id, o.posted_by]));

    const industryIds = [...new Set([...industryIdByOpportunity.values()].filter(Boolean))];
    const { data: conversations } = industryIds.length
      ? await supabase.from("conversations").select("id, industry_id").eq("student_id", userId).in("industry_id", industryIds)
      : { data: [] };
    const conversationIdByIndustry = new Map((conversations ?? []).map((c) => [c.industry_id, c.id]));

    res.status(200).json({
      applications: data.map((a) => {
        const industryId = industryIdByOpportunity.get(a.opportunity_id) ?? null;
        return {
          id: a.id,
          opportunityId: a.opportunity_id,
          companyName: a.company_name,
          department: a.department,
          role: a.role,
          roleSubtext: a.role_subtext,
          status: a.status,
          dateApplied: a.applied_at,
          conversationId: industryId ? conversationIdByIndustry.get(industryId) ?? null : null,
        };
      }),
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/applications/:id/status — lets the RECRUITER who posted the
// opportunity move a real applicant's status (the counterpart to a student's
// own read-only /api/applications). Ownership isn't a simple user_id match
// here — it's "does this application belong to an opportunity this recruiter
// posted" — so it's enforced by joining through opportunities.posted_by
// rather than by a column on applications itself.
export const updateApplicationStatus = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { id } = req.params;
    const { status } = req.body;
    if (!status || typeof status !== "string") {
      return res.status(400).json({ error: "status is required" });
    }

    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("id, opportunity_id")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const { data: opportunity, error: oppError } = await supabase
      .from("opportunities")
      .select("id, posted_by")
      .eq("id", application.opportunity_id)
      .maybeSingle();

    if (oppError || !opportunity || opportunity.posted_by !== userId) {
      // Same response whether the opportunity doesn't exist, isn't posted by
      // this user, or isn't a real (Supabase-backed) opportunity at all —
      // avoids leaking which applications exist to a recruiter who doesn't own them.
      return res.status(404).json({ error: "Application not found" });
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update application status error:", error);
      return res.status(500).json({ error: "Failed to update application status" });
    }

    res.status(200).json({
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
    console.error("Update application status error:", error);
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

    // Auto-create the student<->recruiter conversation thread the moment a
    // real application lands — gives the two accounts a legitimate reason
    // to be linked (see messagesController.findOrCreateConversation). Only
    // possible for a real (UUID) opportunity with a posted_by recruiter;
    // best-effort — a failure here shouldn't fail the application itself.
    const { data: opportunity } = await supabase.from("opportunities").select("posted_by").eq("id", opportunityId).maybeSingle();
    if (opportunity?.posted_by) {
      const { error: convError } = await supabase
        .from("conversations")
        .upsert(
          { student_id: userId, industry_id: opportunity.posted_by, opportunity_id: opportunityId },
          { onConflict: "student_id,industry_id", ignoreDuplicates: true }
        );
      if (convError) console.error("Auto-create conversation on apply error:", convError);
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
