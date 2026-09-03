// Single shared matching engine. Every page that shows a match percentage —
// job listings, job detail, the "Why This Match?" breakdown, the dashboard,
// career-role readiness, and the industry candidate view — calls
// calculateMatch() instead of carrying its own hardcoded percentage. Keeping
// this in one place means a change to the scoring model changes it everywhere
// at once.

// Matches the weighting model from the Step 6 spec exactly: Skill Match 40 /
// Education 15 / Projects 10 / Certifications 10 / Experience 10 / Location 5
// / Other 10 = 100. "Education" absorbs what used to be a generic
// "eligibility" bucket (degree/year/program requirements — still opportunity.eligibility
// in mock data) since that's what education-stage eligibility actually means
// here; "Location" and "Other" are new dimensions the earlier weights didn't
// score at all.
export const DEFAULT_WEIGHTS = {
  skillMatch: 40,
  education: 15,
  projects: 10,
  certifications: 10,
  experience: 10,
  location: 5,
  other: 10,
};

function normalizeSkillName(name) {
  return name.trim().toLowerCase();
}

// A student is "eligible" for an opportunity in this mock model when nothing
// in the opportunity's eligibility list is flagged as unmet — real
// eligibility rules (degree, year, location preference) aren't modeled yet,
// so unless mock data says otherwise every opportunity is treated as eligible.
function evaluateEducation(opportunity) {
  const criteria = opportunity.eligibility ?? [
    { label: "Open to all eligible students", met: true },
  ];
  const metCount = criteria.filter((c) => c.met).length;
  const score = criteria.length === 0 ? 100 : Math.round((metCount / criteria.length) * 100);
  return { criteria, score };
}

function evaluateSkills(studentSkills, requiredSkills) {
  const byName = new Map(studentSkills.map((s) => [normalizeSkillName(s.name), s]));
  const matched = [];
  const missing = [];

  for (const skillName of requiredSkills) {
    const owned = byName.get(normalizeSkillName(skillName));
    if (owned && owned.currentScore >= 50) {
      matched.push({ name: skillName, currentScore: owned.currentScore });
    } else {
      missing.push({ name: skillName, currentScore: owned?.currentScore ?? 0 });
    }
  }

  const score = requiredSkills.length === 0 ? 100 : Math.round((matched.length / requiredSkills.length) * 100);
  return { matched, missing, score };
}

// Projects/certifications/experience aren't modeled as real student data yet
// (no projects/certifications service exists), so these contribute a mock
// baseline score. Structured so a real projectsService/certificationsService
// can replace the baseline without changing the engine's shape.
function evaluateProjects(student) {
  const count = student.projects?.length ?? 2;
  return { count, score: Math.min(count * 40, 100) };
}

function evaluateCertifications(student) {
  const count = student.certifications?.length ?? 1;
  return { count, score: Math.min(count * 50, 100) };
}

function evaluateExperience(student) {
  const hasInternship = student.hasPriorInternship ?? false;
  return { hasPriorInternship: hasInternship, score: hasInternship ? 100 : 40 };
}

// Full score when the opportunity is Remote or the student has no stated
// location preference (nothing to conflict with yet — no real preferences
// service exists); a lower baseline otherwise since we can't confirm a real
// match without that data. Structured the same way projects/certifications
// are, so a real preferencesService can slot in later.
function evaluateLocation(student, opportunity) {
  const isRemote = opportunity.location?.toLowerCase().includes("remote");
  const preferredLocation = student.preferredLocation;
  if (isRemote || !preferredLocation) return { score: 100 };
  const matches = opportunity.location?.toLowerCase().includes(preferredLocation.toLowerCase());
  return { score: matches ? 100 : 50 };
}

// Catch-all for signals not modeled as their own dimension yet (portfolio
// completeness, response rate, profile freshness, etc.) — kept as a neutral
// baseline so it doesn't silently swing the score until real data backs it.
function evaluateOther() {
  return { score: 70 };
}

function bestNextAction(missingSkills, education) {
  if (missingSkills.length > 0) {
    const target = missingSkills[0];
    return `Improve ${target.name} — it's the top missing skill for this match.`;
  }
  const unmet = education.criteria.find((c) => !c.met);
  if (unmet) {
    return `Review eligibility: ${unmet.label}.`;
  }
  return "You're a strong match — apply with confidence.";
}

/**
 * calculateMatch(student, opportunity, weights)
 *
 * student: { skills: SkillProfile[], projects?, certifications?, hasPriorInternship?, preferredLocation? }
 * opportunity: { skills: string[], eligibility?: [{label, met}], location? }
 * weights: { skillMatch, education, projects, certifications, experience, location, other } — percentages summing to 100
 *
 * Returns { overallScore, matchedSkills, missingSkills, education, projectMatch,
 *           certificationMatch, experienceMatch, locationMatch, otherMatch, bestNextAction, weights }
 */
export function calculateMatch(student, opportunity, weights = DEFAULT_WEIGHTS) {
  const skills = evaluateSkills(student.skills ?? [], opportunity.skills ?? []);
  const education = evaluateEducation(opportunity);
  const projects = evaluateProjects(student);
  const certifications = evaluateCertifications(student);
  const experience = evaluateExperience(student);
  const location = evaluateLocation(student, opportunity);
  const other = evaluateOther();

  const totalWeight =
    weights.skillMatch +
    weights.education +
    weights.projects +
    weights.certifications +
    weights.experience +
    weights.location +
    weights.other;

  const weightedSum =
    skills.score * weights.skillMatch +
    education.score * weights.education +
    projects.score * weights.projects +
    certifications.score * weights.certifications +
    experience.score * weights.experience +
    location.score * weights.location +
    other.score * weights.other;

  const overallScore = totalWeight === 0 ? 0 : Math.round(weightedSum / totalWeight);

  return {
    overallScore,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    education,
    // Kept as an alias so existing callers reading match.eligibility (the
    // pre-Step-6 field name) don't break — same object, both names.
    eligibility: education,
    projectMatch: projects,
    certificationMatch: certifications,
    experienceMatch: experience,
    locationMatch: location,
    otherMatch: other,
    bestNextAction: bestNextAction(skills.missing, education),
    weights,
  };
}
