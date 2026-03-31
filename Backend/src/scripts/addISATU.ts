import { pool } from '../config/database';

async function addISATU() {
    const client = await pool.connect();

    try {
        const existing = await client.query(
            "SELECT id FROM universities WHERE name = 'ISATU'"
        );

        if (existing.rows.length > 0) {
            console.log('ISATU already exists in database.');
            console.log(`ISATU University ID: ${existing.rows[0].id}`);
            return;
        }

        const result = await client.query(`
            INSERT INTO universities (name, email_domain) 
            VALUES ('ISATU', 'isatu.edu.ph')
            RETURNING id, name, email_domain
        `);

        console.log('ISATU added successfully!');
        console.log(result.rows[0]);
        
    } catch (error) {
        console.error('Operation failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

addISATU()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
