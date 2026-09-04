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

// Ordinal ranking so "final year" / "3rd year or above" can be compared
// against a student's actual graduation year, not just pattern-matched.
// currentYear is derived from graduationYear (Indian degrees run ~4 years for
// B.Tech/B.E./BCA, ~2 for M.Tech/M.E./MCA/M.Sc — close enough for eligibility
// gating; a student mid-degree is what matters here, not the exact term).
const DEGREE_PROGRAM_LENGTH = {
  "b.tech": 4,
  "b.e.": 4,
  "b.sc": 3,
  bca: 3,
  "m.tech": 2,
  "m.e.": 2,
  "m.sc": 2,
  mca: 2,
};

function programLength(degree) {
  if (!degree) return 4; // reasonable default (undergrad) when unset
  return DEGREE_PROGRAM_LENGTH[degree.trim().toLowerCase()] ?? 4;
}

// Rough "which year of the program is the student in right now" estimate
// from graduationYear + degree — assumes an academic year starting ~June/July,
// so a grad year of "now" or earlier reads as final year rather than negative.
function currentYearOfProgram(student) {
  const gradYear = student.graduationYear;
  if (!gradYear) return null;
  const length = programLength(student.degree);
  const now = new Date();
  // Academic year rolls over around June/July — before that, still count as
  // the prior academic year.
  const academicYear = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
  const yearsUntilGraduation = gradYear - academicYear;
  const year = length - yearsUntilGraduation + 1;
  return Math.min(Math.max(year, 1), length);
}

function isFinalYearOrAbove(student) {
  const year = currentYearOfProgram(student);
  if (year === null) return null; // unknown — can't say either way
  const length = programLength(student.degree);
  return year >= length;
}

// Evaluates one eligibility criterion against the student's actual stored
// education data (degree/branch/graduationYear from Settings — see
// preferencesService.js) instead of trusting the opportunity's own `met`
// flag, which a recruiter always posts as true. Criteria this can't parse
// (custom free-text requirements) fall back to the recruiter's stated `met`
// so they don't silently always fail — same graceful-unknown treatment as
// an unset student field.
function evaluateCriterion(criterion, student) {
  const label = criterion.label.toLowerCase();

  // "3rd year or above", "final year", "recent graduate" — degree-stage checks.
  if (/final year|recent graduate|graduating/.test(label)) {
    const result = isFinalYearOrAbove(student);
    return result === null ? criterion.met : result;
  }
  const yearMatch = label.match(/(\d)(?:st|nd|rd|th)\s+year/);
  if (yearMatch) {
    const requiredYear = Number(yearMatch[1]);
    const year = currentYearOfProgram(student);
    return year === null ? criterion.met : year >= requiredYear;
  }

  // Degree-type checks, e.g. "B.Tech/B.E." or "Graduate or advanced undergraduate".
  const degreeMention = Object.keys(DEGREE_PROGRAM_LENGTH).find((d) => label.includes(d));
  if (degreeMention) {
    if (!student.degree) return criterion.met;
    return student.degree.trim().toLowerCase() === degreeMention;
  }

  // Location-stage checks are scored by the separate Location dimension —
  // treat as met here so they don't double-penalize.
  if (/remote-friendly|willing to relocate|based|onsite|on-site|hybrid/.test(label)) {
    return true;
  }

  // Anything else (custom recruiter-authored text) — no real student
  // attribute to check it against, so trust the recruiter's own flag rather
  // than manufacturing a false negative.
  return criterion.met;
}

// Compares the opportunity's stated eligibility criteria against the
// student's actual stored education data (degree/branch/graduationYear) —
// genuinely scores met/total instead of always trusting the recruiter's own
// `met` flags (which are always posted as true, since a recruiter is
// defining a requirement, not evaluating a candidate).
function evaluateEducation(student, opportunity) {
  const rawCriteria = opportunity.eligibility ?? [{ label: "Open to all eligible students", met: true }];
  const criteria = rawCriteria.map((c) => ({ label: c.label, met: evaluateCriterion(c, student) }));
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
// preference (see Settings > Education & Match Preferences —
// preferencesService.js) — nothing to conflict with. Otherwise genuinely
// compares the student's real preferredLocation against the opportunity's
// location and scores lower on an actual mismatch instead of always
// defaulting to 100.
function evaluateLocation(student, opportunity) {
  const isRemote = opportunity.location?.toLowerCase().includes("remote");
  const preferredLocation = student.preferredLocation;
  if (isRemote || !preferredLocation) return { score: 100 };
  const matches = opportunity.location?.toLowerCase().includes(preferredLocation.toLowerCase());
  return { score: matches ? 100 : 50 };
}

// Profile completeness — the real signal behind what used to be a hardcoded
// 70. See portfolioService.getProfileCompleteness() for the field-by-field
// breakdown (skills assessed, projects, certifications, bio, education,
// resume/portfolio). Passed in pre-computed (0-100) rather than derived here
// so the engine stays synchronous and doesn't need to know about portfolio
// shape directly.
function evaluateOther(student) {
  return { score: student.profileCompleteness ?? 0 };
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
 * student: { skills: SkillProfile[], projects?, certifications?, hasPriorInternship?,
 *            degree?, branch?, graduationYear?, preferredLocation?, profileCompleteness? }
 * opportunity: { skills: string[], eligibility?: [{label, met}], location? }
 * weights: { skillMatch, education, projects, certifications, experience, location, other } — percentages summing to 100
 *
 * Returns { overallScore, matchedSkills, missingSkills, education, projectMatch,
 *           certificationMatch, experienceMatch, locationMatch, otherMatch, bestNextAction, weights }
 */
export function calculateMatch(student, opportunity, weights = DEFAULT_WEIGHTS) {
  const skills = evaluateSkills(student.skills ?? [], opportunity.skills ?? []);
  const education = evaluateEducation(student, opportunity);
  const projects = evaluateProjects(student);
  const certifications = evaluateCertifications(student);
  const experience = evaluateExperience(student);
  const location = evaluateLocation(student, opportunity);
  const other = evaluateOther(student);

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
