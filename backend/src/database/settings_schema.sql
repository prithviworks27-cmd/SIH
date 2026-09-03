-- Settings page additions (Issue 4): phone number, privacy/visibility
-- preferences, and data-sharing consent. Run after full_migration_schema.sql
-- (notification_preferences must already exist).
--
-- Reuses notification_preferences as the single "account settings" row per
-- user rather than creating a parallel table — same one-row-per-user shape
-- the table already had for email/SMS/application-update toggles.
--
-- institution / expected_graduation (college, graduation year) already exist
-- on portfolio_basics and are edited there (Digital Portfolio > Edit) — not
-- duplicated here to avoid two sources of truth for the same fields.

ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS course VARCHAR(255),
  ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(30) NOT NULL DEFAULT 'Institution Only'
    CHECK (profile_visibility IN ('Public', 'Institution Only', 'Private')),
  ADD COLUMN IF NOT EXISTS portfolio_visibility VARCHAR(30) NOT NULL DEFAULT 'Public'
    CHECK (portfolio_visibility IN ('Public', 'Institution Only', 'Private')),
  ADD COLUMN IF NOT EXISTS opportunity_visibility VARCHAR(30) NOT NULL DEFAULT 'Visible to Recruiters'
    CHECK (opportunity_visibility IN ('Visible to Recruiters', 'Hidden')),
  ADD COLUMN IF NOT EXISTS data_sharing_consent BOOLEAN NOT NULL DEFAULT true;
