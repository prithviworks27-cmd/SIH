// Recommended hands-on projects, keyed by skill name — shown on the Learning
// page alongside courses so closing a skill gap isn't just passive content.
// Falls back to a generic project brief for any skill without one authored.
export const PROJECTS_BY_SKILL = {
  "Power BI": { title: "Dashboard Building Project", description: "Build an interactive sales dashboard from a raw CSV dataset." },
  Statistics: { title: "A/B Test Analysis", description: "Analyze a real experiment dataset and report statistically significant findings." },
  Excel: { title: "Budget Tracker Workbook", description: "Build a formula-driven budget tracker with pivot tables and charts." },
  "Python Programming": { title: "Data Cleaning Pipeline", description: "Write a script that cleans and validates a messy real-world dataset." },
  "SQL / Databases": { title: "Sales Reporting Queries", description: "Write joins and aggregations to answer real business questions." },
  "Machine Learning": { title: "Customer Churn Prediction", description: "Train and evaluate a churn-prediction model on sample customer data." },
  "Cloud Computing (AWS)": { title: "Deploy a Serverless API", description: "Ship a small API on AWS Lambda with a CI/CD pipeline." },
  React: { title: "Personal Portfolio Site", description: "Build and deploy a responsive portfolio site using React." },
  JavaScript: { title: "Interactive To-Do App", description: "Build a to-do app with local persistence and no framework." },
};

const GENERIC_PROJECT = { title: "Applied Mini-Project", description: "A hands-on project to practice this skill in a realistic scenario." };

export function projectForSkill(skillName) {
  return PROJECTS_BY_SKILL[skillName] ?? GENERIC_PROJECT;
}
