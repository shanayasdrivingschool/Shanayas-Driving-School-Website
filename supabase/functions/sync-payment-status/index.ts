import Stripe from "npm:stripe@21.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, readAllowedOrigins } from "../_shared/cors.ts";

type SyncRequest = {
  order_id: string;
  payment_intent_id: string;
};

const STRIPE_SECRET_KEY = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
const configuredOrigins = readAllowedOrigins();
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { appInfo: { name: "shanayas-driving-school-checkout", version: "1.0.0" } })
  : null;

const jsonResponse = (status: number, body: Record<string, unknown>, corsHeaders: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const asInstallmentCount = (value: unknown): 2 | 3 | null =>
  value === 2 || value === "2" ? 2 : value === 3 || value === "3" ? 3 : null;

const asRequest = (value: unknown): SyncRequest => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_body");
  const body = value as Record<string, unknown>;
  const orderId = typeof body.order_id === "string" ? body.order_id.trim() : "";
  const paymentIntentId = typeof body.payment_intent_id === "string" ? body.payment_intent_id.trim() : "";
  if (!orderId || !paymentIntentId || !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) throw new Error("invalid_payment_reference");
  return { order_id: orderId, payment_intent_id: paymentIntentId };
};

const getAdminClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) throw new Error("missing_supabase_env");
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
};

