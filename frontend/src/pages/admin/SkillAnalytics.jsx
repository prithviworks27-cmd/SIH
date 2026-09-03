import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { adminNavItems } from "../../config/adminNavConfig";
import { SKILL_CATALOG } from "../../services/mockData/skills";
import { candidates } from "../../services/mockData/candidates";
import { getAllOpportunitiesIncludingInactive } from "../../services/internshipsService";
import { getTopSkillGaps } from "../../services/institutionService";

// Same demand-vs-supply idea the original AdminDashboard had, kept here as
// its own analytics page now that the dashboard leads with the brief's
// Top-Skill-Gaps-as-percentage view instead. Demand = how many active
// opportunities require a skill; supply = how many students already clear it.
function computeSkillDemandVsSupply(opportunities) {
  const demand = {};
  for (const opp of opportunities) {
    for (const skill of opp.skills ?? []) demand[skill] = (demand[skill] ?? 0) + 1;
  }
  const supply = {};
  for (const cand of candidates) {
    for (const skill of cand.skills ?? []) {
      if (skill.currentScore >= 50) supply[skill.name] = (supply[skill.name] ?? 0) + 1;
    }
  }
  return SKILL_CATALOG.map((s) => ({ name: s.name, demand: demand[s.name] ?? 0, supply: supply[s.name] ?? 0 }))
    .filter((s) => s.demand > 0 || s.supply > 0)
    .sort((a, b) => b.demand - a.demand);
}

export default function SkillAnalytics() {
  const [skillChart, setSkillChart] = useState(undefined);
  const [topGaps, setTopGaps] = useState(undefined);

  useEffect(() => {
    getAllOpportunitiesIncludingInactive().then((opps) => setSkillChart(computeSkillDemandVsSupply(opps)));
    getTopSkillGaps(SKILL_CATALOG.length).then(setTopGaps);
  }, []);

  const loading = !skillChart || !topGaps;
  const maxValue = skillChart ? Math.max(1, ...skillChart.flatMap((s) => [s.demand, s.supply])) : 1;

  return (
    <DashboardLayout navItems={adminNavItems} footerNavItems={[]} title="Institution Portal" subtitle="Admin Analytics">
      <header className="mb-10 border-b border-hairline pb-6">
        <h1 className="font-editorial text-3xl text-ink tracking-tight mb-1">Skill Analytics</h1>
        <p className="text-muted">Where student skills fall short of what industry is actually asking for.</p>
      </header>

      {loading && <LoadingState label="Loading skill analytics…" />}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-white border border-hairline rounded-xl p-8">
            <h2 className="text-lg font-medium text-ink mb-1">Top Skill Gaps</h2>
            <p className="text-sm text-muted mb-6">Share of students below the required proficiency for each skill.</p>
            <div className="flex flex-col gap-4">
              {topGaps.map((s) => (
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

          <section className="lg:col-span-7 bg-white border border-hairline rounded-xl p-8">
            <h2 className="text-lg font-medium text-ink mb-1">Industry Demand vs. Student Supply</h2>
            <p className="text-sm text-muted mb-6">How many active opportunities require each skill, vs. how many students already have it.</p>
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
                  <span className="w-2.5 h-2.5 rounded-full bg-pastel-blue-ink inline-block" /> Supply (students)
                </span>
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
