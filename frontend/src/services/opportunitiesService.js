import { resolveMock } from "./mockClient";
import { getAllOpportunitiesIncludingInactive } from "./internshipsService";
import { industryAPI } from "./api";

// Scoped to the logged-in recruiter's own postings — NOT every recruiter's
// (that unscoped list is getAllOpportunitiesIncludingInactive, used by
// student-facing/analytics views). Falls back to filtering the local
// posted-opportunities cache by company name if the backend is unreachable —
// same offline-resilience pattern as the rest of this service, though that
// fallback can only approximate "mine" since the cache has no reliable
// posted_by to filter on client-side.
export async function getMyOpportunities() {
  try {
    const { opportunities } = await industryAPI.getMyOpportunities();
    return resolveMock(opportunities);
  } catch (err) {
    console.warn("Could not load my opportunities from backend, using local cache only:", err.message);
    return resolveMock(await getAllOpportunitiesIncludingInactive());
  }
}

// Creates a new opportunity, immediately visible to students at /internships
// (see internshipsService.getInternships — it reads the same Supabase-backed
// list). Deliberately does NOT fall back to a local-only record on failure —
// a silent local-only "success" here would mean the post never actually
// reaches Supabase (never visible to students, other devices, or after the
// local cache is next overwritten by a real read), while the UI reports it
// as posted. Real failures (validation, auth, network) must reach the
// caller so PostOpportunity can show them instead of masking them.
export async function createOpportunity(fields) {
  const { opportunity } = await industryAPI.createOpportunity(fields);
  return resolveMock(opportunity, { delay: 200 });
}

// Same reasoning as createOpportunity — a status change either really lands
// in Supabase or the caller needs to know it didn't, so Close (or any future
// status change) never silently no-ops while claiming success.
export async function updateOpportunityStatus(id, status) {
  const { opportunity } = await industryAPI.updateOpportunityStatus(id, status);
  return resolveMock(opportunity, { delay: 150 });
}
