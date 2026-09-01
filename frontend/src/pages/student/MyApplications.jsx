export default function MyApplications() {
  return (
    <div className="bg-background text-on-surface antialiased flex h-screen overflow-hidden">
      {/*SideNavBar*/}
      <nav className="hidden md:flex flex-col py-xl px-md bg-surface-container-low border-r border-outline-variant docked left-0 h-full w-64 flex-shrink-0 z-20">
      <div className="mb-xl px-md">
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Academic Collaboration</p>
      </div>
      <ul className="flex flex-col gap-sm flex-grow font-label-md text-label-md">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
      <span>Dashboard</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="quiz">quiz</span>
      <span>Skill Assessment</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="school">school</span>
      <span>Learning Paths</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="work">work</span>
      <span>Internships/Jobs</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all duration-200 cursor-pointer scale-95" href="#">
      <span className="material-symbols-outlined" data-icon="description" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
      <span>My Applications</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
      <span>Portfolio</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
      <span>Messages</span>
      </a>
      </li>
      </ul>
      <div className="mt-auto pt-lg border-t border-outline-variant font-label-md text-label-md">
      <ul className="flex flex-col gap-sm">
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
      <span>Settings</span>
      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all duration-200 cursor-pointer" href="#">
      <span className="material-symbols-outlined" data-icon="logout">logout</span>
      <span>Logout</span>
      </a>
      </li>
      </ul>
      </div>
      </nav>
      {/*Main Content*/}
      <main className="flex-grow overflow-y-auto w-full p-margin md:p-margin p-md">
      <div className="max-w-max-width mx-auto">
      {/*Header*/}
      <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
      <div>
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Application History</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Review and track the status of your submitted applications.</p>
      </div>
      <div className="flex gap-md">
      <button className="px-md py-sm bg-white border border-outline-variant rounded font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-sm">
      <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                          </button>
      <button className="px-md py-sm bg-primary-container text-white rounded font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-sm">
      <span className="material-symbols-outlined text-[18px]">add</span> New Application
                          </button>
      </div>
      </header>
      {/*Table Container*/}
      <div className="bg-white border border-outline-variant rounded">
      <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant">
      <th className="p-md font-medium">Company / Institution</th>
      <th className="p-md font-medium">Role / Program</th>
      <th className="p-md font-medium">Date Applied</th>
      <th className="p-md font-medium">Status</th>
      <th className="p-md font-medium text-right">Actions</th>
      </tr>
      </thead>
      <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
      {/*Row 1*/}
      <tr className="hover:bg-surface-container-lowest transition-colors">
      <td className="p-md">
      <div className="font-medium text-primary">Zurich Institute of Technology</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Department of Materials Science</div>
      </td>
      <td className="p-md">
      <div>Graduate Research Assistant</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Photovoltaics Project</div>
      </td>
      <td className="p-md text-on-surface-variant">Oct 12, 2024</td>
      <td className="p-md">
      <span className="font-label-md text-label-md">Under Review</span>
      </td>
      <td className="p-md text-right">
      <button className="text-primary hover:text-primary-container transition-colors p-sm">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </td>
      </tr>
      {/*Row 2*/}
      <tr className="hover:bg-surface-container-lowest transition-colors">
      <td className="p-md">
      <div className="font-medium text-primary">NextGen Energy Corp</div>
      <div className="text-on-surface-variant text-xs mt-0.5">R&amp;D Division</div>
      </td>
      <td className="p-md">
      <div>Summer Internship - Engineering</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Req ID: 88291</div>
      </td>
      <td className="p-md text-on-surface-variant">Oct 05, 2024</td>
      <td className="p-md">
      <span className="font-label-md text-label-md">Interview</span>
      </td>
      <td className="p-md text-right">
      <button className="text-primary hover:text-primary-container transition-colors p-sm">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </td>
      </tr>
      {/*Row 3*/}
      <tr className="hover:bg-surface-container-lowest transition-colors">
      <td className="p-md">
      <div className="font-medium text-primary">Global Health Initiative</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Data Analytics Team</div>
      </td>
      <td className="p-md">
      <div>Data Analyst (Contract)</div>
      <div className="text-on-surface-variant text-xs mt-0.5">6-month term</div>
      </td>
      <td className="p-md text-on-surface-variant">Sep 28, 2024</td>
      <td className="p-md">
      <span className="font-label-md text-label-md">Applied</span>
      </td>
      <td className="p-md text-right">
      <button className="text-primary hover:text-primary-container transition-colors p-sm">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </td>
      </tr>
      {/*Row 4*/}
      <tr className="hover:bg-surface-container-lowest transition-colors">
      <td className="p-md">
      <div className="font-medium text-primary">BioTech Innovations Ltd</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Lab Operations</div>
      </td>
      <td className="p-md">
      <div>Junior Lab Technician</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Full-time</div>
      </td>
      <td className="p-md text-on-surface-variant">Sep 15, 2024</td>
      <td className="p-md">
      <span className="font-label-md text-label-md">Shortlisted</span>
      </td>
      <td className="p-md text-right">
      <button className="text-primary hover:text-primary-container transition-colors p-sm">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </td>
      </tr>
      {/*Row 5*/}
      <tr className="hover:bg-surface-container-lowest transition-colors">
      <td className="p-md">
      <div className="font-medium text-primary">Acme Software Solutions</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Frontend Team</div>
      </td>
      <td className="p-md">
      <div>UI Developer</div>
      <div className="text-on-surface-variant text-xs mt-0.5">Remote</div>
      </td>
      <td className="p-md text-on-surface-variant">Aug 30, 2024</td>
      <td className="p-md">
      <span className="font-label-md text-label-md text-on-surface-variant">Closed</span>
      </td>
      <td className="p-md text-right">
      <button className="text-primary hover:text-primary-container transition-colors p-sm">
      <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      {/*Pagination Footer*/}
      <div className="flex items-center justify-between p-md border-t border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface-variant">
      <div>Showing 1 to 5 of 12 entries</div>
      <div className="flex gap-sm">
      <button className="px-sm py-xs border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>Previous</button>
      <button className="px-sm py-xs border border-outline-variant rounded hover:bg-surface-container-low transition-colors">Next</button>
      </div>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
