import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import { SKILL_CATALOG } from "../../services/mockData/skills";
import { candidates } from "../../services/mockData/candidates";
import { getAllOpportunitiesIncludingInactive } from "../../services/internshipsService";
import { getPipeline } from "../../services/pipelineService";
import { Users, Target, Briefcase, Handshake } from "@phosphor-icons/react";

const adminNavItems = [{ to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" }];

// Aggregates skill demand across all posted opportunities vs. supply across
// the mock candidate pool — real numbers from the same data every other role
// reads, not separately invented admin-only stats.
function computeAvgReadiness(candidatePool) {
  const scores = candidatePool.map((c) => {
    if (!c.skills?.length) return 0;
    return Math.round((c.skills.reduce((sum, s) => sum + Math.min(s.currentScore / s.requiredScore, 1), 0) / c.skills.length) * 100);
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function computeSkillDemandVsSupply(opportunities, candidatePool) {
  const demand = {};
  for (const opp of opportunities) {
    for (const skill of opp.skills ?? []) demand[skill] = (demand[skill] ?? 0) + 1;
  }
  const supply = {};
  for (const cand of candidatePool) {
    for (const skill of cand.skills ?? []) {
      if (skill.currentScore >= 50) supply[skill.name] = (supply[skill.name] ?? 0) + 1;
    }
  }
  return SKILL_CATALOG.map((s) => ({ name: s.name, demand: demand[s.name] ?? 0, supply: supply[s.name] ?? 0 }))
    .filter((s) => s.demand > 0 || s.supply > 0)
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 8);
}

export default function AdminDashboard() {
  const [opportunities, setOpportunities] = useState(undefined);
  const [pipeline, setPipeline] = useState(undefined);

  useEffect(() => {
    getAllOpportunitiesIncludingInactive().then(setOpportunities);
    getPipeline().then(setPipeline);
  }, []);

  const loading = !opportunities || !pipeline;
  const activeOpportunities = opportunities?.filter((o) => (o.status ?? "Active") === "Active").length ?? "—";
  const selected = pipeline?.filter((p) => p.stage === "Selected").length ?? "—";
  const skillChart = opportunities ? computeSkillDemandVsSupply(opportunities, candidates) : [];
  const maxValue = Math.max(1, ...skillChart.flatMap((s) => [s.demand, s.supply]));

  return (
    <DashboardLayout navItems={adminNavItems} footerNavItems={[]} title="Institution Portal" subtitle="Admin Analytics">
      <header className="mb-10">
        <h1 className="font-editorial text-4xl text-ink tracking-tight mb-2">Institution Overview</h1>
        <p className="text-muted leading-relaxed">Placement, engagement, and skill demand across your student body.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Students" value={candidates.length} icon={Users} />
        <StatCard label="Avg. Skill Readiness" value={`${computeAvgReadiness(candidates)}%`} icon={Target} valueColorClass="text-pastel-blue-ink" />
        <StatCard label="Active Opportunities" value={activeOpportunities} icon={Briefcase} />
        <StatCard label="Placements" value={selected} icon={Handshake} valueColorClass="text-pastel-green-ink" />
      </section>

      <section className="bg-white border border-hairline rounded-xl p-8">
        <h2 className="text-lg font-medium text-ink mb-1">Industry Skill Demand vs. Student Skill Supply</h2>
        <p className="text-sm text-muted mb-6">How many active opportunities require each skill, vs. how many candidates already have it.</p>

        {loading && <p className="text-sm text-muted">Loading…</p>}

        {!loading && skillChart.length === 0 && <p className="text-sm text-muted">No opportunity/skill data yet.</p>}

        {!loading && skillChart.length > 0 && (
          <div className="flex flex-col gap-4">
            {skillChart.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-charcoal">{s.name}</span>
                  <span className="text-muted">
                    Demand {s.demand} · Supply {s.supply}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-full bg-bone rounded-full overflow-hidden">
                    <div className="h-full bg-ink rounded-full" style={{ width: `${(s.demand / maxValue) * 100}%` }} />
                  </div>
                  <div className="h-2 w-full bg-bone rounded-full overflow-hidden">
                    <div className="h-full bg-pastel-blue-ink rounded-full" style={{ width: `${(s.supply / maxValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 text-xs text-muted mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" /> Demand (opportunities)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pastel-blue-ink inline-block" /> Supply (candidates)
              </span>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
