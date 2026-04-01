-- ============================================
-- Migration: Add Dining and Events Tables
-- ============================================

-- Drop tables if they exist
DROP TABLE IF EXISTS dining_locations CASCADE;
DROP TABLE IF EXISTS events CASCADE;

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
-- Sample Data: Dining Locations for all universities
-- ============================================

-- CPU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'CPU Uy Building', 'mess', 'Uy Building', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'International'], 4.2, 0, 0
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'University Cafeteria', 'restaurant', 'Cafeteria Building', 1, '7:00 AM - 7:00 PM', '$', ARRAY['Filipino', 'Fast Food', 'Snacks'], 4.0, 10, 5
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Popup Bistro', 'restaurant', 'Outside of CPU', 2, '6:00 AM - 10:00 PM', '$$', ARRAY['Filipino', 'American', 'Fast Food'], 4.5, -5, 8
FROM universities u WHERE u.name = 'Central Philippine University';

-- USA Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'San Agustin Hall Dining', 'restaurant', 'San Agustin Hall', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'Continental'], 4.1, 0, 0
FROM universities u WHERE u.name = 'University of San Agustin';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Agustin Cafe', 'cafe', 'Quadrangle', 1, '7:00 AM - 9:00 PM', '$$', ARRAY['Specialty Coffee', 'Baked Goods', 'Light Meals'], 4.3, 5, 5
FROM universities u WHERE u.name = 'University of San Agustin';

-- UPV Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Diliman Hall Cafeteria', 'restaurant', 'Diliman Hall', 1, '6:30 AM - 7:30 PM', '$', ARRAY['Filipino', 'Asian Fusion'], 4.2, 0, 0
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'UP Coffee Station', 'cafe', 'University Center', 1, '7:00 AM - 8:00 PM', '$$', ARRAY['Premium Coffee', 'Pastries', 'Desserts'], 4.4, 8, 2
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

-- WVSU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'WVSU Student Mess', 'mess', 'Main Campus Building', 1, '6:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'International'], 4.0, 0, 0
FROM universities u WHERE u.name = 'West Visayas State University';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Campus Coffee Lounge', 'cafe', 'Student Center', 2, '7:00 AM - 8:00 PM', '$$', ARRAY['Coffee', 'Pastries', 'Smoothies'], 4.2, 5, 3
FROM universities u WHERE u.name = 'West Visayas State University';

-- WIT Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'WIT Tech Cafeteria', 'restaurant', 'Technology Building', 1, '7:00 AM - 7:00 PM', '$', ARRAY['Filipino', 'Fast Food', 'Healthy Options'], 4.0, 0, 0
FROM universities u WHERE u.name = 'Western Institute of Technology';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Innovation Hub Snack Bar', 'snack', 'Research Center', 1, '24 Hours', '$', ARRAY['Snacks', 'Coffee', 'Energy Drinks'], 3.8, 6, -4
FROM universities u WHERE u.name = 'Western Institute of Technology';

-- ISATU Dining Locations
INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'ISATU Main Cafeteria', 'restaurant', 'Admin Building', 1, '7:00 AM - 8:00 PM', '$', ARRAY['Filipino', 'Asian', 'Snacks'], 4.1, 0, 0
FROM universities u WHERE u.name = 'ISATU';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'ISATU Tech Cafe', 'cafe', 'Engineering Building', 1, '6:30 AM - 9:00 PM', '$$', ARRAY['Coffee', 'Pastries', 'Light Meals'], 4.3, 8, -3
FROM universities u WHERE u.name = 'ISATU';

INSERT INTO dining_locations (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, coordinates_x, coordinates_y) 
SELECT u.id, 'Resource Center Snack Bar', 'snack', 'Resource Center', 1, '8:00 AM - 6:00 PM', '$', ARRAY['Snacks', 'Beverages', 'Sandwiches'], 3.9, -6, 5
FROM universities u WHERE u.name = 'ISATU';

-- ============================================
-- Sample Data: Events for all universities
-- ============================================

