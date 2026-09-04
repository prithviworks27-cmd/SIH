import { resolveMock } from "./mockClient";
import { applicationsAPI } from "./api";

const STORAGE_KEY = "myApplications";

function loadAppliedIdsLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistAppliedIdsLocally(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort only — an unavailable localStorage just means applications
    // made this session won't persist across a reload.
  }
}

// Applications now live in Supabase, with localStorage as a same-tab
// cache/offline fallback — same resilience pattern as every other migrated
// service. No seed/demo data is layered in — an empty result means the
// student genuinely hasn't applied to anything yet, and callers render that
// as an empty state, not a crash.
export async function getApplications() {
  try {
    const { applications } = await applicationsAPI.getApplications();
    persistAppliedIdsLocally(applications);
    return resolveMock(applications);
  } catch (err) {
    console.warn("Could not load applications from backend, using local cache only:", err.message);
    return resolveMock(loadAppliedIdsLocally());
  }
}

// Records a new application against a job/internship the student applied to.
// Returns the created application record; throws if already applied.
export async function applyToOpportunity(opportunity) {
  const payload = {
    opportunityId: opportunity.id,
    companyName: opportunity.company,
    department: opportunity.type,
    role: opportunity.title,
    roleSubtext: opportunity.location,
  };

  try {
    const { application } = await applicationsAPI.applyToOpportunity(payload);
    const local = loadAppliedIdsLocally();
    persistAppliedIdsLocally([application, ...local]);
    return resolveMock(application, { delay: 200 });
  } catch (err) {
    if (err.status === 409) throw new Error("You've already applied to this opportunity.");

    // Backend unreachable — fall back to a local-only record so applying
    // still works offline, same as the pre-migration behavior.
    console.warn("Could not submit application to backend, saved locally only:", err.message);
    const submitted = loadAppliedIdsLocally();
    if (submitted.some((a) => a.opportunityId === opportunity.id)) {
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
    persistAppliedIdsLocally([newApplication, ...submitted]);
    return resolveMock(newApplication, { delay: 500 });
  }
}

export function hasAppliedTo(opportunityId, applications) {
  return applications?.some((a) => a.opportunityId === opportunityId) ?? false;
}
