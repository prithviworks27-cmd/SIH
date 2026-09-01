export default function CourseDetail() {
  return (
    <div className="flex min-h-screen">
      {/*SideNavBar (from JSON)*/}
      <nav className="bg-surface-container-low dark:bg-surface-container text-primary dark:text-primary-fixed font-label-md text-label-md border-r border-outline-variant dark:border-outline fixed left-0 top-0 h-screen flex flex-col py-xl px-md w-64 hidden md:flex z-50">
      <div className="mb-xl flex items-center gap-md px-md">
      <span className="material-symbols-outlined text-[32px]">menu_book</span>
      <div>
      <div className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Student Portal</div>
      <div className="font-label-sm text-label-sm text-on-surface-variant font-normal">Academic Collaboration</div>
      </div>
      </div>
      <ul className="flex flex-col gap-sm flex-grow">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                          Dashboard
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="quiz">quiz</span>
                          Skill Assessment
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest text-primary dark:text-primary-fixed hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="school">school</span>
                          Learning Paths
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="work">work</span>
                          Internships/Jobs
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="description">description</span>
                          My Applications
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
                          Portfolio
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
                          Messages
                      </a>
      </li>
      </ul>
      <ul className="flex flex-col gap-sm mt-auto pt-xl border-t border-outline-variant">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
                          Settings
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="logout">logout</span>
                          Logout
                      </a>
      </li>
      </ul>
      </nav>
      {/*Main Content Canvas*/}
      <main className="flex-grow md:ml-64 p-md md:p-margin max-w-max-width mx-auto w-full pt-24 md:pt-margin">
      {/*Breadcrumb / Back*/}
      <div className="mb-lg flex items-center gap-sm font-label-md text-label-md text-on-surface-variant">
      <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">arrow_back</span>
      <span className="cursor-pointer hover:text-primary transition-colors">Learning Paths</span>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <span className="text-primary font-bold">Optimization of Semi-Transparent Photovoltaics</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/*Main Content Area*/}
      <div className="lg:col-span-8 flex flex-col gap-xl">
      {/*Header / Title block*/}
      <header className="border-b border-outline-variant pb-xl">
      <div className="flex items-center gap-md mb-md">
      <span className="bg-surface-container-high px-sm py-xs rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">Advanced Research</span>
      <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px]">schedule</span> 12 Weeks
                              </span>
      <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px]">school</span> Graduate Level
                              </span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Optimization of Semi-Transparent Photovoltaics for Urban Infrastructure</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-sm">
      <span className="material-symbols-outlined text-primary">corporate_fare</span>
                              Provided by Department of Materials Science, Zurich Institute of Technology
                          </p>
      </header>
      {/*Description*/}
      <section>
      <h2 className="font-headline-sm text-headline-sm text-primary mb-md">Course Overview</h2>
      <div className="font-body-md text-body-md text-on-surface flex flex-col gap-md">
      <p>This intensive twelve-week program explores the cutting-edge intersection of materials science and sustainable urban design. Students will analyze the optical and electrical properties of emerging semi-transparent photovoltaic (STPV) materials, focusing primarily on perovskite and organic solar cells.</p>
      <p>The curriculum bridges theoretical physics with practical engineering constraints, challenging participants to design scalable BIPV (Building-Integrated Photovoltaic) systems that balance energy yield, aesthetic transparency, and thermal management within modern architectural contexts.</p>
      </div>
      </section>
      {/*Skills*/}
      <section>
      <h2 className="font-headline-sm text-headline-sm text-primary mb-md">Skills &amp; Competencies Acquired</h2>
      <div className="flex flex-wrap gap-sm">
      <span className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface">Material Characterization</span>
      <span className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface">Optical Simulation</span>
      <span className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface">Thin-Film Deposition</span>
      <span className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface">Energy Yield Modeling</span>
      <span className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface">Urban Integration Strategies</span>
      </div>
      </section>
      {/*Syllabus (Numbered List)*/}
      <section className="border border-outline-variant rounded bg-surface-container-lowest p-lg">
      <h2 className="font-headline-sm text-headline-sm text-primary mb-lg border-b border-outline-variant pb-sm">Syllabus Overview</h2>
      <ol className="flex flex-col">
      <li className="flex gap-md py-md border-b border-outline-variant last:border-0 last:pb-0 pt-0 first:pt-0">
      <div className="font-headline-md text-headline-md font-bold text-primary-container min-w-[32px]">01</div>
      <div>
      <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">Fundamentals of Photovoltaic Operation</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Review of semiconductor physics, p-n junctions, and standard solar cell characterization metrics (J-V curves, EQE).</p>
      </div>
      </li>
      <li className="flex gap-md py-md border-b border-outline-variant last:border-0 last:pb-0">
      <div className="font-headline-md text-headline-md font-bold text-primary-container min-w-[32px]">02</div>
      <div>
      <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">Physics of Semi-Transparency</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Light management techniques, optical modeling (transfer matrix method), and the inherent trade-off between Average Visible Transmittance (AVT) and Power Conversion Efficiency (PCE).</p>
      </div>
      </li>
      <li className="flex gap-md py-md border-b border-outline-variant last:border-0 last:pb-0">
      <div className="font-headline-md text-headline-md font-bold text-primary-container min-w-[32px]">03</div>
      <div>
      <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">Emerging Materials: Perovskites and OPVs</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Synthesis, deposition methods, and degradation mechanisms of third-generation photovoltaic materials suited for STPV applications.</p>
      </div>
      </li>
      <li className="flex gap-md py-md border-b border-outline-variant last:border-0 last:pb-0">
      <div className="font-headline-md text-headline-md font-bold text-primary-container min-w-[32px]">04</div>
      <div>
      <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">Building Integration and Device Architecture</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Designing for architectural contexts, managing thermal loads, and evaluating lifetime energy yield in varied urban environments.</p>
      </div>
      </li>
      </ol>
      </section>
      </div>
      {/*Sticky Sidebar / Action Area*/}
      <div className="lg:col-span-4">
      <div className="sticky top-margin flex flex-col gap-md border border-outline-variant bg-surface-container-lowest p-lg rounded">
      <div className="mb-sm">
      <div className="font-headline-sm text-headline-sm text-primary mb-xs">Enrollment Open</div>
      <div className="font-body-sm text-body-sm text-on-surface-variant">Cohort begins September 15th</div>
      </div>
      <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md px-lg rounded flex justify-center items-center gap-sm hover:bg-primary transition-colors">
      <span className="material-symbols-outlined">how_to_reg</span>
                              Enroll in Course
                          </button>
      <button className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md py-md px-lg rounded border border-outline-variant flex justify-center items-center gap-sm hover:bg-surface-container-high transition-colors">
      <span className="material-symbols-outlined">download</span>
                              Download Syllabus PDF
                          </button>
      <div className="mt-lg pt-lg border-t border-outline-variant flex flex-col gap-sm">
      <div className="flex justify-between items-center font-body-sm text-body-sm">
      <span className="text-on-surface-variant">Format</span>
      <span className="font-medium text-on-surface">Hybrid (Online &amp; Lab)</span>
      </div>
      <div className="flex justify-between items-center font-body-sm text-body-sm">
      <span className="text-on-surface-variant">Commitment</span>
      <span className="font-medium text-on-surface">8-10 hours/week</span>
      </div>
      <div className="flex justify-between items-center font-body-sm text-body-sm">
      <span className="text-on-surface-variant">Prerequisites</span>
      <span className="font-medium text-on-surface">B.S. Physics/Engineering</span>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
