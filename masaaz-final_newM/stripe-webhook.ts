// ════════════════════════════════════════════════════════
// Supabase Edge Function: stripe-webhook
// Stripe ödəniş uğurlu olduqda abunəliyi aktiv edir
//
// Deploy: supabase functions deploy stripe-webhook
// Secrets: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
//
// Stripe Dashboard → Webhooks → Endpoint URL:
//   https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
// Events to listen:
//   - checkout.session.completed
//   - payment_intent.succeeded
// ════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14";

const STRIPE_KEY      = Deno.env.get("STRIPE_SECRET_KEY")!;
const WEBHOOK_SECRET  = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SB_URL          = Deno.env.get("SUPABASE_URL")!;
const SB_KEY          = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });

serve(async (req) => {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook imzası xətalı:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  const sb = createClient(SB_URL, SB_KEY);

  // ── checkout.session.completed: Ödəniş tamamlandı ──────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return new Response("Payment not completed", { status: 200 });
    }

    const restaurantId = session.metadata?.restaurant_id;
    if (!restaurantId) {
      console.error("restaurant_id metadata-da yoxdur");
      return new Response("Missing metadata", { status: 200 });
    }

    const now     = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 1); // 1 ay əlavə et

    // Abunəliyi aktiv et
    await sb.from("subscriptions").upsert({
      restaurant_id:    parseInt(restaurantId),
      status:           "active",
      started_at:       now.toISOString(),
      expires_at:       expires.toISOString(),
      stripe_customer_id:    session.customer as string,
      stripe_session_id:     session.id,
      updated_at:       now.toISOString(),
    }, { onConflict: "restaurant_id" });

    // Ödəniş tarixini güncəllə
    await sb.from("payment_history")
      .update({
        status:           "paid",
        stripe_payment_id: session.payment_intent as string,
        stripe_session_id: session.id,
        paid_at:          now.toISOString(),
        period_start:     now.toISOString(),
        period_end:       expires.toISOString(),
        amount:           (session.amount_total || 0) / 100,
        currency:         session.currency || "usd",
      })
      .eq("stripe_session_id", session.id);

    console.log(`✅ Abunəlik aktiv edildi: restoran #${restaurantId}, ${expires.toLocaleDateString("az-AZ")} tarixinə qədər`);
  }

  // ── payment_intent.payment_failed: Ödəniş uğursuz ──────────
  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await sb.from("payment_history")
      .update({ status: "failed" })
      .eq("stripe_payment_id", pi.id);
    console.log("❌ Ödəniş uğursuz:", pi.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
