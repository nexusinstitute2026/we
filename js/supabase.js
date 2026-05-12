// ═══ Supabase Client ═══
// Using ESM CDN so it works in plain browsers without a bundler
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Fallback for environment variables (works in both Vite and plain browsers)
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
export const SUPABASE_URL = env.VITE_SUPABASE_URL || window.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || window.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

export default supabase;

