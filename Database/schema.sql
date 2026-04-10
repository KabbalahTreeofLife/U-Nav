-- ============================================
-- U-Nav Database Schema
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS universities CASCADE;
DROP TABLE IF EXISTS dining_locations CASCADE;
DROP TABLE IF EXISTS events CASCADE;

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
    student_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- Dining Locations Table
-- ============================================
CREATE TABLE dining_locations (
    id SERIAL PRIMARY KEY,
    university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'cafe', 'mess', 'snack')),
    building VARCHAR(255) NOT NULL,
    floor INTEGER DEFAULT 1,
    operating_hours VARCHAR(100),
    price_range VARCHAR(10) DEFAULT '$' CHECK (price_range IN ('$', '$$', '$$$')),
    cuisine TEXT[],
    rating DECIMAL(2,1) DEFAULT 4.0,
    image_url VARCHAR(500),
    coordinates_x INTEGER,
    coordinates_y INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dining_university ON dining_locations(university_id);

-- ============================================
-- Events Table
-- ============================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    room VARCHAR(255),
    date DATE NOT NULL,
    time VARCHAR(100),
    organizer VARCHAR(255),
    category VARCHAR(50) DEFAULT 'academic' CHECK (category IN ('academic', 'sports', 'cultural', 'social')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_university ON events(university_id);
CREATE INDEX idx_events_date ON events(date);

-- ============================================
-- Sample Data: Universities
-- ============================================
INSERT INTO universities (name, email_domain) VALUES
    ('Central Philippine University', 'cpu.edu.ph'),
    ('University of San Agustin', 'usa.edu.ph'),
    ('University of the Philippines - Visayas', 'upv.edu.ph'),
    ('West Visayas State University', 'wvsu.edu.ph'),
    ('Western Institute of Technology', 'wit.edu.ph'),
    ('Institute of Science and Technology University', 'isatu.edu.ph');

-- ============================================
-- Sample Data: Dining Locations
-- ============================================

-- CPU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'CPU Uy Building', 'mess', 'Uy Building', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'International'], 4.2, 0, 0
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'University Cafeteria', 'restaurant', 'Cafeteria Building', 1, '7:00 AM - 7:00 PM', '$', ARRAY['Filipino', 'Fast Food', 'Snacks'], 4.0, 10, 5
FROM universities u WHERE u.name = 'Central Philippine University';

-- USAGustin Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'San Agustin Hall Dining', 'restaurant', 'San Agustin Hall', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'Continental'], 4.1, 0, 0
FROM universities u WHERE u.name = 'University of San Agustin';

-- UPV Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'UP Coffee Station', 'cafe', 'University Center', 1, '7:00 AM - 8:00 PM', '$$', ARRAY['Premium Coffee', 'Pastries'], 4.4, 8, 2
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

-- WVSU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'WVSU Student Mess', 'mess', 'Main Campus Building', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'International'], 4.0, 0, 0
FROM universities u WHERE u.name = 'West Visayas State University';

-- WIT Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'WIT Tech Cafeteria', 'restaurant', 'Technology Building', 1, '7:00 AM - 7:00 PM', '$', ARRAY['Filipino', 'Fast Food'], 4.0, 0, 0
FROM universities u WHERE u.name = 'Western Institute of Technology';

-- ISATU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'ISATU Main Cafeteria', 'restaurant', 'Admin Building', 1, '7:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'Asian', 'Snacks'], 4.1, 0, 0
FROM universities u WHERE u.name = 'Institute of Science and Technology University';

-- ============================================
-- Sample Data: Events
-- ============================================

-- CPU Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Engineering Fair 2026', 'Annual engineering exhibition showcasing student projects and innovations.', 'Engineering Building - Main Hall', '2026-04-15', '9:00 AM - 5:00 PM', 'College of Engineering', 'academic'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Basketball Tournament Finals', 'Inter-college basketball championship finals.', 'Sports Complex - Gymnasium', '2026-04-20', '2:00 PM - 6:00 PM', 'Athletics Office', 'sports'
FROM universities u WHERE u.name = 'Central Philippine University';

-- USAGustin Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'USA Cultural Show', 'Celebration of cultural heritage and traditions.', 'Auditorium', '2026-04-27', '6:30 PM - 9:30 PM', 'Student Organization', 'cultural'
FROM universities u WHERE u.name = 'University of San Agustin';

-- UPV Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Research Symposium', 'Presentation of academic research and studies.', 'Diliman Hall - Conference Room', '2026-04-17', '9:00 AM - 5:00 PM', 'Office of Research', 'academic'
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

-- WVSU Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Volleyball Championship', 'Inter-college volleyball championship.', 'Sports Complex - Court 1', '2026-04-23', '2:00 PM - 7:00 PM', 'Sports Office', 'sports'
FROM universities u WHERE u.name = 'West Visayas State University';

-- WIT Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Tech Conference 2026', 'Annual technology conference featuring industry speakers.', 'Technology Building - Main Auditorium', '2026-04-19', '8:30 AM - 4:30 PM', 'Engineering Department', 'academic'
FROM universities u WHERE u.name = 'Western Institute of Technology';

-- Institute of Science and Technology University Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Tech Innovation Summit', 'Showcase of latest technological innovations and student projects.', 'Engineering Building - Auditorium', '2026-04-18', '9:00 AM - 4:00 PM', 'College of Engineering', 'academic'
FROM universities u WHERE u.name = 'Institute of Science and Technology University';