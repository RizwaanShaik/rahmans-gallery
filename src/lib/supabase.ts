import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variables (in development only)
if (process.env.NODE_ENV === 'development') {
  console.log('[Supabase Init] URL:', supabaseUrl);
  console.log('[Supabase Init] Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

// Check if environment variables are set
// Only throw error in production - in development, allow graceful degradation
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[Supabase Init] Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  } else {
    console.warn('[Supabase Init] Supabase not configured. Contact form submissions will not be saved.');
  }
}

// Create and export the Supabase client
// Type is explicitly SupabaseClient
// Use dummy values if not configured (for development only)
const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export { supabase }; 