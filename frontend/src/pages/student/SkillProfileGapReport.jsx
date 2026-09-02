import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { SealCheck, Warning } from "@phosphor-icons/react";
import { getSkillProfile } from "../../services/skillsService";

function overallProficiencyLabel(percent) {
  if (percent >= 85) return "Expert";
  if (percent >= 70) return "Advanced";
  if (percent >= 50) return "Intermediate";
  return "Developing";
}

function levelLabel(score) {
  if (score >= 90) return "Expert";
  if (score >= 70) return "Advanced";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Beginner";
  return "Untested";
}

function formatDate(iso) {
  if (!iso) return "Not yet assessed";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function SkillProfileGapReport() {
  const navigate = useNavigate();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    getSkillProfile().then(setData);
  }, []);

  if (!data) {
    return (
      <DashboardLayout>
        <LoadingState fullScreen={false} label="Loading skill profile…" />
      </DashboardLayout>
    );
  }

  const { strongSkills, skillGaps, overallMatchPercent, completedAt } = data;
  const primaryDomain = strongSkills[0]?.category ?? "General";

  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="border-b border-hairline pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl text-ink tracking-tight">Skill Profile &amp; Gap Report</h1>
          <p className="text-muted mt-2">Last assessed: {formatDate(completedAt)}</p>
        </div>
        <button
          onClick={() => navigate("/skill-assessment")}
          className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all self-start md:self-auto"
        >
          Retake Assessment
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/*Left Column: Summary & Strong Skills*/}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/*Overview Card*/}
          <section className="bg-white border border-hairline rounded-xl p-8">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Core Competency Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border border-hairline p-4 rounded-lg flex flex-col items-start bg-bone">
                <span className="text-xs uppercase tracking-wide text-muted mb-1">Overall Proficiency</span>
                <span className="text-lg font-medium text-ink">{overallProficiencyLabel(overallMatchPercent)}</span>
              </div>
              <div className="border border-hairline p-4 rounded-lg flex flex-col items-start bg-bone">
                <span className="text-xs uppercase tracking-wide text-muted mb-1">Primary Domain</span>
                <span className="text-lg font-medium text-ink">{primaryDomain}</span>
              </div>
              <div className="border border-hairline p-4 rounded-lg flex flex-col items-start bg-bone">
                <span className="text-xs uppercase tracking-wide text-muted mb-1">Identified Gaps</span>
                <span className="text-lg font-medium text-pastel-red-ink">{skillGaps.length} {skillGaps.length === 1 ? "Gap" : "Gaps"}</span>
              </div>
            </div>
          </section>

          {/*Strong Skills Section*/}
          <section className="bg-white border border-hairline rounded-xl p-8">
            <div className="flex items-center gap-2 mb-4 border-b border-hairline pb-3">
              <SealCheck size={18} className="text-pastel-green-ink" />
              <h3 className="text-base font-medium text-ink">Validated Strengths</h3>
            </div>
            <div className="flex flex-col gap-4">
              {strongSkills.length === 0 && <p className="text-sm text-muted">No strong skills identified yet — take the assessment to build your profile.</p>}
              {strongSkills.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-ink">{item.name}</span>
                    <span className="text-xs text-muted">
                      {levelLabel(item.currentScore)} ({item.currentScore}%)
                    </span>
                  </div>
                  <div className="w-full bg-bone h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ink h-full" style={{ width: `${item.currentScore}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/*Right Column: Skill Gaps & Recommendations*/}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-white border border-hairline rounded-xl p-8 h-full">
            <div className="flex items-center gap-2 mb-4 border-b border-hairline pb-3">
              <Warning size={18} className="text-pastel-red-ink" />
              <h3 className="text-base font-medium text-ink">Identified Skill Gaps</h3>
            </div>
            <div className="flex flex-col gap-4">
              {skillGaps.length === 0 && <p className="text-sm text-muted">No gaps against your target profile — nice work.</p>}
              {skillGaps.map((gap) => (
                <div key={gap.name} className="border border-hairline p-4 rounded-lg bg-bone">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm text-ink">{gap.name}</h4>
                    <span className="px-2 py-0.5 bg-white border border-hairline rounded text-xs text-charcoal">{levelLabel(gap.currentScore)}</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mb-2 border border-hairline">
                    <div className="bg-muted h-full" style={{ width: `${gap.currentScore}%` }}></div>
                  </div>
                  <p className="text-sm text-muted">
                    {gap.gap} point{gap.gap === 1 ? "" : "s"} below the {gap.requiredScore}% target for {gap.category.toLowerCase()} readiness.
                  </p>
                  <Link to="/learning-paths" className="inline-block mt-2 text-sm text-ink hover:underline">
                    View recommended path →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
