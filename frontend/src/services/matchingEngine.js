// Single shared matching engine. Every page that shows a match percentage —
// job listings, job detail, the "Why This Match?" breakdown, the dashboard,
// and later the industry candidate view — calls calculateMatch() instead of
// carrying its own hardcoded percentage. Keeping this in one place means a
// change to the scoring model changes it everywhere at once.

export const DEFAULT_WEIGHTS = {
  skillMatch: 50,
  eligibility: 20,
  projects: 15,
  certifications: 10,
  experience: 5,
};

function normalizeSkillName(name) {
  return name.trim().toLowerCase();
}

// A student is "eligible" for an opportunity in this mock model when nothing
// in the opportunity's eligibility list is flagged as unmet — real
// eligibility rules (degree, year, location preference) aren't modeled yet,
// so unless mock data says otherwise every opportunity is treated as eligible.
function evaluateEligibility(opportunity) {
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

function bestNextAction(missingSkills, eligibility) {
  if (missingSkills.length > 0) {
    const target = missingSkills[0];
    return `Improve ${target.name} — it's the top missing skill for this match.`;
  }
  const unmet = eligibility.criteria.find((c) => !c.met);
  if (unmet) {
    return `Review eligibility: ${unmet.label}.`;
  }
  return "You're a strong match — apply with confidence.";
}

/**
 * calculateMatch(student, opportunity, weights)
 *
 * student: { skills: SkillProfile[], projects?, certifications?, hasPriorInternship? }
 * opportunity: { skills: string[], eligibility?: [{label, met}] }
 * weights: { skillMatch, eligibility, projects, certifications, experience } — percentages summing to 100
 *
 * Returns { overallScore, matchedSkills, missingSkills, eligibility, projectMatch,
 *           certificationMatch, experienceMatch, bestNextAction, weights }
 */
export function calculateMatch(student, opportunity, weights = DEFAULT_WEIGHTS) {
  const skills = evaluateSkills(student.skills ?? [], opportunity.skills ?? []);
  const eligibility = evaluateEligibility(opportunity);
  const projects = evaluateProjects(student);
  const certifications = evaluateCertifications(student);
  const experience = evaluateExperience(student);

  const totalWeight =
    weights.skillMatch + weights.eligibility + weights.projects + weights.certifications + weights.experience;

  const weightedSum =
    skills.score * weights.skillMatch +
    eligibility.score * weights.eligibility +
    projects.score * weights.projects +
    certifications.score * weights.certifications +
    experience.score * weights.experience;

  const overallScore = totalWeight === 0 ? 0 : Math.round(weightedSum / totalWeight);

  return {
    overallScore,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    eligibility,
    projectMatch: projects,
    certificationMatch: certifications,
    experienceMatch: experience,
    bestNextAction: bestNextAction(skills.missing, eligibility),
    weights,
  };
}
