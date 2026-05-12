import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
  console.log('URL:', SUPABASE_URL);
  
  const { data: sections, error: e1 } = await supabase.from('sections').select('*');
  const { data: categories, error: e2 } = await supabase.from('categories').select('*');
  const { data: subjects, error: e3 } = await supabase.from('subjects').select('*');
  const { data: courses, error: e4 } = await supabase.from('courses').select('*');
  const { data: profiles, error: e5 } = await supabase.from('profiles').select('*');

  if (e1) console.error('E1:', e1);
  if (e2) console.error('E2:', e2);
  if (e3) console.error('E3:', e3);
  if (e4) console.error('E4:', e4);
  if (e5) console.error('E5:', e5);

  console.log('Sections:', sections?.length);
  console.log('Categories:', categories?.length);
  console.log('Subjects:', subjects?.length);
  console.log('Courses:', courses?.length);
  console.log('Profiles:', profiles?.length);
}

checkData();
