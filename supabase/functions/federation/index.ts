import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "status";

  try {
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

    // Validate user via getUser
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // GET /federation?action=status
    if (req.method === "GET" && action === "status") {
      const { data: link } = await supabase
        .from("federation_links")
        .select("*")
        .eq("local_user_id", userId)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          federated: !!link?.global_subject_id,
          local_user_id: userId,
          global_subject_id: link?.global_subject_id || null,
          issuer: "alamexa",
          linked_at: link?.linked_at || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /federation?action=anchor
    if (req.method === "POST" && action === "anchor") {
      const body = await req.json();
      const globalId = body.global_subject_id;

      if (!globalId || typeof globalId !== "string") {
        return new Response(JSON.stringify({ error: "global_subject_id required (UUID string)" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("federation_links")
        .upsert({
          local_user_id: userId,
          global_subject_id: globalId,
          issuer: "alamexa",
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ global_subject_id: globalId })
        .eq("user_id", userId);

      return new Response(
        JSON.stringify({ success: true, federation_link: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /federation?action=events
    if (req.method === "GET" && action === "events") {
      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Admin access required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: events, error } = await supabase
        .from("event_outbox")
        .select("*")
        .eq("published", false)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      return new Response(
        JSON.stringify({ events: events || [], count: events?.length || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action", valid_actions: ["status", "anchor", "events"] }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Federation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
