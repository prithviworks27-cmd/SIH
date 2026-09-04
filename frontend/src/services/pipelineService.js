import { resolveMock } from "./mockClient";
import { PIPELINE_STAGES, REJECTED_STAGE } from "./mockData/pipeline";
import { getAllOpportunitiesIncludingInactive } from "./internshipsService";
import { industryAPI, applicationsAPI } from "./api";

const STORAGE_KEY = "pipelineStageOverrides";

function loadOverridesLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistOverridesLocally(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // best-effort — stage moves just won't survive a reload if storage is unavailable
  }
}

// Real applications a student submitted against an opportunity this recruiter
// posted (GET /api/industry/applications) are shaped into
// {id, candidateId, opportunityId, stage, candidate, opportunity} pipeline
// entries, with the id prefixed "real-" so it can be told apart from any
// legacy pipeline_stage_overrides entry id — that's what lets moveStage()
// below route a stage change to the right backend call.
const REAL_ENTRY_PREFIX = "real-";

function isRealEntryId(entryId) {
  return typeof entryId === "string" && entryId.startsWith(REAL_ENTRY_PREFIX);
}

async function loadRealEntries(opportunities) {
  const byOpportunityId = new Map(opportunities.map((o) => [o.id, o]));
  try {
    const { applications } = await industryAPI.getApplicationsForMyOpportunities();
    return applications.map((a) => ({
      id: `${REAL_ENTRY_PREFIX}${a.id}`,
      candidateId: a.candidateId,
      opportunityId: a.opportunityId,
      stage: a.stage,
      candidate: { id: a.candidateId, name: a.candidateName, avatarInitial: a.candidateName?.[0]?.toUpperCase() ?? "?" },
      opportunity: byOpportunityId.get(a.opportunityId) ?? { id: a.opportunityId, title: a.opportunityTitle, company: a.opportunityCompany },
    }));
  } catch (err) {
    console.warn("Could not load real applications for the pipeline, board will be empty:", err.message);
    return [];
  }
}

// The pipeline is sourced entirely from real applications a student has
// actually submitted against an opportunity THIS recruiter posted
// (loadRealEntries, live from GET /api/industry/applications) — no seeded
// demo entries or mock candidate pool are layered in here any more (see
// mockData/pipeline.js for why). Stage moves an industry user has made are
// real per-recruiter state, in Supabase (pipeline_stage_overrides for any
// legacy/local entries, or the application's own status column for a real
// entry — see moveStage below) with localStorage as a same-tab cache/offline
// fallback for the overrides half.
export async function getPipeline() {
  let overrides = loadOverridesLocally();
  try {
    const { overrides: remoteOverrides } = await industryAPI.getPipelineOverrides();
    overrides = { ...overrides, ...remoteOverrides };
    persistOverridesLocally(overrides);
  } catch (err) {
    console.warn("Could not load pipeline overrides from backend, using local cache only:", err.message);
  }

  const opportunities = await getAllOpportunitiesIncludingInactive();
  const realEntries = await loadRealEntries(opportunities);

  // overrides can still apply to a real entry if a stage move made before
  // this migration (or while offline) hasn't synced yet — the application's
  // own persisted status is otherwise the source of truth for real entries.
  const entries = realEntries.map((entry) => ({
    ...entry,
    stage: overrides[entry.id] ?? entry.stage,
  }));

  return resolveMock(entries);
}

export async function moveStage(entryId, newStage) {
  if (!PIPELINE_STAGES.includes(newStage) && newStage !== REJECTED_STAGE) {
    throw new Error(`Unknown stage: ${newStage}`);
  }

  // A real entry's stage IS the student's actual application status — write
  // straight to it via /api/applications/:id/status instead of the
  // pipeline_stage_overrides table, so the change is visible on the
  // student's own /applications page too, not just on this recruiter's board.
  if (isRealEntryId(entryId)) {
    const applicationId = entryId.slice(REAL_ENTRY_PREFIX.length);
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, newStage);
    } catch (err) {
      console.warn(`Could not update application ${applicationId} status to backend:`, err.message);
    }
    return resolveMock({ entryId, stage: newStage }, { delay: 300 });
  }

  const overrides = loadOverridesLocally();
  overrides[entryId] = newStage;
  persistOverridesLocally(overrides);

  try {
    await industryAPI.setPipelineStage(entryId, newStage);
  } catch (err) {
    console.warn(`Could not sync pipeline stage for ${entryId} to backend:`, err.message);
  }

  return resolveMock({ entryId, stage: newStage }, { delay: 300 });
}

// Rejected is reachable from any stage (see REJECTED_STAGE's comment in
// mockData/pipeline.js), so it's its own function rather than just another
// moveStage target the UI has to know the sequencing rules for.
export async function rejectCandidate(entryId) {
  return moveStage(entryId, REJECTED_STAGE);
}

export { PIPELINE_STAGES, REJECTED_STAGE };
