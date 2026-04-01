INSERT INTO users (university_id, email, username, password_hash, role) 
VALUES (NULL, 'admin@unav.edu.ph', 'Global Admin', '$$2b$$10$$A/0844JV49Ps2a2yhEp56e8OimXxJNpS.ytPzgrwP0EeFRcTDV.BS', 'admin') 
RETURNING id, email, role, university_id;