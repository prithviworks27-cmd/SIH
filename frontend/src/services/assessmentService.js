import { resolveMock } from "./mockClient";
import { ASSESSMENT_QUESTIONS } from "./mockData/assessmentQuestions";
import { SKILL_CATALOG, TRUST_LEVELS, buildDemoSkillProfile } from "./mockData/skills";

const STORAGE_KEY = "skillProfile";

export async function getAssessmentQuestions() {
  return resolveMock(ASSESSMENT_QUESTIONS);
}

// Turns { questionId: optionValue } answers into a full skill profile:
// every catalog skill gets a score (answered ones from the assessment,
// everything else keeps its previous score so a partial retake doesn't
// wipe skills the student didn't touch this time).
export function scoreAssessment(answers, previousProfile = []) {
  const previousByName = Object.fromEntries(previousProfile.map((s) => [s.name, s]));
  const now = new Date().toISOString();

  const bySkillScore = {};
  for (const q of ASSESSMENT_QUESTIONS) {
    const chosenValue = answers[q.id];
    if (!chosenValue) continue;
    const option = q.options.find((o) => o.value === chosenValue);
    if (option) bySkillScore[q.skill] = option.score;
  }

  const profile = SKILL_CATALOG.map((s) => {
    if (s.name in bySkillScore) {
      return {
        ...s,
        currentScore: bySkillScore[s.name],
        trustLevel: TRUST_LEVELS.ASSESSED,
        lastUpdated: now,
      };
    }
    const prev = previousByName[s.name];
    return prev ? { ...s, ...prev } : { ...s, currentScore: 0, trustLevel: TRUST_LEVELS.SELF_DECLARED, lastUpdated: null };
  });

  const overallMatchPercent = Math.round(
    profile.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / profile.length * 100
  );

  return { profile, overallMatchPercent, completedAt: now };
}

export async function submitAssessment(answers) {
  const previous = loadStoredProfile();
  const result = scoreAssessment(answers, previous?.profile ?? []);
  persistProfile(result);
  return resolveMock(result, { delay: 600 });
}

function loadStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistProfile(result) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // localStorage unavailable (private mode, quota) — profile just won't persist across reloads.
  }
}

// The single source every page (dashboard, skill profile, gap report, portfolio)
// reads from. Returns a previously-submitted assessment if one exists, otherwise
// a realistic demo profile so the UI never looks empty before the student's first attempt.
export async function getStoredSkillProfileOrDemo() {
  const stored = loadStoredProfile();
  if (stored) return resolveMock(stored);
  return resolveMock({ profile: buildDemoSkillProfile(), overallMatchPercent: 79, completedAt: null });
}

// Proof-of-Skill Challenge completion feeds back into the SAME skill profile
// everything else reads — passing a challenge for a skill bumps its trust
// level to Project-Verified and raises its score, exactly like the spec's
// "Challenge Score → Skill Verification → Trust Level Updated" flow.
export async function verifySkillViaChallenge(skillName, challengeScore) {
  const current = await getStoredSkillProfileOrDemo();
  const now = new Date().toISOString();

  const profile = current.profile.map((s) =>
    s.name === skillName
      ? {
          ...s,
          currentScore: Math.max(s.currentScore, challengeScore),
          trustLevel: TRUST_LEVELS.PROJECT_VERIFIED,
          lastUpdated: now,
        }
      : s
  );

  const overallMatchPercent = Math.round(
    (profile.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / profile.length) * 100
  );

  const result = { profile, overallMatchPercent, completedAt: current.completedAt ?? now };
  persistProfile(result);
  return resolveMock(result, { delay: 300 });
}
