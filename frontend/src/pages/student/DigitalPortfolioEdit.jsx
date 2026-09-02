import DashboardLayout from "../../components/layout/DashboardLayout";
import { FloppyDisk } from "@phosphor-icons/react";

const inputClass =
  "w-full border border-hairline rounded-md px-3 py-2.5 bg-white focus:border-ink focus:ring-0 text-sm outline-none transition-colors";

export default function DigitalPortfolioEdit() {
  return (
    <DashboardLayout>
      {/*Page Header*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Edit Portfolio</h2>
          <p className="text-muted mt-2">Manage your academic and professional profile visible to industry partners.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none py-2 px-6 border border-hairline rounded-md text-charcoal text-sm hover:bg-bone transition-colors">
            Cancel
          </button>
          <button className="flex-1 md:flex-none py-2 px-6 rounded-md bg-ink text-white text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <FloppyDisk size={16} />
            Save Changes
          </button>
        </div>
      </div>
      {/*Basic Info Form*/}
      <section className="bg-white border border-hairline rounded-xl p-8">
        <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Full Name</label>
            <input className={inputClass} type="text" defaultValue="Alex Chen" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Headline / Major</label>
            <input className={inputClass} type="text" defaultValue="PhD Candidate in Materials Science" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Institution</label>
            <input className={inputClass} type="text" defaultValue="Zurich Institute of Technology" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Expected Graduation</label>
            <input className={inputClass} type="month" defaultValue="2025-05" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Bio / Summary</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              defaultValue="Researching optimization of semi-transparent photovoltaics for urban infrastructure integration. Passionate about sustainable energy solutions and scalable manufacturing processes."
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
