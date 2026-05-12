// ═══ Quiz Module ═══
import supabase from './supabase.js';
import { awardPoints, getSubjectIdForCourse } from './leaderboard.js';

// Get quizzes for a course
export async function getCourseQuizzes(courseId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, creator:profiles(full_name)')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Get single quiz with questions
export async function getQuiz(quizId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, course:courses(name)')
    .eq('id', quizId)
    .single();
  if (error) throw error;
  return data;
}

// Check if student already attempted
export async function getMyAttempt(quizId, studentId) {
  const { data } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('student_id', studentId)
    .maybeSingle();
  return data;
}

// Submit quiz attempt
export async function submitAttempt({ quizId, studentId, answers, questions, timeTaken }) {
  // 1. Double check if already attempted to prevent race conditions
  const { data: existing } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('quiz_id', quizId)
    .eq('student_id', studentId)
    .maybeSingle();
    
  if (existing) {
    console.warn('Attempt already exists, skipping insert.');
    return { attempt: existing, alreadySubmitted: true };
  }

  // Calculate score
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      student_id: studentId,
      score,
      time_taken: timeTaken,
      answers,
    })
    .select('*, quiz:quizzes(course_id)')
    .single();
  if (error) throw error;

  // Award leaderboard points (fire & forget)
  try {
    const courseId = data.quiz?.course_id;
    if (courseId) {
      const subjectId = await getSubjectIdForCourse(courseId);
      await awardPoints({
        studentId, courseId, subjectId,
        sourceId: quizId,
        type: 'quiz',
        score,
        maxScore: questions.length,
      });
    }
  } catch(e) { console.warn('[Leaderboard] quiz points error:', e.message); }

  return { attempt: data, score, total: questions.length };
}

// Get leaderboard for a quiz
export async function getLeaderboard(quizId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, student:profiles(full_name)')
    .eq('quiz_id', quizId)
    .order('rank', { ascending: true })
    .limit(50);
  if (error) throw error;
  return data || [];
}

// Teacher: get all attempts for a quiz with student info
export async function getQuizReport(quizId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, student:profiles(full_name, whatsapp_number), quiz:quizzes(title, time_limit)')
    .eq('quiz_id', quizId)
    .order('rank', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Teacher: create quiz
export async function createQuiz({ courseId, title, timeLimit, questions, createdBy, status = 'published', publishAt = null, shuffle = false }) {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      course_id: courseId,
      title,
      time_limit: timeLimit || null,
      questions,
      created_by: createdBy,
      status,
      publish_at: publishAt,
      shuffle,
    })
    .select()
    .single();
  if (error) throw error;

  // Notify enrolled students ONLY if published and not scheduled for later
  const now = new Date();
  const isImmediate = status === 'published' && (!publishAt || new Date(publishAt) <= now);

  if (isImmediate) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('course_id', courseId);
      
    if (enrollments?.length) {
      const notifs = enrollments.map(e => ({
        user_id: e.student_id,
        message: `නව අනුමාන ප්‍රශ්න පත්‍රයක්: "${title}" ලබා දී ඇත.|URL:/pages/course.html?id=${courseId}`,
      }));
      // Use upsert to prevent duplicates
      await supabase.from('notifications').upsert(notifs, { onConflict: 'user_id,message' });
    }
  }
  return data;
}

// Teacher: update quiz
export async function updateQuiz(quizId, updates) {
  const { data, error } = await supabase
    .from('quizzes')
    .update(updates)
    .eq('id', quizId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Teacher: delete quiz
export async function deleteQuiz(quizId) {
  const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
  if (error) throw error;
}

// Get all quizzes teacher created
export async function getTeacherQuizzes(teacherId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, course:courses(name)')
    .eq('created_by', teacherId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
