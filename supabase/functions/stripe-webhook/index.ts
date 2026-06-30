import Stripe from "npm:stripe@21.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
const STRIPE_WEBHOOK_SECRET = (Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "").trim();

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      appInfo: {
        name: "shanayas-driving-school-checkout",
        version: "1.0.0",
      },
    })
  : null;

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const getAdminClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("missing_supabase_env");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const roundMoney = (cents: number) => Number((cents / 100).toFixed(2));

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const asInstallmentCount = (value: unknown): 2 | 3 | null => {
  if (value === 2 || value === "2") {
    return 2;
  }

  if (value === 3 || value === "3") {
    return 3;
  }

  return null;
};

const getLatestChargeId = (paymentIntent: Stripe.PaymentIntent) => {
  if (typeof paymentIntent.latest_charge === "string" && paymentIntent.latest_charge.trim().length > 0) {
    return paymentIntent.latest_charge;
  }

  if (
    paymentIntent.latest_charge &&
    typeof paymentIntent.latest_charge === "object" &&
    "id" in paymentIntent.latest_charge &&
    typeof paymentIntent.latest_charge.id === "string" &&
    paymentIntent.latest_charge.id.trim().length > 0
  ) {
    return paymentIntent.latest_charge.id;
  }

  return null;
};

const getPaymentMethodId = (paymentIntent: Stripe.PaymentIntent) => {
  if (typeof paymentIntent.payment_method === "string" && paymentIntent.payment_method.trim().length > 0) {
    return paymentIntent.payment_method;
  }

  if (
    paymentIntent.payment_method &&
    typeof paymentIntent.payment_method === "object" &&
    "id" in paymentIntent.payment_method &&
    typeof paymentIntent.payment_method.id === "string" &&
    paymentIntent.payment_method.id.trim().length > 0
  ) {
    return paymentIntent.payment_method.id;
  }

  return null;
};

