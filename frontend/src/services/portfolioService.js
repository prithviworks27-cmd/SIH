import { resolveMock } from "./mockClient";
import { DEFAULT_PORTFOLIO } from "./mockData/portfolio";
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

// Portfolio now lives in Supabase (portfolio_basics + 4 child tables), with
// localStorage as a same-tab cache/offline fallback. A brand-new user has no
// row yet — same as the localStorage version defaulting to DEFAULT_PORTFOLIO,
// this seeds that default into Supabase once (backend no-ops safely if
// called again since it's an upsert) so the rich demo content a first-time
// user saw before this migration still shows up, and now persists for real.
export async function getPortfolio() {
  try {
    const remote = await portfolioAPI.getPortfolio();
    if (remote.basics) {
      const portfolio = { ...remote.basics, ...remote };
      persistLocally(portfolio);
      return resolveMock(portfolio);
    }

    // No row yet — seed from the local cache if one exists (an edit made
    // before this migration landed), otherwise the shipped default. The
    // seed endpoint wants { basics: {...}, projects, certifications, ... }
    // (basics nested, matching what getPortfolio's own response shape
    // separates out) — DEFAULT_PORTFOLIO/the local cache is flat, so split
    // it here rather than changing the backend's already-established shape.
    const seedSource = loadStoredLocally() ?? DEFAULT_PORTFOLIO;
    const { projects, certifications, internships, achievements, ...basics } = seedSource;
    await portfolioAPI.seed({ basics, projects, certifications, internships, achievements });
    persistLocally(seedSource);
    return resolveMock(seedSource);
  } catch (err) {
    console.warn("Could not load portfolio from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally() ?? DEFAULT_PORTFOLIO);
  }
}

// Only the editable fields (see DigitalPortfolioEdit) — projects/certifications/
// internships/achievements aren't editable yet, so they're preserved from
// whatever's already stored.
export async function savePortfolioBasics(basics) {
  const current = loadStoredLocally() ?? DEFAULT_PORTFOLIO;
  const next = { ...current, ...basics };
  persistLocally(next);

  try {
    await portfolioAPI.saveBasics(basics);
  } catch (err) {
    console.warn("Could not sync portfolio basics to backend, kept in local cache only:", err.message);
  }

  return resolveMock(next, { delay: 500 });
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
