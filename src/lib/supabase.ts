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
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[Supabase Init] Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

// Create and export the Supabase client
// Type is explicitly SupabaseClient
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabase }; 