import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('Checking environment variables...');
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }
    console.log('Environment variables found:', process.env.POSTGRES_URL);

    console.log('Reading schema file...');
    const schemaPath = join(process.cwd(), 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    console.log('Schema file read successfully');

    console.log('Connecting to database...');
    await sql.query('SELECT NOW()');
    console.log('Database connection successful');

    console.log('Executing schema...');
    await sql.query(schema);
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 