import { resolveMock } from "./mockClient";
import { INDUSTRY_PROGRAMS } from "./mockData/industryPrograms";
import { getCompanyProfile } from "./companyProfileService";
import { industryAPI } from "./api";

const STORAGE_KEY = "createdSkillPrograms";

function loadCreatedLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCreatedLocally(programs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch {
    // best-effort — a newly created program just won't survive a reload if storage is unavailable
  }
}

async function loadCreated() {
  try {
    const { programs } = await industryAPI.getAllSkillPrograms();
    persistCreatedLocally(programs);
    return programs;
  } catch (err) {
    console.warn("Could not load skill programs from backend, using local cache only:", err.message);
    return loadCreatedLocally();
  }
}

// Every program (seed + industry-created) — this is what the student-facing
// Learning page (learningPathsService.getIndustryPrograms) reads from, so a
// program an industry partner creates here actually shows up for students.
// Backend already returns industry-created programs; seed content is
// layered in here since it's frontend-only demo data, not in Supabase.
export async function getAllSkillPrograms() {
  const created = await loadCreated();
  return resolveMock([...INDUSTRY_PROGRAMS, ...created]);
}

// Scoped to the logged-in company for the "My Skill Programs" management
// view — seed programs are shown to everyone (demo content), created ones
// only to the company that made them.
export async function getMySkillPrograms() {
  const [company, created] = await Promise.all([getCompanyProfile(), loadCreated()]);
  const seedForCompany = INDUSTRY_PROGRAMS.filter((p) => p.company === company.name);
  return resolveMock([...seedForCompany, ...created.filter((p) => p.company === company.name)]);
}

// The "killer feature": a company defines a week-by-week program (each week
// targets one skill gap, closing with a project week and a final assessment
// week) instead of just posting a role and hoping candidates show up ready.
// weeks: [{week, focus}] — focus is a skill name for content weeks, or a
// free-text label for the closing project/assessment weeks.
export async function createSkillProgram({ title, skills, weeks }) {
  if (!title?.trim()) throw new Error("Program title is required.");
  if (!skills?.length) throw new Error("Select at least one target skill.");
  if (!weeks?.length) throw new Error("Add at least one week.");

  const company = await getCompanyProfile();

  try {
    const { program } = await industryAPI.createSkillProgram({ title: title.trim(), company: company.name, skills, weeks });
    return resolveMock(program, { delay: 200 });
  } catch (err) {
    console.warn("Could not create skill program on backend, saved locally only:", err.message);
    const program = {
      id: `prog-local-${Date.now()}`,
      title: title.trim(),
      company: company.name,
      durationWeeks: weeks.length,
      skills,
      weeks,
      createdAt: new Date().toISOString(),
    };
    const created = loadCreatedLocally();
    persistCreatedLocally([program, ...created]);
    return resolveMock(program, { delay: 500 });
  }
}
