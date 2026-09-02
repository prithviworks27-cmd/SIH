import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SkillAssessment() {
  return (
    <DashboardLayout>
      {/*Top Progress Bar*/}
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded flex flex-col mb-xl">
        <div className="h-1 w-full bg-surface-container-low rounded-t">
          <div className="h-1 bg-primary w-[30%] transition-all duration-300"></div>
        </div>
        <div className="px-margin py-md flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">Step 3 of 10</span>
          <span className="font-label-md text-label-md text-primary cursor-pointer hover:underline">Save &amp; Exit</span>
        </div>
      </div>
      {/*Assessment Form Container*/}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded p-xl">
          <div className="mb-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Database Fundamentals</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Rate your proficiency in SQL database management.</p>
          </div>
          <form className="flex flex-col gap-md mb-xl">
            <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
              <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="beginner" />
              <div className="ml-md">
                <span className="block font-label-md text-label-md text-on-surface">Beginner</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">Basic understanding, can write simple SELECT statements.</span>
              </div>
            </label>
            <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
              <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="intermediate" />
              <div className="ml-md">
                <span className="block font-label-md text-label-md text-on-surface">Intermediate</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">Comfortable with JOINs, GROUP BY, and basic indexing.</span>
              </div>
            </label>
            <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
              <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="advanced" />
              <div className="ml-md">
                <span className="block font-label-md text-label-md text-on-surface">Advanced</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">Can write complex queries, optimize performance, and design schemas.</span>
              </div>
            </label>
            <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
              <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="expert" />
              <div className="ml-md">
                <span className="block font-label-md text-label-md text-on-surface">Expert</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">Deep knowledge of database architecture, tuning, and enterprise deployment.</span>
              </div>
            </label>
          </form>
          <div className="flex justify-between items-center pt-md border-t border-outline-variant">
            <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-on-surface font-label-md text-label-md hover:bg-surface transition-colors flex items-center gap-sm" type="button">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>
            <button className="px-md py-sm bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-sm" type="button">
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
