import { resolveMock } from "./mockClient";
import { getAllOpportunitiesIncludingInactive, persistPosted } from "./internshipsService";

function loadPosted() {
  try {
    const raw = localStorage.getItem("postedOpportunities");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getMyOpportunities() {
  return resolveMock(await getAllOpportunitiesIncludingInactive());
}

// Creates a new opportunity, immediately visible to students at /internships
// (see internshipsService.getInternships — it reads the same posted list).
export async function createOpportunity(fields) {
  const posted = loadPosted();
  const opportunity = {
    id: `opp-${Date.now()}`,
    status: "Active",
    skills: fields.skills ?? [],
    eligibility: fields.eligibility ?? [],
    ...fields,
  };
  persistPosted([opportunity, ...posted]);
  return resolveMock(opportunity, { delay: 500 });
}

export async function updateOpportunityStatus(id, status) {
  const posted = loadPosted();
  const next = posted.map((o) => (o.id === id ? { ...o, status } : o));
  persistPosted(next);
  return resolveMock({ id, status }, { delay: 300 });
}
