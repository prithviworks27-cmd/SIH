import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { adminNavItems } from "../../config/adminNavConfig";
import { getStudentRoster } from "../../services/institutionService";

function readinessTone(readiness) {
  if (readiness >= 70) return "text-pastel-green-ink";
  if (readiness >= 40) return "text-pastel-blue-ink";
  return "text-muted";
}

export default function StudentManagement() {
  const [roster, setRoster] = useState(undefined);

  useEffect(() => {
    getStudentRoster().then(setRoster);
  }, []);

  return (
    <DashboardLayout navItems={adminNavItems} footerNavItems={[]} title="Institution Portal" subtitle="Admin Analytics">
      <header className="mb-10 border-b border-hairline pb-6">
        <h1 className="font-geist text-3xl text-ink tracking-tight mb-1">Student Management</h1>
        <p className="text-muted">Every student's skill verification and readiness at a glance.</p>
      </header>

      {!roster && <LoadingState label="Loading students…" />}

      {roster && (
        <section className="bg-white border border-hairline rounded-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bone border-b border-hairline text-xs uppercase tracking-wide text-muted">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Institution</th>
                  <th className="p-4 font-medium">Program</th>
                  <th className="p-4 font-medium">Skills Verified</th>
                  <th className="p-4 font-medium">Readiness</th>
                </tr>
              </thead>
              <tbody className="text-sm text-charcoal divide-y divide-hairline">
                {roster.map((s) => (
                  <tr key={s.id} className="hover:bg-bone transition-colors">
                    <td className="p-4 font-medium text-ink">{s.name}</td>
                    <td className="p-4 text-muted">{s.institution}</td>
                    <td className="p-4 text-muted">{s.year}</td>
                    <td className="p-4 text-muted">
                      {s.assessedSkillCount} / {s.totalSkillCount}
                    </td>
                    <td className={`p-4 font-medium ${readinessTone(s.readiness)}`}>{s.readiness}%</td>
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
