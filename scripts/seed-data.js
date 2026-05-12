import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedData() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create Teachers
  console.log("1️⃣ Creating Teachers...");
  const teachers = [
    { email: 'madhubhashini@nexus.lms', pass: 'teacher', phone: '0700000001', name: 'Madhubhashini Chandrapala' },
    { email: 'sameera@nexus.lms', pass: 'teacher', phone: '0700000002', name: 'Sameera Rathnayaka' },
    { email: 'pradeep@nexus.lms', pass: 'teacher', phone: '0700000003', name: 'Pradeep S Dissanayaka' },
  ];

  const teacherIds = {};

  for (const t of teachers) {
    let uid;
    
    // 1. Try to find and delete existing user to ensure a truly clean state
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existing = userList?.users?.find(u => u.email === t.email);
    
    if (existing) {
      console.log(`Deleting existing user ${t.email}...`);
      await supabaseAdmin.auth.admin.deleteUser(existing.id);
    }

    // 2. Create User
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: t.email,
      password: t.pass,
      email_confirm: true
    });
    
    if (authErr) {
      console.error(`Auth error for ${t.email}:`, authErr);
      // If still fails, try to find one more time (maybe delete failed or race condition)
      const { data: retryList } = await supabaseAdmin.auth.admin.listUsers();
      const retryUser = retryList?.users?.find(u => u.email === t.email);
      if (retryUser) uid = retryUser.id;
      else continue;
    } else {
      uid = authData.user.id;
    }

    console.log(`Linking ${t.name} (UID: ${uid}) to profile...`);

    // 3. Upsert into profiles
    const { error: profErr } = await supabaseAdmin.from('profiles').upsert({
      id: uid, 
      role: 'teacher', 
      full_name: t.name, 
      whatsapp_number: t.phone, 
      id_number: 'T-' + Math.random().toString().slice(2,10)
    });

    if (profErr) {
      console.error(`Profile error for ${t.name}:`, profErr);
    }

    teacherIds[t.name] = uid;
  }



  // 2. Create Sections
  console.log("2️⃣ Creating Sections (A/L, Prachina)...");
  const { data: alData } = await supabaseAdmin.from('sections').upsert({ name: 'A/L Section', description: 'Advanced Level Classes' }, { onConflict: 'name' }).select().single();
  const { data: pData } = await supabaseAdmin.from('sections').upsert({ name: 'Prachina Section', description: 'Prachina Exams' }, { onConflict: 'name' }).select().single();

  // 3. Create Categories & Subjects & Courses
  console.log("3️⃣ Creating Categories, Subjects, and Courses...");

  // --- A/L Section ---
  const { data: alCat } = await supabaseAdmin.from('categories').insert({ section_id: alData.id, name: 'A/L Main' }).select().single();
  
  const alSubjects = [
    { name: 'Buddhism', teacher: teacherIds['Madhubhashini Chandrapala'] },
    { name: 'Sinhala', teacher: teacherIds['Sameera Rathnayaka'] },
    { name: 'Pali', teacher: teacherIds['Pradeep S Dissanayaka'] },
    { name: 'Sanskrit', teacher: teacherIds['Pradeep S Dissanayaka'] }
  ];

  for (const sub of alSubjects) {
    const { data: subData } = await supabaseAdmin.from('subjects').insert({ category_id: alCat.id, name: sub.name, teacher_id: sub.teacher }).select().single();
    
    // Add 4 courses for each subject
    const courseNames = ['2026 Revision', '2026 Speed Revision', '2026 Paper Class', '2027 Theory'];
    for (const cName of courseNames) {
      await supabaseAdmin.from('courses').insert({ subject_id: subData.id, name: cName });
    }
  }

  // --- Prachina Section ---
  const prachinaParts = ['Praarambha (ප්‍රාරම්භ)', 'Madhyama (මධ්‍යම)', 'Awasaana (අවසාන)'];
  const pSubjects = [
    { name: 'Sinhala', teacher: teacherIds['Sameera Rathnayaka'] },
    { name: 'Pali', teacher: teacherIds['Pradeep S Dissanayaka'] },
    { name: 'Sanskrit', teacher: teacherIds['Pradeep S Dissanayaka'] }
  ];

  for (const part of prachinaParts) {
    const { data: pCat } = await supabaseAdmin.from('categories').insert({ section_id: pData.id, name: part }).select().single();
    
    for (const sub of pSubjects) {
      await supabaseAdmin.from('subjects').insert({ category_id: pCat.id, name: sub.name, teacher_id: sub.teacher });
      // We can leave courses empty for now or add default ones.
    }
  }

  console.log("✅ Seeding Complete!");
}

seedData();
