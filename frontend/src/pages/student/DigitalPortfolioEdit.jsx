export default function DigitalPortfolioEdit() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/*SideNavBar*/}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen flex-col py-xl px-md bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline h-full w-64 z-10 shrink-0">
      <div className="mb-xl flex items-center gap-sm">
      <span className="material-symbols-outlined text-primary font-bold text-3xl">hub</span>
      <div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Student Portal</h1>
      <p className="font-label-sm text-label-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      </div>
      <nav className="flex-1 flex flex-col gap-sm overflow-y-auto">
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">quiz</span>
      <span>Skill Assessment</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">school</span>
      <span>Learning Paths</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">work</span>
      <span>Internships/Jobs</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">description</span>
      <span>My Applications</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-primary dark:text-primary-fixed font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
      <span>Portfolio</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">mail</span>
      <span>Messages</span>
      </a>
      </nav>
      <div className="mt-auto flex flex-col gap-sm border-t border-outline-variant pt-md">
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">settings</span>
      <span>Settings</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">logout</span>
      <span>Logout</span>
      </a>
      </div>
      </aside>
      {/*Main Content Area*/}
      <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto">
      {/*Top App Bar (Mobile)*/}
      <header className="md:hidden flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-20">
      <h1 className="font-headline-md text-headline-md font-bold text-primary">Portfolio Edit</h1>
      <button className="text-primary"><span className="material-symbols-outlined">menu</span></button>
      </header>
      <div className="max-w-max-width mx-auto p-md md:p-margin pb-24">
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
      </div>
      </main>
      {/*Bottom Navigation (Mobile Only)*/}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant z-20 flex justify-around p-sm pb-safe">
      <a className="flex flex-col items-center p-2 text-on-surface-variant" href="#">
      <span className="material-symbols-outlined">dashboard</span>
      <span className="font-label-sm text-[10px]">Dashboard</span>
      </a>
      <a className="flex flex-col items-center p-2 text-on-surface-variant" href="#">
      <span className="material-symbols-outlined">work</span>
      <span className="font-label-sm text-[10px]">Jobs</span>
      </a>
      <a className="flex flex-col items-center p-2 text-primary font-bold" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
      <span className="font-label-sm text-[10px]">Portfolio</span>
      </a>
      </nav>
    </div>
  );
}
