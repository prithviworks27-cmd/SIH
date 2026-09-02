import { getStoredSkillProfileOrDemo } from "./assessmentService";

const STRONG_SKILL_THRESHOLD = 70;

// Canonical read path for a student's skill data. Every page that needs skills
// (dashboard, skill profile, gap report, portfolio) calls this — never its own
// hardcoded list — so an assessment retake updates all of them at once.
export async function getSkillProfile() {
  const { profile, overallMatchPercent, completedAt } = await getStoredSkillProfileOrDemo();

  const strongSkills = profile
    .filter((s) => s.currentScore >= STRONG_SKILL_THRESHOLD)
    .sort((a, b) => b.currentScore - a.currentScore);

  const skillGaps = profile
    .filter((s) => s.currentScore < s.requiredScore)
    .map((s) => ({ ...s, gap: s.requiredScore - s.currentScore, percent: s.currentScore }))
    .sort((a, b) => b.gap - a.gap);

  return { profile, strongSkills, skillGaps, overallMatchPercent, completedAt };
}
