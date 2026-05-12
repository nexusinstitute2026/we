import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://htmarvcmhieyfcyzibti.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in process.env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log("Starting data setup...");

  const teachersToCreate = [
    { name: 'Madhubhashini Chandrapala', wa: '0711111111', id_num: '111111111V', email: 'madhu@nexuslms.com', avatar: '/images/Madhu_T-.png' },
    { name: 'Sameera Rathnayaka', wa: '0722222222', id_num: '222222222V', email: 'sameera@nexuslms.com', avatar: '/images/Sameera_T.png' },
    { name: 'Pradeep S Dissanayaka', wa: '0733333333', id_num: '333333333V', email: 'pradeep@nexuslms.com', avatar: '/images/pradeep_T.png' }
  ];

  const teacherIds = {};

  // We'll store avatar in the `address` field since there is no avatar_url
  // Create Teachers
  for (const t of teachersToCreate) {
    let { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
    let user = usersData?.users.find(u => u.email === t.email);
    
    if (!user) {
      const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
        email: t.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: t.name, role: 'teacher' }
      });
      if (createErr) {
        console.error("Error creating user:", t.email, createErr);
        continue;
      }
      user = createdUser.user;
    }
    
    // Upsert profile
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: user.id,
      role: 'teacher',
      full_name: t.name,
      whatsapp_number: t.wa,
      id_number: t.id_num,
      address: t.avatar // Store avatar in address for now to avoid schema changes
    });
    
    if (profileErr) {
      console.error("Error upserting profile for:", t.name, profileErr);
    } else {
      teacherIds[t.name] = user.id;
      console.log(`Teacher created/found: ${t.name} -> ${user.id}`);
    }
  }

  console.log("Clearing old sections...");
  await supabase.from('sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Create A/L Section
  const { data: alSection } = await supabase.from('sections').insert({ name: 'A/L Section', description: 'Advanced Level Courses' }).select().single();
  const { data: alCat } = await supabase.from('categories').insert({ section_id: alSection.id, name: 'A/L General' }).select().single();

  const alSubjects = [
    { name: 'Buddhism', teacher: 'Madhubhashini Chandrapala' },
    { name: 'Sinhala', teacher: 'Sameera Rathnayaka' },
    { name: 'Pali', teacher: 'Pradeep S Dissanayaka' },
    { name: 'Sanskrit', teacher: 'Pradeep S Dissanayaka' }
  ];

  const alCourseNames = ['2026 Revision', '2026 Speed revision', '2026 paper class', '2027 Theory'];

  for (const s of alSubjects) {
    const { data: sub } = await supabase.from('subjects').insert({
      category_id: alCat.id,
      name: s.name,
      teacher_id: teacherIds[s.teacher]
    }).select().single();

    for (const cn of alCourseNames) {
      await supabase.from('courses').insert({
        subject_id: sub.id,
        name: cn,
        fee: 2500,
        is_free: false
      });
    }
  }
  console.log("A/L Section created.");

  // Create Prachina Section
  const { data: pSection } = await supabase.from('sections').insert({ name: 'Prachina Section', description: 'Prachina Courses' }).select().single();
  
  const pCategories = ['Praarambha (ප්‍රාරම්භ)', 'Madhyama (මධ්‍යම)', 'Awasana (අවසාන)'];
  const pSubjects = [
    { name: 'Sinhala', teacher: 'Sameera Rathnayaka' },
    { name: 'Pali', teacher: 'Pradeep S Dissanayaka' },
    { name: 'Sanskrit', teacher: 'Pradeep S Dissanayaka' }
  ];

  for (const catName of pCategories) {
    const { data: cat } = await supabase.from('categories').insert({ section_id: pSection.id, name: catName }).select().single();

    for (const s of pSubjects) {
      const { data: sub } = await supabase.from('subjects').insert({
        category_id: cat.id,
        name: s.name,
        teacher_id: teacherIds[s.teacher]
      }).select().single();

      // Ensure Prachina subjects have at least one course so they show up
      await supabase.from('courses').insert({
        subject_id: sub.id,
        name: 'Prachina Course',
        fee: 2500,
        is_free: false
      });
    }
  }
  console.log("Prachina Section created.");

  console.log("Data setup complete!");
}

main().catch(console.error);
