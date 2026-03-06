import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Simple HMAC verification for webhook subscribers
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expectedSig === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "poll";

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // POST /webhooks?action=poll — TAM polls for unpublished events
    if (req.method === "POST" && action === "poll") {
      // Verify webhook secret
      const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const providedSecret = req.headers.get("x-webhook-secret");
      
      if (!providedSecret || providedSecret !== webhookSecret) {
        // Try HMAC signature verification
        const body = await req.text();
        const signature = req.headers.get("x-webhook-signature") || "";
        const valid = await verifySignature(body, signature, webhookSecret);
        
        if (!valid) {
          return new Response(JSON.stringify({ error: "Invalid webhook credentials" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Parse the body since we consumed it
        const parsed = JSON.parse(body);
        const limit = parsed.limit || 50;
        const eventTypes = parsed.event_types || [];
        
        let query = supabaseAdmin
          .from("event_outbox")
          .select("*")
          .eq("published", false)
          .order("created_at", { ascending: true })
          .limit(limit);

        if (eventTypes.length > 0) {
          query = query.in("event_type", eventTypes);
        }

        const { data: events, error } = await query;
        if (error) throw error;

        return new Response(
          JSON.stringify({
            origin: "alamexa",
            events: events || [],
            count: events?.length || 0,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Simple secret match — read body as JSON
      const body = await req.json().catch(() => ({}));
      const limit = body.limit || 50;
      const eventTypes = body.event_types || [];

      let query = supabaseAdmin
        .from("event_outbox")
        .select("*")
        .eq("published", false)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (eventTypes.length > 0) {
        query = query.in("event_type", eventTypes);
      }

      const { data: events, error } = await query;
      if (error) throw error;

      return new Response(
        JSON.stringify({
          origin: "alamexa",
          events: events || [],
          count: events?.length || 0,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /webhooks?action=ack — Mark events as published
    if (req.method === "POST" && action === "ack") {
      const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const providedSecret = req.headers.get("x-webhook-secret");
      
      if (!providedSecret || providedSecret !== webhookSecret) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const eventIds: string[] = body.event_ids || [];

      if (eventIds.length === 0) {
        return new Response(JSON.stringify({ error: "event_ids required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin
        .from("event_outbox")
        .update({ published: true, published_at: new Date().toISOString() })
        .in("id", eventIds);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, acknowledged: eventIds.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /webhooks?action=stats — Event outbox statistics
    if (req.method === "GET" && action === "stats") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Admin required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const [unpublished, published, total] = await Promise.all([
        supabaseAdmin.from("event_outbox").select("id", { count: "exact", head: true }).eq("published", false),
        supabaseAdmin.from("event_outbox").select("id", { count: "exact", head: true }).eq("published", true),
        supabaseAdmin.from("event_outbox").select("id", { count: "exact", head: true }),
      ]);

      return new Response(
        JSON.stringify({
          unpublished: unpublished.count || 0,
          published: published.count || 0,
          total: total.count || 0,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action", valid_actions: ["poll", "ack", "stats"] }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
