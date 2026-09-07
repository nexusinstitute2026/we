# 🚀 LMS Automated Zoom & YouTube Live Integration Specification
**Project Stack:** Node.js (Express), Supabase (PostgreSQL), Zoom Server-to-Server OAuth, YouTube Data API v3

---

## 📌 1. System Overview & Core Requirements

මෙම System එක මගින් Tuition LMS / Web Application එකෙහි Classes Schedule කිරීමේ සම්පූර්ණ ක්‍රියාවලිය Automate කරනු ලබයි. Database එක ලෙස **Supabase (PostgreSQL)** භාවිත වේ.

### Key Features Required:
1. **Teacher Single Class Scheduling:** ගුරුවරයෙකුට තනි පන්තියක් Schedule කළ හැක. ගුරුවරයාට එකම වේලාවට පන්ති දෙකක් Schedule කිරීමට ඉඩ නොදේ (Teacher Overlap Validation).
2. **Admin One-Click Monthly Scheduling:** Admin හට මාසයේ 1 වෙනිදා එක Click එකකින් මුළු මාසයේම පන්ති රුටීන් එක (Master Timetable) අදාල දිනයන්ට ස්වයංක්‍රීයව Schedule කළ හැක.
3. **Dual Zoom Account Smart Bypassing:** 
   * පන්තියක් Schedule වන විට **Primary Zoom Account** එකෙහි එම වේලාවේ වෙනත් පන්තියක් තිබේදැයි පරීක්ෂා කෙරේ.
   * යම් හෙයකින් Primary Account එකේ Clash එකක් තිබේ නම්, ස්වයංක්‍රීයව **Bypass (Secondary) Zoom Account** එක භාවිත කර Meeting එක සාදයි.
4. **YouTube Live Automation (Single Channel):** 
   * Zoom Meeting එකක් සෑදෙන සෑම අවස්ථාවකදීම, හිමිකරුගේ YouTube Channel එකෙහි Unlisted Live Broadcast එකක් සාදයි.
   * Auto-Start, Auto-Stop, Low Latency, සහ Enable Embed settings auto-apply වේ.
   * පැරණි වීඩියෝවක Thumbnail එකක් auto-copy කර නව Stream එකට යොදනු ලබයි.
5. **Zoom Custom Live Stream Patching:** YouTube හි Stream Key සහ Stream URL එක Zoom Meeting එකට patch කරයි (එවිට එක Click එකෙන් Zoom හි සිට YouTube Live යා හැක).
6. **Zero Authentication for Teachers:** ගුරුවරුන්ට Zoom හෝ YouTube Accounts ලබා නොදෙන අතර සියලු කටයුතු Backend Credentials හරහා සිදුවේ.

---

## ⚙️ 2. Environment Variables Setup (`.env`)

Developer විසින් `.env` file එකෙහි පහත Credentials සඳහන් කළ යුතුය.

