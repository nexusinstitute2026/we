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

const monthNames = {
  1: 'ජනවාරි',
  2: 'පෙබරවාරි',
  3: 'මාර්තු',
  4: 'අප්‍රේල්',
  5: 'මැයි'
};

async function main() {
  console.log("Starting to add months...");

  // Get A/L Section
  const { data: section, error: secErr } = await supabase
    .from('sections')
    .select('id')
    .eq('name', 'A/L Section')
    .single();

  if (secErr || !section) {
    console.error("Could not find A/L Section");
    process.exit(1);
  }

  // Get Categories for this section
  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .eq('section_id', section.id);

  const categoryIds = categories.map(c => c.id);

  // Get Subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id')
    .in('category_id', categoryIds);

  const subjectIds = subjects.map(s => s.id);

  // Get Courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name')
    .in('subject_id', subjectIds);

  console.log(`Found ${courses.length} courses in A/L Section.`);

  for (const course of courses) {
    // Determine year from course name, default 2026
    const match = course.name.match(/202[67]/);
    const year = match ? parseInt(match[0]) : 2026;

    console.log(`Adding months to ${course.name} (Year: ${year})`);

    const monthsToInsert = [];
    for (let m = 1; m <= 5; m++) {
      monthsToInsert.push({
        course_id: course.id,
        year: year,
        month_number: m,
        name: monthNames[m],
        payment_deadline_date: 14,
        is_free: false
      });
    }

    // Insert ignoring conflicts (in case some already exist)
    const { error } = await supabase
      .from('course_months')
      .upsert(monthsToInsert, { onConflict: 'course_id,year,month_number' });

    if (error) {
      console.error(`Error adding months for ${course.name}:`, error.message);
    }
  }

  console.log("Finished adding months.");
}

main().catch(console.error);
