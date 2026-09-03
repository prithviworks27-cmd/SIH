import { resolveMock } from "./mockClient";
import { seedPipeline, PIPELINE_STAGES, REJECTED_STAGE } from "./mockData/pipeline";
import { candidates } from "./mockData/candidates";
import { getAllOpportunitiesIncludingInactive } from "./internshipsService";
import { industryAPI } from "./api";

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

// Seed pipeline entries stay in frontend mock data (mockData/pipeline.js,
// tied to the mock candidate pool); only stage moves an industry user has
// made are real per-recruiter state, now in Supabase (pipeline_stage_overrides)
// with localStorage as a same-tab cache/offline fallback.
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
  const byOpportunityId = new Map(opportunities.map((o) => [o.id, o]));
  const byCandidateId = new Map(candidates.map((c) => [c.id, c]));

  const entries = seedPipeline.map((entry) => ({
    ...entry,
    stage: overrides[entry.id] ?? entry.stage,
    candidate: byCandidateId.get(entry.candidateId) ?? null,
    opportunity: byOpportunityId.get(entry.opportunityId) ?? null,
  }));

  return resolveMock(entries);
}

export async function moveStage(entryId, newStage) {
  if (!PIPELINE_STAGES.includes(newStage) && newStage !== REJECTED_STAGE) {
    throw new Error(`Unknown stage: ${newStage}`);
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

// Rejected is reachable from any stage (see REJECTED_STAGE's note in
// mockData/pipeline.js), so it's its own function rather than just another
// moveStage target the UI has to know the sequencing rules for.
export async function rejectCandidate(entryId) {
  return moveStage(entryId, REJECTED_STAGE);
}

export { PIPELINE_STAGES, REJECTED_STAGE };
