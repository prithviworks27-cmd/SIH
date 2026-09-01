export default function RecommendedLearningPaths() {
  return (
    <div className="flex min-h-screen bg-background">
      {/*SideNavBar*/}
      <nav className="hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant w-64 fixed left-0 top-0 h-screen py-xl px-md z-10">
      <div className="mb-xl px-md flex items-center gap-md">
      <img className="w-10 h-10 object-contain" data-alt="A minimalist line-art logo representing an academic building or open book, rendered in dark navy blue (#1B365D) on a pristine white background. The style is strictly corporate, clean, and highly legible, suitable for an institutional portal." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh5PvWk98kWxQx47QgV1PlkZhoafKGHqyzokX_5cmY1qe7eaE2bp5y1k0Y8kbt355l9FEiLa9Kl2EYDOtDI0rBtIY4VzuWaBqTcOXcpu8LR08MS-SxUkqlwin2l-cQpEQnoixLwAqpLEkstzDC3Ykbhp21GAIt8E-b4vUe0kngVPlEqWoyIYjjhD93FgX77So75N7MUJ46t658tOuhnP-0UVR5YrPV1qVucAjIMBy84qd2ee7nfv5b"/>
      <div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      </div>
      <div className="flex flex-col gap-sm flex-grow">
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
      <span className="font-label-md text-label-md">Dashboard</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="quiz">quiz</span>
      <span className="font-label-md text-label-md">Skill Assessment</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-primary font-bold border-l-4 border-primary bg-surface-container-high scale-95 transition-transform" href="#">
      <span className="material-symbols-outlined" data-icon="school">school</span>
      <span className="font-label-md text-label-md">Learning Paths</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="work">work</span>
      <span className="font-label-md text-label-md">Internships/Jobs</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="description">description</span>
      <span className="font-label-md text-label-md">My Applications</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
      <span className="font-label-md text-label-md">Portfolio</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
      <span className="font-label-md text-label-md">Messages</span>
      </a>
      </div>
      <div className="mt-auto flex flex-col gap-sm border-t border-outline-variant pt-md">
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="settings">settings</span>
      <span className="font-label-md text-label-md">Settings</span>
      </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all" href="#">
      <span className="material-symbols-outlined" data-icon="logout">logout</span>
      <span className="font-label-md text-label-md">Logout</span>
      </a>
      </div>
      </nav>
      {/*Main Content*/}
      <main className="flex-grow md:ml-64 p-margin">
      <header className="mb-xl">
      <h2 className="font-display-lg text-display-lg text-primary mb-sm">Recommended Learning Paths</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Curated sequences of academic modules and practical assessments designed to bridge knowledge gaps for industry placement.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
      {/*Card 1*/}
      <article className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col h-full">
      <div className="p-lg flex-grow">
      <div className="flex justify-between items-start mb-md">
      <h3 className="font-headline-md text-headline-md text-primary">Advanced Materials Characterization</h3>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-secondary-container">12 Weeks</span>
      </div>
      <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Required Modules</h4>
      <ul className="flex flex-col gap-sm mb-lg border-t border-outline-variant pt-sm">
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Principles of Electron Microscopy</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Spectroscopic Analysis Techniques</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Data Interpretation &amp; Modeling</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Industrial Application Lab</span>
      </li>
      </ul>
      </div>
      <div className="p-lg border-t border-outline-variant mt-auto bg-surface">
      <button className="w-full bg-primary-container text-on-primary rounded font-label-md text-label-md py-sm transition-colors hover:bg-primary">View Path Details</button>
      </div>
      </article>
      {/*Card 2*/}
      <article className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col h-full">
      <div className="p-lg flex-grow">
      <div className="flex justify-between items-start mb-md">
      <h3 className="font-headline-md text-headline-md text-primary">Quantitative Financial Analysis</h3>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-secondary-container">8 Weeks</span>
      </div>
      <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Required Modules</h4>
      <ul className="flex flex-col gap-sm mb-lg border-t border-outline-variant pt-sm">
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Stochastic Calculus Foundations</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Algorithmic Trading Strategies</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Risk Modeling Frameworks</span>
      </li>
      </ul>
      </div>
      <div className="p-lg border-t border-outline-variant mt-auto bg-surface">
      <button className="w-full bg-primary-container text-on-primary rounded font-label-md text-label-md py-sm transition-colors hover:bg-primary">View Path Details</button>
      </div>
      </article>
      {/*Card 3*/}
      <article className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col h-full">
      <div className="p-lg flex-grow">
      <div className="flex justify-between items-start mb-md">
      <h3 className="font-headline-md text-headline-md text-primary">Sustainable Urban Infrastructure</h3>
      <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-secondary-container">16 Weeks</span>
      </div>
      <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Required Modules</h4>
      <ul className="flex flex-col gap-sm mb-lg border-t border-outline-variant pt-sm">
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Smart Grid Integration</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Eco-Materials Engineering</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Policy &amp; Urban Planning</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Life Cycle Assessment (LCA)</span>
      </li>
      <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
      <span className="font-body-md text-body-md text-on-surface">Capstone: City Proposal</span>
      </li>
      </ul>
      </div>
      <div className="p-lg border-t border-outline-variant mt-auto bg-surface">
      <button className="w-full bg-primary-container text-on-primary rounded font-label-md text-label-md py-sm transition-colors hover:bg-primary">View Path Details</button>
      </div>
      </article>
      </div>
      </main>
    </div>
  );
}
