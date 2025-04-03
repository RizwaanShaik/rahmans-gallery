import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET /api/memories
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM memories 
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ memories: rows });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

// POST /api/memories
export async function POST(request: Request) {
  try {
    const { name, email, message, relation } = await request.json();

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required fields' },
        { status: 400 }
      );
    }

    // Insert into database with optional fields
    const { rows } = await sql`
      INSERT INTO memories (name, email, message, relation)
      VALUES (${name}, ${email || null}, ${message}, ${relation || null})
      RETURNING *
    `;

    return NextResponse.json({ memory: rows[0] });
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    );
  }
} 