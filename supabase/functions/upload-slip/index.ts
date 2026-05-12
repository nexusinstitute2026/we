// ═══ Supabase Edge Function: Upload to Google Drive (Using Official Library) ═══
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { google } from "npm:googleapis";
import { decode } from "https://deno.land/std@0.145.0/encoding/base64.ts";
import { Buffer } from "node:buffer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { base64, filename, mimeType } = await req.json();
    if (!base64 || !filename) throw new Error('Missing data');

    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    const driveFolderId = Deno.env.get('GOOGLE_DRIVE_FOLDER_ID');
    
    if (!serviceAccountJson || !driveFolderId) throw new Error('Secrets missing');
    
    let sa;
    try {
      sa = JSON.parse(serviceAccountJson);
    } catch (e) {
      const decoded = new TextDecoder().decode(decode(serviceAccountJson));
      sa = JSON.parse(decoded);
    }

    // Authenticate
    const auth = new google.auth.JWT(
      sa.client_email,
      null,
      sa.private_key,
      ['https://www.googleapis.com/auth/drive.file']
    );

    const drive = google.drive({ version: 'v3', auth });

    // Convert base64 to stream/buffer
    const buffer = Buffer.from(base64, 'base64');
    const bufferStream = new (await import("node:stream")).PassThrough();
    bufferStream.end(buffer);

    // Upload
    const response = await drive.files.create({
      requestBody: {
        name: `Slip_${Date.now()}_${filename}`,
        parents: [driveFolderId.trim()]
      },
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
      fields: 'id, webViewLink',
    });

    return new Response(
      JSON.stringify({ success: true, url: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Final Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
