import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { SealCheck, Warning } from "@phosphor-icons/react";

export default function SkillProfileGapReport() {
  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="border-b border-hairline pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl text-ink tracking-tight">Skill Profile &amp; Gap Report</h1>
          <p className="text-muted mt-2">Last assessed: October 24, 2024</p>
        </div>
        <button className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all self-start md:self-auto">
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
                <span className="text-lg font-medium text-ink">Advanced</span>
              </div>
              <div className="border border-hairline p-4 rounded-lg flex flex-col items-start bg-bone">
                <span className="text-xs uppercase tracking-wide text-muted mb-1">Primary Domain</span>
                <span className="text-lg font-medium text-ink">Data Science</span>
              </div>
              <div className="border border-hairline p-4 rounded-lg flex flex-col items-start bg-bone">
                <span className="text-xs uppercase tracking-wide text-muted mb-1">Identified Gaps</span>
                <span className="text-lg font-medium text-pastel-red-ink">3 Critical</span>
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
              {[
                { skill: "Statistical Analysis", level: "Expert", percent: 92 },
                { skill: "Python Programming", level: "Advanced", percent: 85 },
                { skill: "Machine Learning Algorithms", level: "Advanced", percent: 78 },
                { skill: "Data Visualization (Tableau)", level: "Intermediate", percent: 70 },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-ink">{item.skill}</span>
                    <span className="text-xs text-muted">
                      {item.level} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-bone h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ink h-full" style={{ width: `${item.percent}%` }}></div>
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
              {[
                { skill: "Cloud Deployment (AWS)", level: "Beginner", percent: 25, note: "Required for integration with current industry R&D pipelines." },
                { skill: "Deep Learning (PyTorch)", level: "Novice", percent: 15, note: "Critical for upcoming computer vision research projects." },
                { skill: "Research Grant Writing", level: "Untested", percent: 5, note: "Essential skill for securing independent funding." },
              ].map((gap) => (
                <div key={gap.skill} className="border border-hairline p-4 rounded-lg bg-bone">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm text-ink">{gap.skill}</h4>
                    <span className="px-2 py-0.5 bg-white border border-hairline rounded text-xs text-charcoal">{gap.level}</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mb-2 border border-hairline">
                    <div className="bg-muted h-full" style={{ width: `${gap.percent}%` }}></div>
                  </div>
                  <p className="text-sm text-muted">{gap.note}</p>
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
