import { resolveMock } from "./mockClient";
import { getAllOpportunitiesIncludingInactive, persistPostedLocally } from "./internshipsService";
import { industryAPI } from "./api";

export async function getMyOpportunities() {
  return resolveMock(await getAllOpportunitiesIncludingInactive());
}

// Creates a new opportunity, immediately visible to students at /internships
// (see internshipsService.getInternships — it reads the same Supabase-backed
// list). Falls back to a local-only record if the backend is unreachable —
// same resilience pattern as every other migrated service, though a
// local-only post won't be visible to other users/devices until it syncs.
export async function createOpportunity(fields) {
  try {
    const { opportunity } = await industryAPI.createOpportunity(fields);
    return resolveMock(opportunity, { delay: 200 });
  } catch (err) {
    console.warn("Could not post opportunity to backend, saved locally only:", err.message);
    const opportunity = {
      id: `opp-local-${Date.now()}`,
      status: "Active",
      skills: fields.skills ?? [],
      eligibility: fields.eligibility ?? [],
      ...fields,
    };
    const posted = await getAllOpportunitiesIncludingInactive();
    persistPostedLocally([opportunity, ...posted]);
    return resolveMock(opportunity, { delay: 500 });
  }
}

export async function updateOpportunityStatus(id, status) {
  try {
    const { opportunity } = await industryAPI.updateOpportunityStatus(id, status);
    return resolveMock(opportunity, { delay: 150 });
  } catch (err) {
    console.warn(`Could not sync status update for ${id} to backend:`, err.message);
    return resolveMock({ id, status }, { delay: 300 });
  }
}
