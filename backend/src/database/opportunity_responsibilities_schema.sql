-- Adds the "responsibilities" field to posted opportunities. overview
-- already existed (full_migration_schema.sql); responsibilities is the same
-- shape (JSONB array of strings). InternshipJobDetail.jsx already rendered
-- job.responsibilities conditionally, but nothing ever wrote it since the
-- column didn't exist — PostOpportunity now collects and sends it. Run this
-- after matching_profile_schema.sql.

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]';
