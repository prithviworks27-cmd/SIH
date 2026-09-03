import { getSkillProfile } from "./skillsService";
import { getInternshipById, getInternships } from "./internshipsService";
import { getStudentEvidence } from "./portfolioService";
import { calculateMatch, DEFAULT_WEIGHTS } from "./matchingEngine";

// Assembles the full student picture the engine scores against: verified
// skills (assessments/skill tests) plus portfolio evidence (projects,
// certifications, internships). Before portfolio evidence was wired in, the
// engine used fixed baselines for those dimensions — now adding a project or
// internship genuinely changes match percentages.
async function getStudentForMatching() {
  const [{ profile }, evidence] = await Promise.all([getSkillProfile(), getStudentEvidence()]);
  return { skills: profile, ...evidence };
}

// Bridges the student's real skill profile + an opportunity into the shared
// matching engine. This is what every page showing a match score should call —
// never read a hardcoded matchPercent off the mock opportunity data directly.
export async function getMatchForOpportunity(jobId, weights = DEFAULT_WEIGHTS) {
  const [student, opportunity] = await Promise.all([getStudentForMatching(), getInternshipById(jobId)]);
  if (!opportunity) return null;
  return { opportunity, match: calculateMatch(student, opportunity, weights) };
}

// Used by the listings page so every card's match % comes from the same engine
// the detail/breakdown pages use, instead of a static number in mock data.
export async function getInternshipsWithMatch(weights = DEFAULT_WEIGHTS) {
  const [student, opportunities] = await Promise.all([getStudentForMatching(), getInternships()]);
  return opportunities
    .map((opportunity) => ({
      ...opportunity,
      match: calculateMatch(student, opportunity, weights),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}
