export default function SkillAssessment() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/*SideNavBar*/}
      <nav className="hidden md:flex bg-surface-container-low dark:bg-surface-container text-primary dark:text-primary-fixed font-label-md text-label-md border-r border-outline-variant dark:border-outline fixed left-0 top-0 h-screen flex-col py-xl px-md w-64 z-20">
      <div className="mb-xl px-md">
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed mb-xs">Student Portal</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      <ul className="flex-1 flex flex-col gap-sm">
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
      <span>Dashboard</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-primary dark:text-primary-fixed font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="quiz" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
      <span>Skill Assessment</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="school">school</span>
      <span>Learning Paths</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="work">work</span>
      <span>Internships/Jobs</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="description">description</span>
      <span>My Applications</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
      <span>Portfolio</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
      <span>Messages</span>
      </a>
      </li>
      </ul>
      <div className="mt-auto border-t border-outline-variant pt-md">
      <ul className="flex flex-col gap-sm">
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
      <span>Settings</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md py-sm px-md rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90" href="#">
      <span className="material-symbols-outlined" data-icon="logout">logout</span>
      <span>Logout</span>
      </a>
      </li>
      </ul>
      </div>
      </nav>
      {/*Main Content Area*/}
      <main className="flex-1 flex flex-col md:ml-64 relative bg-surface h-full">
      {/*Top Progress Bar*/}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-10 flex flex-col">
      <div className="h-1 w-full bg-surface-container-low">
      <div className="h-1 bg-primary w-[30%] transition-all duration-300"></div>
      </div>
      <div className="px-margin py-md flex justify-between items-center">
      <span className="font-label-md text-label-md text-on-surface-variant">Step 3 of 10</span>
      <span className="font-label-md text-label-md text-primary cursor-pointer hover:underline">Save &amp; Exit</span>
      </div>
      </div>
      {/*Assessment Form Container*/}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-margin">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded p-xl">
      <div className="mb-xl">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Database Fundamentals</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant">Rate your proficiency in SQL database management.</p>
      </div>
      <form className="flex flex-col gap-md mb-xl">
      <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
      <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="beginner"/>
      <div className="ml-md">
      <span className="block font-label-md text-label-md text-on-surface">Beginner</span>
      <span className="block font-body-sm text-body-sm text-on-surface-variant">Basic understanding, can write simple SELECT statements.</span>
      </div>
      </label>
      <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
      <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="intermediate"/>
      <div className="ml-md">
      <span className="block font-label-md text-label-md text-on-surface">Intermediate</span>
      <span className="block font-body-sm text-body-sm text-on-surface-variant">Comfortable with JOINs, GROUP BY, and basic indexing.</span>
      </div>
      </label>
      <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
      <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="advanced"/>
      <div className="ml-md">
      <span className="block font-label-md text-label-md text-on-surface">Advanced</span>
      <span className="block font-body-sm text-body-sm text-on-surface-variant">Can write complex queries, optimize performance, and design schemas.</span>
      </div>
      </label>
      <label className="flex items-center p-md border border-outline-variant rounded cursor-pointer hover:border-primary hover:bg-surface transition-colors">
      <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-1" name="sql_proficiency" type="radio" value="expert"/>
      <div className="ml-md">
      <span className="block font-label-md text-label-md text-on-surface">Expert</span>
      <span className="block font-body-sm text-body-sm text-on-surface-variant">Deep knowledge of database architecture, tuning, and enterprise deployment.</span>
      </div>
      </label>
      </form>
      <div className="flex justify-between items-center pt-md border-t border-outline-variant">
      <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-on-surface font-label-md text-label-md hover:bg-surface transition-colors flex items-center gap-sm" type="button">
      <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                              Back
                          </button>
      <button className="px-md py-sm bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-sm" type="button">
                              Next
                              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
      </button>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
