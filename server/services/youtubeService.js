const { google } = require('googleapis');
const axios = require('axios');

function getYouTubeClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

async function createBroadcast(youtube, topic, startTime) {
  const isoStartTime = new Date(startTime).toISOString();
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
  return broadcastRes.data;
}

async function createStream(youtube, topic) {
  const streamRes = await youtube.liveStreams.insert({
    part: ['snippet', 'cdn'],
    requestBody: {
      snippet: { title: `${topic} Stream` },
      cdn: { frameRate: '30fps', ingestionType: 'rtmp', resolution: '720p' }
    }
  });
  return streamRes.data;
}

async function bindBroadcastToStream(youtube, broadcastId, streamId) {
  await youtube.liveBroadcasts.bind({
    id: broadcastId,
    part: ['id', 'contentDetails'],
    streamId: streamId
  });
}

async function applyThumbnail(youtube, targetBroadcastId, sourceVideoId) {
  try {
    if (!sourceVideoId) return;

    const videoRes = await youtube.videos.list({
      part: ['snippet'],
      id: [sourceVideoId]
    });

    if (!videoRes.data.items || videoRes.data.items.length === 0) return;

    const thumbnails = videoRes.data.items[0].snippet.thumbnails;
    const thumbObj = thumbnails.maxres || thumbnails.high || thumbnails.standard || thumbnails.default;
    
    const imageResponse = await axios.get(thumbObj.url, { responseType: 'stream' });

    await youtube.thumbnails.set({
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

module.exports = {
  getYouTubeClient,
  createBroadcast,
  createStream,
  bindBroadcastToStream,
  applyThumbnail
};
