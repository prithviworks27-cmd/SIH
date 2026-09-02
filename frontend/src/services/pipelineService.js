import { resolveMock } from "./mockClient";
import { seedPipeline, PIPELINE_STAGES } from "./mockData/pipeline";
import { candidates } from "./mockData/candidates";
import { getAllOpportunitiesIncludingInactive } from "./internshipsService";

const STORAGE_KEY = "pipelineStageOverrides";

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // best-effort — stage moves just won't survive a reload if storage is unavailable
  }
}

// Returns every pipeline entry enriched with candidate + opportunity details,
// with any recruiter-made stage moves applied on top of the seed data.
export async function getPipeline() {
  const overrides = loadOverrides();
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
  if (!PIPELINE_STAGES.includes(newStage)) {
    throw new Error(`Unknown stage: ${newStage}`);
  }
  const overrides = loadOverrides();
  overrides[entryId] = newStage;
  persistOverrides(overrides);
  return resolveMock({ entryId, stage: newStage }, { delay: 300 });
}

export { PIPELINE_STAGES };
