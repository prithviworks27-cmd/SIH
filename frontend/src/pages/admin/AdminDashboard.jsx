import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import LoadingState from "../../components/common/LoadingState";
import { adminNavItems } from "../../config/adminNavConfig";
import { getInstitutionOverview } from "../../services/institutionService";
import { Users, Target, ShieldCheck, Briefcase, Handshake, Buildings } from "@phosphor-icons/react";

export default function AdminDashboard() {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    getInstitutionOverview().then(setData);
  }, []);

  return (
    <DashboardLayout navItems={adminNavItems} footerNavItems={[]} title="Institution Portal" subtitle="Admin Analytics">
      <header className="mb-10">
        <h1 className="font-editorial text-4xl text-ink tracking-tight mb-2">Institution Overview</h1>
        <p className="text-muted leading-relaxed">Placement, engagement, and skill demand across your student body.</p>
      </header>

      {!data && <LoadingState label="Loading institution overview…" />}

      {data && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Students" value={data.totalStudents.toLocaleString()} icon={Users} />
            <StatCard label="Assessed" value={data.assessedCount.toLocaleString()} icon={ShieldCheck} valueColorClass="text-pastel-blue-ink" />
            <StatCard label="Verified Skills" value={data.verifiedSkillCount.toLocaleString()} icon={Target} valueColorClass="text-pastel-green-ink" />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <StatCard label="Avg. Readiness" value={`${data.avgReadiness}%`} icon={Target} />
            <StatCard label="Active Opportunities" value={data.activeOpportunities} icon={Briefcase} />
            <StatCard label="Placements" value={data.placements} icon={Handshake} valueColorClass="text-pastel-green-ink" />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            <section className="lg:col-span-7 bg-white border border-hairline rounded-xl p-8">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-medium text-ink">Top Skill Gaps</h2>
                <Link to="/admin/skill-analytics" className="text-xs uppercase tracking-wide text-ink hover:text-muted transition-colors">
                  View details
                </Link>
              </div>
              <p className="text-sm text-muted mb-6">Share of students below the required proficiency for each skill.</p>

              {data.skillGaps.length === 0 && <p className="text-sm text-muted">No skill gaps identified.</p>}

              <div className="flex flex-col gap-4">
                {data.skillGaps.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-charcoal">{s.name}</span>
                      <span className="text-pastel-red-ink font-medium">{s.gapPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-bone rounded-full overflow-hidden">
                      <div className="h-full bg-pastel-red-ink rounded-full" style={{ width: `${s.gapPercent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-5 bg-white border border-hairline rounded-xl p-8">
              <h2 className="text-lg font-medium text-ink mb-1">Placement Readiness</h2>
              <p className="text-sm text-muted mb-6">Students grouped by overall skill readiness.</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-charcoal">
                    <span className="w-2.5 h-2.5 rounded-full bg-pastel-green-ink inline-block" /> Ready (70%+)
                  </span>
                  <span className="text-sm font-medium text-ink">{data.placementReadiness.ready}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-charcoal">
                    <span className="w-2.5 h-2.5 rounded-full bg-pastel-blue-ink inline-block" /> Developing (40–69%)
                  </span>
                  <span className="text-sm font-medium text-ink">{data.placementReadiness.developing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-charcoal">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted inline-block" /> Early Stage (&lt;40%)
                  </span>
                  <span className="text-sm font-medium text-ink">{data.placementReadiness.earlyStage}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-hairline flex items-center gap-2 text-sm text-muted">
                <Buildings size={16} />
                {data.industryPartners} active industry partner{data.industryPartners === 1 ? "" : "s"}
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-ink">Students</h2>
            <Link to="/admin/students" className="text-xs uppercase tracking-wide text-ink hover:text-muted transition-colors">
              Manage students
            </Link>
          </div>
          <section className="bg-white border border-hairline rounded-xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bone border-b border-hairline text-xs uppercase tracking-wide text-muted">
                    <th className="p-4 font-medium">Student</th>
                    <th className="p-4 font-medium">Program</th>
                    <th className="p-4 font-medium">Skills Verified</th>
                    <th className="p-4 font-medium">Readiness</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-charcoal divide-y divide-hairline">
                  {data.roster.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-bone transition-colors">
                      <td className="p-4 font-medium text-ink">{s.name}</td>
                      <td className="p-4 text-muted">{s.year}</td>
                      <td className="p-4 text-muted">
                        {s.assessedSkillCount} / {s.totalSkillCount}
                      </td>
                      <td className="p-4 font-medium text-ink">{s.readiness}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
}
