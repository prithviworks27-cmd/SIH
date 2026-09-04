-- Skill Tests (Step 2) persistence — moves skill_test_results and skill_profile
-- off frontend localStorage onto Supabase, scoped to the authenticated user.
-- Run this after schema.sql (users table must already exist).

-- One row per skill test attempt (both passed and failed attempts are kept,
-- so a student's retake history is visible, not just their latest try).
CREATE TABLE IF NOT EXISTS skill_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id VARCHAR(100) NOT NULL,
  skill_name VARCHAR(255) NOT NULL CHECK (skill_name IN ('JavaScript', 'Python Programming', 'React', 'SQL / Databases', 'Data Structures & Algorithms', 'Cloud Computing (AWS)', 'Machine Learning', 'Git & Version Control', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Power BI', 'Statistics', 'Excel', 'TypeScript', 'Java / C++ / C#', 'Node.js', 'Docker / Kubernetes', 'CI/CD (Jenkins, GitHub Actions)', 'REST APIs / GraphQL', 'Deep Learning / NLP', 'Data Visualization (Tableau)', 'Linux / Shell Scripting', 'Cybersecurity Basics', 'Testing / QA (Selenium, Jest)', 'Mobile Development (iOS/Android, Flutter, React Native)', 'DevOps', 'Big Data (Hadoop, Spark)', 'Blockchain')),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percent INTEGER NOT NULL,
  passing_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_test_results_user ON skill_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_test_results_user_test ON skill_test_results(user_id, test_id);

-- Current per-skill profile state: one row per (user, skill). This is the
-- canonical source the dashboard/skill-graph/gap-report/portfolio read —
-- same role frontend/src/services/skillsService.js's localStorage copy plays
-- today, just server-side and shared across devices.
CREATE TABLE IF NOT EXISTS skill_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL CONSTRAINT skill_profile_skill_name_check CHECK (skill_name IN ('JavaScript', 'Python Programming', 'React', 'SQL / Databases', 'Data Structures & Algorithms', 'Cloud Computing (AWS)', 'Machine Learning', 'Git & Version Control', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Power BI', 'Statistics', 'Excel', 'TypeScript', 'Java / C++ / C#', 'Node.js', 'Docker / Kubernetes', 'CI/CD (Jenkins, GitHub Actions)', 'REST APIs / GraphQL', 'Deep Learning / NLP', 'Data Visualization (Tableau)', 'Linux / Shell Scripting', 'Cybersecurity Basics', 'Testing / QA (Selenium, Jest)', 'Mobile Development (iOS/Android, Flutter, React Native)', 'DevOps', 'Big Data (Hadoop, Spark)', 'Blockchain')),
  current_score INTEGER NOT NULL DEFAULT 0 CONSTRAINT skill_profile_current_score_range CHECK (current_score BETWEEN 0 AND 100),
  trust_level VARCHAR(50) NOT NULL DEFAULT 'Self-Declared',
  proficiency_level VARCHAR(50) CONSTRAINT skill_profile_proficiency_level_check CHECK (proficiency_level IN ('Not yet started', 'Beginner', 'Intermediate', 'Advanced', 'Expert') OR proficiency_level IS NULL),
  last_updated TIMESTAMP,
  UNIQUE (user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_skill_profile_user ON skill_profile(user_id);

-- Apply the same checks when this schema is run against an existing table.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'skill_profile_skill_name_check') THEN
    ALTER TABLE skill_profile ADD CONSTRAINT skill_profile_skill_name_check
      CHECK (skill_name IN ('JavaScript', 'Python Programming', 'React', 'SQL / Databases', 'Data Structures & Algorithms', 'Cloud Computing (AWS)', 'Machine Learning', 'Git & Version Control', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Power BI', 'Statistics', 'Excel', 'TypeScript', 'Java / C++ / C#', 'Node.js', 'Docker / Kubernetes', 'CI/CD (Jenkins, GitHub Actions)', 'REST APIs / GraphQL', 'Deep Learning / NLP', 'Data Visualization (Tableau)', 'Linux / Shell Scripting', 'Cybersecurity Basics', 'Testing / QA (Selenium, Jest)', 'Mobile Development (iOS/Android, Flutter, React Native)', 'DevOps', 'Big Data (Hadoop, Spark)', 'Blockchain'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'skill_profile_current_score_range') THEN
    ALTER TABLE skill_profile ADD CONSTRAINT skill_profile_current_score_range CHECK (current_score BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'skill_profile_proficiency_level_check') THEN
    ALTER TABLE skill_profile ADD CONSTRAINT skill_profile_proficiency_level_check
      CHECK (proficiency_level IN ('Not yet started', 'Beginner', 'Intermediate', 'Advanced', 'Expert') OR proficiency_level IS NULL);
  END IF;
END $$;

-- last_updated is set explicitly by the app on each write (mirrors the score/
-- trust level as of that write), not an auto-managed audit column, so no
-- update-timestamp trigger here — unlike users.updated_at in schema.sql.
