-- Question bank for per-skill assessments (distinct from skill_test_results,
-- which stores a user's attempt outcomes, and skill_profile, which stores
-- their current per-skill standing). This table holds the actual question
-- content so tests are generated from data instead of hardcoded in
-- frontend/src/services/mockData/skillTests.js.
--
-- Import assessment_questions.csv into this table via the Supabase
-- Table Editor's "Import data from CSV" action, or:
--   \copy assessment_questions(id, skill_name, level, question_type, prompt, options, correct_answer, explanation)
--   FROM 'assessment_questions.csv' WITH (FORMAT csv, HEADER true);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name VARCHAR(255) NOT NULL CHECK (skill_name IN ('JavaScript', 'Python Programming', 'React', 'SQL / Databases', 'Data Structures & Algorithms', 'Cloud Computing (AWS)', 'Machine Learning', 'Git & Version Control', 'Power BI', 'Statistics', 'Excel', 'TypeScript', 'Java / C++ / C#', 'Node.js', 'Docker / Kubernetes', 'CI/CD (Jenkins, GitHub Actions)', 'REST APIs / GraphQL', 'Deep Learning / NLP', 'Data Visualization (Tableau)', 'Linux / Shell Scripting', 'Cybersecurity Basics', 'Testing / QA (Selenium, Jest)', 'Mobile Development (iOS/Android, Flutter, React Native)', 'DevOps', 'Big Data (Hadoop, Spark)', 'Blockchain')),
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question_type VARCHAR(10) NOT NULL CHECK (question_type IN ('mcq', 'text', 'code')),
  prompt TEXT NOT NULL,
  options JSONB, -- JSON array of 4 option strings for 'mcq'; NULL for 'text'/'code'
  correct_answer TEXT NOT NULL, -- exact matching option for 'mcq'; model/expected answer for 'text'/'code'
  explanation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill ON assessment_questions(skill_name);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill_level ON assessment_questions(skill_name, level);