const getPaymentMethodType = async (stripeClient: Stripe, paymentIntent: Stripe.PaymentIntent) => {
  if (
    paymentIntent.payment_method &&
    typeof paymentIntent.payment_method === "object" &&
    "type" in paymentIntent.payment_method &&
    typeof paymentIntent.payment_method.type === "string"
  ) {
    return paymentIntent.payment_method.type;
  }

  const latestChargeId = getLatestChargeId(paymentIntent);
  if (latestChargeId) {
    try {
      const charge = await stripeClient.charges.retrieve(latestChargeId);
      if (typeof charge.payment_method_details?.type === "string" && charge.payment_method_details.type.trim().length > 0) {
        return charge.payment_method_details.type;
      }
    } catch (error) {
      console.error("stripe-webhook latest charge lookup failed", {
        error: error instanceof Error ? error.message : "unknown_error",
        latestChargeId,
        paymentIntentId: paymentIntent.id,
      });
    }
  }

  const paymentMethodId = getPaymentMethodId(paymentIntent);
  if (paymentMethodId) {
    try {
      const paymentMethod = await stripeClient.paymentMethods.retrieve(paymentMethodId);
      if (typeof paymentMethod.type === "string" && paymentMethod.type.trim().length > 0) {
        return paymentMethod.type;
      }
    } catch (error) {
      console.error("stripe-webhook payment method lookup failed", {
        error: error instanceof Error ? error.message : "unknown_error",
        paymentIntentId: paymentIntent.id,
        paymentMethodId,
      });
    }
  }

  return null;
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  if (!stripe) {
    return jsonResponse(500, { error: "missing_stripe_secret_key" });
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    return jsonResponse(500, { error: "missing_stripe_webhook_secret" });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonResponse(400, { error: "missing_signature" });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (error) {
    return jsonResponse(400, {
      error: "invalid_signature",
      message: error instanceof Error ? error.message : "Webhook signature verification failed.",
    });
  }

  if (
    event.type !== "payment_intent.processing" &&
    event.type !== "payment_intent.succeeded" &&
    event.type !== "payment_intent.payment_failed" &&
    event.type !== "payment_intent.canceled"
  ) {
    return jsonResponse(200, { received: true, ignored: true });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderIdFromMetadata =
    typeof paymentIntent.metadata?.order_id === "string" && paymentIntent.metadata.order_id.trim().length > 0
      ? paymentIntent.metadata.order_id.trim()
      : null;

  const admin = getAdminClient();

  const orderLookup = await admin
    .from("orders")
    .select("id, amount, payment_status, metadata")
    .eq("external_order_id", paymentIntent.id)
    .maybeSingle();

  const order =
    orderLookup.data ??
    (orderIdFromMetadata
      ? (
          await admin.from("orders").select("id, amount, payment_status, metadata").eq("id", orderIdFromMetadata).maybeSingle()
        ).data
      : null);

  if (!order) {
    return jsonResponse(200, { received: true, ignored: true, reason: "order_not_found" });
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
  const orderTotal =
    asNumber(currentPaymentPlan.order_total) ??
    asNumber(order.amount) ??
    roundMoney(paymentIntent.amount);
  const chargedAmount = roundMoney(paymentIntent.amount);
  const remainingBalance = paymentMode === "installment" ? Number(Math.max(orderTotal - chargedAmount, 0).toFixed(2)) : 0;
  const amountDueToday =
    asNumber(currentPaymentPlan.amount_due_today) ??
    chargedAmount;
  const paymentMethodType = await getPaymentMethodType(stripe, paymentIntent);

  const paymentPlanUpdate: Record<string, unknown> = {
    ...currentPaymentPlan,
    payment_mode: paymentMode,
    installment_count: installmentCount,
    order_total: orderTotal,
    amount_due_today: amountDueToday,
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
        payment_method_id: getPaymentMethodId(paymentIntent),
        payment_method_type: paymentMethodType,
        status: paymentIntent.status,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency,
        charge_type: paymentMode,
        last_event_type: event.type,
        last_event_id: event.id,
        last_event_created: event.created,
      },
    },
  };

  if (paymentMethodType) {
    updatePayload.payment_method_type = paymentMethodType;
  }

  if (event.type === "payment_intent.succeeded") {
    if (paymentMode === "installment") {
      updatePayload.payment_status = "pending_payment";
      paymentPlanUpdate.status = "initial_payment_succeeded";
      paymentPlanUpdate.initial_payment_received_at = new Date().toISOString();
      paymentPlanUpdate.initial_payment_amount = chargedAmount;
    } else {
      updatePayload.payment_status = "paid";
      updatePayload.purchased_at = new Date().toISOString();
      paymentPlanUpdate.status = "paid";
      paymentPlanUpdate.remaining_balance = 0;
      paymentPlanUpdate.remaining_installments = 0;
    }
  } else if (event.type === "payment_intent.processing") {
    updatePayload.payment_status = "processing_payment";
    paymentPlanUpdate.status = paymentMode === "installment" ? "initial_payment_processing" : "processing_payment";
  } else if (event.type === "payment_intent.payment_failed") {
    updatePayload.payment_status = "failed";
    paymentPlanUpdate.status = paymentMode === "installment" ? "initial_payment_failed" : "failed";
  } else if (event.type === "payment_intent.canceled") {
    updatePayload.payment_status = "cancelled";
    paymentPlanUpdate.status = paymentMode === "installment" ? "initial_payment_cancelled" : "cancelled";
  }

  const { error: updateError } = await admin.from("orders").update(updatePayload).eq("id", order.id);

  if (updateError) {
    return jsonResponse(500, { error: "order_update_failed" });
  }

  const invoiceId =
    typeof paymentIntent.metadata?.invoice_id === "string" && paymentIntent.metadata.invoice_id.trim().length > 0
      ? paymentIntent.metadata.invoice_id.trim()
      : typeof currentInvoice.id === "string" && currentInvoice.id.trim().length > 0
        ? currentInvoice.id.trim()
        : null;

  if (invoiceId && event.type === "payment_intent.succeeded" && paymentMode === "full") {
    const paidAt = updatePayload.purchased_at as string | undefined;
    const { error: invoiceUpdateError } = await admin
      .from("checkout_invoices")
      .update({
        status: "paid",
        paid_at: paidAt ?? new Date().toISOString(),
        last_order_id: order.id,
      })
      .eq("id", invoiceId);

    if (invoiceUpdateError) {
      console.error("stripe-webhook invoice update failed", {
        code: invoiceUpdateError.code,
        message: invoiceUpdateError.message,
        invoiceId,
        orderId: order.id,
      });
      return jsonResponse(500, { error: "invoice_update_failed" });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const { error: redeemError } = await admin.rpc("redeem_checkout_order_coupons", {
      p_order_id: order.id,
    });

    if (redeemError) {
      console.error("stripe-webhook coupon redemption failed", {
        code: redeemError.code,
        message: redeemError.message,
        orderId: order.id,
      });
      return jsonResponse(500, { error: "coupon_redemption_failed" });
    }
  }

  return jsonResponse(200, { received: true });
});
