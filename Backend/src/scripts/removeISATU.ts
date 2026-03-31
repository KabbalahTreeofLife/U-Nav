import { pool } from '../config/database';

async function removeISATU() {
    const client = await pool.connect();

    try {
        const result = await client.query(
            "DELETE FROM universities WHERE name = 'ISATU' RETURNING id, name"
        );

        if (result.rowCount === 0) {
            console.log('ISATU not found in database.');
            return;
        }

        console.log('ISATU removed successfully!');
        console.log(result.rows[0]);
        
    } catch (error) {
        console.error('Operation failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

removeISATU()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
