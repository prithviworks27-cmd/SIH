import { resolveMock } from "./mockClient";
import { getSkillTests } from "./skillTestService";
import { getSkillProfile } from "./skillsService";
import { getPreferences } from "./preferencesService";
import { portfolioAPI } from "./api";

const STORAGE_KEY = "studentPortfolio";

function loadStoredLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistLocally(portfolio) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  } catch {
    // best-effort — edits just won't survive a reload if storage is unavailable
  }
}

const EMPTY_PORTFOLIO = {
  headline: "",
  bio: "",
  avatarUrl: "",
  institution: "",
  expectedGraduation: "",
  projects: [],
  certifications: [],
  internships: [],
  achievements: [],
};

// Portfolio lives in Supabase (portfolio_basics + 4 child tables), with
// localStorage as a same-tab cache/offline fallback. A brand-new user has no
// row yet — this creates an EMPTY portfolio_basics row (no fake seeded
// projects/certifications/internships/achievements) so getPortfolio() has a
// real row to read going forward and the page shows genuine empty states
// the student fills in themselves via the add/edit UI.
export async function getPortfolio() {
  try {
    const remote = await portfolioAPI.getPortfolio();
    if (remote.basics) {
      const portfolio = { ...EMPTY_PORTFOLIO, ...remote.basics, ...remote };
      persistLocally(portfolio);
      return resolveMock(portfolio);
    }

    await portfolioAPI.init({});
    persistLocally(EMPTY_PORTFOLIO);
    return resolveMock(EMPTY_PORTFOLIO);
  } catch (err) {
    console.warn("Could not load portfolio from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally() ?? EMPTY_PORTFOLIO);
  }
}

// Only the editable basics fields (see DigitalPortfolioEdit).
// Projects/certifications/internships/achievements each have their own
// create/update/delete functions below.
export async function savePortfolioBasics(basics) {
  const current = loadStoredLocally() ?? EMPTY_PORTFOLIO;
  const next = { ...current, ...basics };
  persistLocally(next);

  try {
    await portfolioAPI.saveBasics(basics);
  } catch (err) {
    console.warn("Could not sync portfolio basics to backend, kept in local cache only:", err.message);
  }

  return resolveMock(next, { delay: 500 });
}

// --- Projects / Certifications / Internships / Achievements CRUD --------
// Each mutation deliberately does NOT fall back to a local-only write on
// backend failure (same reasoning as opportunitiesService.createOpportunity)
// — a silent local-only "success" here would mean the entry never actually
// reaches Supabase, so real failures must throw and reach the UI instead of
// being masked. The local cache is refreshed from the server's response on
// success so /portfolio reflects it without a full reload.

function refreshLocalPortfolio(mutate) {
  const current = loadStoredLocally() ?? EMPTY_PORTFOLIO;
  const next = mutate(current);
  persistLocally(next);
  return next;
}

export async function addProject(fields) {
  const { entry } = await portfolioAPI.createProject(fields);
  refreshLocalPortfolio((p) => ({ ...p, projects: [entry, ...(p.projects ?? [])] }));
  return entry;
}
export async function editProject(id, fields) {
  const { entry } = await portfolioAPI.updateProject(id, fields);
  refreshLocalPortfolio((p) => ({ ...p, projects: (p.projects ?? []).map((x) => (x.id === id ? entry : x)) }));
  return entry;
}
export async function removeProject(id) {
  await portfolioAPI.deleteProject(id);
  refreshLocalPortfolio((p) => ({ ...p, projects: (p.projects ?? []).filter((x) => x.id !== id) }));
}

export async function addCertification(fields) {
  const { entry } = await portfolioAPI.createCertification(fields);
  refreshLocalPortfolio((p) => ({ ...p, certifications: [entry, ...(p.certifications ?? [])] }));
  return entry;
}
export async function editCertification(id, fields) {
  const { entry } = await portfolioAPI.updateCertification(id, fields);
  refreshLocalPortfolio((p) => ({ ...p, certifications: (p.certifications ?? []).map((x) => (x.id === id ? entry : x)) }));
  return entry;
}
export async function removeCertification(id) {
  await portfolioAPI.deleteCertification(id);
  refreshLocalPortfolio((p) => ({ ...p, certifications: (p.certifications ?? []).filter((x) => x.id !== id) }));
}
// Attaches a certificate file (PDF/image) to an existing certification —
// moves verification_status to 'pending' server-side so it enters the admin
// review queue.
export async function uploadCertificateFile(id, file) {
  const { entry } = await portfolioAPI.uploadCertificateFile(id, file);
  refreshLocalPortfolio((p) => ({ ...p, certifications: (p.certifications ?? []).map((x) => (x.id === id ? entry : x)) }));
  return entry;
}

export async function addInternship(fields) {
  const { entry } = await portfolioAPI.createInternship(fields);
  refreshLocalPortfolio((p) => ({ ...p, internships: [entry, ...(p.internships ?? [])] }));
  return entry;
}
export async function editInternship(id, fields) {
  const { entry } = await portfolioAPI.updateInternship(id, fields);
  refreshLocalPortfolio((p) => ({ ...p, internships: (p.internships ?? []).map((x) => (x.id === id ? entry : x)) }));
  return entry;
}
export async function removeInternship(id) {
  await portfolioAPI.deleteInternship(id);
  refreshLocalPortfolio((p) => ({ ...p, internships: (p.internships ?? []).filter((x) => x.id !== id) }));
}

export async function addAchievement(description) {
  const { entry } = await portfolioAPI.createAchievement({ description });
  refreshLocalPortfolio((p) => ({ ...p, achievements: [entry, ...(p.achievements ?? [])] }));
  return entry;
}
export async function removeAchievement(id) {
  await portfolioAPI.deleteAchievement(id);
  refreshLocalPortfolio((p) => ({ ...p, achievements: (p.achievements ?? []).filter((x) => x.id !== id) }));
}

// The student's evidence, shaped for matchingEngine.calculateMatch(). Before
// this existed the engine fell back to hardcoded baselines for projects /
// certifications / experience (see its evaluate* helpers) — now those
// dimensions score off the real portfolio, so adding a project or an
// internship actually moves opportunity match percentages.
export async function getStudentEvidence() {
  const portfolio = await getPortfolio();
  return {
    projects: portfolio.projects ?? [],
    certifications: portfolio.certifications ?? [],
    hasPriorInternship: (portfolio.internships ?? []).length > 0,
  };
}

// Passed skill tests, shown as an "Assessment Results" section on the
// portfolio — the concrete scores behind an "Assessment Verified" badge
// (Step 2's skill tests), so an employer sees the evidence, not just the claim.
// Only passed attempts are listed; a failed attempt isn't portfolio evidence.
export async function getAssessmentResults() {
  const tests = await getSkillTests();
  return tests
    .filter((t) => t.lastResult?.passed)
    .map((t) => ({
      testId: t.id,
      title: t.title,
      skillName: t.skillName,
      scorePercent: t.lastResult.scorePercent,
      completedAt: t.lastResult.completedAt,
    }));
}

// Real replacement for the matching engine's old hardcoded "other" score of
// 70 (see matchingEngine.js evaluateOther). Percentage of key profile fields
// that are actually filled in — skills assessed, at least one project, at
// least one certification, a written bio, education data, and a resume/
// portfolio (avatar/headline stand in for "has a presentable portfolio",
// since there's no separate resume upload yet). Also reusable directly as a
// "profile strength" indicator wherever that's useful to show a student.
const COMPLETENESS_FIELDS = 6;

export async function getProfileCompleteness() {
  const [{ profile }, portfolio, prefs] = await Promise.all([getSkillProfile(), getPortfolio(), getPreferences()]);

  const hasAssessedSkills = profile.some((s) => s.currentScore > 0);
  const hasProject = (portfolio.projects ?? []).length > 0;
  const hasCertification = (portfolio.certifications ?? []).length > 0;
  const hasBio = Boolean(portfolio.bio?.trim());
  const hasEducation = Boolean(prefs.degree && prefs.branch && prefs.graduationYear);
  const hasPresentablePortfolio = Boolean(portfolio.headline?.trim() && portfolio.avatarUrl?.trim());

  const completedCount = [hasAssessedSkills, hasProject, hasCertification, hasBio, hasEducation, hasPresentablePortfolio].filter(
    Boolean
  ).length;

  return {
    percent: Math.round((completedCount / COMPLETENESS_FIELDS) * 100),
    fields: { hasAssessedSkills, hasProject, hasCertification, hasBio, hasEducation, hasPresentablePortfolio },
  };
}

// Portfolio-wide verification rollup used by the portfolio page's summary
// strip. Counts how much of the profile is backed by real evidence rather
// than self-declaration.
export function summarizeVerification(skillProfile, portfolio) {
  const skills = skillProfile ?? [];
  const verifiedSkills = skills.filter((s) => s.trustLevel && s.trustLevel !== "Self-Declared");
  return {
    verifiedSkillCount: verifiedSkills.length,
    totalSkillCount: skills.length,
    projectCount: (portfolio?.projects ?? []).length,
    certificationCount: (portfolio?.certifications ?? []).length,
    internshipCount: (portfolio?.internships ?? []).length,
  };
}
