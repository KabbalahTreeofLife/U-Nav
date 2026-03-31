import { pool } from '../config/database';

interface PromoteOptions {
    email?: string;
    username?: string;
    list?: boolean;
}

async function promoteToAdmin(options: PromoteOptions) {
    const client = await pool.connect();

    try {
        if (options.list) {
            const result = await client.query(`
                SELECT id, username, email, role, university_id 
                FROM users 
                ORDER BY role DESC, username ASC
            `);
            
            console.log('\nAll Users:');
            console.log('=' .repeat(80));
            console.log('ID | Username | Email | Role | University ID');
            console.log('-'.repeat(80));
            
            result.rows.forEach(user => {
                const roleDisplay = user.role === 'admin' ? '✅ ADMIN' : '👤 user';
                console.log(`${user.id} | ${user.username || 'N/A'} | ${user.email} | ${roleDisplay} | ${user.university_id}`);
            });
            console.log('');
            return;
        }

        if (options.email) {
            const result = await client.query(
                'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, username, email, role',
                ['admin', options.email]
            );

            if (result.rowCount === 0) {
                console.log(`No user found with email: ${options.email}`);
                return;
            }

            console.log('Successfully promoted user to admin:');
            console.log(result.rows[0]);
            return;
        }

        if (options.username) {
            const result = await client.query(
                'UPDATE users SET role = $1 WHERE username = $2 RETURNING id, username, email, role',
                ['admin', options.username]
            );

            if (result.rowCount === 0) {
                console.log(`No user found with username: ${options.username}`);
                return;
            }

            console.log('Successfully promoted user to admin:');
            console.log(result.rows[0]);
            return;
        }

        console.log('Usage:');
        console.log('  npm run promote-admin -- --list           # List all users');
        console.log('  npm run promote-admin -- --email user@example.com  # Promote by email');
        console.log('  npm run promote-admin -- --username john   # Promote by username');

    } catch (error) {
        console.error('Operation failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

const args = process.argv.slice(2);
const options: PromoteOptions = {};

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--list':
            options.list = true;
            break;
        case '--email':
            options.email = args[++i];
            break;
        case '--username':
            options.username = args[++i];
            break;
    }
}

promoteToAdmin(options)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
