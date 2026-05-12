// ═══ Leaderboard Points Module ═══
import supabase from './supabase.js';

// Point Weights
const WEIGHTS = {
  quiz:       1.0,   // Raw score % → points
  assignment: 1.2,   // Assignment gets 20% bonus
  activity:   1.0,
};

/**
 * Award points to a student for completing a quiz/assignment/activity.
 * Safely ignores duplicate attempts (same student + source).
 *
 * @param {Object} opts
 * @param {string} opts.studentId
 * @param {string} opts.courseId
 * @param {string} opts.subjectId   - Subject UUID (from course → subject)
 * @param {string} opts.sourceId    - Quiz/Assignment/Activity UUID
 * @param {'quiz'|'assignment'|'activity'} opts.type
 * @param {number} opts.score       - Raw score earned
 * @param {number} opts.maxScore    - Maximum possible score
 */
export async function awardPoints({ studentId, courseId, subjectId, sourceId, type, score, maxScore }) {
  if (!studentId || !courseId || !sourceId || score == null || !maxScore) return;

  const pct = score / maxScore;             // 0.0 – 1.0
  const base = pct * 100;                  // normalize to 100-point scale
  const points = Math.round(base * (WEIGHTS[type] || 1.0) * 10) / 10;

  const { error } = await supabase
    .from('student_points')
    .upsert({
      student_id:   studentId,
      course_id:    courseId,
      subject_id:   subjectId,
      source_id:    sourceId,
      category_type: type,
      points_earned: points,
    }, { onConflict: 'student_id,source_id' });  // update if re-graded

  if (error) console.warn('[Leaderboard] awardPoints error:', error.message);
}

/**
 * Fetch the subject_id for a given course_id.
 * Needed to populate student_points.subject_id.
 */
export async function getSubjectIdForCourse(courseId) {
  const { data } = await supabase
    .from('courses')
    .select('subject_id')
    .eq('id', courseId)
    .single();
  return data?.subject_id || null;
}

// ─── Leaderboard Fetch Helpers ───────────────────────────────────────────────

export async function getLeaderboardOverall(limit = 50) {
  const { data, error } = await supabase.rpc('get_leaderboard_overall', { p_limit: limit });
  if (error) throw error;
  return data || [];
}

export async function getLeaderboardCourse(courseId, limit = 50) {
  const { data, error } = await supabase.rpc('get_leaderboard_course', { p_course_id: courseId, p_limit: limit });
  if (error) throw error;
  return data || [];
}

export async function getLeaderboardSubject(subjectId, limit = 50) {
  const { data, error } = await supabase.rpc('get_leaderboard_subject', { p_subject_id: subjectId, p_limit: limit });
  if (error) throw error;
  return data || [];
}

export async function getLeaderboardMonthly(year, month, limit = 50) {
  const { data, error } = await supabase.rpc('get_leaderboard_monthly', { p_year: year, p_month: month, p_limit: limit });
  if (error) throw error;
  return data || [];
}

export async function getMyRankOverall(studentId) {
  const { data, error } = await supabase.rpc('get_my_rank_overall', { p_student_id: studentId });
  if (error) return null;
  return data?.[0] || null;
}
