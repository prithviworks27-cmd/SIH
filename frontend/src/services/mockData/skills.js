// Canonical skill catalog. Every skill a student can have a profile entry for
// is defined once here — category, what "fully ready" looks like (requiredScore),
// and how a score maps to a trust level. Assessment answers produce currentScore;
// nothing else invents its own copy of this list.
export const SKILL_CATALOG = [
  { name: "JavaScript", category: "Technical", requiredScore: 80 },
  { name: "Python Programming", category: "Technical", requiredScore: 85 },
  { name: "React", category: "Technical", requiredScore: 80 },
  { name: "SQL / Databases", category: "Technical", requiredScore: 75 },
  { name: "Data Structures & Algorithms", category: "Technical", requiredScore: 85 },
  { name: "Cloud Computing (AWS)", category: "Technical", requiredScore: 70 },
  { name: "Machine Learning", category: "Technical", requiredScore: 75 },
  { name: "Git & Version Control", category: "Technical", requiredScore: 70 },
  { name: "Communication", category: "Soft Skills", requiredScore: 75 },
  { name: "Teamwork", category: "Soft Skills", requiredScore: 75 },
  { name: "Problem Solving", category: "Soft Skills", requiredScore: 80 },
  { name: "Time Management", category: "Soft Skills", requiredScore: 70 },
];

// Trust levels the assessment alone can produce are capped at ASSESSED —
// higher levels (PROJECT_VERIFIED, CERTIFIED, INDUSTRY_VERIFIED) require
// evidence beyond a self-assessment and are set elsewhere (portfolio/passport).
export const TRUST_LEVELS = {
  SELF_DECLARED: "Self-Declared",
  ASSESSED: "Assessed",
  PROJECT_VERIFIED: "Project-Verified",
  CERTIFIED: "Certified",
  INDUSTRY_VERIFIED: "Industry-Verified",
};

function trustLevelForScore(score) {
  return score === 0 ? TRUST_LEVELS.SELF_DECLARED : TRUST_LEVELS.ASSESSED;
}

// Fallback profile shown before a student ever takes the assessment.
// Every skill starts at 0 / self-declared so the UI has something honest to render.
export function buildEmptySkillProfile() {
  return SKILL_CATALOG.map((s) => ({
    ...s,
    currentScore: 0,
    trustLevel: TRUST_LEVELS.SELF_DECLARED,
    lastUpdated: null,
  }));
}

// Demo default so the dashboard/profile pages have realistic data on first load,
// consistent with the assessment's own scoring model (see assessmentService.js).
export function buildDemoSkillProfile() {
  const demoScores = {
    JavaScript: 88,
    "Python Programming": 90,
    React: 62,
    "SQL / Databases": 78,
    "Data Structures & Algorithms": 82,
    "Cloud Computing (AWS)": 40,
    "Machine Learning": 55,
    "Git & Version Control": 85,
    Communication: 80,
    Teamwork: 84,
    "Problem Solving": 88,
    "Time Management": 72,
  };
  const lastUpdated = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  return SKILL_CATALOG.map((s) => ({
    ...s,
    currentScore: demoScores[s.name] ?? 0,
    trustLevel: trustLevelForScore(demoScores[s.name] ?? 0),
    lastUpdated,
  }));
}
