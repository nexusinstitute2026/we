import supabase from './supabase.js';

// ── Payments & Enrollments ──

export async function submitPaymentSlip(studentId, courseIds, paidYear, paidMonth, base64Slip, amount = 0) {
  // 1. Upload to Supabase Storage
  const filename = `slip-${studentId}-${Date.now()}.jpg`;
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('slips')
    .upload(filename, base64Slip, { contentType: 'image/jpeg' });
    
  if (uploadErr) throw new Error('Slip upload failed: ' + uploadErr.message);

  const { data: publicUrlData } = supabase.storage.from('slips').getPublicUrl(filename);
  const slipUrl = publicUrlData.publicUrl;

  // 2. Insert Payment Record
  const { data: payment, error: payErr } = await supabase.from('payments').insert({
    student_id: studentId,
    paid_year: paidYear,
    paid_month: paidMonth,
    amount: amount,
    slip_drive_link: slipUrl,
    status: 'pending'
  }).select().single();

  if (payErr) throw payErr;

  // 3. Insert Payment Courses
  const pcData = courseIds.map(cid => ({
    payment_id: payment.id,
    course_id: cid
  }));
  const { error: pcErr } = await supabase.from('payment_courses').insert(pcData);
  if (pcErr) throw pcErr;

  // 4. Upsert Enrollments (so they show on the student's dashboard)
  const enrollData = courseIds.map(cid => ({
    student_id: studentId,
    course_id: cid
  }));
  await supabase.from('enrollments').upsert(enrollData, { onConflict: 'student_id,course_id' });

  return payment;
}

export async function getPendingPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, student:profiles(full_name, whatsapp_number, address), payment_courses(course:courses(name))')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, student:profiles(full_name, whatsapp_number), payment_courses(course:courses(name))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function approvePayment(paymentId, studentId) {
  // 1. Update Payment Status
  await supabase.from('payments').update({ status: 'approved' }).eq('id', paymentId);

  // 2. Notify Student
  await supabase.from('notifications').insert({
    user_id: studentId,
    message: 'ඔබේ ගෙවීම අනුමත කර ඇත. දැන් පන්ති වලට සහභාගී විය හැක!'
  });
}

export async function rejectPayment(paymentId, studentId) {
  await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId);
  
  await supabase.from('notifications').insert({
    user_id: studentId,
    message: 'ඔබගේ ගෙවීම් පත (Slip) ප්‍රතික්ෂේප විය. කරුණාකර නිවැරදි එකක් නැවත යොමු කරන්න.'
  });
}

// ── Student's My Enrollments ──
export async function getMyEnrollments(studentId) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, course:courses(id, name, subject:subjects(name, category:categories(section:sections(name))))')
    .eq('student_id', studentId);
  if (error) throw error;
  return data || [];
}

export async function getMyPayments(studentId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*, payment_courses(course:courses(name))')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
