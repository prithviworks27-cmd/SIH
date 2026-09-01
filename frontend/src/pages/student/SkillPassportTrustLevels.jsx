import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SkillPassportTrustLevels() {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
      {/*TopNavBar (Mobile Only)*/}
      <header className="md:hidden bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center px-4 py-md w-full max-w-max-width mx-auto">
      <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">AcademiaLink</span>
      <button onClick={() => setSidebarOpen(true)} className="material-symbols-outlined text-on-surface">menu</button>
      </div>
      </header>
      {/*SideNavBar (Desktop)*/}
      <nav className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline h-screen w-64 fixed left-0 top-0 py-xl px-md z-40 overflow-y-auto`}>
      <button onClick={() => setSidebarOpen(false)} className="md:hidden self-end material-symbols-outlined text-on-surface-variant mb-md">close</button>
      <div className="mb-xl flex flex-col items-center">
      <img alt="User profile" className="w-24 h-24 rounded-full border border-outline-variant mb-md object-cover" data-alt="A professional headshot of a young male student, Arjun Mehta, with a clean corporate background, wearing a smart casual navy blazer. The lighting is soft and high-key, suitable for a minimalist institutional platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjUsU_N4TEXq2gsX6WkW2SvejW1ObOybb_XZaUKadiEiFa4dBxvUzIJOPuL5UQI1Yikm-bnj9-IK7IPZBaZeEJ6NG9YjjwTbwtqe0Qdy8Im-oYzdgspKsm9DmYvR6473SaoV8WYcFYfvjAu33ccJEDRi_lQTlstwHtTUFmqeIWGWD2ElCLVjfQSthHi5JzA-g_aDlEQOL2TIN4kvJ6Lby-YN5tsLJFB3W18XYKRDIQoCFyqxTKk5cP"/>
      <h2 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed text-center">Student Portal</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Academic Collaboration</p>
      </div>
      <div className="flex-grow flex flex-col gap-sm">
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/dashboard">
      <span className="material-symbols-outlined">dashboard</span>
                      Dashboard
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/skill-assessment">
      <span className="material-symbols-outlined">quiz</span>
                      Skill Assessment
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/learning-paths">
      <span className="material-symbols-outlined">school</span>
                      Learning Paths
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/internships">
      <span className="material-symbols-outlined">work</span>
                      Internships/Jobs
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/applications">
      <span className="material-symbols-outlined">description</span>
                      My Applications
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-primary dark:text-primary-fixed font-bold border-l-4 border-primary dark:border-primary-fixed bg-surface-container-high dark:bg-surface-container-highest font-label-md text-label-md scale-95 active:scale-90" to="/portfolio">
      <span className="material-symbols-outlined">account_circle</span>
                      Portfolio
                  </Link>
      <Link className="flex items-center gap-md py-3 px-4 rounded-md text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-secondary transition-all font-label-md text-label-md scale-95 active:scale-90" to="/messages">
      <span className="material-symbols-outlined">mail</span>
                      Messages
                  </Link>
      </div>
      <div className="mt-auto flex flex-col gap-sm pt-xl border-t border-outline-variant">
      <Link className="flex items-center gap-md py-2 px-4 rounded-md text-on-secondary-fixed-variant hover:bg-secondary-container transition-all font-label-md text-label-md scale-95 active:scale-90" to="/settings">
      <span className="material-symbols-outlined">settings</span>
                      Settings
                  </Link>
      <a className="flex items-center gap-md py-2 px-4 rounded-md text-on-secondary-fixed-variant hover:bg-secondary-container transition-all font-label-md text-label-md scale-95 active:scale-90" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
      <span className="material-symbols-outlined">logout</span>
                      Logout
                  </a>
      </div>
      </nav>
      {/*Main Content Canvas*/}
      <main className="flex-grow md:ml-64 p-4 md:p-margin max-w-[1400px] w-full mx-auto pb-32 md:pb-margin">
      {/*Header Section*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-lg">
      <div>
      <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Arjun Mehta</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">Computer Science, M.S. • Skill Passport / Digital Portfolio</p>
      </div>
      <button
        onClick={() => setShareModalOpen(true)}
        className="bg-primary-container text-on-primary border-none py-2 px-4 rounded font-label-md text-label-md flex items-center gap-2 hover:bg-primary transition-colors cursor-pointer"
      >
      <span className="material-symbols-outlined">share</span>
                      Share Portfolio
                  </button>
      </div>
      {/*Bento Grid Layout*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
      {/*Left Column (Verified Skills)*/}
      <div className="lg:col-span-4 flex flex-col gap-lg">
      <div className="card-container p-lg flex flex-col h-full">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
      <span className="material-symbols-outlined">verified</span>
                              Verified Skills
                          </h2>
      <div className="flex flex-col gap-md">
      <div className="flex justify-between items-center py-2 border-b border-outline-variant">
      <span className="font-body-md text-body-md font-medium text-on-surface">Python</span>
      <span className="trust-label">Assessment-verified</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-outline-variant">
      <span className="font-body-md text-body-md font-medium text-on-surface">React</span>
      <span className="trust-label">Faculty-verified</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-outline-variant">
      <span className="font-body-md text-body-md font-medium text-on-surface">Node.js</span>
      <span className="trust-label">Assessment-verified</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-outline-variant">
      <span className="font-body-md text-body-md font-medium text-on-surface">Machine Learning</span>
      <span className="trust-label">Industry-verified</span>
      </div>
      <div className="flex justify-between items-center py-2">
      <span className="font-body-md text-body-md font-medium text-on-surface">Data Structures</span>
      <span className="trust-label">Assessment-verified</span>
      </div>
      </div>
      </div>
      </div>
      {/*Right Column (Projects & Certs)*/}
      <div className="lg:col-span-8 flex flex-col gap-lg">
      {/*Projects*/}
      <div className="card-container p-lg">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
      <span className="material-symbols-outlined">work</span>
                              Projects
                          </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="border border-outline-variant rounded-DEFAULT p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
      <h3 className="font-label-md text-label-md text-on-surface">Predictive Analytics Engine</h3>
      <span className="trust-label">Industry-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow">Developed a scalable machine learning pipeline for analyzing real-time financial data streams in collaboration with FinTech Corp.</p>
      <div className="flex gap-2 mt-auto">
      <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">Python</span>
      <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">AWS</span>
      </div>
      </div>
      <div className="border border-outline-variant rounded-DEFAULT p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
      <h3 className="font-label-md text-label-md text-on-surface">University Registration Portal</h3>
      <span className="trust-label">Faculty-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow">Led the frontend redesign of the student registration system, improving accessibility and reducing load times by 40%.</p>
      <div className="flex gap-2 mt-auto">
      <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">React</span>
      <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">Node.js</span>
      </div>
      </div>
      </div>
      </div>
      {/*Certifications*/}
      <div className="card-container p-lg">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
      <span className="material-symbols-outlined">workspace_premium</span>
                              Certifications &amp; Credentials
                          </h2>
      <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4 border border-outline-variant p-4 rounded-DEFAULT">
      <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded border border-outline-variant shrink-0">
      <span className="material-symbols-outlined text-secondary">cloud</span>
      </div>
      <div className="flex-grow">
      <div className="flex justify-between items-center mb-1">
      <h3 className="font-label-md text-label-md text-on-surface">AWS Certified Solutions Architect</h3>
      <span className="trust-label">Credential Issued</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Amazon Web Services (AWS) • Issued Jan 2024</p>
      </div>
      </div>
      <div className="flex items-start gap-4 border border-outline-variant p-4 rounded-DEFAULT">
      <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded border border-outline-variant shrink-0">
      <span className="material-symbols-outlined text-secondary">database</span>
      </div>
      <div className="flex-grow">
      <div className="flex justify-between items-center mb-1">
      <h3 className="font-label-md text-label-md text-on-surface">Advanced Data Structures Assessment</h3>
      <span className="trust-label">Assessment-verified</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">AcademiaLink Technical Assessments • Top 5% Percentile</p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>
      {/*Inline Share Modal/Overlay*/}
      <div className={`${shareModalOpen ? "flex" : "hidden"} fixed inset-0 bg-[#1A1A1A]/20 z-50 items-center justify-center p-4`}>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg max-w-sm w-full relative">
      <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
      <span className="material-symbols-outlined">close</span>
      </button>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md text-center">Share Skill Passport</h3>
      <div className="border border-outline-variant p-4 rounded flex flex-col items-center justify-center mb-md bg-surface-container-low">
      <img alt="QR Code" className="w-48 h-48 mb-4 object-contain" data-alt="A clean, minimalist high-contrast QR code generated in sharp black and white, suitable for scanning on a modern institutional digital platform interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2sL6A45HFCK8-eI2mGXwpY8iXOIFc6mAA4kEowqMnY19qa_3TLlat5BHrKjaWkeheWKyvEvlZJ-_cTlGjj2ZklEvVebpSfspxn3lRPDmaY6WMqDM0N7c6xsebf2hK1JrvF6MK3Qdn7kZKQ-w3WJhz9Z-gMjpsp41_HOp06lBEgzwpuShsHr8oPyF13n0YkLTg8RXoHsmw5x6VLX1sPWw6y3DvCqsmilsIvTcjv6W4BeqCmDmQoxjK"/>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Scan to view verified portfolio</p>
      </div>
      <div className="flex gap-2">
      <input className="flex-grow border border-outline-variant bg-surface-container-lowest rounded-DEFAULT px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary-container" readOnly type="text" defaultValue="https://academialink.edu/passport/amehta"/>
      <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-DEFAULT font-label-md text-label-md hover:bg-surface-container-low transition-colors">Copy</button>
      </div>
      </div>
      </div>
      {/*Footer*/}
      <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline w-full py-xl px-margin flex flex-col md:flex-row justify-between items-center gap-md md:ml-64 md:w-[calc(100%-256px)] z-30">
      <div className="font-label-md text-label-md font-bold text-primary dark:text-primary-fixed">
                  AcademiaLink
              </div>
      <div className="text-secondary dark:text-secondary-fixed font-body-sm text-body-sm text-center md:text-left">
                  © 2024 AcademiaLink Collaboration Portal. All rights reserved.
              </div>
      <div className="flex gap-4">
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">Privacy Policy</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">Terms of Service</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">Contact Us</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">Help Center</a>
      </div>
      </footer>
    </div>
  );
}
