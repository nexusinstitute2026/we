import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://htmarvcmhieyfcyzibti.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log("Fixing 2027 months to 2026...");

  const { data, error } = await supabase
    .from('course_months')
    .update({ year: 2026 })
    .eq('year', 2027)
    .select();

  if (error) {
    console.error("Error updating months:", error);
  } else {
    console.log(`Successfully updated ${data ? data.length : 0} records to year 2026.`);
  }
}

main().catch(console.error);
