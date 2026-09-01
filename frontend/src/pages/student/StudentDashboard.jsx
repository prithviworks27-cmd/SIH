export default function StudentDashboard() {
  return (
    <div className="bg-surface-container-lowest text-on-surface flex min-h-screen">
      {/*Shared Component: SideNavBar*/}
      <aside className="hidden md:flex bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-screen flex-col py-xl px-md w-64 z-10">
      {/*Header / Identity*/}
      <div className="flex items-center gap-sm mb-xl px-sm">
      <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" data-alt="A professional, high-resolution headshot of a young male student in a light-filled modern university campus setting. The lighting is soft and natural, conveying a bright, approachable, and academic mood. The styling is neat and corporate-modern, fitting for a research portal profile." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMRuaiZxTqzhEL8ITLBcOWBDUypoqcTuMX2-nHpIXdVK572Nv97HDje4xpsLwPavhNsUVpiDmSlBNrLlhTEWmguEjpwUCXFcs4_2A5RmPvHiQfrQ_IE_SXNGdrMzuzM1p4g1MFomRzyj8H3vVawY3v0-xvWftd8rYDYVeKpCog5M-igpI1wVoOydVZvWKu-kby-bQ9FRXkLiqu8PKaQExuewdrtBJGLd7nw020d-qiZYua3xZT7DgE"/>
      <div>
      <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h2>
      <p className="font-label-sm text-label-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      </div>
      {/*Navigation Links*/}
      <nav className="flex-1 space-y-xs">
      {/*Active State: Dashboard*/}
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-primary font-bold border-l-4 border-primary bg-surface-container-high scale-95 transition-transform" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
      <span className="font-label-md text-label-md">Dashboard</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">quiz</span>
      <span className="font-label-md text-label-md">Skill Assessment</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">school</span>
      <span className="font-label-md text-label-md">Learning Paths</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">work</span>
      <span className="font-label-md text-label-md">Internships/Jobs</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">description</span>
      <span className="font-label-md text-label-md">My Applications</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">account_circle</span>
      <span className="font-label-md text-label-md">Portfolio</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">mail</span>
      <span className="font-label-md text-label-md">Messages</span>
      </a>
      </nav>
      {/*Footer Links*/}
      <div className="mt-auto border-t border-outline-variant pt-md space-y-xs">
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">settings</span>
      <span className="font-label-md text-label-md">Settings</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all cursor-pointer duration-200" href="#">
      <span className="material-symbols-outlined">logout</span>
      <span className="font-label-md text-label-md">Logout</span>
      </a>
      </div>
      </aside>
      {/*Main Content Area*/}
      <main className="flex-1 md:ml-64 p-margin md:px-margin px-md py-xl max-w-max-width mx-auto w-full">
      {/*Welcome Header*/}
      <header className="mb-xl">
      <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Welcome back, Arjun Mehta</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">Here is a summary of your academic progress and opportunities.</p>
      </header>
      {/*Stat Cards Grid*/}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
      {/*Stat Card 1*/}
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Skill Match</span>
      <span className="material-symbols-outlined text-primary-container">radar</span>
      </div>
      <div>
      <div className="font-display-lg text-display-lg text-primary-container">82%</div>
      </div>
      </div>
      {/*Stat Card 2*/}
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Applications</span>
      <span className="material-symbols-outlined text-primary-container">work_history</span>
      </div>
      <div>
      <div className="font-display-lg text-display-lg text-on-surface">5</div>
      </div>
      </div>
      {/*Stat Card 3*/}
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Upcoming Deadlines</span>
      <span className="material-symbols-outlined text-error">event</span>
      </div>
      <div>
      <div className="font-display-lg text-display-lg text-on-surface">2</div>
      </div>
      </div>
      </section>
      {/*Main Content Bento Grid*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/*Left Column: Skills & Opportunities*/}
      <div className="lg:col-span-8 flex flex-col gap-gutter">
      {/*Skill Gap Analysis*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-xl">
      <div className="flex items-center justify-between mb-lg">
      <h3 className="font-headline-md text-headline-md text-on-surface">Skill Gap Analysis</h3>
      <button className="font-label-md text-label-md text-primary-container hover:underline">View Details</button>
      </div>
      <div className="space-y-md">
      {/*Skill 1*/}
      <div>
      <div className="flex justify-between items-end mb-xs">
      <span className="font-body-md text-body-md text-on-surface">Python Programming</span>
      <span className="font-label-md text-label-md text-on-surface-variant">90%</span>
      </div>
      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
      <div className="h-full bg-primary-container rounded-full" style={{ width: "90%" }}></div>
      </div>
      </div>
      {/*Skill 2*/}
      <div>
      <div className="flex justify-between items-end mb-xs">
      <span className="font-body-md text-body-md text-on-surface">Data Analysis</span>
      <span className="font-label-md text-label-md text-on-surface-variant">70%</span>
      </div>
      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
      <div className="h-full bg-primary-container rounded-full" style={{ width: "70%" }}></div>
      </div>
      </div>
      {/*Skill 3*/}
      <div>
      <div className="flex justify-between items-end mb-xs">
      <span className="font-body-md text-body-md text-on-surface">UI Design</span>
      <span className="font-label-md text-label-md text-on-surface-variant">60%</span>
      </div>
      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
      <div className="h-full bg-primary-container rounded-full" style={{ width: "60%" }}></div>
      </div>
      </div>
      </div>
      </section>
      {/*Recommended Opportunities*/}
      <section>
      <div className="flex items-center justify-between mb-md">
      <h3 className="font-headline-md text-headline-md text-on-surface">Recommended Opportunities</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {/*Opportunity Card 1*/}
      <article className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md flex flex-col h-full">
      <div className="flex justify-between items-start mb-md">
      <div className="bg-surface-variant p-sm rounded-DEFAULT">
      <span className="material-symbols-outlined text-on-surface-variant">database</span>
      </div>
      <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded-DEFAULT font-label-sm text-label-sm">85% Match</span>
      </div>
      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Data Science Intern</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">TechCorp Research Labs</p>
      <div className="mt-auto flex justify-end">
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-surface-variant transition-colors">Apply Now</button>
      </div>
      </article>
      {/*Opportunity Card 2*/}
      <article className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md flex flex-col h-full">
      <div className="flex justify-between items-start mb-md">
      <div className="bg-surface-variant p-sm rounded-DEFAULT">
      <span className="material-symbols-outlined text-on-surface-variant">code</span>
      </div>
      <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded-DEFAULT font-label-sm text-label-sm">78% Match</span>
      </div>
      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Machine Learning Engineer</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Nexus Systems Institute</p>
      <div className="mt-auto flex justify-end">
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-surface-variant transition-colors">Apply Now</button>
      </div>
      </article>
      </div>
      </section>
      </div>
      {/*Right Column: Recommended Courses*/}
      <div className="lg:col-span-4">
      <section className="bg-surface border border-outline-variant rounded-DEFAULT p-lg h-full flex flex-col">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-lg">Recommended Courses</h3>
      <div className="space-y-md flex-1">
      {/*Course 1*/}
      <a className="block bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md hover:border-primary-container transition-colors group" href="#">
      <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors mb-xs">Advanced Statistical Modeling</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">University of Technology</p>
      <div className="flex items-center gap-xs">
      <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">8 Weeks</span>
      </div>
      </a>
      {/*Course 2*/}
      <a className="block bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md hover:border-primary-container transition-colors group" href="#">
      <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors mb-xs">Foundations of UX Research</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Design Institute Online</p>
      <div className="flex items-center gap-xs">
      <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">4 Weeks</span>
      </div>
      </a>
      {/*Course 3*/}
      <a className="block bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md hover:border-primary-container transition-colors group" href="#">
      <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors mb-xs">Ethics in AI Development</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Global Ethics Forum</p>
      <div className="flex items-center gap-xs">
      <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Self-paced</span>
      </div>
      </a>
      </div>
      <button className="mt-lg w-full bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-primary transition-colors">
                              Browse Full Catalog
                          </button>
      </section>
      </div>
      </div>
      </main>
    </div>
  );
}
