// Mock candidate pool for the industry side. Each candidate carries a full
// skill profile in the same shape skillsService produces for a real student
// (name/category/currentScore/requiredScore/trustLevel), so the SAME
// calculateMatch() engine from matchingEngine.js scores these exactly the
// way it scores the logged-in student against an opportunity.
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
      { name: "JavaScript", currentScore: 85, requiredScore: 80 },
      { name: "React", currentScore: 82, requiredScore: 80 },
      { name: "SQL / Databases", currentScore: 75, requiredScore: 75 },
      { name: "Git & Version Control", currentScore: 88, requiredScore: 70 },
      { name: "Communication", currentScore: 80, requiredScore: 75 },
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
      { name: "Python Programming", currentScore: 90, requiredScore: 85 },
      { name: "Machine Learning", currentScore: 78, requiredScore: 75 },
      { name: "Data Structures & Algorithms", currentScore: 85, requiredScore: 85 },
      { name: "Problem Solving", currentScore: 88, requiredScore: 80 },
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
      { name: "JavaScript", currentScore: 65, requiredScore: 80 },
      { name: "React", currentScore: 55, requiredScore: 80 },
      { name: "Communication", currentScore: 85, requiredScore: 75 },
      { name: "Teamwork", currentScore: 82, requiredScore: 75 },
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
      { name: "Cloud Computing (AWS)", currentScore: 88, requiredScore: 70 },
      { name: "Git & Version Control", currentScore: 92, requiredScore: 70 },
      { name: "Problem Solving", currentScore: 90, requiredScore: 80 },
      { name: "SQL / Databases", currentScore: 80, requiredScore: 75 },
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
      { name: "SQL / Databases", currentScore: 78, requiredScore: 75 },
      { name: "Python Programming", currentScore: 72, requiredScore: 85 },
      { name: "Problem Solving", currentScore: 75, requiredScore: 80 },
    ],
  },
];
