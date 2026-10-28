import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") ?? "").trim();
const SERVICE_ROLE_KEY = (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "").trim();
const CRON_SECRET = (Deno.env.get("STRIPE_RECONCILIATION_CRON_SECRET") ?? "").trim();
const SYNC_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/sync-payment-status` : "";
// Keep scheduled runs gentle on Stripe and the edge-function relay. The next
// run continues from the remaining unresolved orders.
const MAX_ORDERS_PER_RUN = 50;
const BATCH_SIZE = 2;

type OrderRow = {
  id: string;
  external_order_id: string | null;
  payment_status: string;
  metadata: unknown;
};

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

const getPaymentIntentId = (order: OrderRow) => {
  if (order.external_order_id?.startsWith("pi_")) return order.external_order_id;
  const stripe = asRecord(asRecord(order.metadata).stripe);
  const paymentIntentId = stripe.payment_intent_id;
  return typeof paymentIntentId === "string" && /^pi_[A-Za-z0-9]+$/.test(paymentIntentId) ? paymentIntentId : null;
};

const getAdminClient = () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error("missing_supabase_env");
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
};

const reconcileOne = async (order: OrderRow, paymentIntentId: string) => {
  const response = await fetch(SYNC_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order_id: order.id, payment_intent_id: paymentIntentId }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof payload?.error === "string" ? payload.error : `sync_http_${response.status}`);
  }
  return payload as { payment_status?: string; synced?: boolean };
};

Deno.serve(async (request) => {
  if (request.method !== "POST") return jsonResponse(405, { error: "method_not_allowed" });
  if (!CRON_SECRET || request.headers.get("x-stripe-reconciliation-secret") !== CRON_SECRET) {
    return jsonResponse(401, { error: "unauthorized" });
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("id, external_order_id, payment_status, metadata")
      .in("payment_status", ["pending", "pending_payment", "processing_payment", "failed"])
      .order("created_at", { ascending: false })
      .limit(MAX_ORDERS_PER_RUN);

    if (error) return jsonResponse(500, { error: "order_lookup_failed" });

    const candidates = ((data ?? []) as OrderRow[])
      .map((order) => ({ order, paymentIntentId: getPaymentIntentId(order) }))
      .filter((entry): entry is { order: OrderRow; paymentIntentId: string } => Boolean(entry.paymentIntentId));

    let checked = 0;
    let paid = 0;
    let failed = 0;

    for (let index = 0; index < candidates.length; index += BATCH_SIZE) {
      const batch = candidates.slice(index, index + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map(({ order, paymentIntentId }) => reconcileOne(order, paymentIntentId)));
      results.forEach((result) => {
        if (result.status === "rejected") {
          failed += 1;
          console.error("stripe reconciliation candidate failed", result.reason instanceof Error ? result.reason.message : result.reason);
          return;
        }
        checked += 1;
        if (result.value.payment_status === "paid") paid += 1;
      });
    }

    return jsonResponse(200, {
      ok: true,
      candidates: candidates.length,
      checked,
      paid,
      failed,
      skipped_without_payment_intent: (data ?? []).length - candidates.length,
    });
  } catch (error) {
    console.error("stripe-payment-reconciliation-worker failed", error instanceof Error ? error.message : "unknown_error");
    return jsonResponse(500, { error: "reconciliation_worker_failed" });
  }
});
