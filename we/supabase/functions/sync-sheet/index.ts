import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sheetUrl } = await req.json();

    if (!sheetUrl) {
      throw new Error('Missing sheetUrl');
    }

    // --- Google Sheets API Logic Goes Here ---
    // 1. Extract spreadsheetId from sheetUrl
    // 2. Parse GOOGLE_SERVICE_ACCOUNT_JSON
    // 3. Generate OAuth2 Bearer token
    // 4. GET https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:D
    
    // Stub response for demonstration
    // Assumes columns: Date | Description | Zoom Link | YouTube Link
    const stubSessions = [
      {
        date: "2026-05-01",
        description: "පළමු සතියේ පන්තිය",
        zoomLink: "https://zoom.us/j/stub1",
        youtubeLink: "https://youtube.com/watch?v=stub1"
      },
      {
        date: "2026-05-08",
        description: "දෙවන සතියේ පන්තිය",
        zoomLink: "https://zoom.us/j/stub2",
        youtubeLink: "https://youtube.com/watch?v=stub2"
      }
    ];

    return new Response(
      JSON.stringify({ success: true, sessions: stubSessions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
