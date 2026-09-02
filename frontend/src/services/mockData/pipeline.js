// Seed pipeline entries linking a candidate to a seed opportunity at a given
// stage. Real applications (moved between stages by the recruiter, or newly
// added) are layered on top in localStorage by pipelineService.
export const PIPELINE_STAGES = ["Applied", "Screening", "Shortlisted", "Assessment", "Interview", "Selected"];

export const seedPipeline = [
  { id: "pl-001", candidateId: "cand-001", opportunityId: "job-003", stage: "Interview" },
  { id: "pl-002", candidateId: "cand-002", opportunityId: "job-001", stage: "Shortlisted" },
  { id: "pl-003", candidateId: "cand-003", opportunityId: "job-003", stage: "Applied" },
  { id: "pl-004", candidateId: "cand-004", opportunityId: "job-006", stage: "Assessment" },
  { id: "pl-005", candidateId: "cand-005", opportunityId: "job-005", stage: "Applied" },
  { id: "pl-006", candidateId: "cand-002", opportunityId: "job-004", stage: "Screening" },
];
