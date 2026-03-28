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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    university_id INTEGER REFERENCES universities(id) ON DELETE SET NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- Sample Data: Universities
-- ============================================
INSERT INTO universities (name) VALUES
    ('Central Philippine University'),
    ('University of San Agustin'),
    ('University of the Philippines - Visayas'),
    ('West Visayas State University'),
    ('Western Institute of Technology');

-- ============================================
-- Verification Queries
-- ============================================

-- Check universities
-- SELECT * FROM universities;

-- Check users (empty for now)
-- SELECT * FROM users;
