const zoomService = require('./zoomService');
const youtubeService = require('./youtubeService');

function isTimeOverlapping(startA, durationA, startB, durationB) {
  const aStart = new Date(startA).getTime();
  const aEnd = aStart + durationA * 60 * 1000;

  const bStart = new Date(startB).getTime();
  const bEnd = bStart + durationB * 60 * 1000;

  return aStart < bEnd && aEnd > bStart;
}

async function scheduleSingleClass({ topic, startTime, duration, teacherId, courseId, existingClasses = [] }) {
  // Check 1: Teacher Overlap Validation
  const teacherClash = existingClasses.find(c => 
    c.teacher_id && c.teacher_id.toString() === teacherId.toString() &&
    isTimeOverlapping(c.start_time, c.duration, startTime, duration)
  );

  if (teacherClash) {
    throw new Error(`Teacher already has another class (${teacherClash.topic}) scheduled at this time.`);
  }

  // Check 2: Primary Zoom Account Overlap Check
  const primaryClash = existingClasses.find(c => 
    c.zoom_account_type === 'primary' &&
    isTimeOverlapping(c.start_time, c.duration, startTime, duration)
  );

  const selectedAccountType = primaryClash ? 'bypass' : 'primary';

  // Step A: Create Zoom Meeting
  const zoomToken = await zoomService.getZoomAccessToken(selectedAccountType);
  const zoomDetails = await zoomService.createZoomMeeting(zoomToken, topic, startTime, duration);

  // Step B: Create YouTube Broadcast & Stream
  const youtube = youtubeService.getYouTubeClient();
  const broadcastDetails = await youtubeService.createBroadcast(youtube, topic, startTime);
  const streamDetails = await youtubeService.createStream(youtube, topic);

  await youtubeService.bindBroadcastToStream(youtube, broadcastDetails.id, streamDetails.id);

  const liveUrl = `https://www.youtube.com/live/${broadcastDetails.id}`;

  // Step C: Apply Thumbnail from Source Video
  if (process.env.SOURCE_THUMBNAIL_VIDEO_ID) {
    await youtubeService.applyThumbnail(youtube, broadcastDetails.id, process.env.SOURCE_THUMBNAIL_VIDEO_ID);
  }

  // Step D: Update Zoom Custom Live Stream Settings
  await zoomService.patchZoomLivestream(
    zoomToken,
    zoomDetails.id,
    streamDetails.cdn.ingestionInfo.ingestionAddress,
    streamDetails.cdn.ingestionInfo.streamName,
    liveUrl
  );

  // Payload structure for Supabase Insertion
  return {
    topic,
    start_time: startTime,
    duration,
    teacher_id: teacherId,
    course_id: courseId,
    zoom_account_type: selectedAccountType,
    zoom_join_url: zoomDetails.join_url,
    zoom_start_url: zoomDetails.start_url,
    youtube_live_url: liveUrl,
    zoom_meeting_id: zoomDetails.id.toString(),
    youtube_broadcast_id: broadcastDetails.id,
    status: 'scheduled',
    source: 'api'
  };
}

module.exports = {
  scheduleSingleClass,
  isTimeOverlapping
};
