// ═══ Supabase Client ═══
// Using ESM CDN so it works in plain browsers without a bundler
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase Credentials
// Fallback for GitHub Pages where environment variables aren't available
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
export const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://htmarvcmhieyfcyzibti.supabase.co';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWFydmNtaGlleWZjeXppYnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODM1MDAsImV4cCI6MjA5Mjg1OTUwMH0.7PpOSLmsnr8uQI90095Tzr2m8IXLe4BNsZ3TE9CZZmI';

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

