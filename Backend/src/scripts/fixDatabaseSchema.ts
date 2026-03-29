import { query } from '../config/database';

async function fixDatabaseSchema() {
    try {
        console.log('🔄 Fixing database schema...\n');

        // Drop the global username unique constraint
        console.log('1️⃣ Dropping global username unique constraint...');
        try {
            await query('ALTER TABLE users DROP CONSTRAINT users_username_key CASCADE');
            console.log('  ✅ Dropped users_username_key\n');
        } catch (error: any) {
            if (error.code === '42704') { // constraint does not exist
                console.log('  ℹ️ Constraint does not exist, skipping...\n');
            } else {
                throw error;
            }
        }

        // Add email column if it doesn't exist
        console.log('2️⃣ Adding email column...');
        try {
            await query('ALTER TABLE users ADD COLUMN email VARCHAR(255)');
            console.log('  ✅ Added email column\n');
        } catch (error: any) {
            if (error.code === '42701') { // column already exists
                console.log('  ℹ️ Email column already exists\n');
            } else {
                throw error;
            }
        }

        // Add student_id column if it doesn't exist
        console.log('3️⃣ Adding student_id column...');
        try {
            await query('ALTER TABLE users ADD COLUMN student_id VARCHAR(50)');
            console.log('  ✅ Added student_id column\n');
        } catch (error: any) {
            if (error.code === '42701') { // column already exists
                console.log('  ℹ️ Student_id column already exists\n');
            } else {
                throw error;
            }
        }

        // Add composite unique constraint for email per university
        console.log('4️⃣ Adding email uniqueness constraint per university...');
        try {
            await query('ALTER TABLE users ADD CONSTRAINT users_email_university_unique UNIQUE (email, university_id)');
            console.log('  ✅ Added users_email_university_unique\n');
        } catch (error: any) {
            if (error.code === '42710') { // constraint already exists
                console.log('  ℹ️ Constraint already exists\n');
            } else {
                throw error;
            }
        }

        // Add composite unique constraint for student_id per university
        console.log('5️⃣ Adding student_id uniqueness constraint per university...');
        try {
            await query('ALTER TABLE users ADD CONSTRAINT users_student_id_university_unique UNIQUE (student_id, university_id)');
            console.log('  ✅ Added users_student_id_university_unique\n');
        } catch (error: any) {
            if (error.code === '42710') { // constraint already exists
                console.log('  ℹ️ Constraint already exists\n');
            } else {
                throw error;
            }
        }

        // Make username nullable
        console.log('6️⃣ Making username nullable...');
        try {
            await query('ALTER TABLE users ALTER COLUMN username DROP NOT NULL');
            console.log('  ✅ Made username nullable\n');
        } catch (error: any) {
            console.log('  ℹ️ Already nullable or cannot change\n');
        }

        console.log('✅ Database schema fixed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixDatabaseSchema();
