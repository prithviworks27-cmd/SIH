// Each question maps to exactly one skill in SKILL_CATALOG (see skills.js) so
// scoring can fold answers straight back into that catalog with no extra mapping.
// Proficiency-scale options are the same 5 levels across all skill questions;
// only the copy per question changes.
const PROFICIENCY_OPTIONS = [
  { value: "not_started", label: "Not yet started", score: 0, desc: "I have not started learning or using this yet." },
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
      { id: "q-power-bi", skill: "Power BI", prompt: "Rate your proficiency with Power BI and data visualization.", options: PROFICIENCY_OPTIONS },
      { id: "q-statistics", skill: "Statistics", prompt: "How comfortable are you with statistics and data analysis?", options: PROFICIENCY_OPTIONS },
      { id: "q-excel", skill: "Excel", prompt: "Rate your proficiency with Excel and spreadsheets.", options: PROFICIENCY_OPTIONS },
      { id: "q-typescript", skill: "TypeScript", prompt: "Rate your proficiency with TypeScript.", options: PROFICIENCY_OPTIONS },
      { id: "q-java-cpp-csharp", skill: "Java / C++ / C#", prompt: "Rate your proficiency with Java, C++, or C#.", options: PROFICIENCY_OPTIONS },
      { id: "q-node", skill: "Node.js", prompt: "Rate your proficiency with Node.js.", options: PROFICIENCY_OPTIONS },
      { id: "q-docker-kubernetes", skill: "Docker / Kubernetes", prompt: "Rate your proficiency with Docker and Kubernetes.", options: PROFICIENCY_OPTIONS },
      { id: "q-cicd", skill: "CI/CD (Jenkins, GitHub Actions)", prompt: "Rate your experience with CI/CD tools such as Jenkins or GitHub Actions.", options: PROFICIENCY_OPTIONS },
      { id: "q-rest-graphql", skill: "REST APIs / GraphQL", prompt: "Rate your proficiency with REST APIs and GraphQL.", options: PROFICIENCY_OPTIONS },
      { id: "q-deep-learning-nlp", skill: "Deep Learning / NLP", prompt: "Rate your experience with deep learning and natural language processing.", options: PROFICIENCY_OPTIONS },
      { id: "q-tableau", skill: "Data Visualization (Tableau)", prompt: "Rate your proficiency with data visualization in Tableau.", options: PROFICIENCY_OPTIONS },
      { id: "q-linux-shell", skill: "Linux / Shell Scripting", prompt: "Rate your proficiency with Linux and shell scripting.", options: PROFICIENCY_OPTIONS },
      { id: "q-cybersecurity", skill: "Cybersecurity Basics", prompt: "Rate your familiarity with cybersecurity fundamentals.", options: PROFICIENCY_OPTIONS },
      { id: "q-testing-qa", skill: "Testing / QA (Selenium, Jest)", prompt: "Rate your proficiency with software testing and QA tools.", options: PROFICIENCY_OPTIONS },
      { id: "q-mobile", skill: "Mobile Development (iOS/Android, Flutter, React Native)", prompt: "Rate your experience with mobile development platforms and frameworks.", options: PROFICIENCY_OPTIONS },
      { id: "q-devops", skill: "DevOps", prompt: "Rate your proficiency with DevOps practices and tooling.", options: PROFICIENCY_OPTIONS },
      { id: "q-big-data", skill: "Big Data (Hadoop, Spark)", prompt: "Rate your experience with big data tools such as Hadoop or Spark.", options: PROFICIENCY_OPTIONS },
      { id: "q-blockchain", skill: "Blockchain", prompt: "Rate your familiarity with blockchain concepts and development.", options: PROFICIENCY_OPTIONS },
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
