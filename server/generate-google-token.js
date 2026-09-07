const { google } = require('googleapis');
const express = require('express');
const app = express();
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

const scopes = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // Forces consent to ensure a refresh token is returned
});

console.log('====================================================');
console.log('Please click this URL to authorize the app:');
console.log(url);
console.log('====================================================');

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n--- NEW TOKENS ACQUIRED ---');
      console.log('Refresh Token:', tokens.refresh_token);
      console.log('---------------------------\n');
      console.log('Please copy the Refresh Token above and paste it into your .env file as GOOGLE_REFRESH_TOKEN');
      console.log('Then you can close this window and stop this script (Ctrl+C).');
      res.send('<h1>Authentication successful!</h1><p>Check your console for the refresh token.</p><p>You can close this tab now.</p>');
      
      // Auto-exit after a short delay
      setTimeout(() => process.exit(0), 3000);
    } catch (err) {
      console.error('Error retrieving token:', err);
      res.status(500).send('Authentication failed.');
    }
  } else {
    res.send('No code provided.');
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000 for the callback...');
});
