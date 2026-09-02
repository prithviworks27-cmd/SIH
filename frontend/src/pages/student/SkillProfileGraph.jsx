import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SkillProfileGraph() {
  return (
    <DashboardLayout>
      <header className="mb-8 border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl text-ink tracking-tight mb-1">Skill Profile</h1>
          <p className="text-muted">Living Skill Graph</p>
        </div>
        <div className="w-full md:w-64">
          <label className="sr-only" htmlFor="role-selector">
            Target Job Role
          </label>
          <select
            className="w-full border border-hairline bg-white text-charcoal rounded-md py-2 px-3 focus:border-ink focus:ring-0 text-sm h-10"
            id="role-selector"
          >
            <option>Target Job Role: Data Analyst</option>
            <option>Target Job Role: Data Scientist</option>
            <option>Target Job Role: ML Engineer</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/*Readiness Score & Recommendations*/}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-hairline p-8 rounded-xl flex flex-col items-center text-center">
            <h2 className="text-xs uppercase tracking-wide text-muted mb-3">Current Readiness Score</h2>
            <div className="font-editorial text-4xl text-ink mb-2">78%</div>
            <p className="text-sm text-charcoal">You match 14 out of 18 core competencies for this role.</p>
          </div>
          <div className="bg-white border border-hairline p-6 rounded-xl">
            <h3 className="text-base font-medium text-ink mb-3">Recommended Next Activity</h3>
            <p className="text-muted mb-6 text-sm leading-relaxed">Start Power BI Challenge to close a critical skill gap.</p>
            <Link
              to="/proof-of-skill"
              className="block text-center w-full bg-ink text-white hover:bg-[#333333] active:scale-[0.98] transition-all py-2.5 px-4 rounded-md text-sm"
            >
              Begin Challenge
            </Link>
          </div>
        </div>

        {/*Skills Detail*/}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/*Proven Skills*/}
          <div className="bg-white border border-hairline rounded-xl">
            <div className="border-b border-hairline p-5">
              <h2 className="text-xs uppercase tracking-wide text-muted">Skills Already Proven</h2>
            </div>
            <ul className="divide-y divide-hairline">
              {[
                { skill: "Python", tag: "Assessment-verified", updated: "2 weeks ago", percent: 90 },
                { skill: "SQL", tag: "Faculty-verified", updated: "1 month ago", percent: 85 },
                { skill: "Data Visualization", tag: "Project-verified", updated: "3 days ago", percent: 75 },
              ].map((item) => (
                <li key={item.skill} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-medium text-ink">{item.skill}</span>
                      <span className="bg-bone px-2 py-0.5 rounded text-xs text-charcoal">{item.tag}</span>
                    </div>
                    <p className="text-sm text-muted">Last updated: {item.updated}</p>
                  </div>
                  <div className="w-full md:w-48 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-bone rounded-full overflow-hidden">
                      <div className="h-full bg-ink" style={{ width: `${item.percent}%` }}></div>
                    </div>
                    <span className="text-xs text-muted w-8 text-right">{item.percent}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/*Missing Skills*/}
          <div className="bg-white border border-hairline rounded-xl">
            <div className="border-b border-hairline p-5">
              <h2 className="text-xs uppercase tracking-wide text-muted">Missing Competencies</h2>
            </div>
            <ul className="divide-y divide-hairline">
              {[
                { skill: "Power BI", note: "Required for dashboard automation." },
                { skill: "Statistical Testing", note: "Essential for hypothesis validation." },
              ].map((item) => (
                <li key={item.skill} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-base font-medium text-ink">{item.skill}</h4>
                    <p className="text-sm text-muted">{item.note}</p>
                  </div>
                  <Link
                    to="/courses"
                    className="border border-hairline text-charcoal hover:bg-bone transition-colors py-1.5 px-3 rounded-md text-sm"
                  >
                    Explore Courses
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
