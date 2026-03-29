import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function testSignupLogin() {
    try {
        console.log('🧪 Testing signup and login flow...\n');

        // Test data
        const testUser = {
            university_id: 1,
            email: 'testuser@cpu.edu.ph',
            username: 'TestUser',
            password: 'TestPassword123',
        };

        // Check if test user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1 AND university_id = $2',
            [testUser.email, testUser.university_id]
        );

        if (existingUser.rows.length > 0) {
            console.log('📋 Deleting existing test user...');
            await query(
                'DELETE FROM users WHERE email = $1 AND university_id = $2',
                [testUser.email, testUser.university_id]
            );
            console.log('✅ Deleted\n');
        }

        // Test signup
        console.log('1️⃣ Testing signup...');
        const password_hash = await bcrypt.hash(testUser.password, 10);
        console.log(`  - Hashing password: ${testUser.password}`);

        const signupResult = await query(
            'INSERT INTO users (university_id, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username, university_id, password_hash',
            [testUser.university_id, testUser.email, testUser.username, password_hash]
        );

        const createdUser = signupResult.rows[0];
        console.log(`  ✅ Created user:`);
        console.log(`     ID: ${createdUser.id}`);
        console.log(`     Email: ${createdUser.email}`);
        console.log(`     Username: ${createdUser.username}`);
        console.log(`     University ID: ${createdUser.university_id}\n`);

        // Test login - Query by email and university_id
        console.log('2️⃣ Testing login query...');
        const loginResult = await query(
            'SELECT id, email, username, university_id, password_hash FROM users WHERE email = $1 AND university_id = $2',
            [testUser.email, testUser.university_id]
        );

        if (loginResult.rows.length === 0) {
            console.error('  ❌ ERROR: User not found in database!');
            process.exit(1);
        }

        const foundUser = loginResult.rows[0];
        console.log(`  ✅ Found user in database:`);
        console.log(`     Email: ${foundUser.email}`);
        console.log(`     Username: ${foundUser.username}\n`);

        // Verify password
        console.log('3️⃣ Testing password verification...');
        const isValid = await bcrypt.compare(testUser.password, foundUser.password_hash);
        console.log(`  ${isValid ? '✅' : '❌'} Password match: ${isValid}\n`);

        if (isValid) {
            console.log('✅ SIGNUP AND LOGIN TEST PASSED!\n');
            console.log('Test credentials:');
            console.log(`  Email: ${testUser.email}`);
            console.log(`  Password: ${testUser.password}`);
            console.log(`  University: Central Philippine University (ID: 1)`);
        } else {
            console.error('❌ TEST FAILED: Password does not match');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testSignupLogin();
