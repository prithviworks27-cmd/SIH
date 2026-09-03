import { resolveMock } from "./mockClient";
import { ASSESSMENT_QUESTIONS } from "./mockData/assessmentQuestions";
import { SKILL_CATALOG, TRUST_LEVELS, buildDemoSkillProfile } from "./mockData/skills";
import { assessmentAPI } from "./api";

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
  persistProfileLocally(result);

  // Push every answered skill to Supabase too — the self-rating assessment
  // touches many skills at once, so this is a batch of upserts rather than
  // the single-skill call verifySkillViaChallenge/reassessSkillOnPathComplete
  // make. Best-effort: a failed sync here doesn't block the result the
  // student sees, same resilience pattern as skillTestService.js.
  const answeredSkillNames = new Set();
  for (const q of ASSESSMENT_QUESTIONS) {
    if (answers[q.id]) answeredSkillNames.add(q.skill);
  }
  await Promise.all(
    result.profile
      .filter((s) => answeredSkillNames.has(s.name))
      .map((s) =>
        assessmentAPI
          .upsertSkillProfileEntry({ skillName: s.name, currentScore: s.currentScore, trustLevel: s.trustLevel })
          .catch((err) => console.warn(`Could not sync ${s.name} to backend:`, err.message))
      )
  );

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

function persistProfileLocally(result) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // localStorage unavailable (private mode, quota) — profile just won't persist across reloads.
  }
}

// The single source every page (dashboard, skill profile, gap report, portfolio)
// reads from. Merges three layers, weakest first: the demo/self-rating base
// (buildDemoSkillProfile, or whatever's in localStorage from a self-rating
// assessment) is overridden per-skill by whatever Supabase's skill_profile
// table has — that table is written by skill tests (Step 2, always
// authoritative), the self-rating assessment (now also synced, see
// submitAssessment above), and learning-path re-assessment. This is the
// reconciliation flagged as the trickiest part of the full migration: two
// write paths used to target the same localStorage key independently, now
// Supabase is the cross-device source of truth and localStorage is only the
// same-tab cache / offline fallback for the self-rating base layer.
export async function getStoredSkillProfileOrDemo() {
  const localBase = loadStoredProfile() ?? { profile: buildDemoSkillProfile(), overallMatchPercent: 79, completedAt: null };

  let backendEntries = [];
  try {
    const { profile } = await assessmentAPI.getSkillProfile();
    backendEntries = profile;
  } catch (err) {
    console.warn("Could not load skill profile from backend, using local cache only:", err.message);
    return resolveMock(localBase);
  }

  if (backendEntries.length === 0) return resolveMock(localBase);

  const backendByName = new Map(backendEntries.map((e) => [e.skill_name, e]));
  const profile = localBase.profile.map((s) => {
    const backendEntry = backendByName.get(s.name);
    if (!backendEntry) return s;
    return {
      ...s,
      currentScore: backendEntry.current_score,
      trustLevel: backendEntry.trust_level,
      lastUpdated: backendEntry.last_updated,
    };
  });

  const overallMatchPercent = Math.round(
    (profile.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / profile.length) * 100
  );

  const merged = { profile, overallMatchPercent, completedAt: localBase.completedAt };
  return resolveMock(merged);
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
  persistProfileLocally(result);

  const updated = profile.find((s) => s.name === skillName);
  try {
    await assessmentAPI.upsertSkillProfileEntry({
      skillName,
      currentScore: updated.currentScore,
      trustLevel: updated.trustLevel,
    });
  } catch (err) {
    console.warn(`Could not sync ${skillName} to backend:`, err.message);
  }

  return resolveMock(result, { delay: 300 });
}
