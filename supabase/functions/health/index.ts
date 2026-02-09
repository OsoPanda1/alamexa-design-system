import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const isReady = url.searchParams.get("type") === "ready";

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Basic DB connectivity check
    const start = Date.now();
    const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
    const latencyMs = Date.now() - start;

    const healthy = !error;

    const response = {
      status: healthy ? "ok" : "degraded",
      app: "alamexa",
      version: "1.0.0",
      type: isReady ? "readiness" : "liveness",
      checks: {
        database: healthy ? "connected" : "error",
        latency_ms: latencyMs,
      },
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: healthy ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        app: "alamexa",
        type: isReady ? "readiness" : "liveness",
        timestamp: new Date().toISOString(),
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
