import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variables (in development only)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

// Create Supabase client
let supabase;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a mock client in development to prevent app crashes
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using mock Supabase client in development');
    supabase = {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: new Error('Mock Supabase client') }),
      }),
    };
  } else {
    throw error;
  }
}

export { supabase }; 