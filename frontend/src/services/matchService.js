import { getSkillProfile } from "./skillsService";
import { getInternshipById, getInternships } from "./internshipsService";
import { getStudentEvidence, getProfileCompleteness } from "./portfolioService";
import { getPreferences } from "./preferencesService";
import { calculateMatch, DEFAULT_WEIGHTS } from "./matchingEngine";

// Assembles the full student picture the engine scores against: verified
// skills (assessments/skill tests), portfolio evidence (projects,
// certifications, internships), real education/location data from Settings
// (degree/branch/graduationYear/preferredLocation), and overall profile
// completeness. Every dimension the engine scores now reads real student
// data — a fresh profile with nothing filled in just degrades to the
// engine's documented graceful defaults (unknown education criteria trust
// the recruiter's flag, no location preference scores locations as a full
// match, 0% completeness) rather than crashing.
async function getStudentForMatching() {
  const [{ profile }, evidence, prefs, completeness] = await Promise.all([
    getSkillProfile(),
    getStudentEvidence(),
    getPreferences(),
    getProfileCompleteness(),
  ]);
  return {
    skills: profile,
    ...evidence,
    degree: prefs.degree || null,
    branch: prefs.branch || null,
    graduationYear: prefs.graduationYear || null,
    preferredLocation: prefs.preferredLocation || null,
    profileCompleteness: completeness.percent,
  };
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
