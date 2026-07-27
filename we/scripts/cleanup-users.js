import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanup() {
  console.log('Fetching users...');
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  console.log(`Found ${users.length} users in auth.users.`);
  for (const user of users) {
    if (user.email !== '0770000000@nexuslms.com') { // Keep admin
      const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (delError) console.error(`Error deleting ${user.email}:`, delError);
      else console.log(`Deleted orphaned user: ${user.email}`);
    }
  }
  console.log('Cleanup complete!');
}

cleanup();
