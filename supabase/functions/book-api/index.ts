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

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Get counts for capabilities summary
    const [products, trades, users] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("trade_proposals").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    const book = {
      name: "Alamexa",
      version: "1.0.0",
      issuer: "alamexa",
      description: "La nueva era del comercio inteligente. Marketplace + Trueque + Escrow.",
      capabilities: [
        "marketplace",
        "digital-products",
        "trade-barter",
        "escrow-custody",
        "kyc-verification",
        "shipping-integration",
        "ai-assistant",
        "memberships",
        "real-time-messaging",
        "notifications",
        "reviews-reputation",
      ],
      events: [
        "USER_CREATED",
        "USER_VERIFIED",
        "PRODUCT_CREATED",
        "TRADE_PROPOSED",
        "ESCROW_CREATED",
        "PAYMENT_COMPLETED",
        "SHIPPING_UPDATED",
      ],
      apis: [
        "/api/v1/auth",
        "/api/v1/products",
        "/api/v1/trades",
        "/api/v1/escrow",
        "/api/v1/shipping",
        "/api/v1/kyc",
        "/api/v1/messages",
        "/api/v1/notifications",
        "/api/v1/reviews",
        "/api/v1/memberships",
      ],
      federation: {
        protocol: "tam-federation-v1",
        identity: {
          local_id_field: "user_id",
          global_id_field: "global_subject_id",
          issuer: "alamexa",
        },
        event_outbox: true,
        book_api: true,
        health_endpoint: true,
      },
      stats: {
        total_products: products.count ?? 0,
        total_trades: trades.count ?? 0,
        total_users: users.count ?? 0,
      },
      status: "operational",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(book, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", status: "degraded" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
