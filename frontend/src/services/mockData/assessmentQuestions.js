// Each question maps to exactly one skill in SKILL_CATALOG (see skills.js) so
// scoring can fold answers straight back into that catalog with no extra mapping.
// Proficiency-scale options are the same 4 levels across all skill questions;
// only the copy per question changes.
const PROFICIENCY_OPTIONS = [
  { value: "beginner", label: "Beginner", score: 25, desc: "Basic understanding, still learning fundamentals." },
  { value: "intermediate", label: "Intermediate", score: 55, desc: "Comfortable with everyday use, some gaps remain." },
  { value: "advanced", label: "Advanced", score: 80, desc: "Confident and productive without much guidance." },
  { value: "expert", label: "Expert", score: 95, desc: "Deep expertise, could mentor others on this." },
];

export const ASSESSMENT_SECTIONS = [
  {
    section: "Technical Skills",
    questions: [
      { id: "q-js", skill: "JavaScript", prompt: "How comfortable are you with JavaScript?", options: PROFICIENCY_OPTIONS },
      { id: "q-python", skill: "Python Programming", prompt: "Rate your proficiency in Python programming.", options: PROFICIENCY_OPTIONS },
      { id: "q-react", skill: "React", prompt: "How would you rate your React skills?", options: PROFICIENCY_OPTIONS },
      { id: "q-sql", skill: "SQL / Databases", prompt: "Rate your proficiency in SQL and database management.", options: PROFICIENCY_OPTIONS },
      { id: "q-dsa", skill: "Data Structures & Algorithms", prompt: "How confident are you solving DSA problems?", options: PROFICIENCY_OPTIONS },
      { id: "q-cloud", skill: "Cloud Computing (AWS)", prompt: "Rate your experience with cloud platforms (e.g. AWS).", options: PROFICIENCY_OPTIONS },
      { id: "q-ml", skill: "Machine Learning", prompt: "How comfortable are you with machine learning concepts?", options: PROFICIENCY_OPTIONS },
      { id: "q-git", skill: "Git & Version Control", prompt: "Rate your comfort with Git and version control.", options: PROFICIENCY_OPTIONS },
    ],
  },
  {
    section: "Soft Skills",
    questions: [
      { id: "q-comm", skill: "Communication", prompt: "How would you rate your communication skills?", options: PROFICIENCY_OPTIONS },
      { id: "q-team", skill: "Teamwork", prompt: "How effectively do you work in a team?", options: PROFICIENCY_OPTIONS },
      { id: "q-problem", skill: "Problem Solving", prompt: "Rate your problem-solving ability.", options: PROFICIENCY_OPTIONS },
      { id: "q-time", skill: "Time Management", prompt: "How well do you manage your time and deadlines?", options: PROFICIENCY_OPTIONS },
    ],
  },
];

// Flat list is what the assessment flow actually steps through;
// sections exist only for grouping/progress labels.
export const ASSESSMENT_QUESTIONS = ASSESSMENT_SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, section: s.section }))
);
