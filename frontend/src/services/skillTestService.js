import { resolveMock } from "./mockClient";
import { SKILL_TESTS, getSkillTestById } from "./mockData/skillTests";
import { TRUST_LEVELS } from "./mockData/skills";
import { getStoredSkillProfileOrDemo } from "./assessmentService";
import { assessmentAPI } from "./api";

const RESULTS_STORAGE_KEY = "skillTestResults";
const SKILL_PROFILE_STORAGE_KEY = "skillProfile";

// Score → proficiency level shown on the skill profile once a test is passed.
// Kept as ranges (not a single fixed value) so a strong pass reads as more
// senior than a bare pass — same idea as the self-assessment's PROFICIENCY_OPTIONS.
function levelForScore(score) {
  if (score >= 90) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 50) return "Intermediate";
  return "Beginner";
}

// Results and the skill profile now live in Supabase (see backend
// assessmentController.js) so they persist across devices/browsers for a
// logged-in user. localStorage stays as a same-tab cache and as the fallback
// when the backend call fails (offline, logged out, request error) — it
// keeps the demo working even if the API is briefly unreachable.
export async function getSkillTests() {
  const results = await loadResults();
  const tests = SKILL_TESTS.map((t) => ({
    id: t.id,
    skillName: t.skillName,
    title: t.title,
    category: t.category,
    durationMinutes: t.durationMinutes,
    questionCount: t.questions.length,
    passingScore: t.passingScore,
    lastResult: results[t.id] ?? null,
  }));
  return tests;
}

export async function getSkillTestForAttempt(testId) {
  const test = getSkillTestById(testId);
  if (!test) return resolveMock(null);
  // Strip correctValue before handing questions to the UI — the client
  // shouldn't have the answer key sitting in memory during the attempt.
  const questions = test.questions.map(({ correctValue, ...q }) => q);
  return resolveMock({
    id: test.id,
    skillName: test.skillName,
    title: test.title,
    category: test.category,
    durationMinutes: test.durationMinutes,
    passingScore: test.passingScore,
    questions,
  });
}

// Total Questions / Correct Answers / Score % / Pass-Fail — the threshold
// comes from the test definition (SKILL_TESTS[].passingScore), never a
// magic number in the component, so it can be tuned per skill in one place.
// Grading itself stays client-side (question bank is still mock data, per
// Step 2 scope) — only the already-computed result gets persisted server-side.
export function scoreSkillTest(testId, answers) {
  const test = getSkillTestById(testId);
  if (!test) return null;

  const total = test.questions.length;
  let correct = 0;
  const breakdown = test.questions.map((q) => {
    const isCorrect = answers[q.id] === q.correctValue;
    if (isCorrect) correct += 1;
    return { questionId: q.id, correct: isCorrect };
  });

  const scorePercent = Math.round((correct / total) * 100);
  const passed = scorePercent >= test.passingScore;

  return {
    testId,
    skillName: test.skillName,
    title: test.title,
    total,
    correct,
    scorePercent,
    passingScore: test.passingScore,
    passed,
    breakdown,
    completedAt: new Date().toISOString(),
  };
}

export async function submitSkillTest(testId, answers) {
  const result = scoreSkillTest(testId, answers);
  if (!result) throw new Error("Unknown skill test");

  try {
    await assessmentAPI.submitSkillTestResult(testId, {
      testId,
      skillName: result.skillName,
      totalQuestions: result.total,
      correctAnswers: result.correct,
      scorePercent: result.scorePercent,
      passingScore: result.passingScore,
      passed: result.passed,
    });
  } catch (err) {
    // Backend unreachable/unauthenticated — keep the demo working on the
    // local cache alone rather than blocking the result screen on a network error.
    console.warn("Could not persist assessment result to backend, using local cache only:", err.message);
  }

  persistResultLocally(result);
  if (result.passed) {
    await applyPassedTestToSkillProfile(result);
  }
  return resolveMock(result, { delay: 300 });
}

