import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ═══ Configuration ═══
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    const now = new Date()
    const targetTime = new Date(now.getTime() + 6 * 60 * 60 * 1000) // Exactly 6 hours from now
    
    // Range for checking (allow a small window like 5 minutes)
    const windowStart = new Date(targetTime.getTime() - 2.5 * 60 * 1000).toISOString()
    const windowEnd = new Date(targetTime.getTime() + 2.5 * 60 * 1000).toISOString()

    // 1. Find sessions starting in ~6 hours
    const { data: sessions } = await supabase
      .from('sessions')
      .select('*, course:courses(name, subject:subjects(name))')
      .gte('start_time', windowStart)
      .lte('start_time', windowEnd)

    if (!sessions || sessions.length === 0) {
      return new Response(JSON.stringify({ message: "No sessions starting in 6 hours" }), { status: 200 })
    }

    let totalSent = 0

    for (const session of sessions) {
      // 2. Find enrolled students
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('course_id', session.course_id)

      if (!enrollments) continue

      const studentIds = enrollments.map(e => e.student_id)

      // 3. Get push subscriptions
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .in('user_id', studentIds)

      if (!subs) continue

      // 4. Send notifications
      for (const sub of subs) {
        try {
          // In a real Edge Function, you would use a web-push library or manual signing
          // For simplicity in this template, we'll use a mocked fetch call 
          // to an external push service or a manual implementation.
          // Note: Implementing VAPID from scratch in Deno requires 'jose'.
          
          console.log(`Sending notification to user ${sub.user_id} for session ${session.title}`)
          
          // MOCK NOTIFICATION LOGIC (Replace with real web-push call)
          // await sendPushNotification(sub.subscription, {
          //   title: "පන්තිය තව පැය 6කින්!",
          //   body: `${session.course.subject.name} - ${session.title} පන්තිය තව පැය 6කින් ආරම්භ වේ.`,
          //   url: `/pages/course.html?id=${session.course_id}`
          // })
          
          totalSent++
        } catch (err) {
          console.error(`Failed to send push to ${sub.user_id}:`, err)
        }
      }
    }

    return new Response(JSON.stringify({ sent: totalSent }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
