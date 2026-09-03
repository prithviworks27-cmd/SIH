import { resolveMock } from "./mockClient";
import { CAREER_ROLES, getCareerRoleById } from "./mockData/careerRoles";
import { getSkillProfile } from "./skillsService";
import { calculateMatch } from "./matchingEngine";
import { studentStateAPI } from "./api";

const TARGET_ROLE_STORAGE_KEY = "targetRoleId";
const DEFAULT_TARGET_ROLE_ID = "data-analyst";

// Weights favor skill match heavily — a role's readiness is fundamentally
// "do you have the required skills," not eligibility/projects/etc. the way
// an opportunity match is. Keeps calculateMatch() as the one shared engine
// instead of a second bespoke readiness formula.
const ROLE_READINESS_WEIGHTS = {
  skillMatch: 100,
  education: 0,
  projects: 0,
  certifications: 0,
  experience: 0,
  location: 0,
  other: 0,
};

export async function getCareerRoles() {
  return resolveMock(CAREER_ROLES.map(({ id, title, category, description }) => ({ id, title, category, description })));
}

// Target role selection now lives in Supabase (student_target_role table),
// with localStorage as a same-tab cache and offline/error fallback — same
// resilience pattern as skillTestService.js from Step 2. getTargetRoleId()
// stays synchronous (many callers read it without awaiting) by serving the
// cache immediately; getTargetRoleIdAsync() is the source-of-truth version
// used at page load to refresh that cache from the backend.
export function getTargetRoleId() {
  try {
    return localStorage.getItem(TARGET_ROLE_STORAGE_KEY) || DEFAULT_TARGET_ROLE_ID;
  } catch {
    return DEFAULT_TARGET_ROLE_ID;
  }
}

export async function getTargetRoleIdAsync() {
  try {
    const { roleId } = await studentStateAPI.getTargetRole();
    if (roleId) {
      persistTargetRoleLocally(roleId);
      return roleId;
    }
  } catch (err) {
    console.warn("Could not load target role from backend, using local cache:", err.message);
  }
  return getTargetRoleId();
}

export function setTargetRoleId(roleId) {
  persistTargetRoleLocally(roleId);
  studentStateAPI.setTargetRole(roleId).catch((err) => {
    console.warn("Could not persist target role to backend, kept in local cache only:", err.message);
  });
}

function persistTargetRoleLocally(roleId) {
  try {
    localStorage.setItem(TARGET_ROLE_STORAGE_KEY, roleId);
  } catch {
    // best-effort — selection just won't survive a reload
  }
}

// A career role is treated as a synthetic "opportunity" so target-role gap
// analysis (Step 3) and career readiness (Step 4) both run through the same
// calculateMatch() engine every opportunity-match page already uses, instead
// of a second bespoke scoring path.
export async function getRoleReadiness(roleId) {
  const role = getCareerRoleById(roleId);
  if (!role) return null;

  const { profile } = await getSkillProfile();
  const match = calculateMatch({ skills: profile }, { skills: role.requiredSkills }, ROLE_READINESS_WEIGHTS);

  return {
    role,
    readinessPercent: match.overallScore,
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
  };
}

export async function getTargetRoleReadiness() {
  return getRoleReadiness(await getTargetRoleIdAsync());
}
