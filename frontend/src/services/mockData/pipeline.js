// Pipeline stage vocabulary — shared by pipelineService (both real and,
// formerly, seed entries) and the Applicant Pipeline's Kanban columns.
//
// The seeded demo entries that used to live in this file (seedPipeline, tied
// to the mock candidate pool) were removed once pipelineService.getPipeline()
// started sourcing real entries from GET /api/industry/applications — real
// student applications now populate the board directly, so a parallel set of
// fake ones is no longer needed to make it non-empty.
export const PIPELINE_STAGES = ["Applied", "Screening", "Shortlisted", "Assessment", "Interview", "Selected"];

// Rejected is a terminal side-branch, not a step in the main stage sequence —
// an entry can be rejected from any stage, so it's tracked separately rather
// than appended to PIPELINE_STAGES (which represents forward progress only).
export const REJECTED_STAGE = "Rejected";
