import { NextResponse } from "next/server";

import Stripe from "stripe";

import { getEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripeSecretKey = getEnv("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    const webhookSecret = getEnv("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 },
    );
  }

  const idempotencyInsert = await supabase.from("stripe_webhook_events").insert({
    event_id: event.id,
    type: event.type,
    raw: event,
  });

  if (idempotencyInsert.error) {
    if (idempotencyInsert.error.code === "23505") {
      return NextResponse.json({ received: true, deduped: true });
    }
    return NextResponse.json(
      { error: idempotencyInsert.error.message },
      { status: 500 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (orderId) {
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("id,user_id,kind,amount,currency,status,stripe_session_id")
          .eq("id", orderId)
          .maybeSingle();

        if (orderError || !order) {
          throw new Error(orderError?.message ?? "Order not found");
        }

        await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id: paymentIntent ?? null,
            stripe_session_id: order.stripe_session_id ?? session.id,
          })
          .eq("id", orderId);

        await supabase.from("payments").insert({
          user_id: order.user_id,
          order_id: orderId,
          provider: "stripe",
          status: "succeeded",
          amount: order.amount,
          currency: order.currency,
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntent ?? null,
          stripe_event_id: event.id,
        });

        const { data: activeEntitlement } = await supabase
          .from("entitlements")
          .select("id")
          .eq("user_id", order.user_id)
          .eq("kind", order.kind)
          .eq("active", true)
          .maybeSingle();

        if (activeEntitlement?.id) {
          await supabase
            .from("entitlements")
            .update({ order_id: orderId })
            .eq("id", activeEntitlement.id);
        } else {
          await supabase.from("entitlements").insert({
            user_id: order.user_id,
            kind: order.kind,
            order_id: orderId,
            active: true,
          });
        }

        await supabase
          .from("stripe_webhook_events")
          .update({
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntent ?? null,
            order_id: orderId,
            processed_ok: true,
            error: null,
          })
          .eq("event_id", event.id);

        await supabase.from("audit_logs").insert({
          action: "stripe.checkout.session.completed",
          entity_type: "order",
          entity_id: orderId,
          meta: {
            stripe_event_id: event.id,
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntent,
          },
        });
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await supabase.from("orders").update({ status: "canceled" }).eq("id", orderId);
        await supabase
          .from("stripe_webhook_events")
          .update({
            stripe_session_id: session.id,
            order_id: orderId,
            processed_ok: true,
            error: null,
          })
          .eq("event_id", event.id);
        await supabase.from("audit_logs").insert({
          action: "stripe.checkout.session.expired",
          entity_type: "order",
          entity_id: orderId,
          meta: { stripe_event_id: event.id, stripe_session_id: session.id },
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    await supabase
      .from("stripe_webhook_events")
      .update({ processed_ok: false, error: message })
      .eq("event_id", event.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
