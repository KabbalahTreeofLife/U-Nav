import { query } from '../config/database';
import bcrypt from 'bcryptjs';

// Map university IDs to correct email domains
const universityEmailDomains: { [key: number]: string } = {
    1: 'cpu.edu.ph',                    // Central Philippine University
    2: 'wvsu.edu.ph',                   // West Visayas State University
    3: 'upv.edu.ph',                    // University of the Philippines - Visayas
    4: 'wit.edu.ph',                    // Western Institute of Technology
    5: 'usa.edu.ph',                    // University of San Agustin
    6: 'isatu.edu.ph',                  // Institute of Science and Technology University
};

async function setupTestUsersCorrect() {
    try {
        console.log('🔄 Updating admin emails with correct domains...\n');

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

        // Update admin users for each university with correct emails
        for (const university of universities) {
            const domain = universityEmailDomains[university.id];
            if (!domain) {
                console.warn(`⚠️ No email domain configured for ${university.name}`);
                continue;
            }

            const email = `admin@${domain}`;
            
            console.log(`Updating ${university.name}...`);
            
            // Check if admin already exists
            const existingAdmin = await query(
                'SELECT id FROM users WHERE username = $1 AND university_id = $2',
                ['Admin', university.id]
            );

            if (existingAdmin.rows.length > 0) {
                // Update existing with new email and password
                console.log(`  ↻ Updating email to ${email}...`);
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

        console.log('✅ All admin emails updated correctly!\n');
        console.log('📝 Login Credentials:');
        universities.forEach((uni: any) => {
            const domain = universityEmailDomains[uni.id];
            if (domain) {
                const email = `admin@${domain}`;
                console.log(`  ${uni.name}:`);
                console.log(`    Email: ${email}`);
                console.log(`    Password: ${password}`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setupTestUsersCorrect();
