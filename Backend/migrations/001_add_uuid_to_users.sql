-- Migration: Add UUID column and update unique constraint for users table
-- This allows the same username to exist in different universities

-- Add UUID column (for new users)
-- Note: If you have existing users, you'll need to generate UUIDs for them
ALTER TABLE users ADD COLUMN id UUID UNIQUE;

-- Update existing users with UUIDs (using PostgreSQL's gen_random_uuid)
UPDATE users SET id = gen_random_uuid() WHERE id IS NULL;

-- Make id NOT NULL after populating
ALTER TABLE users ALTER COLUMN id SET NOT NULL;

-- Remove old primary key if it exists (typically an auto-increment integer)
-- ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Add new constraint: username must be unique per university
ALTER TABLE users ADD CONSTRAINT users_username_university_unique UNIQUE (username, university_id);

-- If you previously had a global username uniqueness constraint, drop it:
-- ALTER TABLE users DROP CONSTRAINT users_username_unique;
