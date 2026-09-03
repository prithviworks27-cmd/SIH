import { resolveMock } from "./mockClient";
import { candidates } from "./mockData/candidates";
import { getStudentRoster } from "./institutionService";
import { getPipeline } from "./pipelineService";

// Faculty see a subset of the institution's students ("my students" — the
// ones assigned to this faculty member's cohort/advisees). No real
// advisor-assignment model exists yet, so this takes the first N of the
// institution roster as a stand-in — swap for a real assignment table later
// without changing anything the Faculty Dashboard reads.
const MY_STUDENT_IDS = candidates.slice(0, 4).map((c) => c.id);

export async function getMyStudents() {
  const roster = await getStudentRoster();
  return roster.filter((s) => MY_STUDENT_IDS.includes(s.id));
}

// Per-student detail for the faculty drill-down: skill gaps + any internship
// activity currently in the pipeline, so a faculty member can see not just a
// readiness number but what's actually driving it.
export async function getStudentDetail(studentId) {
  const candidate = candidates.find((c) => c.id === studentId);
  if (!candidate) return null;

  const pipeline = await getPipeline();
  const internshipActivity = pipeline.filter((p) => p.candidateId === studentId);

  const skillGaps = (candidate.skills ?? [])
    .filter((s) => s.currentScore < s.requiredScore)
    .map((s) => ({ ...s, gap: s.requiredScore - s.currentScore }))
    .sort((a, b) => b.gap - a.gap);

  return resolveMock({
    id: candidate.id,
    name: candidate.name,
    institution: candidate.institution,
    year: candidate.year,
    skills: candidate.skills ?? [],
    skillGaps,
    internshipActivity,
  });
}
