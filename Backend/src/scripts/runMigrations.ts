import { pool } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

const runMigrations = async () => {
    console.log('Starting migrations...');
    
    const client = await pool.connect();
    
    try {
        // Check if tables exist
        const checkResult = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        if (checkResult.rows.length > 0) {
            console.log('Database already has tables:');
            checkResult.rows.forEach((row: { table_name: string }) => console.log(`  - ${row.table_name}`));
            console.log('\n✅ Database is already set up!');
        } else {
        // Run schema.sql
        console.log('Running schema.sql...');
        const schemaPath = path.join(__dirname, '../../../Database/schema.sql');
        console.log('Schema path:', schemaPath);
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await client.query(schema);
        console.log('Schema created successfully!');
        }
        
        // Verify tables
        const result = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        console.log('\nTables in database:');
        result.rows.forEach((row: { table_name: string }) => console.log(`  - ${row.table_name}`));
        
        console.log('\n✅ All migrations completed successfully!');
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

runMigrations();