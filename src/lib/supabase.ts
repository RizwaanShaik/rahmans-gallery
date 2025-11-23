import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variables (always log in production for debugging)
console.log('[Supabase Init] NODE_ENV:', process.env.NODE_ENV);
console.log('[Supabase Init] URL:', supabaseUrl || 'MISSING');
console.log('[Supabase Init] Anon Key:', supabaseAnonKey ? `Present (${supabaseAnonKey.length} chars)` : 'Missing');
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.warn('[Supabase Init] WARNING: Anon key does not start with "eyJ" - might not be a valid JWT token');
}

// Check if environment variables are set
// Only throw error in production - in development, allow graceful degradation
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[Supabase Init] ERROR: Missing Supabase environment variables');
    console.error('[Supabase Init] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'MISSING');
    console.error('[Supabase Init] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'MISSING');
    throw new Error('[Supabase Init] Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  } else {
    console.warn('[Supabase Init] Supabase not configured. Contact form submissions will not be saved.');
  }
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.includes('placeholder')) {
  console.error('[Supabase Init] ERROR: Invalid Supabase URL format:', supabaseUrl);
  console.error('[Supabase Init] URL should start with https://');
}

// Create and export the Supabase client
// Type is explicitly SupabaseClient
// Use dummy values if not configured (for development only)
let supabase: SupabaseClient;
try {
  supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
    : createClient('https://placeholder.supabase.co', 'placeholder-key');
  
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    console.log('[Supabase Init] ✓ Supabase client created successfully');
  } else {
    console.warn('[Supabase Init] ⚠️  Using placeholder Supabase client');
  }
} catch (error) {
  console.error('[Supabase Init] ERROR creating Supabase client:', error);
  throw error;
}

export { supabase }; 