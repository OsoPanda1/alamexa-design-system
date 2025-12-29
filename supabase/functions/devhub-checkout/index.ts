import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_RESTRICTED_KEY");
    if (!stripeKey) {
      throw new Error("Stripe key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { userId, email, registrationId } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get or create Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "https://alamexa.app";

    // Create checkout session for $250 MXN one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "DevHub Membership - TAMV ONLINE NETWORK",
              description: "Membresía única de desarrollador en el ecosistema TAMV",
              images: ["https://alamexa.app/devhub-badge.png"],
            },
            unit_amount: 25000, // $250 MXN in centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?devhub_payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/devhub?payment=cancelled`,
      metadata: {
        user_id: userId,
        registration_id: registrationId || "",
        type: "devhub_membership",
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