```env
PORT=5000
# PRIMARY ZOOM ACCOUNT CREDENTIALS
ZOOM_PRIMARY_ACCOUNT_ID=your_primary_account_id
ZOOM_PRIMARY_CLIENT_ID=your_primary_client_id
ZOOM_PRIMARY_CLIENT_SECRET=your_primary_client_secret

# BYPASS (SECONDARY) ZOOM ACCOUNT CREDENTIALS
ZOOM_BYPASS_ACCOUNT_ID=your_bypass_account_id
ZOOM_BYPASS_CLIENT_ID=your_bypass_client_id
ZOOM_BYPASS_CLIENT_SECRET=your_bypass_client_secret

# GOOGLE / YOUTUBE OAUTH CREDENTIALS
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_REFRESH_TOKEN=your_google_refresh_token


# THUMBNAIL REUSE CONFIGURATION
SOURCE_THUMBNAIL_VIDEO_ID=your_source_video_id



# 3. Supabase Database Schema (SQL)
Supabase SQL Editor එකේ පහත Tables නිර්මාණය කරන්න:

SQL
-- 1. Classes Table
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    duration INT NOT NULL, -- in minutes
    teacher_id UUID NOT NULL,
    zoom_account_type VARCHAR(20) CHECK (zoom_account_type IN ('primary', 'bypass')),
    zoom_meeting_id VARCHAR(100),
    zoom_join_url TEXT,
    zoom_start_url TEXT,
    youtube_live_url TEXT,
    youtube_broadcast_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Routines Table (Monthly Automatic Schedule එක සඳහා)
CREATE TABLE routines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    day_of_week INT NOT NULL, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    time_of_day VARCHAR(10) NOT NULL, -- e.g., "16:00"
    duration INT NOT NULL,
    teacher_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
💻 4. Core Implementation Code
Dependencies to Install:
Bash
npm install express axios googleapis dotenv @supabase/supabase-js
A. Supabase Client Configuration (config/supabase.js)
JavaScript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role Key for Admin Access

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
B. Scheduler Service (services/schedulerService.js)
JavaScript
const axios = require('axios');
const { google } = require('googleapis');

// -------------------------------------------------------------------
// 1. Dynamic Zoom Access Token Generator
// -------------------------------------------------------------------
async function getZoomAccessToken(accountType = 'primary') {
  const accountId = accountType === 'primary' 
    ? process.env.ZOOM_PRIMARY_ACCOUNT_ID 
    : process.env.ZOOM_BYPASS_ACCOUNT_ID;

  const clientId = accountType === 'primary' 
    ? process.env.ZOOM_PRIMARY_CLIENT_ID 
    : process.env.ZOOM_BYPASS_CLIENT_ID;

  const clientSecret = accountType === 'primary' 
    ? process.env.ZOOM_PRIMARY_CLIENT_SECRET 
    : process.env.ZOOM_BYPASS_CLIENT_SECRET;

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await axios.post(
    `[https://zoom.us/oauth/token?grant_type=account_credentials&account_id=$](https://zoom.us/oauth/token?grant_type=account_credentials&account_id=$){accountId}`,
    {},
    { headers: { Authorization: `Basic ${authHeader}` } }
  );
  return response.data.access_token;
}

// -------------------------------------------------------------------
// 2. YouTube OAuth2 Client Generator
// -------------------------------------------------------------------
function getYouTubeClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

// -------------------------------------------------------------------
// 3. Time Overlap Logic Engine
// -------------------------------------------------------------------
function isTimeOverlapping(startA, durationA, startB, durationB) {
  const aStart = new Date(startA).getTime();
  const aEnd = aStart + durationA * 60 * 1000;

  const bStart = new Date(startB).getTime();
  const bEnd = bStart + durationB * 60 * 1000;

  return aStart < bEnd && aEnd > bStart;
}

// -------------------------------------------------------------------
// 4. Thumbnail Reuser Function
// -------------------------------------------------------------------
async function applyThumbnail(youtubeClient, targetBroadcastId, sourceVideoId) {
  try {
    if (!sourceVideoId) return;

    const videoRes = await youtubeClient.videos.list({
      part: ['snippet'],
      id: [sourceVideoId]
    });

    if (!videoRes.data.items || videoRes.data.items.length === 0) return;

    const thumbnails = videoRes.data.items[0].snippet.thumbnails;
    const thumbObj = thumbnails.maxres || thumbnails.high || thumbnails.standard || thumbnails.default;
    
    const imageResponse = await axios.get(thumbObj.url, { responseType: 'stream' });

    await youtubeClient.thumbnails.set({
      videoId: targetBroadcastId,
      media: {
        mimeType: imageResponse.headers['content-type'],
        body: imageResponse.data
      }
    });
    console.log(`Thumbnail copied successfully to Broadcast: ${targetBroadcastId}`);
  } catch (err) {
    console.error(`Thumbnail Error: ${err.message}`);
  }
}

