import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sanitizeText, sanitizeEmail, sanitizeForDatabase } from '@/utils/sanitize';

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
    
    const { name, email, message, relation, is_anonymous } = body;

    // Validate required fields - only message is required now
    if (!message || message.trim().length === 0) {
      console.error('Missing required field: message');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate: if not anonymous, name should be provided
    if (!is_anonymous && (!name || name.trim().length === 0)) {
      console.error('Name required when not anonymous');
      return NextResponse.json(
        { error: 'Name is required when not sharing anonymously' },
        { status: 400 }
      );
    }

    // Sanitize all inputs to prevent XSS and injection attacks
    const sanitizedName = name ? sanitizeText(name.trim()) : null;
    const sanitizedEmail = email ? sanitizeEmail(email.trim()) : null;
    const sanitizedMessage = sanitizeForDatabase(message.trim());
    const sanitizedRelation = relation ? sanitizeText(relation) : null;

    // Additional validation after sanitization
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message contains invalid content' },
        { status: 400 }
      );
    }

    if (sanitizedEmail && sanitizedEmail.length === 0 && email.trim().length > 0) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Build insert object - conditionally include is_anonymous to handle missing column
    const insertData: any = { 
      name: is_anonymous ? null : sanitizedName, 
      email: sanitizedEmail, 
      message: sanitizedMessage, 
      relation: sanitizedRelation
    };
    
    // Only include is_anonymous if it's true (to avoid errors if column doesn't exist yet)
    // If column doesn't exist, Supabase will ignore unknown fields, but safer to conditionally include
    if (is_anonymous) {
      insertData.is_anonymous = true;
    }

    // Insert into database
    const { data: memory, error } = await supabase
      .from('memories')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST:', error);
      // If error is about unknown column, try without is_anonymous
      if (error.message && error.message.includes('column') && error.message.includes('is_anonymous')) {
        console.warn('[Memories API] is_anonymous column not found, retrying without it');
        const { data: retryMemory, error: retryError } = await supabase
          .from('memories')
          .insert([
            { 
              name: is_anonymous ? null : (name?.trim() || null), 
              email: email?.trim() || null, 
              message: message.trim(), 
              relation: relation || null
            }
          ])
          .select()
          .single();
        
        if (retryError) {
          console.error('Supabase error on retry:', retryError);
          throw retryError;
        }
        
        return NextResponse.json({ memory: retryMemory });
      }
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
    
    // Return more detailed error information
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      ...(error as any).code && { code: (error as any).code },
      ...(error as any).details && { details: (error as any).details },
      ...(error as any).hint && { hint: (error as any).hint }
    } : { message: errorMessage };

    return NextResponse.json(
      { 
        error: 'Failed to create memory', 
        details: errorMessage,
        ...errorDetails
      },
      { status: 500 }
    );
  }
} 