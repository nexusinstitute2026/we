import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function listUsers() {
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  console.log('Users:', users.map(u => u.email));
  
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*');
  console.log('Profiles:', profiles);
}

listUsers();
