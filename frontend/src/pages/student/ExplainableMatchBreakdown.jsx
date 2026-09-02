import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ExplainableMatchBreakdown() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto">
        {/*Breadcrumbs / Back*/}
        <button
          className="inline-flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm hover:text-primary mb-lg"
          onClick={() => navigate("/internships")}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Internships
        </button>

        {/*Content Container*/}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col gap-xl">
          {/*Top Section: Job Info*/}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Senior Data Research Intern</h1>
              <p className="font-body-lg text-body-lg text-secondary">Global Analytics Corp</p>
              <div className="flex gap-sm mt-md">
                <span className="bg-surface-container text-on-surface px-sm py-[2px] rounded-sm font-label-sm text-label-sm">Zurich, CH (On-site)</span>
                <span className="bg-surface-container text-on-surface px-sm py-[2px] rounded-sm font-label-sm text-label-sm">Full-time Intern</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display-lg text-display-lg font-bold text-primary">92%</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Match Score</div>
            </div>
          </div>

          {/*Match Breakdown Section*/}
          <div className="border-t border-outline-variant pt-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Why this match?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Skills Met</h3>
                <ul className="space-y-sm font-body-md text-body-md text-on-surface">
                  {["Python", "SQL", "Statistical Modeling", "Research Methodology"].map((skill) => (
                    <li key={skill} className="flex items-center gap-sm py-sm border-b border-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Skills Gap</h3>
                <ul className="space-y-sm font-body-md text-body-md text-on-surface">
                  {["Tableau", "BigQuery"].map((skill) => (
                    <li key={skill} className="flex items-center gap-sm py-sm border-b border-surface-variant">
                      <span className="material-symbols-outlined text-error text-[20px]">close</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/*Eligibility*/}
            <div className="mt-lg">
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Eligibility &amp; Preferences</h3>
              <ul className="space-y-sm font-body-md text-body-md text-on-surface">
                <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                  Master's Degree Candidate
                </li>
                <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                  2024/2025 Graduation Year
                </li>
                <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
                  <span className="material-symbols-outlined text-error text-[20px]">close</span>
                  On-site (Zurich) <span className="text-secondary ml-xs font-body-sm text-body-sm">(You prefer Remote)</span>
                </li>
              </ul>
            </div>

            {/*Next Action*/}
            <div className="mt-xl bg-surface-container-low p-md border border-outline-variant rounded flex flex-col md:flex-row justify-between items-center gap-md">
              <p className="font-body-md text-body-md text-on-surface">
                <span className="font-semibold">Bridge the gap:</span> Complete the Tableau Advanced module to increase match to 98%.
              </p>
              <Link
                to="/courses"
                className="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded whitespace-nowrap hover:bg-primary transition-colors"
              >
                View Module
              </Link>
            </div>
          </div>
        </div>

        {/*Bottom Action Row (for Apply)*/}
        <div className="mt-lg flex justify-end gap-md">
          <button className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded hover:bg-surface-container-low transition-colors">
            Save for Later
          </button>
          <button className="bg-primary-container text-on-primary font-label-md text-label-md px-lg py-md rounded hover:bg-primary transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
