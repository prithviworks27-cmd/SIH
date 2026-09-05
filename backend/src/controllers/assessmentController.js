import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

const PROFICIENCY_LEVELS = new Set(["Not yet started", "Beginner", "Intermediate", "Advanced", "Expert"]);
const ASSESSABLE_SKILLS = new Set([
  "JavaScript", "Python Programming", "React", "SQL / Databases", "Data Structures & Algorithms",
  "Cloud Computing (AWS)", "Machine Learning", "Git & Version Control", "Communication", "Teamwork",
  "Problem Solving", "Time Management", "Power BI", "Statistics", "Excel", "TypeScript", "Java / C++ / C#",
  "Node.js", "Docker / Kubernetes", "CI/CD (Jenkins, GitHub Actions)", "REST APIs / GraphQL", "Deep Learning / NLP",
  "Data Visualization (Tableau)", "Linux / Shell Scripting", "Cybersecurity Basics", "Testing / QA (Selenium, Jest)",
  "Mobile Development (iOS/Android, Flutter, React Native)", "DevOps", "Big Data (Hadoop, Spark)", "Blockchain",
]);

function levelForScore(score) {
  if (score >= 90) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 50) return "Intermediate";
  if (score === 0) return "Not yet started";
  return "Beginner";
}

// Turns a skill name into the synthetic test_id dynamic tests are stored
// under in skill_test_results, e.g. "SQL / Databases" -> "dynamic-sql-databases".
function dynamicTestId(skillName) {
  return `dynamic-${skillName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

// Shared by submitSkillTestResult (static SKILL_TESTS) and submitDynamicTest
// (assessment_questions-backed tests): insert the attempt into
// skill_test_results, and on a pass, upsert skill_profile keeping the higher
// of any existing score (a retake shouldn't lower an already-verified score).
// Returns { result, profile } ready to send straight back to the client, or
// throws so callers can turn that into a 500 with their own log message.
async function persistTestResult(userId, { testId, skillName, total, correct, scorePercent, passingScore, passed, levelBreakdown = null, questionReview = null }) {
  const completedAt = new Date().toISOString();

  const { data: result, error: insertError } = await supabase
    .from("skill_test_results")
    .insert({
      user_id: userId,
      test_id: testId,
      skill_name: skillName,
      total_questions: total,
      correct_answers: correct,
      score_percent: scorePercent,
      passing_score: passingScore,
      passed,
      completed_at: completedAt,
      // Per-level (beginner/intermediate/advanced) score breakdown — only
      // dynamic tests compute this; static SKILL_TESTS attempts pass null.
      level_breakdown: levelBreakdown,
      question_review: questionReview,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  let profile = null;
  if (passed) {
    const { data: existing } = await supabase
      .from("skill_profile")
      .select("current_score")
      .eq("user_id", userId)
      .eq("skill_name", skillName)
      .maybeSingle();

    const nextScore = Math.max(existing?.current_score ?? 0, scorePercent);

    const { data: upserted, error: upsertError } = await supabase
      .from("skill_profile")
      .upsert(
        {
          user_id: userId,
          skill_name: skillName,
          current_score: nextScore,
          trust_level: "Assessment Verified",
          proficiency_level: levelForScore(scorePercent),
          last_updated: completedAt,
        },
        { onConflict: "user_id,skill_name" }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;
    profile = upserted;
  }

  return { result, profile };
}

// Grades a free-text/code answer against the expected answer by keyword
// overlap rather than exact match (there's no single "correct" phrasing for
// these). Pulls out the significant words (4+ letters, so filler like "the",
// "is", "a" don't count) from the expected answer and requires at least half
// of them to show up in the submission, case/whitespace-insensitively.
function gradeTextAnswer(submitted, correctAnswer) {
  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const submittedNorm = normalize(submitted);
  if (!submittedNorm) return false;

  const expectedWords = [...new Set(normalize(correctAnswer).match(/[a-z0-9]{4,}/g) || [])];
  if (expectedWords.length === 0) return submittedNorm === normalize(correctAnswer);

  const matched = expectedWords.filter((w) => submittedNorm.includes(w));
  return matched.length / expectedWords.length >= 0.5;
}

// GET /api/assessments/skill-tests/results — every attempt for the current user,
// used by the "My Assessments" list to show each test's last result plus its
// full attempt history (see getAssessmentHistory on the frontend, which
// relies on every retake staying as its own row rather than being replaced).
export const getSkillTestResults = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("skill_test_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Fetch skill test results error:", error);
      return res.status(500).json({ error: "Failed to load assessment results" });
    }

    res.status(200).json({ results: data });
  } catch (error) {
    console.error("Get skill test results error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/assessments/skill-tests/:testId/submit
// body: { skillName, totalQuestions, correctAnswers, scorePercent, passingScore, passed }
// Scoring itself stays client-side (the question bank + correct answers are
// still mock data, per Step 2 scope — "no backend assessment APIs" for
// question delivery/grading) — this endpoint only persists the already-computed
// result via persistTestResult, which keeps every attempt as its own row
// (never replaces a retake) and updates the shared skill_profile row when passed.
export const submitSkillTestResult = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { testId, skillName, totalQuestions, correctAnswers, scorePercent, passingScore, passed } = req.body;

    if (
      !testId ||
      !ASSESSABLE_SKILLS.has(skillName) ||
      typeof totalQuestions !== "number" ||
      typeof correctAnswers !== "number" ||
      typeof scorePercent !== "number" ||
      typeof passingScore !== "number" ||
      typeof passed !== "boolean"
    ) {
      return res.status(400).json({ error: "Invalid assessment result payload" });
    }

    let payload;
    try {
      payload = await persistTestResult(userId, {
        testId,
        skillName,
        total: totalQuestions,
        correct: correctAnswers,
        scorePercent,
        passingScore,
        passed,
      });
    } catch (persistError) {
      console.error("Persist skill test result error:", persistError);
      return res.status(500).json({ error: "Failed to save assessment result" });
    }

    res.status(201).json(payload);
  } catch (error) {
    console.error("Submit skill test result error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/assessments/skill-profile/upsert
// body: { skillName, currentScore, trustLevel, proficiencyLevel? }
// General-purpose skill-profile write for the two non-skill-test paths that
// update it: the self-rating assessment (assessmentService.submitAssessment)
// and learning-path re-assessment (learningPathsService.completeNextModule).
// Unlike submitSkillTestResult, this always writes (no pass/fail gate) since
// callers are already responsible for deciding a skill's new score/trust
// level before calling this — matches what the localStorage version did.
export const upsertSkillProfileEntry = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { skillName, currentScore, trustLevel, proficiencyLevel } = req.body;
    if (
      !skillName ||
      !ASSESSABLE_SKILLS.has(skillName) ||
      typeof currentScore !== "number" ||
      !Number.isFinite(currentScore) ||
      currentScore < 0 ||
      currentScore > 100 ||
      !trustLevel ||
      (proficiencyLevel !== undefined && proficiencyLevel !== null && !PROFICIENCY_LEVELS.has(proficiencyLevel))
    ) {
      return res.status(400).json({ error: "skillName, currentScore, and trustLevel are required" });
    }

    const { data, error } = await supabase
      .from("skill_profile")
      .upsert(
        {
          user_id: userId,
          skill_name: skillName,
          current_score: currentScore,
          trust_level: trustLevel,
          proficiency_level: proficiencyLevel ?? null,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "user_id,skill_name" }
      )
      .select()
      .single();

    if (error) {
      console.error("Upsert skill profile entry error:", error);
      return res.status(500).json({ error: "Failed to update skill profile" });
    }

    res.status(200).json({ entry: data });
  } catch (error) {
    console.error("Upsert skill profile entry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/assessments/skill-profile — the student's current per-skill state,
// keyed by skill name, as persisted by passed skill tests.
export const getSkillProfile = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("skill_profile")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch skill profile error:", error);
      return res.status(500).json({ error: "Failed to load skill profile" });
    }

    res.status(200).json({ profile: data });
  } catch (error) {
    console.error("Get skill profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const DYNAMIC_TEST_PASSING_SCORE = 70;

// Per-question time budget by difficulty, in seconds — summed into the
// single total countdown DynamicSkillTestStart shows (not a per-question
// timer: the whole allowance is one pool the student can spend across
// questions in any order).
const LEVEL_TIME_SECONDS = { beginner: 120, intermediate: 240, advanced: 360 };

// GET /api/assessments/dynamic-tests/:skillName — a 20-question objective
// test for one skill, sourced from the assessment_questions bank instead of
// the hardcoded SKILL_TESTS array. correct_answer is stripped before the
// response goes out so the answer key never reaches the browser.
export const getDynamicTest = async (req, res) => {
  try {
    const { skillName } = req.params;
    if (!ASSESSABLE_SKILLS.has(skillName)) {
      return res.status(400).json({ error: "Unknown skill" });
    }

    const { data, error } = await supabase
      .from("assessment_questions")
      .select("id, level, question_type, prompt, options")
      .eq("skill_name", skillName)
      .order("level", { ascending: true });

    if (error) {
      console.error("Fetch dynamic test questions error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(503).json({
        error: "The assessment question bank is unavailable. Please ask an administrator to run the assessment_questions database migration.",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No questions available for this skill yet" });
    }

    const questions = data.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      level: q.level,
      questionType: q.question_type,
      timeSeconds: LEVEL_TIME_SECONDS[q.level] ?? LEVEL_TIME_SECONDS.intermediate,
      // mcq options come back as a JSON array of option strings; shape them
      // into {value, label} pairs QuestionCard already knows how to render.
      // text/code questions have no options — the client renders a text
      // input instead.
      options: Array.isArray(q.options) ? q.options.map((opt) => ({ value: opt, label: opt })) : null,
    }));

    const totalTimeSeconds = questions.reduce((sum, q) => sum + q.timeSeconds, 0);

    res.status(200).json({
      testId: dynamicTestId(skillName),
      skillName,
      title: skillName,
      category: "Technical Skill",
      durationMinutes: Math.round(totalTimeSeconds / 60),
      totalTimeSeconds,
      passingScore: DYNAMIC_TEST_PASSING_SCORE,
      questions,
    });
  } catch (error) {
    console.error("Get dynamic test error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/assessments/dynamic-tests/:skillName/submit
// body: { answers: { [questionId]: submittedAnswer } }
// Re-fetches the same questions (this time including correct_answer) and
// grades server-side — mcq by exact match, text/code by keyword overlap
// (see gradeTextAnswer) — then persists exactly like a static skill test.
export const submitDynamicTest = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { skillName } = req.params;
    if (!ASSESSABLE_SKILLS.has(skillName)) {
      return res.status(400).json({ error: "Unknown skill" });
    }

    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object is required" });
    }

    const { data: questions, error } = await supabase
      .from("assessment_questions")
      .select("id, level, question_type, correct_answer")
      .eq("skill_name", skillName);

    if (error) {
      console.error("Fetch dynamic test answer key error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(503).json({
        error: "The assessment question bank is unavailable. Please ask an administrator to run the assessment_questions database migration.",
      });
    }

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No questions available for this skill yet" });
    }

    const total = questions.length;
    let correctCount = 0;
    // Tally per level (beginner/intermediate/advanced) alongside the overall
    // count, so the result can show e.g. "6/7 beginner, 4/7 intermediate,
    // 2/6 advanced" — not just one blended percentage.
    const levelTotals = {};
    const breakdown = questions.map((q) => {
      const submitted = answers[q.id];
      const isCorrect =
        q.question_type === "mcq" ? submitted === q.correct_answer : gradeTextAnswer(submitted, q.correct_answer);
      if (isCorrect) correctCount += 1;

      const level = q.level;
      if (!levelTotals[level]) levelTotals[level] = { total: 0, correct: 0 };
      levelTotals[level].total += 1;
      if (isCorrect) levelTotals[level].correct += 1;

      return { questionId: q.id, level, correct: isCorrect };
    });

    const questionIds = questions.map((q) => q.id);
    const { data: questionDetails, error: detailsError } = await supabase
      .from("assessment_questions")
      .select("id, level, question_type, prompt, correct_answer, explanation")
      .in("id", questionIds);
    if (detailsError) {
      console.error("Fetch assessment review details error:", detailsError);
      return res.status(500).json({ error: "Failed to prepare assessment review" });
    }

    const reviewById = new Map((questionDetails || []).map((q) => [q.id, q]));
    const questionReview = questions.map((q) => {
      const detail = reviewById.get(q.id) || q;
      const submittedAnswer = answers[q.id] ?? "";
      const result = breakdown.find((item) => item.questionId === q.id);
      return {
        questionId: q.id,
        level: q.level,
        questionType: q.question_type,
        prompt: detail.prompt,
        submittedAnswer,
        correctAnswer: detail.correct_answer,
        explanation: detail.explanation,
        correct: result?.correct ?? false,
      };
    });

    const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];
    const levelBreakdown = LEVEL_ORDER.filter((level) => levelTotals[level]).map((level) => ({
      level,
      total: levelTotals[level].total,
      correct: levelTotals[level].correct,
      scorePercent: Math.round((levelTotals[level].correct / levelTotals[level].total) * 100),
    }));

    const scorePercent = Math.round((correctCount / total) * 100);
    const passed = scorePercent >= DYNAMIC_TEST_PASSING_SCORE;
    const testId = dynamicTestId(skillName);

    let payload;
    try {
      payload = await persistTestResult(userId, {
        testId,
        skillName,
        total,
        correct: correctCount,
        scorePercent,
        passingScore: DYNAMIC_TEST_PASSING_SCORE,
        passed,
        levelBreakdown,
        questionReview,
      });
    } catch (persistError) {
      console.error("Persist dynamic test result error:", persistError);
      return res.status(500).json({ error: "Failed to save assessment result" });
    }

    res.status(201).json({
      ...payload,
      result: { ...payload.result, breakdown, level_breakdown: levelBreakdown },
    });
  } catch (error) {
    console.error("Submit dynamic test error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
