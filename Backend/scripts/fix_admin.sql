INSERT INTO users (university_id, email, username, password_hash, role) 
VALUES (NULL, 'admin@unav.edu.ph', 'Global Admin', '$2b$10$c2c4R.swS3/FhvGKtKvzTul0Qjv2mWdAjDx9xMAirwEQdkSae9INW', 'admin') 
RETURNING id, email, role;