export default function InternshipJobDetail() {
  return (
    <div className="flex min-h-screen">
      {/*SideNavBar*/}
      <aside className="fixed left-0 top-0 h-screen flex flex-col py-xl px-md bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline w-64 z-50">
      <div className="mb-xl">
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Student Portal</h1>
      <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant">Academic Collaboration</p>
      </div>
      <nav className="flex-1 space-y-sm">
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
      <span>Dashboard</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>quiz</span>
      <span>Skill Assessment</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>school</span>
      <span>Learning Paths</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-primary dark:text-primary-fixed font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
      <span>Internships/Jobs</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
      <span>My Applications</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
      <span>Portfolio</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>mail</span>
      <span>Messages</span>
      </a>
      </nav>
      <div className="mt-auto space-y-sm pt-xl border-t border-outline-variant dark:border-outline">
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
      <span>Settings</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
      <span>Logout</span>
      </a>
      </div>
      </aside>
      {/*Main Content*/}
      <main className="ml-64 flex-1 p-margin min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1">
      {/*Breadcrumbs / Back*/}
      <a className="inline-flex items-center gap-sm text-secondary hover:text-primary transition-colors font-body-sm text-body-sm mb-lg" href="#">
      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      Back to Internships
                  </a>
      {/*Header Section*/}
      <header className="bg-surface-container-lowest border border-[#E5E5E5] rounded-DEFAULT p-lg mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
      <div className="flex items-center gap-lg">
      <img className="w-16 h-16 rounded-DEFAULT object-cover border border-[#E5E5E5]" data-alt="A clean, minimalist high-tech corporate logo for a leading materials science research firm. The design uses geometric shapes in stark navy blue and pure white, reflecting institutional credibility and precision. The background is a solid, clean white." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPDx1e77Rt-PQwPz2wv5A0NrQeWQ4OLw2qFEVLHr-ZOxK0PM3b317gYnYd-r3DLvhxV6OZ8yfcZPZeFlLmpTizETu8QW-VWw1nCWLtdFMYRIujIWVrUPLfM8D7wD0V9FcMRvBfUUtQpzZsgE_W4IoVHcHKvWjXM-pOtyuIWv5oEoseTpBSMp2rIEkzygHngW8HHv-6YrK7r6K4yPUSdfjF8Wf20arIhAiRsBWsZnKWwXYZnuOhIghR"/>
      <div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Materials Science Research Intern</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-sm">
      <span className="material-symbols-outlined text-[20px]">domain</span>
                                  Zurich Institute of Technology - R&amp;D Division
                              </p>
      </div>
      </div>
      <div className="flex flex-col items-end gap-md w-full md:w-auto">
      <div className="flex items-center gap-sm font-label-md text-label-md text-primary">
      <span className="material-symbols-outlined text-[20px] text-green-700">check_circle</span>
      <span>92% Skill Match</span>
      </div>
      <button className="bg-primary-container text-white px-lg py-sm rounded-DEFAULT font-label-md text-label-md hover:bg-opacity-90 transition-opacity w-full md:w-auto">
                              Apply Now
                          </button>
      </div>
      </header>
      {/*Grid Layout*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      {/*Main Content Column*/}
      <div className="lg:col-span-2 space-y-lg">
      {/*Overview Card*/}
      <section className="bg-surface-container-lowest border border-[#E5E5E5] rounded-DEFAULT p-lg">
      <h2 className="font-headline-md text-headline-md text-primary mb-md border-b border-[#E5E5E5] pb-sm">Overview</h2>
      <div className="space-y-md font-body-md text-body-md text-on-surface">
      <p>We are seeking a highly motivated graduate or advanced undergraduate student to join our core research team focusing on the optimization of semi-transparent photovoltaics for urban infrastructure. This role involves direct collaboration with industry partners to translate theoretical models into scalable, real-world applications.</p>
      <p>The successful candidate will assist in synthesizing novel polymer blends, conducting rigorous optical and electrical characterizations, and analyzing large datasets to identify performance bottlenecks. This internship provides unparalleled exposure to state-of-the-art laboratory facilities and a direct pathway to potential long-term commercial R&amp;D roles.</p>
      <h3 className="font-headline-sm text-headline-sm text-primary mt-lg mb-sm">Key Responsibilities</h3>
      <ul className="list-disc pl-lg space-y-sm text-on-surface-variant">
      <li>Synthesize and characterize novel organic semiconductor materials.</li>
      <li>Fabricate and test thin-film photovoltaic devices under simulated urban conditions.</li>
      <li>Perform statistical analysis on device performance metrics using Python or R.</li>
      <li>Draft technical reports and present findings in weekly cross-functional meetings.</li>
      </ul>
      </div>
      </section>
      {/*Required Skills*/}
      <section className="bg-surface-container-lowest border border-[#E5E5E5] rounded-DEFAULT p-lg">
      <h2 className="font-headline-md text-headline-md text-primary mb-md border-b border-[#E5E5E5] pb-sm">Required Competencies</h2>
      <div className="flex flex-wrap gap-sm">
      <span className="bg-[#E5E5E5] text-on-background px-md py-xs rounded-[2px] font-label-sm text-label-sm">Polymer Synthesis</span>
      <span className="bg-[#E5E5E5] text-on-background px-md py-xs rounded-[2px] font-label-sm text-label-sm">Spectroscopy (UV-Vis, FTIR)</span>
      <span className="bg-[#E5E5E5] text-on-background px-md py-xs rounded-[2px] font-label-sm text-label-sm">Python / Data Analysis</span>
      <span className="bg-[#E5E5E5] text-on-background px-md py-xs rounded-[2px] font-label-sm text-label-sm">Device Fabrication</span>
      <span className="bg-[#E5E5E5] text-on-background px-md py-xs rounded-[2px] font-label-sm text-label-sm">Technical Writing</span>
      </div>
      </section>
      </div>
      {/*Sidebar Details Column*/}
      <div className="space-y-lg">
      {/*Quick Facts*/}
      <aside className="bg-surface-container-lowest border border-[#E5E5E5] rounded-DEFAULT p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-[#E5E5E5] pb-sm">Details</h3>
      <ul className="space-y-md font-body-sm text-body-sm">
      <li className="flex items-start gap-md">
      <span className="material-symbols-outlined text-outline">location_on</span>
      <div>
      <span className="block font-label-md text-label-md text-on-surface">Location</span>
      <span className="text-on-surface-variant">Zurich, Switzerland (Hybrid)</span>
      </div>
      </li>
      <li className="flex items-start gap-md">
      <span className="material-symbols-outlined text-outline">calendar_month</span>
      <div>
      <span className="block font-label-md text-label-md text-on-surface">Duration</span>
      <span className="text-on-surface-variant">6 Months (Starts Sept 2024)</span>
      </div>
      </li>
      <li className="flex items-start gap-md">
      <span className="material-symbols-outlined text-outline">payments</span>
      <div>
      <span className="block font-label-md text-label-md text-on-surface">Compensation</span>
      <span className="text-on-surface-variant">3,500 CHF / Month</span>
      </div>
      </li>
      <li className="flex items-start gap-md">
      <span className="material-symbols-outlined text-outline">schedule</span>
      <div>
      <span className="block font-label-md text-label-md text-on-surface">Commitment</span>
      <span className="text-on-surface-variant">Full-Time (40 hrs/week)</span>
      </div>
      </li>
      </ul>
      </aside>
      {/*About Company Snippet*/}
      <aside className="bg-surface-container-lowest border border-[#E5E5E5] rounded-DEFAULT p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-[#E5E5E5] pb-sm">About the Partner</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                                  The Zurich Institute of Technology's R&amp;D Division bridges the gap between academic materials science and commercial infrastructure deployment, specializing in sustainable urban technologies.
                              </p>
      <a className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs" href="#">
                                  View Partner Profile
                                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </a>
      </aside>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
