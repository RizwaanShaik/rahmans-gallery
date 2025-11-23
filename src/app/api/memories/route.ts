import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/memories
export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      console.warn('[Memories API] Supabase not configured, returning empty array');
      return NextResponse.json({ memories: [] });
    }

    const { data: memories, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET:', error);
      throw error;
    }

    return NextResponse.json({ memories: memories || [] });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories', memories: [] },
      { status: 500 }
    );
  }
}

// POST /api/memories
export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      console.warn('[Memories API] Supabase not configured, memory will not be saved');
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.', memory: null },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('Received request body:', body);
    
    const { name, email, message, relation } = body;

    // Validate required fields
    if (!name || !message) {
      console.error('Missing required fields:', { name, message });
      return NextResponse.json(
        { error: 'Name and message are required fields' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data: memory, error } = await supabase
      .from('memories')
      .insert([
        { 
          name, 
          email: email || null, 
          message, 
          relation: relation || null 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST:', error);
      throw error;
    }

    console.log('Successfully created memory:', memory);
    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Error creating memory:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if ('cause' in error) {
        console.error('Error cause:', error.cause);
      }
    }
    
    // Check if it's a network/fetch error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      console.error('[Memories API] Network error detected - Supabase URL might be unreachable');
      console.error('[Memories API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: 'Unable to connect to database. Please check server configuration.',
          hint: 'Verify NEXT_PUBLIC_SUPABASE_URL is correct and Supabase project is active'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create memory', details: errorMessage },
      { status: 500 }
    );
  }
} 