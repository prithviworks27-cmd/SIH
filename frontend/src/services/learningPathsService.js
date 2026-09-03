import { resolveMock } from "./mockClient";
import { getSkillProfile } from "./skillsService";
import { getTargetRoleReadiness } from "./careerRoleService";
import { modulesForSkill } from "./mockData/learningPathModules";
import { projectForSkill } from "./mockData/recommendedProjects";
import { getAllSkillPrograms } from "./skillProgramsService";
import { getStoredSkillProfileOrDemo } from "./assessmentService";
import { TRUST_LEVELS } from "./mockData/skills";
import { studentStateAPI, assessmentAPI } from "./api";

const STORAGE_KEY = "learningPathProgress";

function loadProgressLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistProgressLocally(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // best-effort — completed-module progress just won't survive a reload if storage is unavailable
  }
}

// Progress now lives in Supabase (learning_path_progress table), with
// localStorage as a same-tab cache/offline fallback — same resilience
// pattern as every other migrated service. Backend is the source of truth
// when reachable.
async function loadProgress() {
  const local = loadProgressLocally();
  try {
    const { progress } = await studentStateAPI.getLearningProgress();
    return { ...local, ...progress };
  } catch (err) {
    console.warn("Could not load learning progress from backend, using local cache only:", err.message);
    return local;
  }
}

// Builds one learning path per missing skill for the student's current
// target role (see careerRoleService.getTargetRoleReadiness — Step 3/4's
// gap data), so "Recommended Learning" is explicitly Skill Gap -> Learning,
// not a disconnected topic list. Falls back to the generic threshold-based
// gaps (skillsService.getSkillProfile) if no target role gaps exist, so the
// page never looks empty for a fully-role-ready student.
export async function getLearningPaths() {
  const roleReadiness = await getTargetRoleReadiness();
  const progress = await loadProgress();

  let gapNames = (roleReadiness?.missingSkills ?? []).map((s) => s.name);
  if (gapNames.length === 0) {
    const { skillGaps } = await getSkillProfile();
    gapNames = skillGaps.slice(0, 6).map((s) => s.name);
  }

  const paths = gapNames.map((skillName) => {
    const modules = modulesForSkill(skillName);
    const completed = Math.min(progress[skillName] ?? 0, modules.length);
    return {
      skillName,
      title: `Close the gap: ${skillName}`,
      duration: `${modules.length * 2} Weeks`,
      modules,
      completed,
      progressPercent: modules.length === 0 ? 0 : Math.round((completed / modules.length) * 100),
      project: projectForSkill(skillName),
    };
  });

  return resolveMock(paths);
}

export async function getRecommendedProjects() {
  const roleReadiness = await getTargetRoleReadiness();
  const gapNames = (roleReadiness?.missingSkills ?? []).map((s) => s.name);
  const projects = gapNames.map((skillName) => ({ skillName, ...projectForSkill(skillName) }));
  return resolveMock(projects);
}

export async function getIndustryPrograms() {
  return getAllSkillPrograms();
}

// The step that closes the loop the spec calls for: Skill Gap -> Recommended
// Learning -> Complete Learning -> Re-assessment -> Skill Level Updated.
// Completing a path's final module counts as a lightweight re-assessment:
// it nudges the skill's score up (never past the role's required bar) and
// marks it Assessed, the same trust tier a real assessment produces — a full
// skill test (see skillTestService.js) still yields a stronger, test-backed
// verification if the student takes one. The updated score/trust level is
// pushed to the same Supabase skill_profile table skill tests and the
// self-rating assessment write to (see assessmentService.js's merge logic).
async function reassessSkillOnPathComplete(skillName) {
  const current = await getStoredSkillProfileOrDemo();
  const now = new Date().toISOString();

  const profile = current.profile.map((s) => {
    if (s.name !== skillName) return s;
    const bumped = Math.min(s.requiredScore, Math.max(s.currentScore, 40) + 25);
    const trustLevel = s.trustLevel === TRUST_LEVELS.SELF_DECLARED ? TRUST_LEVELS.ASSESSED : s.trustLevel;
    return { ...s, currentScore: Math.max(s.currentScore, bumped), trustLevel, lastUpdated: now };
  });

  const updated = profile.find((s) => s.name === skillName);
  try {
    await assessmentAPI.upsertSkillProfileEntry({
      skillName,
      currentScore: updated.currentScore,
      trustLevel: updated.trustLevel,
    });
  } catch (err) {
    console.warn(`Could not sync ${skillName} re-assessment to backend:`, err.message);
  }
}

export async function completeNextModule(skillName) {
  const modules = modulesForSkill(skillName);
  const progress = await loadProgress();
  const current = progress[skillName] ?? 0;
  const next = Math.min(current + 1, modules.length);

  progress[skillName] = next;
  persistProgressLocally(progress);
  try {
    await studentStateAPI.setLearningProgress(skillName, next);
  } catch (err) {
    console.warn(`Could not sync learning progress for ${skillName} to backend:`, err.message);
  }

  const justFinished = next === modules.length && current < modules.length;
  if (justFinished) {
    await reassessSkillOnPathComplete(skillName);
  }

  return resolveMock({ skillName, completed: next, total: modules.length, justFinished }, { delay: 300 });
}
