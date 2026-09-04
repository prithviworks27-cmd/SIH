import { industryAPI } from "./api";

// Real applicants only — every student who has applied to one of this
// recruiter's opportunities (GET /api/industry/candidates). Replaces the old
// fake 6-person mock pool, which had no connection to real users and made
// Candidate Detail 404 whenever a recruiter clicked a real applicant's name.
export async function getCandidates() {
  try {
    const { candidates } = await industryAPI.getMyCandidates();
    return candidates;
  } catch (err) {
    console.warn("Could not load candidates from backend:", err.message);
    return [];
  }
}

export async function getCandidateById(candidateId) {
  try {
    const { candidate } = await industryAPI.getCandidateProfile(candidateId);
    return candidate ?? null;
  } catch (err) {
    console.warn(`Could not load candidate ${candidateId} from backend:`, err.message);
    return null;
  }
}
