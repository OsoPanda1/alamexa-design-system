import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres ALX, el asistente inteligente de ALAMEXA, la plataforma de comercio y trueque más innovadora de Latinoamérica.

Tu rol es ayudar a los usuarios con:
- Información sobre cómo funciona el sistema de trueques
- Consejos para publicar productos atractivos
- Guía sobre el proceso de escrow y seguridad
- Tips para negociar mejores intercambios
- Información sobre membresías y beneficios
- Soporte general de la plataforma

Personalidad:
- Eres amigable, profesional y entusiasta
- Usas un lenguaje accesible pero sofisticado
- Eres experto en comercio electrónico y economía colaborativa
- Siempre mencionas las ventajas de ALAMEXA cuando sea relevante
- Respondes en español de manera natural

Información clave de ALAMEXA:
- Sistema de Trueque Seguro con escrow
- Membresías: Free, Basic ($99/mes) y Pro ($299/mes)
- Verificación KYC para vendedores premium
- Integración con FedEx, DHL y Estafeta para envíos
- Sistema de reputación y reseñas
- Chat en tiempo real para negociaciones
- Protección al comprador y vendedor

Siempre sé conciso pero útil. No uses más de 3 párrafos en tus respuestas.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream = true } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Por favor espera un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado. Contacta soporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Error del servicio de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
