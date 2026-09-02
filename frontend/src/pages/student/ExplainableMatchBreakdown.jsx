import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ArrowLeft, Check, X } from "@phosphor-icons/react";

export default function ExplainableMatchBreakdown() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[760px] mx-auto">
        {/*Breadcrumbs / Back*/}
        <button
          className="inline-flex items-center gap-2 text-muted text-sm hover:text-ink mb-6 transition-colors"
          onClick={() => navigate("/internships")}
        >
          <ArrowLeft size={16} />
          Back to Internships
        </button>

        {/*Content Container*/}
        <div className="bg-white border border-hairline rounded-xl p-8 flex flex-col gap-8">
          {/*Top Section: Job Info*/}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-editorial text-2xl text-ink tracking-tight mb-1">Senior Data Research Intern</h1>
              <p className="text-muted">Global Analytics Corp</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-bone text-charcoal px-2.5 py-1 rounded-full text-xs">Zurich, CH (On-site)</span>
                <span className="bg-bone text-charcoal px-2.5 py-1 rounded-full text-xs">Full-time Intern</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-editorial text-3xl text-ink">92%</div>
              <div className="text-xs text-muted">Match Score</div>
            </div>
          </div>

          {/*Match Breakdown Section*/}
          <div className="border-t border-hairline pt-6">
            <h2 className="text-lg font-medium text-ink mb-6">Why this match?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Skills Met</h3>
                <ul className="space-y-2 text-sm text-charcoal">
                  {["Python", "SQL", "Statistical Modeling", "Research Methodology"].map((skill) => (
                    <li key={skill} className="flex items-center gap-2 py-2 border-b border-hairline">
                      <Check size={16} className="text-pastel-green-ink" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Skills Gap</h3>
                <ul className="space-y-2 text-sm text-charcoal">
                  {["Tableau", "BigQuery"].map((skill) => (
                    <li key={skill} className="flex items-center gap-2 py-2 border-b border-hairline">
                      <X size={16} className="text-pastel-red-ink" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/*Eligibility*/}
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Eligibility &amp; Preferences</h3>
              <ul className="space-y-2 text-sm text-charcoal">
                <li className="flex items-center gap-2 py-2 border-b border-hairline">
                  <Check size={16} className="text-pastel-green-ink" />
                  Master's Degree Candidate
                </li>
                <li className="flex items-center gap-2 py-2 border-b border-hairline">
                  <Check size={16} className="text-pastel-green-ink" />
                  2024/2025 Graduation Year
                </li>
                <li className="flex items-center gap-2 py-2 border-b border-hairline">
                  <X size={16} className="text-pastel-red-ink" />
                  On-site (Zurich) <span className="text-muted ml-1 text-xs">(You prefer Remote)</span>
                </li>
              </ul>
            </div>

            {/*Next Action*/}
            <div className="mt-8 bg-bone p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-charcoal">
                <span className="font-medium text-ink">Bridge the gap:</span> Complete the Tableau Advanced module to increase match to 98%.
              </p>
              <Link
                to="/courses"
                className="bg-ink text-white text-sm px-4 py-2 rounded-md whitespace-nowrap hover:bg-[#333333] active:scale-[0.98] transition-all"
              >
                View Module
              </Link>
            </div>
          </div>
        </div>

        {/*Bottom Action Row (for Apply)*/}
        <div className="mt-6 flex justify-end gap-3">
          <button className="border border-hairline text-charcoal text-sm px-6 py-2.5 rounded-md hover:bg-bone transition-colors">
            Save for Later
          </button>
          <button className="bg-ink text-white text-sm px-6 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all">
            Apply Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
