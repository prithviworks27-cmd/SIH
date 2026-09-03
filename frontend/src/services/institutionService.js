import { resolveMock } from "./mockClient";
import { candidates } from "./mockData/candidates";
import { SKILL_CATALOG } from "./mockData/skills";
import { getAllOpportunitiesIncludingInactive } from "./internshipsService";
import { getPipeline } from "./pipelineService";

// The institution/faculty views read the same mock candidate pool the
// industry side already uses (see mockData/candidates.js) rather than
// inventing a second "student body" dataset — this is the same student pool,
// just seen from the institution's side of the platform instead of a
// recruiter's. A real institution deployment would swap this for actual
// enrolled-student records without changing anything downstream.
function readinessForCandidate(candidate) {
  if (!candidate.skills?.length) return 0;
  return Math.round(
    (candidate.skills.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / candidate.skills.length) * 100
  );
}

export async function getStudentRoster() {
  const roster = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    institution: c.institution,
    year: c.year,
    readiness: readinessForCandidate(c),
    assessedSkillCount: c.skills?.filter((s) => s.trustLevel && s.trustLevel !== "Self-Declared").length ?? 0,
    totalSkillCount: c.skills?.length ?? 0,
  }));
  return resolveMock(roster.sort((a, b) => b.readiness - a.readiness));
}

// "Top Skill Gaps" as a percentage of the student body missing each skill —
// matches the brief's exact presentation (e.g. "Power BI 42%"), distinct
// from AdminDashboard's original demand-vs-supply chart (raw counts). A
// student "has" a skill once their score clears its SKILL_CATALOG requiredScore.
export async function getTopSkillGaps(limit = 5) {
  const total = candidates.length || 1;
  const gapPercentByName = SKILL_CATALOG.map((catalogSkill) => {
    const missingCount = candidates.filter((c) => {
      const owned = c.skills?.find((s) => s.name === catalogSkill.name);
      return !owned || owned.currentScore < catalogSkill.requiredScore;
    }).length;
    return { name: catalogSkill.name, gapPercent: Math.round((missingCount / total) * 100) };
  });
  return resolveMock(
    gapPercentByName
      .filter((s) => s.gapPercent > 0)
      .sort((a, b) => b.gapPercent - a.gapPercent)
      .slice(0, limit)
  );
}

// Placement readiness buckets — how many students are Ready (>=70%),
// Developing (40-69%), or Early Stage (<40%) for their profile overall,
// independent of any single target role.
export async function getPlacementReadiness() {
  const buckets = { ready: 0, developing: 0, earlyStage: 0 };
  for (const c of candidates) {
    const readiness = readinessForCandidate(c);
    if (readiness >= 70) buckets.ready += 1;
    else if (readiness >= 40) buckets.developing += 1;
    else buckets.earlyStage += 1;
  }
  return resolveMock(buckets);
}

export async function getInstitutionOverview() {
  const [roster, skillGaps, placementReadiness, opportunities, pipeline] = await Promise.all([
    getStudentRoster(),
    getTopSkillGaps(),
    getPlacementReadiness(),
    getAllOpportunitiesIncludingInactive(),
    getPipeline(),
  ]);

  const avgReadiness = Math.round(roster.reduce((sum, s) => sum + s.readiness, 0) / (roster.length || 1));
  const assessedCount = roster.filter((s) => s.assessedSkillCount > 0).length;
  const verifiedSkillCount = roster.reduce((sum, s) => sum + s.assessedSkillCount, 0);
  const activeOpportunities = opportunities.filter((o) => (o.status ?? "Active") === "Active").length;
  const placements = pipeline.filter((p) => p.stage === "Selected").length;

  // Industry partnerships: distinct companies with at least one active
  // opportunity posted — a real "partnership" concept doesn't exist as its
  // own data model yet, so this is the closest honest proxy available.
  const industryPartners = new Set(opportunities.filter((o) => (o.status ?? "Active") === "Active").map((o) => o.company)).size;

  return {
    totalStudents: roster.length,
    assessedCount,
    verifiedSkillCount,
    avgReadiness,
    activeOpportunities,
    placements,
    industryPartners,
    skillGaps,
    placementReadiness,
    roster,
  };
}
