import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Drop existing table if it exists
    await sql`DROP TABLE IF EXISTS memories`;

    // Create table with updated schema
    await sql`
      CREATE TABLE memories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        message TEXT NOT NULL,
        relation VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

setupDatabase(); 