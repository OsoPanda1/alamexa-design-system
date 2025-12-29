import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_RESTRICTED_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    
    // For simplified webhook handling (without signature verification for now)
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      if (session.metadata?.type === "devhub_membership") {
        const userId = session.metadata.user_id;
        const registrationId = session.metadata.registration_id;

        // Update devhub registration payment status
        if (registrationId) {
          await supabase
            .from("devhub_registrations")
            .update({
              payment_status: "completed",
              payment_id: session.payment_intent,
              approved_at: new Date().toISOString(),
            })
            .eq("id", registrationId);
        } else {
          // Update by user_id if no registration_id
          await supabase
            .from("devhub_registrations")
            .update({
              payment_status: "completed",
              payment_id: session.payment_intent,
              approved_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("payment_status", "pending");
        }

        // Update user profile membership
        await supabase
          .from("profiles")
          .update({
            membership_tier: "basic",
            membership_expires_at: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(), // 1 year
          })
          .eq("user_id", userId);

        // Create notification
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "¡Bienvenido a DevHub!",
          message: "Tu membresía DevHub ha sido activada. Ya eres parte del ecosistema TAMV.",
          type: "membership",
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
