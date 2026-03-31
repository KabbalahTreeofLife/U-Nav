import { pool } from '../config/database';

async function migrateAddRole() {
    console.log('Starting migration: Add role column to users...');

    const client = await pool.connect();

    try {
        const checkResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
        `);

        if (checkResult.rows.length > 0) {
            console.log('Role column already exists. Skipping migration.');
            return;
        }

        await client.query(`
            ALTER TABLE users 
            ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
        `);

        console.log('Successfully added role column to users table.');
        console.log('Default role for existing users: user');
        
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

migrateAddRole()
    .then(() => {
        console.log('Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
