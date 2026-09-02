import { resolveMock } from "./mockClient";
import { getSkillProfile } from "./skillsService";
import { modulesForSkill } from "./mockData/learningPathModules";

const STORAGE_KEY = "learningPathProgress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // best-effort — completed-module progress just won't survive a reload if storage is unavailable
  }
}

// Builds one learning path per skill gap in the student's real profile
// (see skillsService.getSkillProfile) — not a hardcoded, disconnected topic
// list. Each path's modules are keyed by skill name (learningPathModules.js),
// and progress (completed module count) is tracked per skill in localStorage.
export async function getLearningPaths() {
  const { skillGaps } = await getSkillProfile();
  const progress = loadProgress();

  const paths = skillGaps.slice(0, 6).map((gap) => {
    const modules = modulesForSkill(gap.name);
    const completed = Math.min(progress[gap.name] ?? 0, modules.length);
    return {
      skillName: gap.name,
      title: `Close the gap: ${gap.name}`,
      duration: `${modules.length * 2} Weeks`,
      modules,
      completed,
      progressPercent: modules.length === 0 ? 0 : Math.round((completed / modules.length) * 100),
    };
  });

  return resolveMock(paths);
}

export async function completeNextModule(skillName) {
  const modules = modulesForSkill(skillName);
  const progress = loadProgress();
  const current = progress[skillName] ?? 0;
  const next = Math.min(current + 1, modules.length);
  progress[skillName] = next;
  persistProgress(progress);
  return resolveMock({ skillName, completed: next, total: modules.length }, { delay: 300 });
}
