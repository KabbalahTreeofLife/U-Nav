-- Migration: Add email field and implement email-based authentication
-- Email becomes the primary unique identifier (per university)
-- Username becomes optional display name (can have duplicates)

-- Add email column
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Add composite unique constraint: email must be unique per university
ALTER TABLE users ADD CONSTRAINT users_email_university_unique UNIQUE (email, university_id);

-- Make email NOT NULL after ensuring all users have one
-- First, if you have existing users, generate placeholder emails or update manually:
-- UPDATE users SET email = CONCAT(username, '@', university_id, '.local') WHERE email IS NULL;
-- Then uncomment:
-- ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Make username optional (nullable) since it's now just a display name
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;

-- Add student_id field (optional, for institutional tracking)
ALTER TABLE users ADD COLUMN student_id VARCHAR(50);
ALTER TABLE users ADD CONSTRAINT users_student_id_university_unique UNIQUE (student_id, university_id);