-- CPU Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Engineering Fair 2026', 'Annual engineering exhibition showcasing student projects and innovations.', 'Engineering Building - Main Hall', '2026-04-15', '9:00 AM - 5:00 PM', 'College of Engineering', 'academic'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Basketball Tournament Finals', 'Inter-college basketball championship finals.', 'Sports Complex - Gymnasium', '2026-04-20', '2:00 PM - 6:00 PM', 'Athletics Office', 'sports'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Cultural Night', 'Annual cultural presentation featuring traditional dances and music.', 'Auditorium', '2026-04-25', '6:00 PM - 10:00 PM', 'Student Council', 'cultural'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Career Fair', 'Meet potential employers and explore career opportunities.', 'Student Center - Function Hall', '2026-05-01', '8:00 AM - 4:00 PM', 'Career Services', 'academic'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Welcome Week Social', 'Welcome gathering for new students.', 'Quad Area', '2026-05-10', '3:00 PM - 7:00 PM', 'Student Affairs', 'social'
FROM universities u WHERE u.name = 'Central Philippine University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Science Quiz Bowl', 'Inter-college science competition.', 'Science Building - Room 301', '2026-05-15', '1:00 PM - 5:00 PM', 'College of Science', 'academic'
FROM universities u WHERE u.name = 'Central Philippine University';

-- USA Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Philosophy Seminar', 'Discussion on contemporary philosophical issues.', 'San Agustin Hall - Room 201', '2026-04-21', '10:00 AM - 1:00 PM', 'College of Liberal Arts', 'academic'
FROM universities u WHERE u.name = 'University of San Agustin';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'USA Cultural Show', 'Celebration of cultural heritage and traditions.', 'Auditorium', '2026-04-27', '6:30 PM - 9:30 PM', 'Student Organization', 'cultural'
FROM universities u WHERE u.name = 'University of San Agustin';

-- UPV Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Research Symposium', 'Presentation of academic research and studies.', 'Diliman Hall - Conference Room', '2026-04-17', '9:00 AM - 5:00 PM', 'Office of Research', 'academic'
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'UP Arts Festival', 'Festival celebrating arts and culture at UP.', 'Quadrangle', '2026-04-26', '5:00 PM - 11:00 PM', 'College of Arts', 'cultural'
FROM universities u WHERE u.name = 'University of the Philippines - Visayas';

-- WVSU Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'WVSU Education Forum', 'Forum discussing innovations in education.', 'Main Campus Building - Hall', '2026-04-16', '8:00 AM - 3:00 PM', 'College of Education', 'academic'
FROM universities u WHERE u.name = 'West Visayas State University';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Volleyball Championship', 'Inter-college volleyball championship.', 'Sports Complex - Court 1', '2026-04-23', '2:00 PM - 7:00 PM', 'Sports Office', 'sports'
FROM universities u WHERE u.name = 'West Visayas State University';

-- WIT Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Tech Conference 2026', 'Annual technology conference featuring industry speakers.', 'Technology Building - Main Auditorium', '2026-04-19', '8:30 AM - 4:30 PM', 'Engineering Department', 'academic'
FROM universities u WHERE u.name = 'Western Institute of Technology';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Robotics Competition', 'Student robotics teams compete in engineering challenges.', 'Research Center - Lab', '2026-05-02', '9:00 AM - 6:00 PM', 'Robotics Club', 'sports'
FROM universities u WHERE u.name = 'Western Institute of Technology';

-- ISATU Events
INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Tech Innovation Summit', 'Showcase of latest technological innovations and student projects.', 'Engineering Building - Auditorium', '2026-04-18', '9:00 AM - 4:00 PM', 'College of Engineering', 'academic'
FROM universities u WHERE u.name = 'ISATU';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'ISATU Sports Day', 'Inter-department sports competition.', 'Sports Complex', '2026-04-22', '1:00 PM - 6:00 PM', 'Athletics Department', 'sports'
FROM universities u WHERE u.name = 'ISATU';

INSERT INTO events (university_id, title, description, room, date, time, organizer, category)
SELECT u.id, 'Science Expo 2026', 'Exhibition of scientific research and innovations.', 'Resource Center - Main Hall', '2026-05-05', '10:00 AM - 5:00 PM', 'College of Science', 'academic'
FROM universities u WHERE u.name = 'ISATU';

-- ============================================
-- Verification Queries
-- ============================================

-- Check dining locations by university
-- SELECT d.*, u.name as university_name FROM dining_locations d JOIN universities u ON d.university_id = u.id ORDER BY university_id;

-- Check events by university
-- SELECT e.*, u.name as university_name FROM events e JOIN universities u ON e.university_id = u.id ORDER BY university_id;
