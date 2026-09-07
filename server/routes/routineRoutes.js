const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// 1. List all routines
router.get('/routines', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routines')
      .select(`
        *,
        course:courses(name),
        teacher:profiles(full_name)
      `)
      .order('day_of_week', { ascending: true })
      .order('time_of_day', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Create a routine
router.post('/routines', async (req, res) => {
  try {
    const { topic, day_of_week, time_of_day, duration, teacher_id, course_id, is_active } = req.body;

    const { data, error } = await supabase
      .from('routines')
      .insert([{ topic, day_of_week, time_of_day, duration, teacher_id, course_id, is_active }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data, message: 'Routine created successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. Update a routine
router.put('/routines/:id', async (req, res) => {
  try {
    const { topic, day_of_week, time_of_day, duration, teacher_id, course_id, is_active } = req.body;
    
    const { data, error } = await supabase
      .from('routines')
      .update({ topic, day_of_week, time_of_day, duration, teacher_id, course_id, is_active })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Routine updated successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 4. Delete a routine
router.delete('/routines/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('routines')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Routine deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
