import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function listUsers() {
    const { data: profiles, error } = await supabase.from('profiles').select('*').limit(10);
    if (error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(profiles, null, 2));
}

listUsers();
