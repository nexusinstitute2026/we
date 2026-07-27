// ═══ Attendance & Google Sheets Sync ═══
import supabase from './supabase.js';

// Log attendance when student clicks Zoom or YouTube link
export async function logAttendance({ studentId, courseId, sessionType, sessionLink }) {
  const { error } = await supabase.from('attendance').insert({
    student_id: studentId,
    course_id: courseId,
    session_type: sessionType, // 'zoom' | 'youtube'
    session_link: sessionLink,
  });
  if (error) console.error('Attendance log error:', error);
}

// Get student attendance for a course
export async function getAttendance(studentId, courseId) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .order('clicked_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Teacher/Admin: get all attendance for a course
export async function getCourseAttendance(courseId) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, student:profiles(full_name)')
    .eq('course_id', courseId)
    .order('clicked_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Sync sessions from Google Sheet via Edge Function
export async function syncGoogleSheet(sheetUrl) {
  const { data, error } = await supabase.functions.invoke('sync-sheet', {
    body: { sheetUrl }
  });
  if (error) throw new Error('Sheet sync failed: ' + error.message);
  return data?.sessions || [];
}

// Get sessions for a course (from Supabase courses table google_sheet_link)
export async function getCourseSessions(courseId) {
  const { data: course, error } = await supabase
    .from('courses')
    .select('google_sheet_link')
    .eq('id', courseId)
    .single();
  if (error || !course?.google_sheet_link) return [];
  return await syncGoogleSheet(course.google_sheet_link);
}

// Admin: save Google Sheet link to course
export async function updateSheetLink(courseId, sheetUrl) {
  const { error } = await supabase
    .from('courses')
    .update({ google_sheet_link: sheetUrl })
    .eq('id', courseId);
  if (error) throw error;
}
