import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { academicianNavItems, academicianFooterNavItems } from "../../config/academicianNavConfig";
import { useAuth } from "../../hooks/useAuth";
import { getMyStudents } from "../../services/facultyService";
import { Users } from "@phosphor-icons/react";

function readinessTone(readiness) {
  if (readiness >= 80) return "text-pastel-green-ink";
  if (readiness >= 60) return "text-pastel-blue-ink";
  return "text-pastel-red-ink";
}

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState(undefined);

  useEffect(() => {
    getMyStudents().then(setStudents);
  }, []);

  return (
    <DashboardLayout navItems={academicianNavItems} footerNavItems={academicianFooterNavItems} title="Faculty Portal" subtitle="Student Mentorship">
      <header className="mb-10">
        <h1 className="font-geist text-4xl text-ink tracking-tight mb-2">Welcome back, {user?.name || "Faculty"}</h1>
        <p className="text-muted leading-relaxed">Monitor your students' skill readiness and progress toward placement.</p>
      </header>

      {!students && <LoadingState label="Loading your students…" />}

      {students && students.length === 0 && (
        <div className="bg-white border border-hairline rounded-xl p-10 text-center text-sm text-muted flex flex-col items-center gap-2">
          <Users size={28} className="text-muted" />
          No students assigned to you yet.
        </div>
      )}

      {students && students.length > 0 && (
        <section className="bg-white border border-hairline rounded-xl">
          <div className="p-6 border-b border-hairline">
            <h2 className="text-lg font-medium text-ink">My Students</h2>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bone border-b border-hairline text-xs uppercase tracking-wide text-muted">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Program</th>
                  <th className="p-4 font-medium">Skills Verified</th>
                  <th className="p-4 font-medium">Readiness</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-charcoal divide-y divide-hairline">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-bone transition-colors">
                    <td className="p-4 font-medium text-ink">{s.name}</td>
                    <td className="p-4 text-muted">{s.year}</td>
                    <td className="p-4 text-muted">
                      {s.assessedSkillCount} / {s.totalSkillCount}
                    </td>
                    <td className={`p-4 font-medium ${readinessTone(s.readiness)}`}>{s.readiness}%</td>
                    <td className="p-4">
                      <Link to={`/academician/students/${s.id}`} className="text-ink hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
