// ═══ Auth Helpers ═══
import supabase from './supabase.js';

// Format WhatsApp number as email for Supabase Auth
export function toAuthEmail(whatsapp) {
  const clean = whatsapp.replace(/\D/g, '');
  return `${clean}@nexuslms.com`;
}

// Register a new student
export async function registerStudent({ full_name, school, address, id_number, whatsapp_number }) {
  const email = toAuthEmail(whatsapp_number);
  const password = id_number.substring(0, 6);

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { full_name, role: 'student' } // Also store in auth metadata for safety
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw new Error('මෙම WhatsApp අංකය දැනටමත් ලියාපදිංචි වී ඇත.');
    }
    throw authError;
  }

  if (!authData.user) throw new Error('ලියාපදිංචිය අතරමගදී බිඳ වැටුණි. නැවත උත්සාහ කරන්න.');

  // 2. Create profile row
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    role: 'student',
    full_name,
    school,
    address,
    id_number,
    whatsapp_number: whatsapp_number.replace(/\D/g, ''),
  });

  if (profileError) {
    console.error("Profile Error:", profileError);
    if (profileError.code === '23505') {
      throw new Error('මෙම ID අංකය දැනටමත් පද්ධතියේ පවතී.');
    }
    throw new Error('පැතිකඩ (Profile) සෑදීම අසාර්ථක විය: ' + profileError.message);
  }

  return { email, password, user: authData.user };
}

// Login
export async function login(whatsappOrEmail, password, rememberMe = false) {
  let email = whatsappOrEmail;
  if (!whatsappOrEmail.includes('@')) {
    email = toAuthEmail(whatsappOrEmail);
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  if (rememberMe) {
    localStorage.setItem('nexus_remember', '1');
  }
  return data;
}

// Logout
export async function logout() {
  localStorage.removeItem('nexus_remember');
  await supabase.auth.signOut();
  window.location.href = import.meta.env.BASE_URL + 'login.html';
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Get current user profile
export async function getProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  if (error) return null;
  return data;
}

// Role-based route guard — call at top of each page
export async function requireAuth(allowedRoles = []) {
  const session = await getSession();
  if (!session) {
    window.location.href = import.meta.env.BASE_URL + 'login.html';
    return null;
  }
  const profile = await getProfile();
  if (!profile) {
    window.location.href = import.meta.env.BASE_URL + 'login.html';
    return null;
  }
  if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
    redirectByRole(profile.role);
    return null;
  }
  return profile;
}

// Redirect to correct dashboard based on role
export function redirectByRole(role) {
  const base = import.meta.env.BASE_URL;
  if (role === 'admin')   window.location.href = base + 'dashboard/admin.html';
  else if (role === 'teacher') window.location.href = base + 'dashboard/teacher.html';
  else window.location.href = base + 'dashboard/student.html';
}

// Redirect logged-in users away from auth pages
export async function redirectIfLoggedIn() {
  const profile = await getProfile();
  if (profile) redirectByRole(profile.role);
}

// Populate user chip in sidebar
export function populateUserChip(profile) {
  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role');
  const avatarEl = document.getElementById('user-avatar');
  if (nameEl) nameEl.textContent = profile.full_name;
  if (roleEl) {
    const labels = { student: 'සිසුවා', teacher: 'ගුරුවරයා', admin: 'පරිපාලක' };
    roleEl.textContent = labels[profile.role] || profile.role;
  }
  if (avatarEl) avatarEl.textContent = profile.full_name.charAt(0).toUpperCase();
}

// ── Check Course Access Logic ──
// student has access if they paid for the current calendar month, 
// OR if today is <= 14th, and they paid for the previous month.
export async function getStudentAccessDetails(studentId, courseId) {
  const today = new Date();
  const targetYear = today.getFullYear();
  const targetMonth = today.getMonth() + 1;

  const { data: currentMonthData } = await supabase
    .from('course_months')
    .select('payment_deadline_date')
    .eq('course_id', courseId)
    .eq('year', targetYear)
    .eq('month_number', targetMonth)
    .single();

  const deadline = currentMonthData?.payment_deadline_date || 14;

  const validPeriods = [{ year: targetYear, month: targetMonth }];
  
  if (today.getDate() <= deadline) {
    let prevMonth = targetMonth - 1;
    let prevYear = targetYear;
    if (prevMonth === 0) { prevMonth = 12; prevYear--; }
    validPeriods.push({ year: prevYear, month: prevMonth });
  }

  const { data, error } = await supabase
    .from('payment_courses')
    .select(`
      payments!inner(student_id, paid_year, paid_month, status, created_at)
    `)
    .eq('course_id', courseId)
    .eq('payments.student_id', studentId)
    .in('payments.status', ['approved', 'pending']);

  if (error || !data || data.length === 0) {
    return { hasCurrentAccess: false, paidMonths: [] };
  }

  const paidMonths = [];
  let hasCurrentAccess = false;
  let maxPaidTotalM = -1;

  for (const pc of data) {
    const p = Array.isArray(pc.payments) ? pc.payments[0] : pc.payments;
    if (!p) continue;
    
    // Check if it's pending and within 3 days
    if (p.status === 'pending') {
      const createdDate = new Date(p.created_at);
      const diffMs = today - createdDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > 3) continue; // Expired temp access
    }

    paidMonths.push({ year: p.paid_year, month: p.paid_month });
    const totalM = p.paid_year * 12 + (p.paid_month - 1);
    if (totalM > maxPaidTotalM) maxPaidTotalM = totalM;
    
    for (const vp of validPeriods) {
      if (p.paid_year === vp.year && p.paid_month === vp.month) {
        hasCurrentAccess = true;
      }
    }
  }

  // Next month after the maximum paid month
  const maxAccessibleValue = maxPaidTotalM >= 0 ? maxPaidTotalM + 1 : -1;

  return { hasCurrentAccess, paidMonths, maxAccessibleValue };
}
