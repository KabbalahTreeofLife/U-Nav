-- ============================================
-- U-Nav Database Schema
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- ============================================
-- Universities Table
-- ============================================
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email_domain VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    university_id INTEGER REFERENCES universities(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- Password Reset Tokens Table
-- ============================================
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);

-- ============================================
-- Sample Data: Universities
-- ============================================
INSERT INTO universities (name, email_domain) VALUES
    ('Central Philippine University', 'cpu.edu.ph'),
    ('University of San Agustin', 'usa.edu.ph'),
    ('University of the Philippines - Visayas', 'upv.edu.ph'),
    ('West Visayas State University', 'wvsu.edu.ph'),
    ('Western Institute of Technology', 'wit.edu.ph'),
    ('ISATU', 'isatu.edu.ph');

-- ============================================
-- Verification Queries
-- ============================================

-- Check universities
-- SELECT * FROM universities;

-- Check users (empty for now)
-- SELECT * FROM users;
