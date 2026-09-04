-- Matching-engine realism pass: adds the real student fields the matching
-- engine's education and location dimensions need, plus the "Save for Later"
-- feature. Run after settings_schema.sql (notification_preferences must
-- already have its Settings-page columns).
--
-- Education fields (degree, branch, graduation_year) and preferred_location
-- live on notification_preferences — the same one-row-per-user "account
-- settings" table phone/course/visibility already live on — rather than a
-- new table, for the same reason settings_schema.sql gave: a handful of
-- extra columns doesn't earn a new table when a suitable one already has a
-- unique-per-user row and is already fetched/saved by the Settings page.
--
-- Distinct from portfolio_basics.expected_graduation (a free-text display
-- string like "2026-05" shown on the portfolio) — graduation_year here is a
-- plain integer the matching engine does real year arithmetic against (see
-- matchingEngine.js currentYearOfProgram). Two different consumers, so kept
-- as two fields rather than overloading one.

ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS degree VARCHAR(100),
  ADD COLUMN IF NOT EXISTS branch VARCHAR(100),
  ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
  ADD COLUMN IF NOT EXISTS preferred_location VARCHAR(100);

-- ============================================================
-- STUDENT: saved opportunities ("Save for Later")
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) NOT NULL,
  saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user ON saved_opportunities(user_id);
