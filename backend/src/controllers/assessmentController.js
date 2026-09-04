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

// GET /api/assessments/skill-tests/results — every attempt for the current user,
// used by the "My Assessments" list to show each test's last result.
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
// result and, on a pass, updates the shared skill_profile row.
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

    const completedAt = new Date().toISOString();

    const { data: result, error: insertError } = await supabase
      .from("skill_test_results")
      .insert({
        user_id: userId,
        test_id: testId,
        skill_name: skillName,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percent: scorePercent,
        passing_score: passingScore,
        passed,
        completed_at: completedAt,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert skill test result error:", insertError);
      return res.status(500).json({ error: "Failed to save assessment result" });
    }

    let profile = null;
    if (passed) {
      // Read-modify-write: keep the higher of any existing score for this
      // skill (a retake shouldn't lower an already-verified score), same
      // rule the localStorage version used (Math.max).
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

      if (upsertError) {
        console.error("Upsert skill profile error:", upsertError);
        return res.status(500).json({ error: "Assessment saved, but failed to update skill profile" });
      }
      profile = upserted;
    }

    res.status(201).json({ result, profile });
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
