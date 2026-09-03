// Industry-run skill development programs — the student-facing side of the
// "6-Week Skill Development Program" concept (Step 8 lets industry create
// these; for now they're hardcoded so the Learning page has real content to
// point at ahead of that). Weeks map onto specific skills so a program is
// visibly tied to real gaps, not just a marketing blurb.
export const INDUSTRY_PROGRAMS = [
  {
    id: "prog-data-analytics",
    title: "Data Analytics Job-Ready Program",
    company: "Global Health Initiative",
    durationWeeks: 6,
    skills: ["Python Programming", "SQL / Databases", "Power BI", "Statistics"],
    weeks: [
      { week: 1, focus: "Python Programming" },
      { week: 2, focus: "SQL / Databases" },
      { week: 3, focus: "Power BI" },
      { week: 4, focus: "Statistics" },
      { week: 5, focus: "Industry Project" },
      { week: 6, focus: "Final Assessment" },
    ],
  },
  {
    id: "prog-cloud-ready",
    title: "Cloud Infrastructure Bootcamp",
    company: "Acme Software Solutions",
    durationWeeks: 4,
    skills: ["Cloud Computing (AWS)", "Git & Version Control"],
    weeks: [
      { week: 1, focus: "Cloud Computing (AWS)" },
      { week: 2, focus: "Git & Version Control" },
      { week: 3, focus: "Industry Project" },
      { week: 4, focus: "Final Assessment" },
    ],
  },
];
