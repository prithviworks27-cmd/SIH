import { resolveMock } from "./mockClient";
import { applications as seedApplications } from "./mockData/applications";

const STORAGE_KEY = "myApplications";

function loadAppliedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistAppliedIds(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort only — an unavailable localStorage just means applications
    // made this session won't persist across a reload.
  }
}

export async function getApplications() {
  const submitted = loadAppliedIds();
  return resolveMock([...submitted, ...seedApplications]);
}

// Records a new application against a job/internship the student applied to.
// Returns the created application record; throws if already applied.
export async function applyToOpportunity(opportunity) {
  const submitted = loadAppliedIds();
  const alreadyApplied = submitted.some((a) => a.opportunityId === opportunity.id);
  if (alreadyApplied) {
    throw new Error("You've already applied to this opportunity.");
  }

  const newApplication = {
    id: `app-local-${opportunity.id}`,
    opportunityId: opportunity.id,
    companyName: opportunity.company,
    department: opportunity.type,
    role: opportunity.title,
    roleSubtext: opportunity.location,
    dateApplied: new Date().toISOString(),
    status: "Applied",
  };

  const next = [newApplication, ...submitted];
  persistAppliedIds(next);
  return resolveMock(newApplication, { delay: 500 });
}

export function hasAppliedTo(opportunityId, applications) {
  return applications?.some((a) => a.opportunityId === opportunityId) ?? false;
}
