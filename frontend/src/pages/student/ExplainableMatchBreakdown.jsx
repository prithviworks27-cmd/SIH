import { Link, useNavigate } from "react-router-dom";
export default function ExplainableMatchBreakdown() {
  const navigate = useNavigate();
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased h-screen flex overflow-hidden">
      {/*TopNavBar for Web*/}
      <header className="hidden md:flex justify-between items-center px-margin py-md w-full max-w-max-width mx-auto bg-surface-container-lowest border-b border-outline-variant fixed top-0 left-0 right-0 z-50">
      <div className="font-headline-md text-headline-md font-bold text-primary">AcademiaLink</div>
      <nav className="flex gap-lg">
      <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors cursor-pointer duration-200" href="#">How it works</a>
      <a className="text-primary font-label-md text-label-md border-b-2 border-primary pb-1 hover:text-primary transition-colors cursor-pointer duration-200" href="#">For Students</a>
      <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors cursor-pointer duration-200" href="#">For Industry</a>
      <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors cursor-pointer duration-200" href="#">For Institutions</a>
      </nav>
      <div className="flex gap-md items-center">
      <button className="text-primary font-label-md text-label-md hover:text-primary-container">Login</button>
      <button className="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded">Sign Up</button>
      </div>
      </header>
      {/*SideNavBar for Desktop (Secondary Nav context)*/}
      <aside className="hidden md:flex fixed left-0 top-[73px] h-[calc(100vh-73px)] flex-col py-xl px-md bg-surface-container-low border-r border-outline-variant w-64 z-40">
      <div className="mb-lg px-md">
      <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      <nav className="flex-1 space-y-sm">
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/dashboard">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                      Dashboard
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/skill-assessment">
      <span className="material-symbols-outlined" data-icon="quiz">quiz</span>
                      Skill Assessment
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/learning-paths">
      <span className="material-symbols-outlined" data-icon="school">school</span>
                      Learning Paths
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-primary font-bold border-l-4 border-primary bg-surface-container-high hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/internships">
      <span className="material-symbols-outlined" data-icon="work" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                      Internships/Jobs
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/applications">
      <span className="material-symbols-outlined" data-icon="description">description</span>
                      My Applications
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/portfolio">
      <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
                      Portfolio
                  </Link>
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/messages">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
                      Messages
                  </Link>
      </nav>
      <div className="mt-auto space-y-sm">
      <Link className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/settings">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
                      Settings
                  </Link>
      <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
      <span className="material-symbols-outlined" data-icon="logout">logout</span>
                      Logout
                  </a>
      </div>
      </aside>
      {/*Main Content Canvas*/}
      <main className="flex-1 md:ml-64 mt-[73px] h-[calc(100vh-73px)] overflow-y-auto w-full p-md md:p-margin bg-background relative">
      <div className="max-w-[800px] mx-auto">
      {/*Breadcrumbs / Back*/}
      <a className="inline-flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm hover:text-primary mb-lg" href="#">
      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      Back to Internships
                  </a>
      {/*Content Container*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col gap-xl">
      {/*Top Section: Job Info*/}
      <div className="flex justify-between items-start">
      <div>
      <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Senior Data Research Intern</h1>
      <p className="font-body-lg text-body-lg text-secondary">Global Analytics Corp</p>
      <div className="flex gap-sm mt-md">
      <span className="bg-surface-container text-on-surface px-sm py-[2px] rounded-sm font-label-sm text-label-sm">Zurich, CH (On-site)</span>
      <span className="bg-surface-container text-on-surface px-sm py-[2px] rounded-sm font-label-sm text-label-sm">Full-time Intern</span>
      </div>
      </div>
      <div className="text-right">
      <div className="font-display-lg text-display-lg font-bold text-primary">92%</div>
      <div className="font-label-md text-label-md text-on-surface-variant">Match Score</div>
      </div>
      </div>
      {/*Match Breakdown Section*/}
      <div className="border-t border-outline-variant pt-lg">
      <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Why this match?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      {/*Skills Matched*/}
      <div>
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Skills Met</h3>
      <ul className="space-y-sm font-body-md text-body-md text-on-surface">
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                          Python
                                      </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                          SQL
                                      </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                          Statistical Modeling
                                      </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                          Research Methodology
                                      </li>
      </ul>
      </div>
      {/*Skills Missing*/}
      <div>
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Skills Gap</h3>
      <ul className="space-y-sm font-body-md text-body-md text-on-surface">
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-error text-[20px]">close</span>
                                          Tableau
                                      </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-error text-[20px]">close</span>
                                          BigQuery
                                      </li>
      </ul>
      </div>
      </div>
      {/*Eligibility*/}
      <div className="mt-lg">
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Eligibility &amp; Preferences</h3>
      <ul className="space-y-sm font-body-md text-body-md text-on-surface">
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                      Master's Degree Candidate
                                  </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                      2024/2025 Graduation Year
                                  </li>
      <li className="flex items-center gap-sm py-sm border-b border-surface-variant">
      <span className="material-symbols-outlined text-error text-[20px]">close</span>
                                      On-site (Zurich) <span className="text-secondary ml-xs font-body-sm text-body-sm">(You prefer Remote)</span>
      </li>
      </ul>
      </div>
      {/*Next Action*/}
      <div className="mt-xl bg-surface-container-low p-md border border-outline-variant rounded flex flex-col md:flex-row justify-between items-center gap-md">
      <p className="font-body-md text-body-md text-on-surface">
      <span className="font-semibold">Bridge the gap:</span> Complete the Tableau Advanced module to increase match to 98%.
                              </p>
      <button className="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded whitespace-nowrap hover:bg-primary transition-colors">
                                  View Module
                              </button>
      </div>
      </div>
      </div>
      {/*Bottom Action Row (for Apply)*/}
      <div className="mt-lg flex justify-end gap-md">
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded hover:bg-surface-container-low transition-colors">
                          Save for Later
                      </button>
      <button className="bg-primary-container text-on-primary font-label-md text-label-md px-lg py-md rounded hover:bg-primary transition-colors">
                          Apply Now
                      </button>
      </div>
      </div>
      </main>
    </div>
  );
}
