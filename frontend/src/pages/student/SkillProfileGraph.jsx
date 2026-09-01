import { useState } from "react";

export default function SkillProfileGraph() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full flex font-body-md bg-surface text-on-surface">
      {/*Top Navigation (Mobile Only)*/}
      <header className="md:hidden flex justify-between items-center px-md py-md w-full bg-surface-container-lowest border-b border-outline-variant fixed top-0 z-50">
      <div className="font-headline-md text-headline-md font-bold text-primary">AcademiaLink</div>
      <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="material-symbols-outlined text-primary">menu</button>
      </header>
      <div className="flex h-screen w-full pt-16 md:pt-0">
      {/*Side Navigation (Desktop)*/}
      <nav className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col py-xl px-md bg-surface-container-low border-r border-outline-variant docked left-0 h-full w-64 shrink-0 fixed md:relative top-16 md:top-0 z-40`}>
      <div className="mb-xl px-md flex items-center justify-between">
      <div>
      <div className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</div>
      <div className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Academic Collaboration</div>
      </div>
      <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="md:hidden material-symbols-outlined text-on-surface-variant">close</button>
      </div>
      <ul className="flex flex-col gap-xs flex-grow">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">dashboard</span>
                              Dashboard
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">quiz</span>
                              Skill Profile
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">school</span>
                              Learning Paths
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">work</span>
                              Internships/Jobs
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">description</span>
                              My Applications
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">account_circle</span>
                              Portfolio
                          </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">mail</span>
                              Messages
                          </a>
      </li>
      </ul>
      <div className="mt-auto border-t border-outline-variant pt-md">
      <ul className="flex flex-col gap-xs">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">settings</span>
                                  Settings
                              </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">logout</span>
                                  Logout
                              </a>
      </li>
      </ul>
      </div>
      </nav>
      {/*Main Content Canvas*/}
      <main className="flex-1 overflow-y-auto w-full">
      <div className="max-w-max-width mx-auto px-md md:px-margin py-xl w-full">
      <header className="mb-lg border-b border-outline-variant pb-md flex flex-col md:flex-row md:items-end justify-between gap-md">
      <div>
      <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary mb-xs">Skill Profile</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Living Skill Graph</p>
      </div>
      <div className="w-full md:w-64">
      <label className="sr-only" htmlFor="role-selector">Target Job Role</label>
      <select className="w-full border-outline-variant border bg-surface-container-lowest text-on-surface rounded py-sm px-md focus:border-primary focus:ring-0 font-body-sm text-body-sm h-10" id="role-selector">
      <option>Target Job Role: Data Analyst</option>
      <option>Target Job Role: Data Scientist</option>
      <option>Target Job Role: ML Engineer</option>
      </select>
      </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
      {/*Readiness Score & Recommendations*/}
      <div className="lg:col-span-4 flex flex-col gap-lg">
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded flex flex-col items-center text-center">
      <h2 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-wider">Current Readiness Score</h2>
      <div className="font-display-lg text-display-lg text-primary font-bold mb-sm">78%</div>
      <p className="font-body-sm text-body-sm text-on-surface">You match 14 out of 18 core competencies for this role.</p>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded border-t-4 border-t-primary-container">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Recommended Next Activity</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Start Power BI Challenge to close a critical skill gap.</p>
      <button className="w-full bg-primary-container text-on-primary hover:bg-primary transition-colors py-sm px-md rounded font-label-md text-label-md">
                                      Begin Challenge
                                  </button>
      </div>
      </div>
      {/*Skills Detail*/}
      <div className="lg:col-span-8 flex flex-col gap-lg">
      {/*Proven Skills*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded">
      <div className="border-b border-outline-variant p-md bg-[#F5F5F5]">
      <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Skills Already Proven</h2>
      </div>
      <div className="p-0">
      <ul className="divide-y divide-outline-variant">
      <li className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface">Python</span>
      <span className="bg-surface-container px-2 py-1 rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">Assessment-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: 2 weeks ago</p>
      </div>
      <div className="w-full md:w-48 flex items-center gap-md">
      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant">
      <div className="h-full bg-surface-tint w-[90%]"></div>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant w-8 text-right">90%</span>
      </div>
      </li>
      <li className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface">SQL</span>
      <span className="bg-surface-container px-2 py-1 rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">Faculty-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: 1 month ago</p>
      </div>
      <div className="w-full md:w-48 flex items-center gap-md">
      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant">
      <div className="h-full bg-surface-tint w-[85%]"></div>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant w-8 text-right">85%</span>
      </div>
      </li>
      <li className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <span className="font-headline-sm text-headline-sm text-on-surface">Data Visualization</span>
      <span className="bg-surface-container px-2 py-1 rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">Project-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: 3 days ago</p>
      </div>
      <div className="w-full md:w-48 flex items-center gap-md">
      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant">
      <div className="h-full bg-surface-tint w-[75%]"></div>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant w-8 text-right">75%</span>
      </div>
      </li>
      </ul>
      </div>
      </div>
      {/*Missing Skills*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded">
      <div className="border-b border-outline-variant p-md bg-[#F5F5F5]">
      <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Missing Competencies</h2>
      </div>
      <div className="p-0">
      <ul className="divide-y divide-outline-variant">
      <li className="p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
      <div>
      <h4 className="font-headline-sm text-headline-sm text-on-surface">Power BI</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Required for dashboard automation.</p>
      </div>
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-colors py-1 px-3 rounded font-label-sm text-label-sm">
                                                  Explore Courses
                                              </button>
      </li>
      <li className="p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
      <div>
      <h4 className="font-headline-sm text-headline-sm text-on-surface">Statistical Testing</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Essential for hypothesis validation.</p>
      </div>
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-colors py-1 px-3 rounded font-label-sm text-label-sm">
                                                  Explore Courses
                                              </button>
      </li>
      </ul>
      </div>
      </div>
      </div>
      </div>
      </div>
      {/*Footer*/}
      <footer className="w-full py-xl px-margin flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant mt-xl">
      <div className="font-label-md text-label-md font-bold text-primary">AcademiaLink</div>
      <div className="font-body-sm text-body-sm text-secondary">© 2024 AcademiaLink Collaboration Portal. All rights reserved.</div>
      <div className="flex gap-md font-body-sm text-body-sm">
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Contact Us</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Help Center</a>
      </div>
      </footer>
      </main>
      </div>
    </div>
  );
}
