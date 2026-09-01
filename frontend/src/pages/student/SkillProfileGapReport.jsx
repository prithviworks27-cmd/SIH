import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SkillProfileGapReport() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full flex flex-col md:flex-row bg-background">
      {/*TopNavBar (Mobile)*/}
      <nav className="md:hidden bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-md py-md w-full max-w-max-width mx-auto relative z-20">
      <div className="font-headline-md text-headline-md font-bold text-primary">AcademiaLink</div>
      <button onClick={() => setSidebarOpen(true)} className="material-symbols-outlined text-on-surface-variant">menu</button>
      </nav>
      {/*SideNavBar (Desktop & Mobile Menu)*/}
      <aside className={`${sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full"} md:flex flex-col fixed md:relative top-0 left-0 h-full w-64 bg-surface-container-low border-r border-outline-variant py-xl px-md z-30 transition-transform transform md:translate-x-0 overflow-y-auto`}>
      <div className="mb-xl flex items-center justify-between md:block">
      <div>
      <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Academic Collaboration</p>
      </div>
      <button onClick={() => setSidebarOpen(false)} className="md:hidden material-symbols-outlined text-on-surface-variant">close</button>
      </div>
      <nav className="flex-1 flex flex-col gap-sm">
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/dashboard">
      <span className="material-symbols-outlined">dashboard</span>
                      Dashboard
                  </Link>
      {/*Active Tab: Skill Assessment (maps to Skill Profile)*/}
      <Link className="flex items-center gap-md px-md py-3 text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/skill-assessment">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                      Skill Assessment
                  </Link>
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/learning-paths">
      <span className="material-symbols-outlined">school</span>
                      Learning Paths
                  </Link>
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/internships">
      <span className="material-symbols-outlined">work</span>
                      Internships/Jobs
                  </Link>
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/applications">
      <span className="material-symbols-outlined">description</span>
                      My Applications
                  </Link>
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/portfolio">
      <span className="material-symbols-outlined">account_circle</span>
                      Portfolio
                  </Link>
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/messages">
      <span className="material-symbols-outlined">mail</span>
                      Messages
                  </Link>
      </nav>
      <div className="mt-xl pt-md border-t border-outline-variant flex flex-col gap-sm">
      <Link className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/settings">
      <span className="material-symbols-outlined">settings</span>
                      Settings
                  </Link>
      <a className="flex items-center gap-md px-md py-3 text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
      <span className="material-symbols-outlined">logout</span>
                      Logout
                  </a>
      </div>
      </aside>
      {/*Main Content*/}
      <main className="flex-1 overflow-y-auto w-full max-w-max-width mx-auto px-md md:px-margin py-lg md:py-xl flex flex-col gap-xl">
      {/*Header*/}
      <header className="border-b border-outline-variant pb-md flex flex-col md:flex-row md:items-end justify-between gap-md">
      <div>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Skill Profile &amp; Gap Report</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Last assessed: October 24, 2024</p>
      </div>
      <button className="bg-primary-container text-on-primary border border-[#E5E5E5] px-4 py-2 rounded font-label-md text-label-md hover:bg-[#152a4a] transition-colors self-start md:self-auto">
                      Retake Assessment
                  </button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/*Left Column: Summary & Strong Skills*/}
      <div className="lg:col-span-8 flex flex-col gap-xl">
      {/*Overview Card*/}
      <section className="bg-surface-container-lowest border border-[#E5E5E5] rounded p-lg">
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-md border-b border-[#E5E5E5] pb-sm">Core Competency Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-md">
      <div className="border border-[#E5E5E5] p-md rounded flex flex-col items-start bg-[#F5F5F5]">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Overall Proficiency</span>
      <span className="font-headline-md text-headline-md text-primary font-bold">Advanced</span>
      </div>
      <div className="border border-[#E5E5E5] p-md rounded flex flex-col items-start bg-[#F5F5F5]">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Primary Domain</span>
      <span className="font-headline-md text-headline-md text-on-background">Data Science</span>
      </div>
      <div className="border border-[#E5E5E5] p-md rounded flex flex-col items-start bg-[#F5F5F5]">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Identified Gaps</span>
      <span className="font-headline-md text-headline-md text-error">3 Critical</span>
      </div>
      </div>
      </section>
      {/*Strong Skills Section*/}
      <section className="bg-surface-container-lowest border border-[#E5E5E5] rounded p-lg">
      <div className="flex items-center gap-2 mb-md border-b border-[#E5E5E5] pb-sm">
      <span className="material-symbols-outlined text-primary">verified</span>
      <h3 className="font-headline-sm text-headline-sm text-on-background">Validated Strengths</h3>
      </div>
      <div className="flex flex-col gap-md">
      {/*Skill Item*/}
      <div>
      <div className="flex justify-between mb-xs">
      <span className="font-label-md text-label-md text-on-background">Statistical Analysis</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Expert (92%)</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-2 rounded overflow-hidden">
      <div className="bg-primary-container h-full" style={{ width: "92%" }}></div>
      </div>
      </div>
      {/*Skill Item*/}
      <div>
      <div className="flex justify-between mb-xs">
      <span className="font-label-md text-label-md text-on-background">Python Programming</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Advanced (85%)</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-2 rounded overflow-hidden">
      <div className="bg-primary-container h-full" style={{ width: "85%" }}></div>
      </div>
      </div>
      {/*Skill Item*/}
      <div>
      <div className="flex justify-between mb-xs">
      <span className="font-label-md text-label-md text-on-background">Machine Learning Algorithms</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Advanced (78%)</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-2 rounded overflow-hidden">
      <div className="bg-primary-container h-full" style={{ width: "78%" }}></div>
      </div>
      </div>
      {/*Skill Item*/}
      <div>
      <div className="flex justify-between mb-xs">
      <span className="font-label-md text-label-md text-on-background">Data Visualization (Tableau)</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Intermediate (70%)</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-2 rounded overflow-hidden">
      <div className="bg-primary-container h-full" style={{ width: "70%" }}></div>
      </div>
      </div>
      </div>
      </section>
      </div>
      {/*Right Column: Skill Gaps & Recommendations*/}
      <div className="lg:col-span-4 flex flex-col gap-xl">
      <section className="bg-surface-container-lowest border border-[#E5E5E5] rounded p-lg h-full">
      <div className="flex items-center gap-2 mb-md border-b border-[#E5E5E5] pb-sm">
      <span className="material-symbols-outlined text-error">warning</span>
      <h3 className="font-headline-sm text-headline-sm text-on-background">Identified Skill Gaps</h3>
      </div>
      <div className="flex flex-col gap-lg">
      {/*Gap Item 1*/}
      <div className="border border-[#E5E5E5] p-md rounded bg-[#FAFAFA]">
      <div className="flex justify-between items-start mb-sm">
      <h4 className="font-label-md text-label-md text-on-background">Cloud Deployment (AWS)</h4>
      <span className="px-2 py-0.5 bg-[#E5E5E5] rounded font-label-sm text-label-sm text-on-background">Beginner</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-1.5 rounded overflow-hidden mb-sm">
      <div className="bg-[#5e5e5e] h-full" style={{ width: "25%" }}></div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Required for integration with current industry R&amp;D pipelines.</p>
      <a className="inline-block mt-sm font-label-md text-label-md text-primary hover:underline" href="#">View recommended path →</a>
      </div>
      {/*Gap Item 2*/}
      <div className="border border-[#E5E5E5] p-md rounded bg-[#FAFAFA]">
      <div className="flex justify-between items-start mb-sm">
      <h4 className="font-label-md text-label-md text-on-background">Deep Learning (PyTorch)</h4>
      <span className="px-2 py-0.5 bg-[#E5E5E5] rounded font-label-sm text-label-sm text-on-background">Novice</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-1.5 rounded overflow-hidden mb-sm">
      <div className="bg-[#5e5e5e] h-full" style={{ width: "15%" }}></div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Critical for upcoming computer vision research projects.</p>
      <a className="inline-block mt-sm font-label-md text-label-md text-primary hover:underline" href="#">View recommended path →</a>
      </div>
      {/*Gap Item 3*/}
      <div className="border border-[#E5E5E5] p-md rounded bg-[#FAFAFA]">
      <div className="flex justify-between items-start mb-sm">
      <h4 className="font-label-md text-label-md text-on-background">Research Grant Writing</h4>
      <span className="px-2 py-0.5 bg-[#E5E5E5] rounded font-label-sm text-label-sm text-on-background">Untested</span>
      </div>
      <div className="w-full bg-[#E5E5E5] h-1.5 rounded overflow-hidden mb-sm">
      <div className="bg-[#5e5e5e] h-full" style={{ width: "5%" }}></div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Essential skill for securing independent funding.</p>
      <a className="inline-block mt-sm font-label-md text-label-md text-primary hover:underline" href="#">View recommended path →</a>
      </div>
      </div>
      </section>
      </div>
      </div>
      </main>
    </div>
  );
}
