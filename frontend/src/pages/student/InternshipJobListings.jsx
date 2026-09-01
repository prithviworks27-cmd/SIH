import { useState } from "react";

export default function InternshipJobListings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-body-md text-body-md">
      {/*SideNavBar*/}
      <aside className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col bg-surface-container-low border-r border-outline-variant h-full w-64 fixed left-0 top-0 py-xl px-md z-10`}>
      <div className="mb-lg px-sm flex items-center justify-between">
      <div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      <button onClick={() => setSidebarOpen(false)} className="md:hidden material-symbols-outlined text-on-surface-variant">close</button>
      </div>
      <nav className="flex-1 space-y-xs overflow-y-auto">
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">dashboard</span>
                      Dashboard
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">quiz</span>
                      Skill Assessment
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">school</span>
                      Learning Paths
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded font-bold border-l-4 border-primary bg-surface-container-high text-primary scale-95 active:scale-90 transition-transform font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">work</span>
                      Internships/Jobs
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">description</span>
                      My Applications
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">account_circle</span>
                      Portfolio
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">mail</span>
                      Messages
                  </a>
      </nav>
      <div className="mt-auto pt-lg border-t border-outline-variant space-y-xs">
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">settings</span>
                      Settings
                  </a>
      <a className="flex items-center gap-sm px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Logout
                  </a>
      </div>
      </aside>
      {/*Main Content Area*/}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-full bg-surface">
      {/*Mobile Header (Visible only on mobile)*/}
      <header className="md:hidden flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest">
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Internships/Jobs</h1>
      <button onClick={() => setSidebarOpen(true)} className="text-on-surface-variant">
      <span className="material-symbols-outlined">menu</span>
      </button>
      </header>
      <div className="flex-1 overflow-y-auto p-md md:p-margin flex flex-col md:flex-row gap-lg">
      {/*Filter Sidebar (Left)*/}
      <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md sticky top-margin">
      <h2 className="font-headline-sm text-headline-sm font-medium text-on-surface mb-md">Filters</h2>
      {/*Skills Filter*/}
      <div className="mb-lg border-b border-outline-variant pb-md">
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Skills</h3>
      <div className="space-y-sm">
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Python</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Java</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">React</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Data Analysis</span>
      </label>
      </div>
      </div>
      {/*Location Filter*/}
      <div className="mb-lg border-b border-outline-variant pb-md">
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Location</h3>
      <div className="space-y-sm">
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Remote</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Bangalore</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Mumbai</span>
      </label>
      </div>
      </div>
      {/*Type Filter*/}
      <div>
      <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Type</h3>
      <div className="space-y-sm">
      <label className="flex items-center gap-sm cursor-pointer">
      <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Full-time</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Internship</span>
      </label>
      <label className="flex items-center gap-sm cursor-pointer">
      <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
      <span className="font-body-sm text-body-sm text-on-surface">Part-time</span>
      </label>
      </div>
      </div>
      </div>
      </div>
      {/*Opportunities List (Right)*/}
      <div className="flex-1">
      <div className="flex justify-between items-center mb-md">
      <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Available Opportunities</h2>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 24 results</span>
      </div>
      <div className="space-y-md">
      {/*Job Card 1*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col md:flex-row gap-md items-start md:items-center hover:border-primary transition-colors cursor-pointer">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <h3 className="font-headline-sm text-headline-sm font-medium text-primary">Machine Learning Engineer Intern</h3>
      <span className="bg-surface-container px-sm py-xs rounded-sm font-label-sm text-label-sm text-on-surface">Internship</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-sm">TechCorp AI Labs • Remote</p>
      <div className="flex flex-wrap gap-xs">
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">Python</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">TensorFlow</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">Data Analysis</span>
      </div>
      </div>
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-md border-t md:border-t-0 border-outline-variant pt-md md:pt-0 mt-md md:mt-0">
      <div className="text-right">
      <span className="block font-headline-md text-headline-md text-primary font-bold">92%</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Match</span>
      </div>
      <button className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">Apply Now</button>
      </div>
      </div>
      {/*Job Card 2*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col md:flex-row gap-md items-start md:items-center hover:border-primary transition-colors cursor-pointer">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <h3 className="font-headline-sm text-headline-sm font-medium text-primary">Junior Backend Developer</h3>
      <span className="bg-surface-container px-sm py-xs rounded-sm font-label-sm text-label-sm text-on-surface">Full-time</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-sm">Global Systems Solutions • Bangalore (Hybrid)</p>
      <div className="flex flex-wrap gap-xs">
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">Java</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">Spring Boot</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">SQL</span>
      </div>
      </div>
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-md border-t md:border-t-0 border-outline-variant pt-md md:pt-0 mt-md md:mt-0">
      <div className="text-right">
      <span className="block font-headline-md text-headline-md text-primary font-bold">85%</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Match</span>
      </div>
      <button className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">Apply Now</button>
      </div>
      </div>
      {/*Job Card 3*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col md:flex-row gap-md items-start md:items-center hover:border-primary transition-colors cursor-pointer">
      <div className="flex-1">
      <div className="flex items-center gap-sm mb-xs">
      <h3 className="font-headline-sm text-headline-sm font-medium text-primary">Frontend Engineer Intern</h3>
      <span className="bg-surface-container px-sm py-xs rounded-sm font-label-sm text-label-sm text-on-surface">Internship</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-sm">Creative Digital Agency • Mumbai</p>
      <div className="flex flex-wrap gap-xs">
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">React</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">TypeScript</span>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">CSS</span>
      </div>
      </div>
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-md border-t md:border-t-0 border-outline-variant pt-md md:pt-0 mt-md md:mt-0">
      <div className="text-right">
      <span className="block font-headline-md text-headline-md text-primary font-bold">78%</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Match</span>
      </div>
      <button className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">Apply Now</button>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