Deno.serve(async (request) => {
  const corsHeaders = buildCorsHeaders({
    origin: request.headers.get("origin"),
    configuredOrigins,
    allowedHeaders: "authorization, x-client-info, apikey, content-type",
    allowedMethods: "POST, OPTIONS",
  });
  if (!corsHeaders) return new Response("Origin not allowed", { status: 403 });
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { error: "method_not_allowed" }, corsHeaders);
  if (!stripe) return jsonResponse(500, { error: "missing_stripe_secret_key" }, corsHeaders);

  let input: SyncRequest;
  try {
    input = asRequest(await request.json());
  } catch (error) {
    return jsonResponse(400, { error: error instanceof Error ? error.message : "invalid_body" }, corsHeaders);
  }

  try {
    const admin = getAdminClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(input.payment_intent_id);
    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, amount, payment_status, external_order_id, purchased_at, metadata")
      .eq("id", input.order_id)
      .maybeSingle();

    if (orderError) return jsonResponse(500, { error: "order_lookup_failed" }, corsHeaders);
    if (!order) return jsonResponse(404, { error: "order_not_found" }, corsHeaders);

    const paymentIntentOrderId = paymentIntent.metadata?.order_id?.trim();
    if (paymentIntentOrderId !== input.order_id || (order.external_order_id && order.external_order_id !== paymentIntent.id)) {
      return jsonResponse(400, { error: "payment_reference_mismatch" }, corsHeaders);
    }

    // The endpoint is a recovery path for a successful customer payment. Do not
    // turn a still-incomplete PaymentIntent into a paid order from the browser.
    if (paymentIntent.status !== "succeeded" && paymentIntent.status !== "processing" && paymentIntent.status !== "canceled") {
      return jsonResponse(200, { ok: true, synced: false, payment_status: order.payment_status }, corsHeaders);
    }

    const currentMetadata = asRecord(order.metadata);
    const currentPaymentPlan = asRecord(currentMetadata.payment_plan);
    const currentStripe = asRecord(currentMetadata.stripe);
    const currentInvoice = asRecord(currentMetadata.invoice);
    const paymentMode =
      paymentIntent.metadata?.payment_mode === "installment" || currentPaymentPlan.payment_mode === "installment"
        ? "installment"
        : "full";
    const installmentCount =
      asInstallmentCount(paymentIntent.metadata?.installment_count) ?? asInstallmentCount(currentPaymentPlan.installment_count);
    const orderTotal = asNumber(currentPaymentPlan.order_total) ?? asNumber(order.amount) ?? Number((paymentIntent.amount / 100).toFixed(2));
    const chargedAmount = Number((paymentIntent.amount / 100).toFixed(2));
    const remainingBalance = paymentMode === "installment" ? Number(Math.max(orderTotal - chargedAmount, 0).toFixed(2)) : 0;
    const paymentPlanUpdate: Record<string, unknown> = {
      ...currentPaymentPlan,
      payment_mode: paymentMode,
      installment_count: installmentCount,
      order_total: orderTotal,
      amount_due_today: asNumber(currentPaymentPlan.amount_due_today) ?? chargedAmount,
      remaining_balance: remainingBalance,
      remaining_installments: paymentMode === "installment" ? Math.max((installmentCount ?? 1) - 1, 0) : 0,
      initial_payment_intent_id: paymentIntent.id,
      initial_payment_status: paymentIntent.status,
    };
    const updatePayload: Record<string, unknown> = {
      external_order_id: paymentIntent.id,
      amount: orderTotal,
      payment_provider: "stripe",
      metadata: {
        ...currentMetadata,
        payment_plan: paymentPlanUpdate,
        stripe: {
          ...currentStripe,
          payment_intent_id: paymentIntent.id,
          status: paymentIntent.status,
          amount_cents: paymentIntent.amount,
          currency: paymentIntent.currency,
          charge_type: paymentMode,
          last_event_type: "client_reconciliation",
          last_event_created: paymentIntent.created,
        },
      },
    };

    if (paymentIntent.status === "succeeded") {
      if (paymentMode === "installment") {
        updatePayload.payment_status = "pending_payment";
        paymentPlanUpdate.status = "initial_payment_succeeded";
        paymentPlanUpdate.initial_payment_received_at = new Date().toISOString();
        paymentPlanUpdate.initial_payment_amount = chargedAmount;
      } else {
        updatePayload.payment_status = "paid";
        updatePayload.purchased_at = order.purchased_at ?? new Date().toISOString();
        paymentPlanUpdate.status = "paid";
        paymentPlanUpdate.remaining_balance = 0;
        paymentPlanUpdate.remaining_installments = 0;
      }
    } else if (paymentIntent.status === "processing") {
      // Never downgrade a completed payment while a stale browser request is in flight.
      if (order.payment_status === "paid" || currentPaymentPlan.status === "initial_payment_succeeded" || currentPaymentPlan.status === "paid") {
        return jsonResponse(200, { ok: true, synced: false, payment_status: order.payment_status }, corsHeaders);
      }
      updatePayload.payment_status = "processing_payment";
      paymentPlanUpdate.status = paymentMode === "installment" ? "initial_payment_processing" : "processing_payment";
    } else {
      if (order.payment_status === "paid" || currentPaymentPlan.status === "paid") {
        return jsonResponse(200, { ok: true, synced: false, payment_status: order.payment_status }, corsHeaders);
      }
      updatePayload.payment_status = "cancelled";
      paymentPlanUpdate.status = paymentMode === "installment" ? "initial_payment_cancelled" : "cancelled";
    }

    const { error: updateError } = await admin.from("orders").update(updatePayload).eq("id", order.id);
    if (updateError) return jsonResponse(500, { error: "order_update_failed" }, corsHeaders);

    const invoiceId = typeof currentInvoice.id === "string" && currentInvoice.id.trim() ? currentInvoice.id.trim() : null;
    if (invoiceId && paymentIntent.status === "succeeded" && paymentMode === "full") {
      const { error: invoiceError } = await admin
        .from("checkout_invoices")
        .update({ status: "paid", paid_at: updatePayload.purchased_at, last_order_id: order.id })
        .eq("id", invoiceId);
      if (invoiceError) return jsonResponse(500, { error: "invoice_update_failed" }, corsHeaders);
    }

    if (paymentIntent.status === "succeeded") {
      const { error: couponError } = await admin.rpc("redeem_checkout_order_coupons", { p_order_id: order.id });
      if (couponError) console.error("sync-payment-status coupon redemption failed", couponError.message);
    }

    return jsonResponse(200, {
      ok: true,
      synced: true,
      payment_status: updatePayload.payment_status,
      order_id: order.id,
    }, corsHeaders);
  } catch (error) {
    console.error("sync-payment-status failed", error instanceof Error ? error.message : "unknown_error");
    return jsonResponse(500, { error: "payment_status_sync_failed" }, corsHeaders);
  }
});
