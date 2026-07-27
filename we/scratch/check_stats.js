import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkStats() {
    const [students, courses, pendingPayments, enrollments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    ]);
    console.log('Students:', students.count);
    console.log('Courses:', courses.count);
    console.log('Pending Payments:', pendingPayments.count);
    console.log('Enrollments:', enrollments.count);
}

checkStats();
