const axios = require('axios');

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
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {},
    { headers: { Authorization: `Basic ${authHeader}` } }
  );
  return response.data.access_token;
}

async function createZoomMeeting(token, topic, startTime, duration) {
  const isoStartTime = new Date(startTime).toISOString();
  const response = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic: topic,
      type: 2,
      start_time: isoStartTime,
      duration: duration,
      settings: { show_share_button: true, allow_multiple_devices: true }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

async function patchZoomLivestream(token, meetingId, streamUrl, streamKey, pageUrl) {
  await axios.patch(
    `https://api.zoom.us/v2/meetings/${meetingId}/livestream`,
    {
      stream_url: streamUrl,
      stream_key: streamKey,
      page_url: pageUrl
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

module.exports = {
  getZoomAccessToken,
  createZoomMeeting,
  patchZoomLivestream
};
