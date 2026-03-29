import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function setupTestUsers() {
    try {
        console.log('🔄 Setting up test users...\n');

        // Get all universities
        const universitiesResult = await query('SELECT id, name FROM universities ORDER BY id');
        const universities = universitiesResult.rows;

        if (universities.length === 0) {
            console.error('❌ No universities found in database');
            process.exit(1);
        }

        console.log(`Found ${universities.length} universities:`);
        universities.forEach((uni: any) => console.log(`  - ${uni.name} (ID: ${uni.id})`));
        console.log();

        // Hash the password
        const password = 'Admin123';
        const password_hash = await bcrypt.hash(password, 10);

        // Create admin users for each university
        for (const university of universities) {
            const email = `admin@${university.name.toLowerCase().replace(/\s+/g, '')}.edu.ph`;
            
            console.log(`Setting up Admin for ${university.name}...`);
            
            // Check if admin already exists
            const existingAdmin = await query(
                'SELECT id FROM users WHERE username = $1 AND university_id = $2',
                ['Admin', university.id]
            );

            if (existingAdmin.rows.length > 0) {
                // Update existing
                console.log(`  ↻ Updating existing Admin user...`);
                const updateResult = await query(
                    'UPDATE users SET email = $1, password_hash = $2 WHERE username = $3 AND university_id = $4 RETURNING id, email',
                    [email, password_hash, 'Admin', university.id]
                );
                console.log(`  ✅ Updated: ${updateResult.rows[0].email}`);
            } else {
                // Create new
                console.log(`  ✨ Creating new Admin user...`);
                const insertResult = await query(
                    'INSERT INTO users (university_id, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email',
                    [university.id, email, 'Admin', password_hash]
                );
                console.log(`  ✅ Created: ${insertResult.rows[0].email}`);
            }

            // Verify
            const verifyResult = await query(
                'SELECT password_hash FROM users WHERE email = $1 AND university_id = $2',
                [email, university.id]
            );
            
            if (verifyResult.rows.length > 0) {
                const isValid = await bcrypt.compare(password, verifyResult.rows[0].password_hash);
                console.log(`  ${isValid ? '✅' : '❌'} Password verification: ${isValid ? 'VALID' : 'INVALID'}\n`);
            }
        }

        console.log('✅ All test users setup complete!\n');
        console.log('📝 Login Credentials:');
        universities.forEach((uni: any) => {
            const email = `admin@${uni.name.toLowerCase().replace(/\s+/g, '')}.edu.ph`;
            console.log(`  ${uni.name}:`);
            console.log(`    Email: ${email}`);
            console.log(`    Password: ${password}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setupTestUsers();
