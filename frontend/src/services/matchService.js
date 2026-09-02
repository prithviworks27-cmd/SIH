import { getSkillProfile } from "./skillsService";
import { getInternshipById, getInternships } from "./internshipsService";
import { calculateMatch, DEFAULT_WEIGHTS } from "./matchingEngine";

// Bridges the student's real skill profile + an opportunity into the shared
// matching engine. This is what every page showing a match score should call —
// never read a hardcoded matchPercent off the mock opportunity data directly.
export async function getMatchForOpportunity(jobId, weights = DEFAULT_WEIGHTS) {
  const [{ profile }, opportunity] = await Promise.all([getSkillProfile(), getInternshipById(jobId)]);
  if (!opportunity) return null;
  return { opportunity, match: calculateMatch({ skills: profile }, opportunity, weights) };
}

// Used by the listings page so every card's match % comes from the same engine
// the detail/breakdown pages use, instead of a static number in mock data.
export async function getInternshipsWithMatch(weights = DEFAULT_WEIGHTS) {
  const [{ profile }, opportunities] = await Promise.all([getSkillProfile(), getInternships()]);
  return opportunities
    .map((opportunity) => ({
      ...opportunity,
      match: calculateMatch({ skills: profile }, opportunity, weights),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}
