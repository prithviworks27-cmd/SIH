import DashboardLayout from "../../components/layout/DashboardLayout";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export default function SkillAssessment() {
  return (
    <DashboardLayout>
      {/*Top Progress Bar*/}
      <div className="w-full bg-white border border-hairline rounded-xl flex flex-col mb-10">
        <div className="h-1 w-full bg-bone rounded-t-xl overflow-hidden">
          <div className="h-1 bg-ink w-[30%] transition-all duration-300"></div>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-muted">Step 3 of 10</span>
          <span className="text-sm text-ink cursor-pointer hover:underline">Save &amp; Exit</span>
        </div>
      </div>
      {/*Assessment Form Container*/}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-hairline rounded-xl p-10">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-ink mb-2">Database Fundamentals</h2>
            <p className="text-muted">Rate your proficiency in SQL database management.</p>
          </div>
          <form className="flex flex-col gap-3 mb-8">
            {[
              { value: "beginner", label: "Beginner", desc: "Basic understanding, can write simple SELECT statements." },
              { value: "intermediate", label: "Intermediate", desc: "Comfortable with JOINs, GROUP BY, and basic indexing." },
              { value: "advanced", label: "Advanced", desc: "Can write complex queries, optimize performance, and design schemas." },
              { value: "expert", label: "Expert", desc: "Deep knowledge of database architecture, tuning, and enterprise deployment." },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center p-4 border border-hairline rounded-xl cursor-pointer hover:border-ink transition-colors"
              >
                <input className="w-4 h-4 text-ink border-hairline focus:ring-ink" name="sql_proficiency" type="radio" value={option.value} />
                <div className="ml-4">
                  <span className="block text-sm font-medium text-ink">{option.label}</span>
                  <span className="block text-sm text-muted">{option.desc}</span>
                </div>
              </label>
            ))}
          </form>
          <div className="flex justify-between items-center pt-4 border-t border-hairline">
            <button className="px-4 py-2 border border-hairline rounded-md text-charcoal text-sm hover:bg-bone transition-colors flex items-center gap-2" type="button">
              <ArrowLeft size={16} />
              Back
            </button>
            <button className="px-4 py-2 bg-ink text-white rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2" type="button">
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
