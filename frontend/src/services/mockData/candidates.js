// Mock candidate pool for the industry side. Each candidate carries a full
// skill profile in the same shape skillsService produces for a real student
// (name/category/currentScore/requiredScore/trustLevel), so the SAME
// calculateMatch() engine from matchingEngine.js scores these exactly the
// way it scores the logged-in student against an opportunity. trustLevel
// values mirror TRUST_LEVELS in mockData/skills.js — the industry Candidate
// Detail view reads these directly to show recruiters what's actually
// verified vs. self-declared, not just a bare score.
export const candidates = [
  {
    id: "cand-001",
    name: "Priya Sharma",
    institution: "Zurich Institute of Technology",
    year: "3rd Year, B.Tech CSE",
    avatarInitial: "P",
    hasPriorInternship: true,
    projects: [{ title: "Recommendation Engine for E-commerce" }, { title: "Real-time Chat App" }],
    certifications: [{ title: "AWS Certified Cloud Practitioner" }],
    skills: [
      { name: "JavaScript", currentScore: 85, requiredScore: 80, trustLevel: "Assessment Verified" },
      { name: "React", currentScore: 82, requiredScore: 80, trustLevel: "Assessment Verified" },
      { name: "SQL / Databases", currentScore: 75, requiredScore: 75, trustLevel: "Assessed" },
      { name: "Git & Version Control", currentScore: 88, requiredScore: 70, trustLevel: "Project-Verified" },
      { name: "Communication", currentScore: 80, requiredScore: 75, trustLevel: "Self-Declared" },
    ],
  },
  {
    id: "cand-002",
    name: "Rohan Verma",
    institution: "Nexus Systems Institute",
    year: "4th Year, B.E. Information Technology",
    avatarInitial: "R",
    hasPriorInternship: false,
    projects: [{ title: "ML Model for Traffic Prediction" }],
    certifications: [],
    skills: [
      { name: "Python Programming", currentScore: 90, requiredScore: 85, trustLevel: "Assessment Verified" },
      { name: "Machine Learning", currentScore: 78, requiredScore: 75, trustLevel: "Assessed" },
      { name: "Data Structures & Algorithms", currentScore: 85, requiredScore: 85, trustLevel: "Project-Verified" },
      { name: "Problem Solving", currentScore: 88, requiredScore: 80, trustLevel: "Self-Declared" },
    ],
  },
  {
    id: "cand-003",
    name: "Ananya Iyer",
    institution: "Global Research Consortium",
    year: "2nd Year, B.Tech CSE",
    avatarInitial: "A",
    hasPriorInternship: false,
    projects: [{ title: "Personal Portfolio Site" }],
    certifications: [{ title: "Meta Front-End Developer Certificate" }],
    skills: [
      { name: "JavaScript", currentScore: 65, requiredScore: 80, trustLevel: "Assessed" },
      { name: "React", currentScore: 55, requiredScore: 80, trustLevel: "Self-Declared" },
      { name: "Communication", currentScore: 85, requiredScore: 75, trustLevel: "Self-Declared" },
      { name: "Teamwork", currentScore: 82, requiredScore: 75, trustLevel: "Self-Declared" },
    ],
  },
  {
    id: "cand-004",
    name: "Karan Mehta",
    institution: "Zurich Institute of Technology",
    year: "Final Year, M.S. Computer Science",
    avatarInitial: "K",
    hasPriorInternship: true,
    projects: [{ title: "Distributed Cache System" }, { title: "Cloud Cost Optimizer" }, { title: "CI/CD Pipeline Toolkit" }],
    certifications: [{ title: "AWS Certified Solutions Architect" }, { title: "Certified Kubernetes Administrator" }],
    skills: [
      { name: "Cloud Computing (AWS)", currentScore: 88, requiredScore: 70, trustLevel: "Industry-Verified" },
      { name: "Git & Version Control", currentScore: 92, requiredScore: 70, trustLevel: "Project-Verified" },
      { name: "Problem Solving", currentScore: 90, requiredScore: 80, trustLevel: "Assessment Verified" },
      { name: "SQL / Databases", currentScore: 80, requiredScore: 75, trustLevel: "Assessed" },
    ],
  },
  {
    id: "cand-005",
    name: "Sneha Reddy",
    institution: "Quantify Institute",
    year: "3rd Year, B.Tech Data Science",
    avatarInitial: "S",
    hasPriorInternship: false,
    projects: [{ title: "Public Health Dataset Dashboard" }],
    certifications: [],
    skills: [
      { name: "SQL / Databases", currentScore: 78, requiredScore: 75, trustLevel: "Assessed" },
      { name: "Python Programming", currentScore: 72, requiredScore: 85, trustLevel: "Self-Declared" },
      { name: "Problem Solving", currentScore: 75, requiredScore: 80, trustLevel: "Self-Declared" },
    ],
  },
];
