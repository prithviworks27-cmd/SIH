-- Full Supabase migration — moves every remaining localStorage-backed piece
-- of app state onto Supabase, scoped to the authenticated user (or company,
-- for industry-posted content). Run this after schema.sql and
-- assessments_schema.sql (users, skill_test_results, skill_profile must
-- already exist).
--
-- Read-only seed/demo catalogs (SKILL_CATALOG, CAREER_ROLES, candidates.js
-- mock pool, learning module content, etc.) are NOT migrated — they stay as
-- frontend mock data exactly as before. Only the MUTABLE state layered on
-- top of them (a student's selections, an industry user's created content,
-- progress/read-state overrides) moves to real tables. This mirrors exactly
-- what each service's STORAGE_KEY held.
--
-- Opportunities and applications are the exception: their seed/demo data
-- (internships.js seed jobs, applications.js seed applications) was removed
-- entirely (see git history) — opportunities and applications tables below
-- are now the ONLY source for both, no mock fallback layered on top.

-- ============================================================
-- STUDENT: dynamic assessment question bank
-- Run the CSV import in assessment_questions_schema.sql after this table exists.
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name VARCHAR(255) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question_type VARCHAR(10) NOT NULL CHECK (question_type IN ('mcq', 'text', 'code')),
  prompt TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill ON assessment_questions(skill_name);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill_level ON assessment_questions(skill_name, level);

ALTER TABLE skill_test_results
  ADD COLUMN IF NOT EXISTS level_breakdown JSONB,
  ADD COLUMN IF NOT EXISTS question_review JSONB;

CREATE TABLE IF NOT EXISTS ai_skill_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latest_run_at TIMESTAMP NOT NULL,
  analysis JSONB NOT NULL,
  based_on JSONB NOT NULL DEFAULT '[]',
  provider VARCHAR(50) NOT NULL,
  model TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, latest_run_at)
);

CREATE INDEX IF NOT EXISTS idx_ai_skill_analyses_user ON ai_skill_analyses(user_id, created_at DESC);

-- ============================================================
-- STUDENT: target role selection (careerRoleService.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_target_role (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role_id VARCHAR(100) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STUDENT: learning path module-completion progress (learningPathsService.js)
-- One row per (user, skill) — how many modules of that skill's path are done.
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  completed_modules INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_path_progress(user_id);

-- ============================================================
-- STUDENT: portfolio (portfolioService.js)
-- Basics live on one row per user; projects/certifications/internships/
-- achievements are child tables since the mock data holds arrays of them.
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_basics (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  headline VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  institution VARCHAR(255),
  expected_graduation VARCHAR(20),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skills JSONB NOT NULL DEFAULT '[]',
  trust_level VARCHAR(50) NOT NULL DEFAULT 'Self-Declared',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  issued_date VARCHAR(20),
  related_skill VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  period VARCHAR(100),
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_certifications_user ON portfolio_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_internships_user ON portfolio_internships(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_achievements_user ON portfolio_achievements(user_id);

-- ============================================================
-- STUDENT: applications (applicationsService.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  department VARCHAR(100),
  role VARCHAR(255),
  role_subtext VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);

-- ============================================================
-- STUDENT: course enrollments (enrollmentsService.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, course_id)
);

-- ============================================================
-- STUDENT: notification read-state overrides (notificationsService.js)
-- Seed notifications stay in frontend mock data; this only tracks which
-- seed notification IDs a user has marked read (the localStorage version
-- stored `false` to mean "read" — kept the same semantics here).
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_read_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_id VARCHAR(100) NOT NULL,
  read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, notification_id)
);

-- ============================================================
-- STUDENT: notification preferences (preferencesService.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_alerts BOOLEAN NOT NULL DEFAULT false,
  application_updates BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STUDENT: messages (messagesService.js)
-- Seed conversations/contacts stay in frontend mock data (no real
-- second-party user accounts exist for them — "Dr. Aris Thorne" etc. are
-- demo contacts, not real users). This only persists messages the logged-in
-- user actually sent and the unread flag per seed conversation, same
-- semantics as the localStorage version.
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_read_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id VARCHAR(100) NOT NULL,
  unread BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, conversation_id)
);

CREATE TABLE IF NOT EXISTS sent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sent_messages_user_conv ON sent_messages(user_id, conversation_id);

-- ============================================================
-- INDUSTRY: company profile (companyProfileService.js)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  industry VARCHAR(255),
  website VARCHAR(255),
  size VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDUSTRY: posted opportunities (internshipsService.js / opportunitiesService.js)
-- The only source of opportunities shown anywhere in the app — no seed/demo
-- data layered on top (see internshipsService.js allOpportunities()).
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  type VARCHAR(50),
  location VARCHAR(255),
  duration VARCHAR(100),
  stipend VARCHAR(100),
  commitment VARCHAR(255),
  overview JSONB DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  eligibility JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_opportunities_posted_by ON opportunities(posted_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);

-- ============================================================
-- INDUSTRY: applicant pipeline stage overrides (pipelineService.js)
-- Seed pipeline entries (mockData/pipeline.js, tied to mock candidates)
-- stay in frontend mock data; this only tracks stage moves an industry
-- user has made, same as the localStorage overrides object.
-- ============================================================
CREATE TABLE IF NOT EXISTS pipeline_stage_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pipeline_entry_id VARCHAR(100) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (updated_by, pipeline_entry_id)
);

-- ============================================================
-- INDUSTRY: skill development programs (skillProgramsService.js) —
-- the Step 8 "killer feature." Seed programs (industryPrograms.js) stay in
-- frontend mock data; this is what a company actually creates.
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  duration_weeks INTEGER NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  weeks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_programs_created_by ON skill_programs(created_by);
