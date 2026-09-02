import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DigitalPortfolio() {
  return (
    <DashboardLayout>
      {/*Top Bar / Actions*/}
      <div className="flex justify-end mb-lg">
      <button className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:opacity-90 transition-opacity">Share Portfolio</button>
      </div>
      {/*Profile Header*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg mb-lg">
      <div className="flex flex-col md:flex-row gap-lg items-start md:items-center">
      <img className="w-32 h-32 rounded-full object-cover border border-outline-variant" data-alt="A professional headshot of a young male computer science student in a clean, modern, well-lit studio environment. The lighting is high-key and bright, reflecting a professional and academic tone. The student wears a simple, dark navy shirt against a pure white background, embodying a minimalist, corporate modern aesthetic without any distracting shadows or gradients." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtQUzCO62_lh-IZnUvoSrEzkP5BHUghJ24t3gk3f2Cv5npSv_5HZdU1Q6ypZwSTkSLyQu7wbMpbF7XhNflzGcO-UIGtzDtQYQNsE7QUBZ6QWeQXWyoViM0ymuvF-42fzBy1k-RYY3tOKRXyd0JJMXDhAD8cKWZp496PuFdgbDEGO3CnBvUm-xxLgpCDfyYDNLEIz2XVZRjnLO4lcItOD1A4M9ZqRLkMMqxGDOTAFtSxFCs3FQQ53ad"/>
      <div>
      <h2 className="font-display-lg text-display-lg text-primary mb-xs">Arjun Mehta</h2>
      <p className="font-headline-md text-headline-md text-on-surface-variant mb-sm">Final Year Student, Computer Science</p>
      <p className="font-body-md text-body-md text-on-surface max-w-2xl">Passionate about data-driven solutions and full-stack development.</p>
      </div>
      </div>
      </section>
      {/*Bento Grid Layout for Sections*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      {/*Left Column: Skills & Certifications*/}
      <div className="lg:col-span-1 flex flex-col gap-lg">
      {/*Verified Skills*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-xs">Verified Skills</h3>
      <div className="flex flex-wrap gap-sm">
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Python</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">React</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Node.js</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">SQL</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">AWS</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Docker</span>
      </div>
      </section>
      {/*Certifications*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-xs">Certifications</h3>
      <ul className="flex flex-col gap-md">
      <li className="border-b border-outline-variant pb-md last:border-b-0 last:pb-0">
      <p className="font-label-md text-label-md text-on-surface">AWS Certified Solutions Architect</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Amazon Web Services • Oct 2023</p>
      </li>
      <li className="border-b border-outline-variant pb-md last:border-b-0 last:pb-0">
      <p className="font-label-md text-label-md text-on-surface">Machine Learning Specialization</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Stanford Online • Jun 2023</p>
      </li>
      </ul>
      </section>
      </div>
      {/*Right Column: Projects, Internships, Achievements*/}
      <div className="lg:col-span-2 flex flex-col gap-lg">
      {/*Projects*/}
      <section>
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md hover:bg-surface-bright transition-colors">
      <h4 className="font-label-md text-label-md text-on-surface mb-xs">Predictive Urban Traffic Model</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Developed a machine learning model using historical data to predict traffic congestion with 85% accuracy.</p>
      <div className="flex gap-xs">
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Python</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Scikit-learn</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md hover:bg-surface-bright transition-colors">
      <h4 className="font-label-md text-label-md text-on-surface mb-xs">Distributed File Storage System</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Implemented a fault-tolerant distributed file system in Go, handling concurrent node failures.</p>
      <div className="flex gap-xs">
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Go</span>
      <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-sm text-label-sm border border-outline-variant">Raft</span>
      </div>
      </div>
      </div>
      </section>
      {/*Internships & Achievements Grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      {/*Internships*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-xs">Internships</h3>
      <ul className="flex flex-col gap-md">
      <li className="border-b border-outline-variant pb-md last:border-b-0 last:pb-0">
      <p className="font-label-md text-label-md text-on-surface">Software Engineering Intern</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">TechNova Solutions • Summer 2023</p>
      <p className="font-body-sm text-body-sm text-on-surface mt-xs">Optimized backend API endpoints, reducing average response time by 20%.</p>
      </li>
      <li className="border-b border-outline-variant pb-md last:border-b-0 last:pb-0">
      <p className="font-label-md text-label-md text-on-surface">Data Analyst Intern</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Quantify Inc. • Winter 2022</p>
      </li>
      </ul>
      </section>
      {/*Achievements*/}
      <section className="bg-surface-container-lowest border border-outline-variant rounded p-lg">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-xs">Achievements</h3>
      <ul className="flex flex-col gap-md list-disc list-inside font-body-sm text-body-sm text-on-surface">
      <li>1st Place - University Hackathon 2023</li>
      <li>Dean's List for Academic Excellence (6 consecutive semesters)</li>
      <li>Published paper in IEEE Student Conference on AI applications.</li>
      </ul>
      </section>
      </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
