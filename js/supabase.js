// ═══ Supabase Client ═══
import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables
// Create a .env file in the root and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

export default supabase;

