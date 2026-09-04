// Module sequences keyed by skill name, used to build a learning path for
// each of the student's real skill gaps (see learningPathsService.js).
// Falls back to a generic 3-module sequence for any skill without a
// hand-authored list.
export const MODULES_BY_SKILL = {
  "Cloud Computing (AWS)": ["AWS Fundamentals", "Compute & Storage Services", "Deploying a Production Workload", "Cost & Security Best Practices"],
  "Machine Learning": ["Supervised Learning Foundations", "Model Evaluation & Tuning", "Feature Engineering", "Deploying ML Models"],
  React: ["React Fundamentals", "Hooks & State Management", "API Integration", "Build & Deploy a React Project"],
  "SQL / Databases": ["Relational Database Design", "Joins & Aggregations", "Query Optimization", "Schema Migrations"],
  "Data Structures & Algorithms": ["Arrays, Lists & Complexity", "Trees & Graphs", "Dynamic Programming", "Mock Interview Practice"],
  JavaScript: ["JavaScript Fundamentals", "Async & Promises", "Modern ES6+ Features", "Build a Small App"],
  "Python Programming": ["Python Syntax & Data Types", "Working with Libraries", "File & Data Handling", "Build a CLI Tool"],
  "Git & Version Control": ["Git Basics", "Branching & Merging", "Collaborating via Pull Requests"],
  Communication: ["Written Communication for Tech Teams", "Presenting Technical Work", "Giving & Receiving Feedback"],
  Teamwork: ["Collaborative Workflows", "Agile Ceremonies", "Conflict Resolution Basics"],
  "Problem Solving": ["Structured Problem Breakdown", "Debugging Methodically", "Design Thinking Basics"],
  "Time Management": ["Prioritization Frameworks", "Deep Work Habits", "Avoiding Burnout"],
  "Power BI": ["Data Import & Power Query", "Data Modeling & Relationships", "DAX Measures", "Interactive Reports & Dashboards"],
  Statistics: ["Descriptive Statistics", "Probability & Distributions", "Hypothesis Testing", "Regression & Experiment Analysis"],
  Excel: ["Formulas & Functions", "Data Cleaning & Validation", "Pivot Tables & Charts", "Automation with Power Query"],
  TypeScript: ["Types & Inference", "Functions, Objects & Generics", "Narrowing & Utility Types", "TypeScript Project Configuration"],
  "Java / C++ / C#": ["Language Fundamentals", "Object-Oriented Programming", "Collections & Error Handling", "Build a Console Application"],
  "Node.js": ["Runtime & Modules", "Async Programming", "HTTP Servers & REST APIs", "Production Node.js Services"],
  "Docker / Kubernetes": ["Containers & Images", "Dockerfiles & Compose", "Kubernetes Objects", "Deployments & Service Operations"],
  "CI/CD (Jenkins, GitHub Actions)": ["Version-Controlled Workflows", "Build & Test Automation", "Pipeline Configuration", "Deployment & Release Practices"],
  "REST APIs / GraphQL": ["HTTP & API Design", "REST Resources & Security", "GraphQL Schemas & Queries", "Testing & Documenting APIs"],
  "Deep Learning / NLP": ["Neural Network Foundations", "Training & Evaluation", "Text Representation", "Build an NLP Model"],
  "Data Visualization (Tableau)": ["Connecting & Preparing Data", "Charts & Visual Encodings", "Calculated Fields & Filters", "Interactive Tableau Dashboards"],
  "Linux / Shell Scripting": ["Filesystem & Permissions", "Processes & Networking", "Shell Commands & Pipelines", "Reliable Bash Automation"],
  "Cybersecurity Basics": ["Threats & Security Principles", "Identity & Access Control", "Secure Networks & Data", "Incident Response Fundamentals"],
  "Testing / QA (Selenium, Jest)": ["Testing Principles & Test Cases", "Unit Testing with Jest", "Browser Automation with Selenium", "Continuous Quality & Reporting"],
  "Mobile Development (iOS/Android, Flutter, React Native)": ["Mobile UI & Navigation", "State & Data Management", "Platform APIs & Testing", "Build and Release a Mobile App"],
  DevOps: ["Infrastructure & Environments", "Automation & Observability", "Containers & Deployment", "Reliability & Incident Practices"],
  "Big Data (Hadoop, Spark)": ["Distributed Data Concepts", "Hadoop Storage & Processing", "Spark DataFrames", "Build a Data Pipeline"],
  Blockchain: ["Distributed Ledger Concepts", "Transactions & Consensus", "Smart Contracts", "Blockchain Application Security"],
};

const GENERIC_MODULES = ["Fundamentals", "Applied Practice", "Real-World Project"];

export function modulesForSkill(skillName) {
  return MODULES_BY_SKILL[skillName] ?? GENERIC_MODULES;
}
