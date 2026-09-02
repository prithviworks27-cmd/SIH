import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SkillProfileGapReport() {
  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="border-b border-outline-variant pb-md mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Skill Profile &amp; Gap Report</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Last assessed: October 24, 2024</p>
        </div>
        <button className="bg-primary-container text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-primary transition-colors self-start md:self-auto">
          Retake Assessment
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/*Left Column: Summary & Strong Skills*/}
        <div className="lg:col-span-8 flex flex-col gap-xl">
          {/*Overview Card*/}
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-md border-b border-outline-variant pb-sm">Core Competency Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-md">
              <div className="border border-outline-variant p-md rounded flex flex-col items-start bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Overall Proficiency</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">Advanced</span>
              </div>
              <div className="border border-outline-variant p-md rounded flex flex-col items-start bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Primary Domain</span>
                <span className="font-headline-md text-headline-md text-on-background">Data Science</span>
              </div>
              <div className="border border-outline-variant p-md rounded flex flex-col items-start bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Identified Gaps</span>
                <span className="font-headline-md text-headline-md text-error">3 Critical</span>
              </div>
            </div>
          </section>

          {/*Strong Skills Section*/}
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
            <div className="flex items-center gap-2 mb-md border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">verified</span>
              <h3 className="font-headline-sm text-headline-sm text-on-background">Validated Strengths</h3>
            </div>
            <div className="flex flex-col gap-md">
              {[
                { skill: "Statistical Analysis", level: "Expert", percent: 92 },
                { skill: "Python Programming", level: "Advanced", percent: 85 },
                { skill: "Machine Learning Algorithms", level: "Advanced", percent: 78 },
                { skill: "Data Visualization (Tableau)", level: "Intermediate", percent: 70 },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between mb-xs">
                    <span className="font-label-md text-label-md text-on-background">{item.skill}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.level} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/*Right Column: Skill Gaps & Recommendations*/}
        <div className="lg:col-span-4 flex flex-col gap-xl">
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg h-full">
            <div className="flex items-center gap-2 mb-md border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-error">warning</span>
              <h3 className="font-headline-sm text-headline-sm text-on-background">Identified Skill Gaps</h3>
            </div>
            <div className="flex flex-col gap-lg">
              {[
                { skill: "Cloud Deployment (AWS)", level: "Beginner", percent: 25, note: "Required for integration with current industry R&D pipelines." },
                { skill: "Deep Learning (PyTorch)", level: "Novice", percent: 15, note: "Critical for upcoming computer vision research projects." },
                { skill: "Research Grant Writing", level: "Untested", percent: 5, note: "Essential skill for securing independent funding." },
              ].map((gap) => (
                <div key={gap.skill} className="border border-outline-variant p-md rounded bg-surface-container-low">
                  <div className="flex justify-between items-start mb-sm">
                    <h4 className="font-label-md text-label-md text-on-background">{gap.skill}</h4>
                    <span className="px-2 py-0.5 bg-surface-container-high rounded font-label-sm text-label-sm text-on-background">{gap.level}</span>
                  </div>
                  <div className="w-full bg-surface-variant h-1.5 rounded overflow-hidden mb-sm">
                    <div className="bg-secondary h-full" style={{ width: `${gap.percent}%` }}></div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">{gap.note}</p>
                  <Link to="/learning-paths" className="inline-block mt-sm font-label-md text-label-md text-primary hover:underline">
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
