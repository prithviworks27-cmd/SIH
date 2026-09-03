// Skill Tests: per-skill, pass/fail MCQ exams — distinct from the self-rating
// survey in assessmentQuestions.js. Each question has ONE correct answer and
// scoring is objective (correct / total), not self-reported comfort level.
//
// passingScore is kept on the skill test definition (not hardcoded in the UI
// or scoring logic) so the threshold can be tuned per skill without touching
// component code — see skillTestService.js's scoreSkillTest().

export const SKILL_TESTS = [
  {
    id: "python",
    skillName: "Python Programming",
    title: "Python",
    category: "Technical Skill",
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "py-1",
        prompt: "Which data structure stores key-value pairs?",
        options: [
          { value: "a", label: "List" },
          { value: "b", label: "Tuple" },
          { value: "c", label: "Dictionary" },
          { value: "d", label: "Set" },
        ],
        correctValue: "c",
      },
      {
        id: "py-2",
        prompt: "What does the len() function return for a string?",
        options: [
          { value: "a", label: "The memory address of the string" },
          { value: "b", label: "The number of characters in the string" },
          { value: "c", label: "The data type of the string" },
          { value: "d", label: "The last character of the string" },
        ],
        correctValue: "b",
      },
      {
        id: "py-3",
        prompt: "Which keyword is used to define a function in Python?",
        options: [
          { value: "a", label: "function" },
          { value: "b", label: "func" },
          { value: "c", label: "def" },
          { value: "d", label: "lambda" },
        ],
        correctValue: "c",
      },
      {
        id: "py-4",
        prompt: "What is the output of 3 // 2 in Python?",
        options: [
          { value: "a", label: "1.5" },
          { value: "b", label: "1" },
          { value: "c", label: "2" },
          { value: "d", label: "Error" },
        ],
        correctValue: "b",
      },
      {
        id: "py-5",
        prompt: "Which of these is a mutable data type?",
        options: [
          { value: "a", label: "Tuple" },
          { value: "b", label: "String" },
          { value: "c", label: "List" },
          { value: "d", label: "Integer" },
        ],
        correctValue: "c",
      },
      {
        id: "py-6",
        prompt: "What does the 'self' keyword refer to inside a class method?",
        options: [
          { value: "a", label: "The class itself" },
          { value: "b", label: "The current instance of the class" },
          { value: "c", label: "A global variable" },
          { value: "d", label: "The parent class" },
        ],
        correctValue: "b",
      },
      {
        id: "py-7",
        prompt: "Which module is used for regular expressions in Python?",
        options: [
          { value: "a", label: "regex" },
          { value: "b", label: "re" },
          { value: "c", label: "pyregex" },
          { value: "d", label: "string" },
        ],
        correctValue: "b",
      },
      {
        id: "py-8",
        prompt: "How do you handle exceptions in Python?",
        options: [
          { value: "a", label: "try / catch" },
          { value: "b", label: "try / except" },
          { value: "c", label: "catch / throw" },
          { value: "d", label: "error / handle" },
        ],
        correctValue: "b",
      },
      {
        id: "py-9",
        prompt: "What does 'list comprehension' let you do?",
        options: [
          { value: "a", label: "Sort a list in place" },
          { value: "b", label: "Build a new list concisely from an iterable" },
          { value: "c", label: "Convert a list to a dictionary" },
          { value: "d", label: "Delete duplicate values automatically" },
        ],
        correctValue: "b",
      },
      {
        id: "py-10",
        prompt: "Which of these correctly imports the 'pandas' library as 'pd'?",
        options: [
          { value: "a", label: "import pandas as pd" },
          { value: "b", label: "include pandas as pd" },
          { value: "c", label: "using pandas as pd" },
          { value: "d", label: "require pandas as pd" },
        ],
        correctValue: "a",
      },
    ],
  },
  {
    id: "sql",
    skillName: "SQL / Databases",
    title: "SQL",
    category: "Technical Skill",
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: "sql-1",
        prompt: "Which SQL statement is used to extract data from a database?",
        options: [
          { value: "a", label: "GET" },
          { value: "b", label: "SELECT" },
          { value: "c", label: "OPEN" },
          { value: "d", label: "EXTRACT" },
        ],
        correctValue: "b",
      },
      {
        id: "sql-2",
        prompt: "Which clause is used to filter rows in a SELECT query?",
        options: [
          { value: "a", label: "WHERE" },
          { value: "b", label: "FILTER" },
          { value: "c", label: "HAVING" },
          { value: "d", label: "LIMIT" },
        ],
        correctValue: "a",
      },
      {
        id: "sql-3",
        prompt: "Which JOIN returns only matching rows from both tables?",
        options: [
          { value: "a", label: "LEFT JOIN" },
          { value: "b", label: "RIGHT JOIN" },
          { value: "c", label: "INNER JOIN" },
          { value: "d", label: "FULL OUTER JOIN" },
        ],
        correctValue: "c",
      },
      {
        id: "sql-4",
        prompt: "Which keyword removes duplicate rows from a result set?",
        options: [
          { value: "a", label: "UNIQUE" },
          { value: "b", label: "DISTINCT" },
          { value: "c", label: "FILTER" },
          { value: "d", label: "NODUPE" },
        ],
        correctValue: "b",
      },
      {
        id: "sql-5",
        prompt: "Which statement is used to add new rows to a table?",
        options: [
          { value: "a", label: "INSERT INTO" },
          { value: "b", label: "ADD ROW" },
          { value: "c", label: "CREATE ROW" },
          { value: "d", label: "APPEND TO" },
        ],
        correctValue: "a",
      },
      {
        id: "sql-6",
        prompt: "What does a PRIMARY KEY constraint guarantee?",
        options: [
          { value: "a", label: "The column allows NULLs" },
          { value: "b", label: "The column values are unique and not null" },
          { value: "c", label: "The column is indexed for full-text search" },
          { value: "d", label: "The column auto-increments" },
        ],
        correctValue: "b",
      },
      {
        id: "sql-7",
        prompt: "Which clause groups rows sharing a value into summary rows?",
        options: [
          { value: "a", label: "GROUP BY" },
          { value: "b", label: "ORDER BY" },
          { value: "c", label: "PARTITION" },
          { value: "d", label: "COLLECT BY" },
        ],
        correctValue: "a",
      },
      {
        id: "sql-8",
        prompt: "Which function returns the number of rows matching a query?",
        options: [
          { value: "a", label: "SUM()" },
          { value: "b", label: "COUNT()" },
          { value: "c", label: "TOTAL()" },
          { value: "d", label: "ROWS()" },
        ],
        correctValue: "b",
      },
      {
        id: "sql-9",
        prompt: "Which statement permanently removes a table and its data?",
        options: [
          { value: "a", label: "DELETE TABLE" },
          { value: "b", label: "REMOVE TABLE" },
          { value: "c", label: "DROP TABLE" },
          { value: "d", label: "TRUNCATE ONLY" },
        ],
        correctValue: "c",
      },
      {
        id: "sql-10",
        prompt: "What is a foreign key used for?",
        options: [
          { value: "a", label: "Encrypting a column" },
          { value: "b", label: "Linking a row to a primary key in another table" },
          { value: "c", label: "Speeding up all queries automatically" },
          { value: "d", label: "Renaming a column" },
        ],
        correctValue: "b",
      },
    ],
  },
  {
    id: "communication",
    skillName: "Communication",
    title: "Communication",
    category: "Soft Skill",
    durationMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: "comm-1",
        prompt: "A teammate misunderstands your written instructions. What's the best first step?",
        options: [
          { value: "a", label: "Assume they weren't paying attention" },
          { value: "b", label: "Ask what part was unclear and rephrase it" },
          { value: "c", label: "Repeat the same message again" },
          { value: "d", label: "Escalate to a manager immediately" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-2",
        prompt: "Active listening primarily involves:",
        options: [
          { value: "a", label: "Preparing your response while the other person talks" },
          { value: "b", label: "Fully focusing on and understanding the speaker before responding" },
          { value: "c", label: "Interrupting to show engagement" },
          { value: "d", label: "Only listening for keywords" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-3",
        prompt: "In a status update to stakeholders, which is the most effective structure?",
        options: [
          { value: "a", label: "A long, unstructured narrative of everything that happened" },
          { value: "b", label: "Key outcomes first, then supporting details" },
          { value: "c", label: "Only raising problems, no progress" },
          { value: "d", label: "Technical jargon with no context" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-4",
        prompt: "Giving constructive feedback is most effective when it is:",
        options: [
          { value: "a", label: "Vague but positive" },
          { value: "b", label: "Specific, behavior-focused, and actionable" },
          { value: "c", label: "Delivered publicly for accountability" },
          { value: "d", label: "Focused on personality traits" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-5",
        prompt: "When emailing a busy stakeholder, you should:",
        options: [
          { value: "a", label: "Bury the ask at the end of a long email" },
          { value: "b", label: "Lead with a clear subject line and the ask up front" },
          { value: "c", label: "Avoid stating what you need" },
          { value: "d", label: "Use as much technical detail as possible" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-6",
        prompt: "Nonverbal communication in a video call includes:",
        options: [
          { value: "a", label: "Only the words spoken" },
          { value: "b", label: "Tone of voice, eye contact, and body language" },
          { value: "c", label: "Font size in shared slides" },
          { value: "d", label: "Typing speed in chat" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-7",
        prompt: "A disagreement arises in a team meeting. The best response is to:",
        options: [
          { value: "a", label: "Stay silent to avoid conflict" },
          { value: "b", label: "State your view respectfully and seek to understand others'" },
          { value: "c", label: "Insist you're right and move on" },
          { value: "d", label: "Bring it up privately with someone else later" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-8",
        prompt: "When presenting to a non-technical audience, you should:",
        options: [
          { value: "a", label: "Use as much jargon as possible to sound credible" },
          { value: "b", label: "Translate technical concepts into plain, relevant terms" },
          { value: "c", label: "Skip context and jump straight to conclusions" },
          { value: "d", label: "Read the slides verbatim" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-9",
        prompt: "Which is an example of a clarifying question?",
        options: [
          { value: "a", label: "\"That doesn't make sense.\"" },
          { value: "b", label: "\"When you say 'soon', do you mean this week or this month?\"" },
          { value: "c", label: "\"Whatever, I'll just guess.\"" },
          { value: "d", label: "\"I already know what you mean.\"" },
        ],
        correctValue: "b",
      },
      {
        id: "comm-10",
        prompt: "Written communication with a remote team benefits most from:",
        options: [
          { value: "a", label: "Being as brief as possible, even if unclear" },
          { value: "b", label: "Clarity and context, since tone can't be heard" },
          { value: "c", label: "Assuming shared context always exists" },
          { value: "d", label: "Avoiding questions to seem confident" },
        ],
        correctValue: "b",
      },
    ],
  },
];

export function getSkillTestById(id) {
  return SKILL_TESTS.find((t) => t.id === id);
}
