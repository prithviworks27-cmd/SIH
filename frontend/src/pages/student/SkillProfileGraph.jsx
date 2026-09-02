import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SkillProfileGraph() {
  return (
    <DashboardLayout>
      <header className="mb-lg border-b border-outline-variant pb-md flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary mb-xs">Skill Profile</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Living Skill Graph</p>
        </div>
        <div className="w-full md:w-64">
          <label className="sr-only" htmlFor="role-selector">Target Job Role</label>
          <select
            className="w-full border-outline-variant border bg-surface-container-lowest text-on-surface rounded py-sm px-md focus:border-primary focus:ring-0 font-body-sm text-body-sm h-10"
            id="role-selector"
          >
            <option>Target Job Role: Data Analyst</option>
            <option>Target Job Role: Data Scientist</option>
            <option>Target Job Role: ML Engineer</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/*Readiness Score & Recommendations*/}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded flex flex-col items-center text-center">
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-wider">Current Readiness Score</h2>
            <div className="font-display-lg text-display-lg text-primary font-bold mb-sm">78%</div>
            <p className="font-body-sm text-body-sm text-on-surface">You match 14 out of 18 core competencies for this role.</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded border-t-4 border-t-primary-container">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Recommended Next Activity</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Start Power BI Challenge to close a critical skill gap.</p>
            <Link
              to="/proof-of-skill"
              className="block text-center w-full bg-primary-container text-on-primary hover:bg-primary transition-colors py-sm px-md rounded font-label-md text-label-md"
            >
              Begin Challenge
            </Link>
          </div>
        </div>

        {/*Skills Detail*/}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/*Proven Skills*/}
          <div className="bg-surface-container-lowest border border-outline-variant rounded">
            <div className="border-b border-outline-variant p-md bg-surface-container-low">
              <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Skills Already Proven</h2>
            </div>
            <ul className="divide-y divide-outline-variant">
              {[
                { skill: "Python", tag: "Assessment-verified", updated: "2 weeks ago", percent: 90 },
                { skill: "SQL", tag: "Faculty-verified", updated: "1 month ago", percent: 85 },
                { skill: "Data Visualization", tag: "Project-verified", updated: "3 days ago", percent: 75 },
              ].map((item) => (
                <li key={item.skill} className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface">{item.skill}</span>
                      <span className="bg-surface-container px-2 py-1 rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">
                        {item.tag}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: {item.updated}</p>
                  </div>
                  <div className="w-full md:w-48 flex items-center gap-md">
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant">
                      <div className="h-full bg-surface-tint" style={{ width: `${item.percent}%` }}></div>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant w-8 text-right">{item.percent}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/*Missing Skills*/}
          <div className="bg-surface-container-lowest border border-outline-variant rounded">
            <div className="border-b border-outline-variant p-md bg-surface-container-low">
              <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Missing Competencies</h2>
            </div>
            <ul className="divide-y divide-outline-variant">
              {[
                { skill: "Power BI", note: "Required for dashboard automation." },
                { skill: "Statistical Testing", note: "Essential for hypothesis validation." },
              ].map((item) => (
                <li key={item.skill} className="p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.skill}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.note}</p>
                  </div>
                  <Link
                    to="/courses"
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-colors py-1 px-3 rounded font-label-sm text-label-sm"
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
