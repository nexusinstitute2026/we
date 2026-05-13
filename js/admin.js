// ═══ Admin & Hierarchy Module ═══
import supabase from './supabase.js';

// ── Hierarchy Data Fetching ──

export async function getFullHierarchy() {
  const { data, error } = await supabase
    .from('sections')
    .select(`
      id, name, description,
      categories (
        id, name,
        subjects (
          id, name,
          teacher:profiles(id, full_name),
          courses (
            id, name, fee, is_free,
            course_months (
              id, year, month_number, name, google_sheet_url, image_url
            )
          )
        )
      )
    `);
  if (error) throw error;
  return data || [];
}

// ── Sections ──
export async function getSections() {
  const { data, error } = await supabase.from('sections').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function createSection(name, description) {
  const { data, error } = await supabase.from('sections').insert({ name, description }).select().single();
  if (error) throw error;
  return data;
}

export async function updateSection(id, name, description) {
  const { error } = await supabase.from('sections').update({ name, description }).eq('id', id);
  if (error) throw error;
}

export async function deleteSection(id) {
  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) throw error;
}

// ── Categories ──
export async function createCategory(sectionId, name) {
  const { data, error } = await supabase.from('categories').insert({ section_id: sectionId, name }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, name) {
  const { error } = await supabase.from('categories').update({ name }).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ── Subjects ──
export async function createSubject(categoryId, name, teacherId) {
  const { data, error } = await supabase.from('subjects').insert({ category_id: categoryId, name, teacher_id: teacherId || null }).select().single();
  if (error) throw error;
  return data;
}

export async function updateSubject(id, name, teacherId) {
  const { error } = await supabase.from('subjects').update({ name, teacher_id: teacherId || null }).eq('id', id);
  if (error) throw error;
}

export async function deleteSubject(id) {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
}

// ── Courses ──
export async function createCourse(subjectId, name, numMonths, fee = 2500, isFree = false) {
  const { data, error } = await supabase.from('courses').insert({ subject_id: subjectId, name, fee, is_free: isFree }).select().single();
  if (error) throw error;
  if (numMonths && parseInt(numMonths) > 0) {
    const monthsData = [];
    const monthNames = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1;
    const totalMonths = parseInt(numMonths);

    for (let i = 0; i < totalMonths; i++) {
      let targetMonth = currentMonth + i;
      let targetYear = currentYear;
      
      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear++;
      }

      monthsData.push({
        course_id: data.id,
        year: targetYear,
        month_number: targetMonth,
        name: monthNames[targetMonth - 1],
        image_url: `https://picsum.photos/300/200?random=${data.id}${targetMonth}${targetYear}`
      });
    }
    const { error: mError } = await supabase.from('course_months').insert(monthsData);
    if (mError) throw mError;
  }
  
  return data;
}

export async function updateCourse(id, name, fee = 2500, isFree = false) {
  const { error } = await supabase.from('courses').update({ name, fee, is_free: isFree }).eq('id', id);
  if (error) throw error;
}

export async function deleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

// ── Course Months ──
export async function createCourseMonth(courseId, year, monthNumber, name, sheetUrl, paymentDeadlineDate = 14, isFree = false) {
  const { data, error } = await supabase.from('course_months').insert({
    course_id: courseId,
    year, month_number: monthNumber, name,
    google_sheet_url: sheetUrl || null,
    payment_deadline_date: paymentDeadlineDate,
    is_free: isFree,
    image_url: `https://picsum.photos/300/200?random=${courseId}${monthNumber}`
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCourseMonth(id, year, monthNumber, name, sheetUrl, paymentDeadlineDate = 14, isFree = false) {
  const { error } = await supabase.from('course_months').update({
    year, month_number: monthNumber, name, google_sheet_url: sheetUrl || null,
    payment_deadline_date: paymentDeadlineDate, is_free: isFree
  }).eq('id', id);
  if (error) throw error;
}

export async function deleteCourseMonth(id) {
  const { error } = await supabase.from('course_months').delete().eq('id', id);
  if (error) throw error;
}

// ── Users ──
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getUsersByRole(role) {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', role).order('full_name');
  if (error) throw error;
  return data || [];
}

export async function createTeacher({ full_name, school, address, id_number, whatsapp_number }) {
  const { registerStudent } = await import('./auth.js');
  const result = await registerStudent({ full_name, school, address, id_number, whatsapp_number });
  await supabase.from('profiles').update({ role: 'teacher' }).eq('id', result.user.id);
  return result;
}

export async function updateUserProfile(id, updates) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteUser(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}

// ── Enrollments ──
export async function getAllEnrollments() {
  const { data, error } = await supabase.from('enrollments')
    .select('*, student:profiles(full_name, whatsapp_number), course:courses(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEnrollment(studentId, courseId) {
  const { error } = await supabase.from('enrollments').upsert([{ student_id: studentId, course_id: courseId }], { onConflict: 'student_id,course_id' });
  if (error) throw error;
}

export async function getStudentCourseMonths(studentId, courseId) {
  const { data: months } = await supabase.from('course_months').select('*').eq('course_id', courseId).order('year').order('month_number');
  const { data: accessData } = await supabase.from('payment_courses')
    .select('payment_id, payments!inner(id, paid_year, paid_month, status, slip_drive_link)')
    .eq('course_id', courseId)
    .eq('payments.student_id', studentId)
    .in('payments.status', ['approved']);
  return { months: months || [], accessData: accessData || [] };
}

export async function toggleStudentMonthAccess(studentId, courseId, year, month, grant) {
  if (grant) {
    const { data: p, error } = await supabase.from('payments').insert({
      student_id: studentId, paid_year: year, paid_month: month, amount: 0, slip_drive_link: 'manual_assign', status: 'approved'
    }).select().single();
    if (error) throw error;
    if (p) await supabase.from('payment_courses').insert({ payment_id: p.id, course_id: courseId });
  } else {
    // Revoke access: find payment_courses links for this month and delete them
    const { data: payments } = await supabase.from('payments')
      .select('id').eq('student_id', studentId).eq('paid_year', year).eq('paid_month', month);
    if (payments && payments.length > 0) {
      for (const p of payments) {
        await supabase.from('payment_courses').delete().eq('payment_id', p.id).eq('course_id', courseId);
      }
    }
  }
}

export async function updateEnrollment(id) {
  // status and expiry_date don't exist in the current schema
  console.warn('Update enrollment skipped: status and expiry_date columns missing in schema.');
}

export async function deleteEnrollment(id) {
  const { error } = await supabase.from('enrollments').delete().eq('id', id);
  if (error) throw error;
}

// ── Dashboard Stats ──
export async function getAdminStats() {
  const [students, courses, pendingPayments, activeEnrollments] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
  ]);
  return {
    students: students.count || 0,
    courses: courses.count || 0,
    pendingPayments: pendingPayments.count || 0,
    activeEnrollments: activeEnrollments.count || 0,
  };
}

// ── Teacher's subjects and courses ──
export async function getTeacherSubjects(teacherId) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*, category:categories(name, section:sections(name)), courses(*, course_months(*))')
    .eq('teacher_id', teacherId);
  if (error) throw error;
  return data || [];
}

export async function getTeacherCourses(teacherId) {
  const subjects = await getTeacherSubjects(teacherId);
  const courses = [];
  subjects.forEach(s => {
    if (s.courses) {
      s.courses.forEach(c => {
        courses.push({
          ...c,
          title: `${s.name} - ${c.name}` // Formatted title for dropdowns
        });
      });
    }
  });
  return courses;
}

// ── Force Sync Google Sheet (Client-side directly from Google) ──
export async function syncCourseSheet(courseId, courseMonthId, sheetUrl) {
  const match = sheetUrl.match(/\/d\/(.*?)(?:\/|$)/);
  if (!match) throw new Error('අවලංගු Google Sheet ලින්ක් එකකි. කරුණාකර ලින්ක් එක පරීක්ෂා කරන්න.');
  const sheetId = match[1];

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error fetching sheet');
    const text = await res.text();
    
    // Extract JSON from Google's response wrapper
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonStr);
    
    const rows = data.table.rows;
    if (!rows || rows.length === 0) throw new Error('Sheet හිස්ව පවතී.');

    // Fetch existing sessions for this month to prevent duplicates and preserve IDs
    const { data: existing } = await supabase.from('sessions').select('id, start_time').eq('course_month_id', courseMonthId);
    const existingMap = new Map();
    if (existing) {
      existing.forEach(s => {
        try {
          existingMap.set(new Date(s.start_time).toISOString(), s.id);
        } catch(e) {}
      });
    }

    const sessionsToUpsert = [];
    const sheetDates = new Set();

    // Start from index 1 (Row 2)
    for (let i = 1; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || !c[1] || (!c[1].v && !c[1].f)) continue; // Skip if 'Start Time' column is empty
      
      let dateVal = c[1].f || c[1].v;
      let topicVal = c[0] && c[0].v ? String(c[0].v) : 'පන්තිය';
      
      let parsedDate = new Date(dateVal);
      
      // Handle Google Visualization Date string: "Date(2026,3,6,19,0,0)"
      if (isNaN(parsedDate.getTime()) && c[1].v && String(c[1].v).startsWith('Date(')) {
        const parts = String(c[1].v).match(/Date\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/);
        if (parts) {
          // JS Months are 0-indexed in Date constructor
          parsedDate = new Date(parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);
        }
      }

      if (isNaN(parsedDate.getTime())) {
          parsedDate = new Date(String(dateVal).replace(/\./g, '/')); 
      }
      
      if (isNaN(parsedDate.getTime())) {
          console.warn(`[Sync] Skipping row ${i} due to invalid date:`, c[1].v, c[1].f);
          continue; 
      }

      const isoDate = parsedDate.toISOString();
      const sessionObj = {
        course_id: courseId,
        course_month_id: courseMonthId,
        title: topicVal,
        zoom_link: c[4] && c[4].v ? String(c[4].v) : null,
        yt_link: c[5] && c[5].v ? String(c[5].v) : null,
        start_time: isoDate
      };

      // If we already have a session at this exact start_time, update it instead of creating a duplicate
      if (existingMap.has(isoDate)) {
        sessionObj.id = existingMap.get(isoDate);
      }

      sessionsToUpsert.push(sessionObj);
      sheetDates.add(isoDate);
    }

    if (sessionsToUpsert.length === 0) {
      throw new Error('Sheet එකේ වලංගු දත්ත කිසිවක් හමු නොවීය. කරුණාකර දින වකවානු පරීක්ෂා කරන්න.');
    }

    // Upsert the sessions
    const { error } = await supabase.from('sessions').upsert(sessionsToUpsert);
    if (error) {
      console.error('[Sync Error]', error);
      throw error;
    }

    // Attempt to delete sessions that are no longer in the sheet
    if (existing) {
      const toDelete = existing.filter(s => {
        try { return !sheetDates.has(new Date(s.start_time).toISOString()); }
        catch(e) { return false; }
      }).map(s => s.id);

      if (toDelete.length > 0) {
        // We ignore errors here because they might have foreign key constraints (e.g. attendance records)
        await supabase.from('sessions').delete().in('id', toDelete);
      }
    }
    
    return { success: true, count: sessionsToUpsert.length };
  } catch (err) {
    throw new Error('Sheet Sync අසාර්ථකයි: ' + err.message);
  }
}
