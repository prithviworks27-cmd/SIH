// Career role catalog for Step 3 (target-role skill gaps) and Step 4 (Career
// Path readiness + roadmap) — both read from this single list so a role's
// required skills are defined once. Skill names must match SKILL_CATALOG
// entries in skills.js (see careerRoleService.js's calculateMatch() call),
// same convention internships.js already documents for job postings.
//
// requiredScore per skill is optional; when omitted the role just needs the
// skill to exist at any tested level to count as "have it" (calculateMatch's
// own >=50 threshold decides matched vs missing).
export const CAREER_ROLES = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & Analytics",
    description: "Turns raw data into decisions — queries, dashboards, and statistical analysis for stakeholders.",
    requiredSkills: ["Python Programming", "SQL / Databases", "Power BI", "Statistics", "Excel"],
    roadmap: [
      "Current Skills",
      "Learn Power BI",
      "Improve Statistics",
      "Complete Project",
      "Re-assessment",
      "Internship",
      "Data Analyst",
    ],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Software Engineering",
    description: "Builds user-facing web interfaces — component architecture, state, and responsive design.",
    requiredSkills: ["JavaScript", "React", "Git & Version Control", "Problem Solving"],
    roadmap: [
      "Current Skills",
      "Master React Patterns",
      "Build Portfolio Project",
      "Complete Project",
      "Re-assessment",
      "Internship",
      "Frontend Developer",
    ],
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    category: "Infrastructure",
    description: "Provisions and operates cloud infrastructure — deployment pipelines, scaling, reliability.",
    requiredSkills: ["Cloud Computing (AWS)", "Git & Version Control", "Problem Solving", "Python Programming"],
    roadmap: [
      "Current Skills",
      "Learn Cloud Fundamentals",
      "Hands-on AWS Labs",
      "Complete Project",
      "Re-assessment",
      "Internship",
      "Cloud Engineer",
    ],
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "Data & Analytics",
    description: "Designs and ships ML models — from data pipelines to production model evaluation.",
    requiredSkills: ["Python Programming", "Machine Learning", "Data Structures & Algorithms", "Statistics"],
    roadmap: [
      "Current Skills",
      "Strengthen Statistics",
      "Build ML Project",
      "Complete Project",
      "Re-assessment",
      "Internship",
      "ML Engineer",
    ],
  },
];

export function getCareerRoleById(id) {
  return CAREER_ROLES.find((r) => r.id === id);
}
