// Demo portfolio content (about/projects/certifications/internships/achievements).
// Skills are intentionally NOT duplicated here — the portfolio page reads the
// student's real skill profile from skillsService instead, so trust levels
// stay consistent with the assessment (see Step 2).
export const DEFAULT_PORTFOLIO = {
  headline: "Final Year Student, Computer Science",
  bio: "Passionate about data-driven solutions and full-stack development.",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAtQUzCO62_lh-IZnUvoSrEzkP5BHUghJ24t3gk3f2Cv5npSv_5HZdU1Q6ypZwSTkSLyQu7wbMpbF7XhNflzGcO-UIGtzDtQYQNsE7QUBZ6QWeQXWyoViM0ymuvF-42fzBy1k-RYY3tOKRXyd0JJMXDhAD8cKWZp496PuFdgbDEGO3CnBvUm-xxLgpCDfyYDNLEIz2XVZRjnLO4lcItOD1A4M9ZqRLkMMqxGDOTAFtSxFCs3FQQ53ad",
  institution: "Zurich Institute of Technology",
  expectedGraduation: "2026-05",
  projects: [
    {
      id: "proj-001",
      title: "Predictive Urban Traffic Model",
      description: "Developed a machine learning model using historical data to predict traffic congestion with 85% accuracy.",
      skills: ["Python Programming", "Machine Learning"],
      trustLevel: "Project-Verified",
    },
    {
      id: "proj-002",
      title: "Distributed File Storage System",
      description: "Implemented a fault-tolerant distributed file system, handling concurrent node failures with a Raft-based consensus layer.",
      skills: ["Problem Solving", "Git & Version Control"],
      trustLevel: "Project-Verified",
    },
  ],
  certifications: [
    { id: "cert-001", title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2026-01", relatedSkill: "Cloud Computing (AWS)" },
    { id: "cert-002", title: "Machine Learning Specialization", issuer: "Stanford Online", date: "2025-06", relatedSkill: "Machine Learning" },
  ],
  internships: [
    {
      id: "intern-001",
      role: "Software Engineering Intern",
      company: "TechNova Solutions",
      period: "Summer 2025",
      note: "Optimized backend API endpoints, reducing average response time by 20%.",
    },
    {
      id: "intern-002",
      role: "Data Analyst Intern",
      company: "Quantify Inc.",
      period: "Winter 2024",
      note: "",
    },
  ],
  achievements: [
    "1st Place — University Hackathon 2026",
    "Dean's List for Academic Excellence (6 consecutive semesters)",
    "Published paper in IEEE Student Conference on AI applications.",
  ],
};