// -------------------------------------------------------------------
// 5. Main Class Scheduler Function
// -------------------------------------------------------------------
async function scheduleSingleClass({ topic, startTime, duration, teacherId, existingClasses = [] }) {
  // Check 1: Teacher Overlap Validation
  const teacherClash = existingClasses.find(c => 
    c.teacher_id.toString() === teacherId.toString() &&
    isTimeOverlapping(c.start_time, c.duration, startTime, duration)
  );

  if (teacherClash) {
    throw new Error(`ගුරුවරයාට මෙම කාලසීමාව තුළ වෙනත් පන්තියක් (${teacherClash.topic}) ඇත.`);
  }

  // Check 2: Primary Zoom Account Overlap Check
  const primaryClash = existingClasses.find(c => 
    c.zoom_account_type === 'primary' &&
    isTimeOverlapping(c.start_time, c.duration, startTime, duration)
  );

  const selectedAccountType = primaryClash ? 'bypass' : 'primary';
  const isoStartTime = new Date(startTime).toISOString();

  // Step A: Create Zoom Meeting
  const zoomToken = await getZoomAccessToken(selectedAccountType);
  const zoomResponse = await axios.post(
    '[https://api.zoom.us/v2/users/me/meetings](https://api.zoom.us/v2/users/me/meetings)',
    {
      topic: topic,
      type: 2,
      start_time: isoStartTime,
      duration: duration,
      settings: { show_share_button: true, allow_multiple_devices: true }
    },
    { headers: { Authorization: `Bearer ${zoomToken}` } }
  );
  const zoomDetails = zoomResponse.data;

  // Step B: Create YouTube Broadcast & Stream
  const youtube = getYouTubeClient();
  const broadcastRes = await youtube.liveBroadcasts.insert({
    part: ['snippet', 'status', 'contentDetails'],
    requestBody: {
      snippet: { title: topic, scheduledStartTime: isoStartTime, description: 'Nexus Institute Class' },
      status: { privacyStatus: 'unlisted', selfDeclaredMadeForKids: false },
      contentDetails: {
        enableAutoStart: true,
        enableAutoStop: true,
        monitorStream: { enableMonitorStream: true },
        enableEmbed: true,
        enableDvr: true,
        latencyPreference: 'low',
        recordFromStart: true
      }
    }
  });

  const streamRes = await youtube.liveStreams.insert({
    part: ['snippet', 'cdn'],
    requestBody: {
      snippet: { title: `${topic} Stream` },
      cdn: { frameRate: '30fps', ingestionType: 'rtmp', resolution: '720p' }
    }
  });

  await youtube.liveBroadcasts.bind({
    id: broadcastRes.data.id,
    part: ['id', 'contentDetails'],
    streamId: streamRes.data.id
  });

  const liveUrl = `[https://www.youtube.com/live/$](https://www.youtube.com/live/$){broadcastRes.data.id}`;

  // Step C: Apply Thumbnail from Source Video
  if (process.env.SOURCE_THUMBNAIL_VIDEO_ID) {
    await applyThumbnail(youtube, broadcastRes.data.id, process.env.SOURCE_THUMBNAIL_VIDEO_ID);
  }

  // Step D: Update Zoom Custom Live Stream Settings
  await axios.patch(
    `[https://api.zoom.us/v2/meetings/$](https://api.zoom.us/v2/meetings/$){zoomDetails.id}/livestream`,
    {
      stream_url: streamRes.data.cdn.ingestionInfo.ingestionAddress,
      stream_key: streamRes.data.cdn.ingestionInfo.streamName,
      page_url: liveUrl
    },
    { headers: { Authorization: `Bearer ${zoomToken}` } }
  );

  // Payload structure for Supabase Insertion
  return {
    topic,
    start_time: startTime,
    duration,
    teacher_id: teacherId,
    zoom_account_type: selectedAccountType,
    zoom_join_url: zoomDetails.join_url,
    zoom_start_url: zoomDetails.start_url,
    youtube_live_url: liveUrl,
    zoom_meeting_id: zoomDetails.id.toString(),
    youtube_broadcast_id: broadcastRes.data.id,
    status: 'scheduled'
  };
}

