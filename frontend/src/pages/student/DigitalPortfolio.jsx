import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DigitalPortfolio() {
  return (
    <DashboardLayout>
      {/*Top Bar / Actions*/}
      <div className="flex justify-end mb-6">
        <button className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all">
          Share Portfolio
        </button>
      </div>
      {/*Profile Header*/}
      <section className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            className="w-28 h-28 rounded-full object-cover border border-hairline"
            alt="Arjun Mehta"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtQUzCO62_lh-IZnUvoSrEzkP5BHUghJ24t3gk3f2Cv5npSv_5HZdU1Q6ypZwSTkSLyQu7wbMpbF7XhNflzGcO-UIGtzDtQYQNsE7QUBZ6QWeQXWyoViM0ymuvF-42fzBy1k-RYY3tOKRXyd0JJMXDhAD8cKWZp496PuFdgbDEGO3CnBvUm-xxLgpCDfyYDNLEIz2XVZRjnLO4lcItOD1A4M9ZqRLkMMqxGDOTAFtSxFCs3FQQ53ad"
          />
          <div>
            <h2 className="font-editorial text-3xl text-ink tracking-tight mb-1">Arjun Mehta</h2>
            <p className="text-muted mb-2">Final Year Student, Computer Science</p>
            <p className="text-charcoal max-w-2xl leading-relaxed">
              Passionate about data-driven solutions and full-stack development.
            </p>
          </div>
        </div>
      </section>
      {/*Bento Grid Layout for Sections*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*Left Column: Skills & Certifications*/}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/*Verified Skills*/}
          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Verified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "React", "Node.js", "SQL", "AWS", "Docker"].map((skill) => (
                <span key={skill} className="bg-bone text-charcoal px-2.5 py-1 rounded-md text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </section>
          {/*Certifications*/}
          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Certifications</h3>
            <ul className="flex flex-col gap-4">
              <li className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm text-ink">AWS Certified Solutions Architect</p>
                <p className="text-xs text-muted mt-0.5">Amazon Web Services • Oct 2023</p>
              </li>
              <li className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm text-ink">Machine Learning Specialization</p>
                <p className="text-xs text-muted mt-0.5">Stanford Online • Jun 2023</p>
              </li>
            </ul>
          </section>
        </div>
        {/*Right Column: Projects, Internships, Achievements*/}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/*Projects*/}
          <section>
            <h3 className="text-base font-medium text-ink mb-4">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow">
                <h4 className="text-sm font-medium text-ink mb-1">Predictive Urban Traffic Model</h4>
                <p className="text-sm text-muted mb-3 leading-relaxed">
                  Developed a machine learning model using historical data to predict traffic congestion with 85% accuracy.
                </p>
                <div className="flex gap-1.5">
                  <span className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">Python</span>
                  <span className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">Scikit-learn</span>
                </div>
              </div>
              <div className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow">
                <h4 className="text-sm font-medium text-ink mb-1">Distributed File Storage System</h4>
                <p className="text-sm text-muted mb-3 leading-relaxed">
                  Implemented a fault-tolerant distributed file system in Go, handling concurrent node failures.
                </p>
                <div className="flex gap-1.5">
                  <span className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">Go</span>
                  <span className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">Raft</span>
                </div>
              </div>
            </div>
          </section>
          {/*Internships & Achievements Grid*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*Internships*/}
            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Internships</h3>
              <ul className="flex flex-col gap-4">
                <li className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm text-ink">Software Engineering Intern</p>
                  <p className="text-xs text-muted mt-0.5">TechNova Solutions • Summer 2023</p>
                  <p className="text-xs text-charcoal mt-1.5">Optimized backend API endpoints, reducing average response time by 20%.</p>
                </li>
                <li className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm text-ink">Data Analyst Intern</p>
                  <p className="text-xs text-muted mt-0.5">Quantify Inc. • Winter 2022</p>
                </li>
              </ul>
            </section>
            {/*Achievements*/}
            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Achievements</h3>
              <ul className="flex flex-col gap-3 list-disc list-inside text-sm text-charcoal">
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