// The step that turns a quiz into Skill Intelligence: a passed test writes
// straight into the same skill profile every other page reads (dashboard,
// skill graph, gap report, portfolio) — never an isolated result screen only.
// The backend write happens in submitSkillTest via assessmentAPI; this keeps
// the local cache (read by skillsService.getSkillProfile) in sync too.
async function applyPassedTestToSkillProfile(result) {
  const current = await getStoredSkillProfileOrDemo();
  const now = result.completedAt;

  const profile = current.profile.map((s) =>
    s.name === result.skillName
      ? {
          ...s,
          currentScore: Math.max(s.currentScore, result.scorePercent),
          trustLevel: TRUST_LEVELS.TEST_VERIFIED,
          proficiencyLevel: levelForScore(result.scorePercent),
          lastUpdated: now,
        }
      : s
  );

  const overallMatchPercent = Math.round(
    (profile.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / profile.length) * 100
  );

  const next = { profile, overallMatchPercent, completedAt: current.completedAt ?? now };
  persistSkillProfileLocally(next);
}

// Backend results are the source of truth when reachable; localStorage is
// merged in underneath so any test only ever taken before the backend was
// wired up (or taken while offline) still shows its last result.
async function loadResults() {
  const local = loadResultsLocally();
  try {
    const { results } = await assessmentAPI.getSkillTestResults();
    const byTestId = {};
    for (const r of results) {
      byTestId[r.test_id] = {
        testId: r.test_id,
        skillName: r.skill_name,
        total: r.total_questions,
        correct: r.correct_answers,
        scorePercent: r.score_percent,
        passingScore: r.passing_score,
        passed: r.passed,
        completedAt: r.completed_at,
      };
    }
    return { ...local, ...byTestId };
  } catch (err) {
    console.warn("Could not load assessment results from backend, using local cache only:", err.message);
    return local;
  }
}

function loadResultsLocally() {
  try {
    const raw = localStorage.getItem(RESULTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistResultLocally(result) {
  try {
    const all = loadResultsLocally();
    all[result.testId] = result;
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // best-effort — a missed persist just means "last result" won't show next visit
  }
}

function persistSkillProfileLocally(next) {
  try {
    localStorage.setItem(SKILL_PROFILE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — profile update just won't survive a reload
  }
}

export async function getSkillTestResult(testId) {
  const all = await loadResults();
  return all[testId] ?? null;
}

// Assessment results grouped per test. Retesting replaces the previous
// database row, so each group contains the current result only.
export async function getAssessmentHistory() {
  let rows = [];
  try {
    const { results } = await assessmentAPI.getSkillTestResults();
    rows = results.map((r) => ({
      id: r.id,
      testId: r.test_id,
      skillName: r.skill_name,
      total: r.total_questions,
      correct: r.correct_answers,
      scorePercent: r.score_percent,
      passingScore: r.passing_score,
      passed: r.passed,
      completedAt: r.completed_at,
    }));
  } catch (err) {
    console.warn("Could not load assessment history from backend, falling back to last-known result per test:", err.message);
    // Offline/unauthenticated fallback — only the last attempt per test is
    // available locally (localStorage never kept full history), so history
    // degrades to one row per test rather than being empty.
    rows = Object.values(loadResultsLocally());
  }

  const byTest = new Map();
  for (const attempt of rows) {
    if (!byTest.has(attempt.testId)) {
      byTest.set(attempt.testId, { testId: attempt.testId, skillName: attempt.skillName, attempts: [] });
    }
    byTest.get(attempt.testId).attempts.push(attempt);
  }

  return Array.from(byTest.values())
    .map((group) => {
      const attempts = [...group.attempts].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      const bestScore = Math.max(...attempts.map((a) => a.scorePercent));
      return {
        testId: group.testId,
        skillName: group.skillName,
        title: getSkillTestById(group.testId)?.title ?? group.skillName,
        latest: attempts[0],
        bestScore,
        attemptCount: attempts.length,
        attempts,
      };
    })
    .sort((a, b) => new Date(b.latest.completedAt) - new Date(a.latest.completedAt));
}
