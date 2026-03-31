import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

async function createGlobalAdmin() {
    const client = await pool.connect();

    try {
        console.log('Clearing all existing users...');
        await client.query('DELETE FROM users');
        console.log('All users deleted.\n');

        console.log('Creating global admin account...');
        
        const email = 'admin@unav.com';
        const password = 'GlobalAdmin';
        const passwordHash = await bcrypt.hash(password, 10);

        await client.query(`
            INSERT INTO users (email, username, password_hash, university_id, role) 
            VALUES ($1, $2, $3, NULL, $4)
        `, [email, 'Global Admin', passwordHash, 'admin']);

        console.log('\n✅ Global Admin created successfully!');
        console.log('='.repeat(50));
        console.log('Email:    admin@unav.com');
        console.log('Password: GlobalAdmin');
        console.log('Role:     Global Admin (can access all universities)');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('Operation failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

createGlobalAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
