-- Adds the "size" column to company_profiles (e.g. "50-200 employees").
-- The Company Profile page and the industry onboarding step both send this
-- field; description already existed and doubles as the "about" text.
-- Safe to run against an existing database — only adds a column if missing.
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS size VARCHAR(255);
