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
};

const GENERIC_MODULES = ["Fundamentals", "Applied Practice", "Real-World Project"];

export function modulesForSkill(skillName) {
  return MODULES_BY_SKILL[skillName] ?? GENERIC_MODULES;
}
