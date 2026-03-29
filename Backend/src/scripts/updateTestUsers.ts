import { pool, query } from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function updateDatabaseWithTestUsers() {
    try {
        console.log('Connecting to database...');

        // Get Central Philippine University ID
        const universityResult = await query(
            'SELECT id FROM universities WHERE name = $1 LIMIT 1',
            ['Central Philippine University']
        );

        if (universityResult.rows.length === 0) {
            console.error('Central Philippine University not found in database');
            console.log('Available universities:');
            const allUniversities = await query('SELECT id, name FROM universities');
            console.log(allUniversities.rows);
            process.exit(1);
        }

        const cpuId = universityResult.rows[0].id;
        console.log(`Found CPU with ID: ${cpuId}`);

        // Hash the password
        const password = 'Admin123';
        const password_hash = await bcrypt.hash(password, 10);
        console.log(`Password hashed: ${password_hash.substring(0, 20)}...`);

        // Check if admin user already exists at CPU
        const existingAdmin = await query(
            'SELECT id, username, email FROM users WHERE username = $1 AND university_id = $2',
            ['Admin', cpuId]
        );

        if (existingAdmin.rows.length > 0) {
            const adminUser = existingAdmin.rows[0];
            console.log(`Found existing Admin user: ${JSON.stringify(adminUser)}`);
            
            // Update the existing admin user with email and new password
            console.log('Updating existing Admin user...');
            const updateResult = await query(
                'UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING id, username, email, university_id',
                ['admin@cpu.edu.ph', password_hash, adminUser.id]
            );
            console.log(`✅ Updated Admin user: ${JSON.stringify(updateResult.rows[0])}`);
        } else {
            // Create new admin user
            console.log('Creating new Admin user...');
            const userId = uuidv4();
            const insertResult = await query(
                'INSERT INTO users (id, university_id, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, university_id',
                [userId, cpuId, 'admin@cpu.edu.ph', 'Admin', password_hash]
            );
            console.log(`✅ Created Admin user: ${JSON.stringify(insertResult.rows[0])}`);
        }

        // Verify the user can be queried back
        console.log('\nVerifying login...');
        const verifyResult = await query(
            'SELECT id, username, email, university_id, password_hash FROM users WHERE email = $1 AND university_id = $2',
            ['admin@cpu.edu.ph', cpuId]
        );

        if (verifyResult.rows.length > 0) {
            const user = verifyResult.rows[0];
            console.log(`Found user: ${user.email}`);
            
            // Verify password
            const isValid = await bcrypt.compare(password, user.password_hash);
            console.log(`Password verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        }

        console.log('\n✅ Database update complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateDatabaseWithTestUsers();
