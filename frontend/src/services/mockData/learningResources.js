const DEFAULT_FREE_CONTENT = {
  label: "FreeCodeCamp lessons",
  url: "https://www.freecodecamp.org/news/search/?query=",
};

const RESOURCES_BY_SKILL = {
  JavaScript: [{ label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }, { label: "FreeCodeCamp JavaScript", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" }],
  "Python Programming": [{ label: "Python Documentation", url: "https://docs.python.org/3/tutorial/" }, { label: "FreeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }],
  React: [{ label: "React Documentation", url: "https://react.dev/learn" }, { label: "FreeCodeCamp React", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/react/" }],
  "SQL / Databases": [{ label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }, { label: "SQLBolt free lessons", url: "https://sqlbolt.com/" }],
  "Data Structures & Algorithms": [{ label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" }, { label: "FreeCodeCamp Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" }],
  "Cloud Computing (AWS)": [{ label: "AWS Skill Builder", url: "https://skillbuilder.aws/" }, { label: "AWS Training free digital courses", url: "https://aws.amazon.com/training/digital/" }],
  "Machine Learning": [{ label: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" }, { label: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }],
  "Git & Version Control": [{ label: "Git Documentation", url: "https://git-scm.com/doc" }, { label: "GitHub Skills", url: "https://skills.github.com/" }],
  "Power BI": [{ label: "Microsoft Learn Power BI", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" }, { label: "Microsoft Power BI samples", url: "https://learn.microsoft.com/en-us/power-bi/create-reports/sample-datasets" }],
  Statistics: [{ label: "OpenStax Introductory Statistics", url: "https://openstax.org/details/books/introductory-statistics-2e" }, { label: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" }],
  Excel: [{ label: "Microsoft Excel Help", url: "https://support.microsoft.com/en-us/excel" }, { label: "GCFGlobal Excel tutorial", url: "https://edu.gcfglobal.org/en/excel/" }],
  TypeScript: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }, { label: "TypeScript for JavaScript Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" }],
  "Java / C++ / C#": [{ label: "Microsoft C# Guide", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" }, { label: "W3Schools Java and C++ tutorials", url: "https://www.w3schools.com/" }],
  "Node.js": [{ label: "Node.js Learn", url: "https://nodejs.org/en/learn" }, { label: "FreeCodeCamp Node.js", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" }],
  "Docker / Kubernetes": [{ label: "Docker Get Started", url: "https://docs.docker.com/get-started/" }, { label: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" }],
  "CI/CD (Jenkins, GitHub Actions)": [{ label: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" }, { label: "Jenkins User Documentation", url: "https://www.jenkins.io/doc/" }],
  "REST APIs / GraphQL": [{ label: "MDN HTTP Overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }, { label: "GraphQL Learn", url: "https://graphql.org/learn/" }],
  "Deep Learning / NLP": [{ label: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" }, { label: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course/chapter1/1" }],
  "Data Visualization (Tableau)": [{ label: "Tableau Training", url: "https://www.tableau.com/learn/training" }, { label: "Tableau Public", url: "https://public.tableau.com/app/learn" }],
  "Linux / Shell Scripting": [{ label: "Linux Documentation", url: "https://www.kernel.org/doc/html/latest/" }, { label: "Linux Journey free course", url: "https://linuxjourney.com/" }],
  "Cybersecurity Basics": [{ label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }, { label: "Cisco Introduction to Cybersecurity", url: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity" }],
  "Testing / QA (Selenium, Jest)": [{ label: "Jest Documentation", url: "https://jestjs.io/docs/getting-started" }, { label: "Selenium Documentation", url: "https://www.selenium.dev/documentation/" }],
  "Mobile Development (iOS/Android, Flutter, React Native)": [{ label: "Flutter Documentation", url: "https://docs.flutter.dev/get-started/learn-more" }, { label: "React Native Tutorial", url: "https://reactnative.dev/docs/tutorial" }],
  DevOps: [{ label: "DevOps Roadmap", url: "https://roadmap.sh/devops" }, { label: "Google SRE Books", url: "https://sre.google/books/" }],
  "Big Data (Hadoop, Spark)": [{ label: "Apache Spark Documentation", url: "https://spark.apache.org/docs/latest/" }, { label: "Hadoop Documentation", url: "https://hadoop.apache.org/docs/" }],
  Blockchain: [{ label: "Ethereum Developer Documentation", url: "https://ethereum.org/en/developers/docs/" }, { label: "Solidity Documentation", url: "https://docs.soliditylang.org/en/latest/" }],
};

export function resourcesForSkill(skillName) {
  return RESOURCES_BY_SKILL[skillName] ?? [
    { label: "Official documentation search", url: `https://www.google.com/search?q=${encodeURIComponent(`${skillName} official documentation`)}` },
    { label: DEFAULT_FREE_CONTENT.label, url: `${DEFAULT_FREE_CONTENT.url}${encodeURIComponent(skillName)}` },
  ];
}