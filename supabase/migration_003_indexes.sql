-- Phase 8: Database Improvements
-- Add missing indexes to improve query performance

-- Unique index on user_id for faster lookups and data integrity
CREATE UNIQUE INDEX IF NOT EXISTS student_profiles_user_id_idx ON student_profiles (user_id);

-- Index on university system for faster filtering in search and matching
CREATE INDEX IF NOT EXISTS universities_system_idx ON universities (system);

-- Index on major language for faster filtering
CREATE INDEX IF NOT EXISTS university_majors_language_idx ON university_majors (language);
