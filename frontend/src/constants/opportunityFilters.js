// Single shared source for the skill tags and location options used by BOTH
// the industry opportunity-posting form (PostOpportunity.jsx) and the
// student-side opportunity filters (InternshipJobListings.jsx). Keeping one
// list means a skill/city an industry user picks when posting always exactly
// matches a filter value a student can select — no free-text drift between
// "posted skill" and "filterable skill".
//
// Note: this is deliberately a *superset* of skills.js's SKILL_CATALOG (the
// catalog of skills a student can hold a verified profile score for). An
// opportunity can require a skill the assessment engine doesn't test yet —
// matchingEngine.evaluateSkills() already handles that gracefully, showing
// it as "missing" with currentScore 0 rather than crashing or excluding it.
export const OPPORTUNITY_SKILLS = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C++",
  "React",
  "Node.js",
  "Angular",
  "Vue.js",
  "SQL/Databases",
  "MongoDB",
  "Cloud Computing (AWS)",
  "Azure",
  "Google Cloud",
  "Machine Learning",
  "Deep Learning",
  "Data Analytics",
  "Data Science",
  "DevOps",
  "Docker",
  "Kubernetes",
  "Cybersecurity",
  "Blockchain",
  "Flutter",
  "React Native",
  "Android Development",
  "iOS Development",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Excel/Power BI",
  "Django",
  "Spring Boot",
  ".NET",
  "Go",
  "Rust",
  "HTML/CSS",
  "REST APIs",
  "GraphQL",
  "Git/GitHub",
];

// Curated India-only tech hub cities. Recommended approach (see task 3):
// the posting form's location dropdown is CONSTRAINED to this list (plus
// Remote), rather than dynamically appending whatever free text an industry
// user types. Rationale:
//   - Guarantees filters and postings always stay in sync (a posted city is
//     always a filterable city) with zero drift, matching the same
//     single-source-of-truth approach used for skills above.
//   - Avoids letting stray/duplicate/misspelled city names (or non-Indian
//     cities, per this task's India-only scope) leak into the filter list.
//   - A dropdown is also just a better input than free text for a field
//     that's filtered on — no "Bangalore" vs "Bengaluru" fragmentation.
// If a legitimate need for a city outside this list comes up later, extend
// this array (and re-deploy) rather than reintroducing free text.
export const OPPORTUNITY_CITIES = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi NCR (Gurugram/Noida)",
  "Kolkata",
  "Ahmedabad",
  "Kochi",
  "Jaipur",
  "Chandigarh",
  "Indore",
  "Coimbatore",
  "Bhubaneswar",
];
