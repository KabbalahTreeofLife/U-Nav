-- Migration: Fix database schema for email-based authentication
-- Removes global username uniqueness constraint
-- Adds email field if it doesn't exist

-- Drop the global username unique constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key CASCADE;

-- Add email column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add student_id column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);

-- Add composite unique constraint for email per university
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_email_university_unique UNIQUE (email, university_id);

-- Add composite unique constraint for student_id per university (if student_id is used)
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_student_id_university_unique UNIQUE (student_id, university_id);

-- Make username nullable (it's now just a display name)
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;
