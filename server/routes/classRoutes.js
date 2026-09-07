const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { scheduleSingleClass } = require('../services/schedulerService');

// 1. Teacher Single Class Scheduling Route
router.post('/teacher/schedule-class', async (req, res) => {
  try {
    const { topic, startTime, duration, teacherId, courseId } = req.body;

    const { data: existingClasses, error: fetchError } = await supabase
      .from('classes')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .eq('status', 'scheduled');

    if (fetchError) throw fetchError;

    const classPayload = await scheduleSingleClass({
      topic,
      startTime,
      duration,
      teacherId,
      courseId,
      existingClasses
    });

    const { data: savedClass, error: insertError } = await supabase
      .from('classes')
      .insert([classPayload])
      .select()
      .single();

    if (insertError) throw insertError;

    await syncClassToCourseMonthAndSession(savedClass);

    res.status(200).json({
      success: true,
      message: 'Class scheduled successfully.',
      data: savedClass
    });
  } catch (error) {
    console.error('Error scheduling class:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Helper function to auto-sync class records into course_months and sessions tables
async function syncClassToCourseMonthAndSession(classData) {
  try {
    if (!classData.course_id || !classData.start_time) return;

    const startDate = new Date(classData.start_time);
    const year = startDate.getFullYear();
    const monthNumber = startDate.getMonth() + 1;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = `${monthNames[monthNumber - 1]} ${year}`;

    // 1. Get or create course_month
    let { data: courseMonth, error: cmErr } = await supabase
      .from('course_months')
      .select('*')
      .eq('course_id', classData.course_id)
      .eq('year', year)
      .eq('month_number', monthNumber)
      .maybeSingle();

    if (cmErr) {
      console.error('Error fetching course_month:', cmErr);
    }

    if (!courseMonth) {
      const { data: newMonth, error: createCmErr } = await supabase
        .from('course_months')
        .insert([{
          course_id: classData.course_id,
          year: year,
          month_number: monthNumber,
          name: monthName,
          scheduling_method: 'api'
        }])
        .select()
        .single();

      if (createCmErr) {
        console.error('Error creating course_month:', createCmErr);
      } else {
        courseMonth = newMonth;
      }
    }

    if (!courseMonth) return;

    // 2. Insert or upsert session
    const sessionPayload = {
      course_id: classData.course_id,
      course_month_id: courseMonth.id,
      start_time: classData.start_time,
      title: classData.topic,
      zoom_link: classData.zoom_join_url || null,
      yt_link: classData.youtube_live_url || null
    };

    const { error: sessionErr } = await supabase
      .from('sessions')
      .upsert([sessionPayload], { onConflict: 'course_month_id,start_time,title' });

    if (sessionErr) {
      console.error('Error syncing session to course_months/sessions:', sessionErr);
    }
  } catch (err) {
    console.error('Sync helper failed:', err);
  }
}

// Helper function to build preview list for a given year & month
async function getPreviewListForMonth(year, month) {
  const { data: routines, error: routineErr } = await supabase
    .from('routines')
    .select('*, course:courses(name), teacher:profiles(full_name)')
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })
    .order('time_of_day', { ascending: true });

  if (routineErr) throw routineErr;

  const courseRecCounts = {};

  for (const routine of routines) {
    if (routine.course_id && !(routine.course_id in courseRecCounts)) {
      // Fetch existing classes for this course to calculate next recording number based on DB count OR highest Rec number found in topic
      const { data: existingClasses } = await supabase
        .from('classes')
        .select('topic')
        .eq('course_id', routine.course_id)
        .neq('status', 'cancelled');
      
      let maxRecNo = 0;
      if (existingClasses && existingClasses.length > 0) {
        maxRecNo = existingClasses.length;
        existingClasses.forEach(c => {
          if (c.topic) {
            const match = c.topic.match(/Rec\s*0*(\d+)/i);
            if (match && match[1]) {
              const num = parseInt(match[1], 10);
              if (num > maxRecNo) maxRecNo = num;
            }
          }
        });
      }
      
      courseRecCounts[routine.course_id] = maxRecNo;
    }
  }

  const previewItems = [];

  for (const routine of routines) {
    if (!routine.teacher_id || !routine.course_id) continue;

    const datesInMonth = getDatesForDayOfWeek(year, month - 1, routine.day_of_week);
    const courseName = routine.course?.name || routine.topic;

    for (const date of datesInMonth) {
      const [hours, minutes] = routine.time_of_day.split(':');
      const startTime = new Date(date);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const currentRecNo = (courseRecCounts[routine.course_id] || 0) + 1;
      courseRecCounts[routine.course_id] = currentRecNo;
      const recFormatted = String(currentRecNo).padStart(2, '0');

      const topicWithRec = `${courseName} - Rec ${recFormatted}`;

      previewItems.push({
        id: `preview-${routine.id}-${startTime.getTime()}`,
        routineId: routine.id,
        courseId: routine.course_id,
        teacherId: routine.teacher_id,
        courseName: courseName,
        teacherName: routine.teacher?.full_name || 'Teacher',
        topic: topicWithRec,
        recNo: currentRecNo,
        dateStr: date.toISOString().split('T')[0],
        timeOfDay: routine.time_of_day,
        startTime: startTime.toISOString(),
        duration: routine.duration,
        dayOfWeek: routine.day_of_week,
        selected: true
      });
    }
  }

  previewItems.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return previewItems;
}

// 1.8 Preview Monthly Bulk Schedule Route
router.post('/admin/preview-monthly', async (req, res) => {
  try {
    const { year, month } = req.body;
    const previewList = await getPreviewListForMonth(year, month);
    res.json({ success: true, data: previewList });
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. System Admin Monthly Bulk Scheduling Route
router.post('/admin/schedule-monthly', async (req, res) => {
  try {
    const { year, month, selectedClasses } = req.body;

    const { data: activeClasses, error: classErr } = await supabase
      .from('classes')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .eq('status', 'scheduled');
    
    if (classErr) throw classErr;

    let localActiveClasses = [...activeClasses];
    const results = [];
    const errors = [];

    // Determine target classes list to schedule
    let targetList = [];
    if (Array.isArray(selectedClasses) && selectedClasses.length > 0) {
      targetList = selectedClasses;
    } else {
      targetList = await getPreviewListForMonth(year, month);
    }

    for (const item of targetList) {
      try {
        const classPayload = await scheduleSingleClass({
          topic: item.topic,
          startTime: item.startTime,
          duration: item.duration,
          teacherId: item.teacherId,
          courseId: item.courseId,
          existingClasses: localActiveClasses
        });

        const { data: newClass, error: insErr } = await supabase
          .from('classes')
          .insert([classPayload])
          .select()
          .single();

        if (insErr) throw insErr;

        await syncClassToCourseMonthAndSession(newClass);

        localActiveClasses.push(newClass);
        results.push(newClass);
      } catch (err) {
        const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
        console.error(`Bulk schedule error for "${item.topic}" on ${item.startTime}:`, detail);
        errors.push({ topic: item.topic, date: item.startTime, error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Monthly bulk schedule execution completed.',
      totalCreated: results.length,
      successfulClasses: results,
      failedClasses: errors
    });
  } catch (error) {
    console.error('Error in bulk schedule:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get all classes (can filter by teacherId or courseId)
router.get('/classes', async (req, res) => {
  try {
    const { teacherId, courseId } = req.query;
    
    let query = supabase.from('classes').select('*').order('start_time', { ascending: true });
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }
    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Cancel a class
router.delete('/classes/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('classes')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.json({ success: true, message: 'Class cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function getDatesForDayOfWeek(year, monthIndex, dayOfWeek) {
  const dates = [];
  const date = new Date(year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    if (date.getDay() === dayOfWeek) {
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

module.exports = router;
