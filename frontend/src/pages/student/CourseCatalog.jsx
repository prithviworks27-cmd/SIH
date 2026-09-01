import { Link, useNavigate } from "react-router-dom";
export default function CourseCatalog() {
  const navigate = useNavigate();
  return (
    <div className="font-body-md text-on-surface flex min-h-screen">
      {/*SideNavBar*/}
      <nav className="fixed left-0 top-0 h-screen flex flex-col py-xl px-md bg-surface-container-low dark:bg-surface-container docked left-0 h-full w-64 border-r border-outline-variant dark:border-outline flat no shadows z-50">
      <div className="flex items-center gap-sm mb-lg">
      <span className="material-symbols-outlined text-primary text-3xl">school</span>
      <div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Student Portal</h1>
      <p className="font-label-sm text-label-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      </div>
      <ul className="flex-1 flex flex-col gap-sm">
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/dashboard">
      <span className="material-symbols-outlined">dashboard</span>
                          Dashboard
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/skill-assessment">
      <span className="material-symbols-outlined">quiz</span>
                          Skill Assessment
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-primary dark:text-primary-fixed font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/learning-paths">
      <span className="material-symbols-outlined">school</span>
                          Learning Paths
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/internships">
      <span className="material-symbols-outlined">work</span>
                          Internships/Jobs
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/applications">
      <span className="material-symbols-outlined">description</span>
                          My Applications
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/portfolio">
      <span className="material-symbols-outlined">account_circle</span>
                          Portfolio
                      </Link>
      </li>
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/messages">
      <span className="material-symbols-outlined">mail</span>
                          Messages
                      </Link>
      </li>
      </ul>
      <ul className="flex flex-col gap-sm mt-auto pt-lg border-t border-e5">
      <li>
      <Link className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" to="/settings">
      <span className="material-symbols-outlined">settings</span>
                          Settings
                      </Link>
      </li>
      <li>
      <a className="flex items-center gap-sm px-md py-sm rounded text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
      <span className="material-symbols-outlined">logout</span>
                          Logout
                      </a>
      </li>
      </ul>
      </nav>
      {/*Main Content Area*/}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
      {/*Top Header Area (Canvas)*/}
      <header className="bg-white-panel border-b border-e5 px-margin py-xl">
      <div className="max-w-max-width mx-auto flex justify-between items-end">
      <div>
      <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Course Catalog</h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Discover curated learning paths and advanced modules provided by leading institutional partners.</p>
      </div>
      <div className="flex gap-md">
      <div className="relative">
      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
      <input className="pl-[36px] pr-md py-[6px] border border-e5 rounded bg-white-panel font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-0 focus:outline-none w-64" placeholder="Search courses..." type="text"/>
      </div>
      <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Search</button>
      </div>
      </div>
      </header>
      {/*Main Layout: Sidebar Filters + Course List*/}
      <div className="flex-1 bg-[#FAFAFA] px-margin py-xl">
      <div className="max-w-max-width mx-auto flex gap-gutter">
      {/*Left Filter Sidebar*/}
      <aside className="w-64 flex-shrink-0">
      <div className="bg-white-panel border border-e5 rounded p-md">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-e5 pb-sm">Filters</h3>
      {/*Filter Group: Category*/}
      <div className="mb-lg">
      <h4 className="font-label-md text-label-md text-on-surface mb-sm">Skill Category</h4>
      <div className="flex flex-col gap-xs">
      <label className="flex items-center gap-sm cursor-pointer">
      <input defaultChecked className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Data Science</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Material Engineering</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Quantum Computing</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Bioinformatics</span>
      </label>
      </div>
      </div>
      {/*Filter Group: Duration*/}
      <div className="mb-lg">
      <h4 className="font-label-md text-label-md text-on-surface mb-sm">Duration</h4>
      <div className="flex flex-col gap-xs">
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Short (&lt; 4 weeks)</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input defaultChecked className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Medium (4-8 weeks)</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Extensive (8+ weeks)</span>
      </label>
      </div>
      </div>
      {/*Filter Group: Provider*/}
      <div>
      <h4 className="font-label-md text-label-md text-on-surface mb-sm">Provider</h4>
      <div className="flex flex-col gap-xs">
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Zurich Institute of Technology</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input defaultChecked className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Global Research Consortium</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-e5 text-primary focus:ring-0" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface-variant">TechCorp Academy</span>
      </label>
      </div>
      </div>
      </div>
      </aside>
      {/*Course List Area*/}
      <section className="flex-1 flex flex-col gap-md">
      {/*Sorting/Meta*/}
      <div className="flex justify-between items-center bg-white-panel border border-e5 rounded px-md py-sm">
      <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 24 results</span>
      <div className="flex items-center gap-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
      <select className="border border-e5 rounded bg-white-panel font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-0 focus:outline-none py-1 pl-2 pr-8">
      <option>Relevance</option>
      <option>Newest</option>
      <option>Duration (Low to High)</option>
      </select>
      </div>
      </div>
      {/*List of Courses (Plain Bordered Rows)*/}
      <div className="bg-white-panel border border-e5 rounded flex flex-col">
      {/*Course Row 1*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-md border-b border-e5 last:border-b-0 hover:bg-[#F9F9F9] transition-colors">
      <div className="flex-1 mb-sm md:mb-0">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">Foundations of Applied Machine Learning</h3>
      <div className="flex items-center gap-md font-body-sm text-body-sm text-on-surface-variant mb-sm">
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">account_balance</span> Zurich Institute of Technology</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">schedule</span> 6 Weeks</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> Intermediate</span>
      </div>
      <div className="flex gap-sm">
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Data Science</span>
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Python</span>
      </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-sm">
      <button className="text-primary font-label-md text-label-md hover:underline bg-transparent border-0">View Details</button>
      <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Enroll</button>
      </div>
      </div>
      {/*Course Row 2*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-md border-b border-e5 last:border-b-0 hover:bg-[#F9F9F9] transition-colors">
      <div className="flex-1 mb-sm md:mb-0">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">Advanced Polymers in Urban Infrastructure</h3>
      <div className="flex items-center gap-md font-body-sm text-body-sm text-on-surface-variant mb-sm">
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">account_balance</span> Global Research Consortium</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">schedule</span> 8 Weeks</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> Advanced</span>
      </div>
      <div className="flex gap-sm">
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Material Eng</span>
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Urban Planning</span>
      </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-sm">
      <button className="text-primary font-label-md text-label-md hover:underline bg-transparent border-0">View Details</button>
      <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Enroll</button>
      </div>
      </div>
      {/*Course Row 3*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-md border-b border-e5 last:border-b-0 hover:bg-[#F9F9F9] transition-colors">
      <div className="flex-1 mb-sm md:mb-0">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">Quantum Cryptography Fundamentals</h3>
      <div className="flex items-center gap-md font-body-sm text-body-sm text-on-surface-variant mb-sm">
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">account_balance</span> TechCorp Academy</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">schedule</span> 4 Weeks</span>
      <span className="flex items-center gap-[2px]"><span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> Beginner</span>
      </div>
      <div className="flex gap-sm">
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Quantum Computing</span>
      <span className="bg-chip px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">Cybersecurity</span>
      </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-sm">
      <button className="text-primary font-label-md text-label-md hover:underline bg-transparent border-0">View Details</button>
      <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Enroll</button>
      </div>
      </div>
      </div>
      {/*Pagination (Simple)*/}
      <div className="flex justify-center items-center gap-sm mt-md">
      <button className="px-sm py-sm border border-e5 rounded bg-white-panel text-on-surface-variant hover:bg-[#F9F9F9] disabled:opacity-50" disabled>
      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>
      <span className="font-body-sm text-body-sm text-on-surface-variant px-sm">Page 1 of 4</span>
      <button className="px-sm py-sm border border-e5 rounded bg-white-panel text-on-surface-variant hover:bg-[#F9F9F9]">
      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
      </div>
      </section>
      </div>
      </div>
      </main>
    </div>
  );
}