module.exports = { scheduleSingleClass };
C. Express Controller & Routes (routes/classRoutes.js)
JavaScript
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { scheduleSingleClass } = require('../services/schedulerService');

// -------------------------------------------------------------------
// 1. Teacher Single Class Scheduling Route
// -------------------------------------------------------------------
router.post('/teacher/schedule-class', async (req, res) => {
  try {
    const { topic, startTime, duration, teacherId } = req.body;

    // Fetch scheduled classes from Supabase
    const { data: existingClasses, error: fetchError } = await supabase
      .from('classes')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .eq('status', 'scheduled');

    if (fetchError) throw fetchError;

    // Process Class Scheduling
    const classPayload = await scheduleSingleClass({
      topic,
      startTime,
      duration,
      teacherId,
      existingClasses
    });

    // Save to Supabase
    const { data: savedClass, error: insertError } = await supabase
      .from('classes')
      .insert([classPayload])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(200).json({
      success: true,
      message: 'Class scheduled successfully in Supabase!',
      data: savedClass
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// -------------------------------------------------------------------
// 2. System Admin Monthly Bulk Scheduling Route (One-Click Trigger)
// -------------------------------------------------------------------
router.post('/admin/schedule-monthly-classes', async (req, res) => {
  try {
    const { year, month } = req.body; // e.g., year: 2026, month: 9 (September)

    // Fetch Master Routines from Supabase
    const { data: routines, error: routineErr } = await supabase.from('routines').select('*');
    if (routineErr) throw routineErr;

    // Fetch Active Classes from Supabase
    const { data: activeClasses, error: classErr } = await supabase
      .from('classes')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .eq('status', 'scheduled');
    
    if (classErr) throw classErr;

    let localActiveClasses = [...activeClasses];
    const results = [];
    const errors = [];

    // Loop through routines and create entries for the month
    for (const routine of routines) {
      const datesInMonth = getDatesForDayOfWeek(year, month - 1, routine.day_of_week);

      for (const date of datesInMonth) {
        try {
          const [hours, minutes] = routine.time_of_day.split(':');
          const startTime = new Date(date);
          startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          const classPayload = await scheduleSingleClass({
            topic: routine.topic,
            startTime,
            duration: routine.duration,
            teacherId: routine.teacher_id,
            existingClasses: localActiveClasses
          });

          // Insert into Supabase
          const { data: newClass, error: insErr } = await supabase
            .from('classes')
            .insert([classPayload])
            .select()
            .single();

          if (insErr) throw insErr;

          localActiveClasses.push(newClass);
          results.push(newClass);
        } catch (err) {
          errors.push({ topic: routine.topic, date: date, error: err.message });
        }
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper Function: Gets all specific days (e.g. all Mondays) in a given month
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
🧪 5. Developer Verification & Testing Checklist
[ ] Supabase Table Creation: Run SQL scripts in Supabase Dashboard and verify classes and routines tables are populated.

[ ] Dual Account Test: Set up 2 overlapping classes at the same time. Verify that Class #1 gets assigned primary account and Class #2 automatically gets assigned bypass account in Supabase.

[ ] Teacher Conflict Test: Try adding two overlapping classes for the same teacher_id. Ensure API returns a HTTP 400 error.

[ ] YouTube Broadcast Validation: Verify the generated YouTube stream link has privacyStatus: unlisted, enableAutoStart: true, and enableAutoStop: true.

[ ] Thumbnail Copy Test: Confirm that the target YouTube broadcast correctly inherits the thumbnail of SOURCE_THUMBNAIL_VIDEO_ID.

[ ] Zoom Streaming Configuration: Open Zoom Meeting settings via browser and verify that Custom Live Streaming Service URL, Key, and Page Link are filled correctly.

[ ] Admin Bulk Execution: Run /admin/schedule-monthly-classes endpoint and check Supabase table for generated month entries.