// ════════════════════════════════════════════════════════
// Supabase Edge Function: create-checkout
// Stripe ödəniş səhifəsi yaradır
//
// Deploy: supabase functions deploy create-checkout
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
//          supabase secrets set APP_URL=https://masaaz.vercel.app
// ════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const APP_URL    = Deno.env.get("APP_URL") || "https://masaaz.vercel.app";
const SB_URL     = Deno.env.get("SUPABASE_URL")!;
const SB_KEY     = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PLAN_PRICE_USD = 2900; // $29.00 — sentlə göstərilir

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { restaurant_id, restaurant_name } = await req.json();
    if (!restaurant_id) {
      return new Response(JSON.stringify({ error: "restaurant_id mütləqdir" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const sb = createClient(SB_URL, SB_KEY);

    // Mövcud abunəliyi yoxla
    const { data: sub } = await sb
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("restaurant_id", restaurant_id)
      .maybeSingle();

    let customerId = sub?.stripe_customer_id;

    // Stripe Customer yarat (əgər yoxdursa)
    if (!customerId) {
      const custRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          description: `MasaAz — ${restaurant_name || "Restoran #" + restaurant_id}`,
          metadata: { restaurant_id: String(restaurant_id) }
        }).toString(),
      });
      const cust = await custRes.json();
      customerId = cust.id;

      // DB-ə kaydet
      await sb.from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("restaurant_id", restaurant_id);
    }

    // Stripe Checkout Session yarat
    const successUrl = `${APP_URL}/owner.html?paid=success&session_id={CHECKOUT_SESSION_ID}&rid=${restaurant_id}`;
    const cancelUrl  = `${APP_URL}/owner.html?paid=cancel&rid=${restaurant_id}`;

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "mode": "payment",           // bir dəfəlik ödəniş
        "customer": customerId,
        "success_url": successUrl,
        "cancel_url":  cancelUrl,
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": `MasaAz Aylıq Abunəlik — ${restaurant_name || "Restoran"}`,
        "line_items[0][price_data][product_data][description]": "1 aylıq tam giriş · Real-time rezervasiyalar · WhatsApp bildirişlər",
        "line_items[0][price_data][unit_amount]": String(PLAN_PRICE_USD),
        "line_items[0][quantity]": "1",
        "metadata[restaurant_id]": String(restaurant_id),
        "metadata[restaurant_name]": restaurant_name || "",
      }).toString(),
    });

    const session = await sessionRes.json();

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Session ID-ni DB-ə kaydet (pending kimi)
    await sb.from("subscriptions").update({
      stripe_session_id: session.id,
      updated_at: new Date().toISOString(),
    }).eq("restaurant_id", restaurant_id);

    // Ödəniş tarixinə əlavə et
    await sb.from("payment_history").insert({
      restaurant_id,
      amount: PLAN_PRICE_USD / 100,
      currency: "USD",
      stripe_session_id: session.id,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
