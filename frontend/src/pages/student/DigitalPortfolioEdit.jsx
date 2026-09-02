import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DigitalPortfolioEdit() {
  return (
    <DashboardLayout>
      {/*Page Header*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
      <div>
      <h2 className="font-display-lg text-display-lg md:text-display-lg font-bold text-on-surface">Edit Portfolio</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your academic and professional profile visible to industry partners.</p>
      </div>
      <div className="flex gap-md w-full md:w-auto">
      <button className="flex-1 md:flex-none py-2 px-6 border border-outline-variant rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
      <button className="flex-1 md:flex-none py-2 px-6 rounded bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-sm">save</span>
                              Save Changes
                          </button>
      </div>
      </div>
      {/*Basic Info Form*/}
      <section className="card-container">
      <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-md border-b border-outline-variant pb-2">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Full Name</label>
      <input className="form-input font-body-md text-body-md" type="text" defaultValue="Alex Chen"/>
      </div>
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Headline / Major</label>
      <input className="form-input font-body-md text-body-md" type="text" defaultValue="PhD Candidate in Materials Science"/>
      </div>
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Institution</label>
      <input className="form-input font-body-md text-body-md" type="text" defaultValue="Zurich Institute of Technology"/>
      </div>
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Expected Graduation</label>
      <input className="form-input font-body-md text-body-md" type="month" defaultValue="2025-05"/>
      </div>
      <div className="md:col-span-2">
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Bio / Summary</label>
      <textarea
        className="form-textarea font-body-md text-body-md"
        defaultValue="Researching optimization of semi-transparent photovoltaics for urban infrastructure integration. Passionate about sustainable energy solutions and scalable manufacturing processes."
      />
      </div>
      </div>
      </section>
    </DashboardLayout>
  );
}
