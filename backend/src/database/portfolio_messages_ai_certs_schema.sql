-- Portfolio CRUD, real student<->industry messaging, AI Advisor memory, and
-- certificate upload/verification. Run after opportunity_responsibilities_schema.sql.

-- ============================================================
-- CERTIFICATE UPLOAD + VERIFICATION (portfolio_certifications)
-- file_url/file_name: set once a student uploads a file to the
-- "certificates" Supabase Storage bucket (created separately, see backend
-- setup notes). verification_status starts 'unverified' (no file — pure
-- self-report, matches today's behavior); uploading a file moves it to
-- 'pending' so it shows up in the admin review queue; an admin's
-- approve/reject sets 'verified'/'rejected' and records who/when.
-- ============================================================
ALTER TABLE portfolio_certifications
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_portfolio_certifications_status ON portfolio_certifications(verification_status);

-- ============================================================
-- REAL STUDENT <-> INDUSTRY MESSAGING
-- A conversation is created once a student applies to an opportunity (or on
-- first message, whichever comes first) between that student and the
-- opportunity's posted_by recruiter. Replaces the old free-text
-- conversation_id-only sent_messages/conversation_read_state pair (still
-- used for nothing after this — kept as-is, unrelated to this feature).
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, industry_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_industry ON conversations(industry_id);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conv ON conversation_messages(conversation_id, sent_at);

-- Per-participant unread flag — a conversation has exactly two participants
-- (student_id, industry_id on the conversation row), so this tracks "does
-- THIS user have unread messages in THIS conversation" without needing a
-- generic participants table.
CREATE TABLE IF NOT EXISTS conversation_unread (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unread BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (conversation_id, user_id)
);

-- ============================================================
-- AI ADVISOR CONVERSATION MEMORY
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_advisor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_advisor_messages_user ON ai_advisor_messages(user_id, created_at);
