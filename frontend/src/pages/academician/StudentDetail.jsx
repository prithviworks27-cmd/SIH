import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import SkillTrustBadge from "../../components/common/SkillTrustBadge";
import ApplicationStatus from "../../components/common/ApplicationStatus";
import { academicianNavItems, academicianFooterNavItems } from "../../config/academicianNavConfig";
import { getStudentDetail } from "../../services/facultyService";
import { ArrowLeft, MagnifyingGlass, GraduationCap } from "@phosphor-icons/react";

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(undefined);
  const [recommended, setRecommended] = useState(null);

  useEffect(() => {
    getStudentDetail(studentId).then(setStudent);
  }, [studentId]);

  const handleRecommend = (skillName) => {
    setRecommended(skillName);
  };

  return (
    <DashboardLayout navItems={academicianNavItems} footerNavItems={academicianFooterNavItems} title="Faculty Portal" subtitle="Student Mentorship">
      {student === undefined && <LoadingState label="Loading student…" />}

      {student === null && (
        <EmptyState
          icon={MagnifyingGlass}
          title="Student not found"
          actionLabel="Back to My Students"
          onAction={() => navigate("/academician/dashboard")}
        />
      )}

      {student && (
        <div className="max-w-4xl mx-auto w-full">
          <button
            className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors text-sm mb-6"
            onClick={() => navigate("/academician/dashboard")}
          >
            <ArrowLeft size={16} />
            Back to My Students
          </button>

          <header className="bg-white border border-hairline rounded-xl p-8 mb-6">
            <h1 className="font-geist text-2xl text-ink tracking-tight mb-1">{student.name}</h1>
            <p className="text-muted">
              {student.institution} · {student.year}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Skills &amp; Assessments</h3>
              <ul className="flex flex-col gap-1">
                {student.skills.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-3 py-2.5 border-b border-hairline last:border-b-0">
                    <span className="text-sm text-charcoal">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted w-10 text-right">{s.currentScore}%</span>
                      <SkillTrustBadge trustLevel={s.trustLevel ?? "Self-Declared"} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Skill Gaps</h3>
              {student.skillGaps.length === 0 ? (
                <p className="text-sm text-muted">No gaps — every skill meets its required proficiency.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {student.skillGaps.map((g) => (
                    <li key={g.name} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-charcoal">{g.name}</p>
                        <p className="text-xs text-muted">{g.gap} points below target</p>
                      </div>
                      <button
                        onClick={() => handleRecommend(g.name)}
                        className="text-xs border border-hairline text-charcoal px-2.5 py-1.5 rounded-md hover:bg-bone transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        <GraduationCap size={13} />
                        {recommended === g.name ? "Recommended ✓" : "Recommend Learning"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Internship Activity</h3>
            {student.internshipActivity.length === 0 ? (
              <p className="text-sm text-muted">No internship applications yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {student.internshipActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 py-2 border-b border-hairline last:border-b-0">
                    <div>
                      <p className="text-sm text-ink">{entry.opportunity?.title}</p>
                      <p className="text-xs text-muted">{entry.opportunity?.company}</p>
                    </div>
                    <ApplicationStatus status={entry.stage} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
