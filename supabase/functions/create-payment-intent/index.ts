import Stripe from "npm:stripe@21.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, readAllowedOrigins } from "../_shared/cors.ts";
import { calculateCheckoutTotals, normalizeCheckoutPricingItems } from "../_shared/checkoutPricing.ts";
import {
  applyCouponsToCheckoutPricing,
  normalizeCheckoutCouponCodes,
  validateCheckoutCouponCodes,
} from "../_shared/checkoutCoupons.ts";

type PaymentMode = "full" | "installment";
type InstallmentCount = 2 | 3;
type BillingDetails = {
  address_line1: string;
  city: string;
  country: string;
  email: string;
  full_name: string;
  phone: string;
  postal_code: string;
  province: string;
};

type PaymentIntentBody = {
  applied_coupon_codes: string[];
  billing_details: BillingDetails;
  invoice_token: string | null;
  order_id: string;
  items: unknown;
};

type CheckoutPricingResult = ReturnType<typeof applyCouponsToCheckoutPricing>;

type CheckoutInvoiceRecord = {
  id: string;
  public_token: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  expires_at: string | null;
  paid_at: string | null;
};

const INSTALLMENT_EXCLUDED_PAYMENT_METHOD_TYPES: Array<Stripe.PaymentIntentCreateParams.ExcludedPaymentMethodType> = [
  "affirm",
  "afterpay_clearpay",
  "klarna",
];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STRIPE_SECRET_KEY = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();

const configuredOrigins = readAllowedOrigins();

const jsonResponse = (status: number, body: Record<string, unknown>, corsHeaders: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });

const roundMoney = (value: number) => Number(value.toFixed(2));
const toCents = (value: number) => Math.round(value * 100);

const asOrderId = (value: unknown) => {
  if (typeof value !== "string") {
    throw new Error("invalid_order_id");
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("invalid_order_id");
  }

  return trimmed;
};

const asRequiredString = (value: unknown, errorMessage: string) => {
  if (typeof value !== "string") {
    throw new Error(errorMessage);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(errorMessage);
  }

  return trimmed;
};

const asOptionalUuid = (value: unknown, errorMessage: string) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = asRequiredString(value, errorMessage);
  if (!UUID_PATTERN.test(normalized)) {
    throw new Error(errorMessage);
  }

  return normalized;
};

const asCountryCode = (value: unknown) => {
  const normalized = asRequiredString(value, "invalid_country").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error("invalid_country");
  }

  return normalized;
};

const asBillingDetails = (value: unknown): BillingDetails => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("invalid_billing_details");
  }

  const billingDetails = value as Record<string, unknown>;

  return {
    address_line1: asRequiredString(billingDetails.address_line1, "invalid_address_line1"),
    city: asRequiredString(billingDetails.city, "invalid_city"),
    country: asCountryCode(billingDetails.country),
    email: asRequiredString(billingDetails.email, "invalid_email").toLowerCase(),
    full_name: asRequiredString(billingDetails.full_name, "invalid_full_name"),
    phone: asRequiredString(billingDetails.phone, "invalid_phone"),
    postal_code: asRequiredString(billingDetails.postal_code, "invalid_postal_code"),
    province: asRequiredString(billingDetails.province, "invalid_province"),
  };
};

const asInstallmentCount = (value: unknown): InstallmentCount => (value === 3 ? 3 : 2);

const calculatePaymentPlan = (
  orderTotal: number,
  paymentMode: PaymentMode,
  installmentCount: InstallmentCount,
) => {
  const normalizedTotal = roundMoney(orderTotal);

  if (paymentMode === "full") {
    return {
      amountDueToday: normalizedTotal,
      installmentAmounts: [normalizedTotal],
      installmentCount: null,
      orderTotal: normalizedTotal,
      paymentMode: "full" as const,
      remainingBalance: 0,
      remainingInstallments: 0,
    };
  }

  const totalCents = toCents(normalizedTotal);
  const baseInstallmentCents = Math.floor(totalCents / installmentCount);
  const remainderCents = totalCents % installmentCount;
  const installmentAmounts = Array.from({ length: installmentCount }, (_, index) =>
    roundMoney((baseInstallmentCents + (index < remainderCents ? 1 : 0)) / 100),
  );
  const amountDueToday = installmentAmounts[0];

  return {
    amountDueToday,
    installmentAmounts,
    installmentCount,
    orderTotal: normalizedTotal,
    paymentMode: "installment" as const,
    remainingBalance: roundMoney(normalizedTotal - amountDueToday),
    remainingInstallments: installmentCount - 1,
  };
};

const asRequestBody = (value: unknown): PaymentIntentBody => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("invalid_body");
  }

  const body = value as Record<string, unknown>;

  return {
    applied_coupon_codes: normalizeCheckoutCouponCodes(body.applied_coupon_codes),
    billing_details: asBillingDetails(body.billing_details),
    invoice_token: asOptionalUuid(body.invoice_token, "invalid_invoice_token"),
    order_id: asOrderId(body.order_id),
    items: body.items,
  };
};

const isExpiredTimestamp = (value: string | null) => {
  if (!value) {
    return false;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= Date.now();
};

const resolveCheckoutInvoice = async (
  admin: ReturnType<typeof createClient>,
  invoiceToken: string,
) => {
  const { data, error } = await admin
    .from("checkout_invoices")
    .select("id, public_token, title, description, amount, currency, customer_name, customer_email, status, expires_at, paid_at")
    .eq("public_token", invoiceToken)
    .maybeSingle();

  if (error) {
    console.error("create-payment-intent invoice lookup failed", {
      code: error.code,
      message: error.message,
      invoiceToken,
    });
    throw new Error("invoice_lookup_failed");
  }

  if (!data) {
    throw new Error("invoice_not_found");
  }

  const invoice = {
    ...data,
    amount: Number(data.amount ?? 0),
    description: typeof data.description === "string" ? data.description : null,
    customer_name: typeof data.customer_name === "string" ? data.customer_name : null,
    customer_email: typeof data.customer_email === "string" ? data.customer_email : null,
    expires_at: typeof data.expires_at === "string" ? data.expires_at : null,
    paid_at: typeof data.paid_at === "string" ? data.paid_at : null,
  } satisfies CheckoutInvoiceRecord;

  if (invoice.paid_at || invoice.status === "paid") {
    throw new Error("invoice_already_paid");
  }

  if (invoice.status !== "open") {
    throw new Error("invoice_not_available");
  }

  if (isExpiredTimestamp(invoice.expires_at)) {
    throw new Error("invoice_expired");
  }

  return invoice;
};

const buildInvoicePricing = (invoice: CheckoutInvoiceRecord): CheckoutPricingResult => {
  const unitPrice = roundMoney(invoice.amount);
  const unitCostCents = toCents(unitPrice);

  return {
    items: [],
    lineItems: [
      {
        itemType: "extra",
        productId: invoice.id,
        locationId: "invoice",
        quantity: 1,
        pricingTier: "standard",
        productName: invoice.title,
        unitPrice,
        unitCostCents,
        lineTotal: unitPrice,
      },
    ],
    appliedCoupons: [],
    bundleDiscountAmount: 0,
    bundleDiscountEligibleInCarCourseCount: 0,
    bundleDiscountPercent: 0,
    couponDiscountAmount: 0,
    couponDiscountPercent: 0,
    totalDiscountAmount: 0,
    discountAmount: 0,
    discountPercent: 0,
    subtotalBeforeDiscount: unitPrice,
    subtotalAfterBundleDiscount: unitPrice,
    subtotal: unitPrice,
    estimatedTaxes: 0,
    total: unitPrice,
  };
};

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      appInfo: {
        name: "shanayas-driving-school-checkout",
        version: "1.0.0",
      },
    })
  : null;

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders({
    origin,
    configuredOrigins,
    allowedHeaders: "authorization, x-client-info, apikey, content-type",
    allowedMethods: "POST, OPTIONS",
  });

  if (!corsHeaders) {
    return new Response("Origin not allowed", { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" }, corsHeaders);
  }

  if (!stripe) {
    return jsonResponse(500, { error: "missing_stripe_secret_key" }, corsHeaders);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { error: "missing_supabase_env" }, corsHeaders);
  }

  let body: PaymentIntentBody;
  try {
    body = asRequestBody(await request.json());
  } catch (error) {
    return jsonResponse(
      400,
      { error: error instanceof Error ? error.message : "invalid_body" },
      corsHeaders,
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, package_name, customer_email, payment_status, external_order_id, metadata")
    .eq("id", body.order_id)
    .single();

  if (orderError || !order) {
    return jsonResponse(404, { error: "order_not_found" }, corsHeaders);
  }

  if (order.payment_status === "paid") {
    return jsonResponse(409, { error: "order_already_paid" }, corsHeaders);
  }

  const currentMetadata =
    order.metadata && typeof order.metadata === "object" && !Array.isArray(order.metadata)
      ? order.metadata as Record<string, unknown>
      : {};
  const currentPricingSummary =
    currentMetadata.pricing_summary &&
    typeof currentMetadata.pricing_summary === "object" &&
    !Array.isArray(currentMetadata.pricing_summary)
      ? currentMetadata.pricing_summary as Record<string, unknown>
      : {};
  const currentPaymentPlan =
    currentMetadata.payment_plan &&
    typeof currentMetadata.payment_plan === "object" &&
    !Array.isArray(currentMetadata.payment_plan)
      ? currentMetadata.payment_plan as Record<string, unknown>
      : {};
  const currentStripe =
    currentMetadata.stripe &&
    typeof currentMetadata.stripe === "object" &&
    !Array.isArray(currentMetadata.stripe)
      ? currentMetadata.stripe as Record<string, unknown>
      : {};
  const currentInvoice =
    currentMetadata.invoice &&
    typeof currentMetadata.invoice === "object" &&
    !Array.isArray(currentMetadata.invoice)
      ? currentMetadata.invoice as Record<string, unknown>
      : {};
  const invoiceToken =
    body.invoice_token ??
    (typeof currentInvoice.public_token === "string" && currentInvoice.public_token.trim().length > 0
      ? currentInvoice.public_token.trim()
      : null);

  let pricing: CheckoutPricingResult;
  let invoice: CheckoutInvoiceRecord | null = null;

  if (invoiceToken) {
    if (body.applied_coupon_codes.length > 0) {
      return jsonResponse(400, { error: "invoice_coupon_not_supported" }, corsHeaders);
    }

    try {
      invoice = await resolveCheckoutInvoice(admin, invoiceToken);
    } catch (error) {
      return jsonResponse(
        400,
        { error: error instanceof Error ? error.message : "invoice_lookup_failed" },
        corsHeaders,
      );
    }

    if (
      typeof currentInvoice.id === "string" &&
      currentInvoice.id.trim().length > 0 &&
      currentInvoice.id !== invoice.id
    ) {
      return jsonResponse(409, { error: "invoice_order_mismatch" }, corsHeaders);
    }

    pricing = buildInvoicePricing(invoice);
  } else {
    try {
      const validatedCoupons = await validateCheckoutCouponCodes(admin, body.applied_coupon_codes);
      const normalizedItems = normalizeCheckoutPricingItems(body.items);
      pricing = applyCouponsToCheckoutPricing(calculateCheckoutTotals(normalizedItems), validatedCoupons);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "invalid_coupon_code";
      return jsonResponse(
        400,
        { error: errorMessage === "invalid_items" ? "invalid_items" : errorMessage },
        corsHeaders,
      );
    }
  }

  const isLegacyInstallmentOrder = currentPaymentPlan.payment_mode === "installment";
  const paymentPlan = calculatePaymentPlan(
    pricing.total,
    isLegacyInstallmentOrder ? "installment" : "full",
    asInstallmentCount(currentPaymentPlan.installment_count),
  );
  const chargeAmountCents = toCents(paymentPlan.amountDueToday);
  const shouldEnableDynamicPaymentMethods = true;
  const hasDiscount = pricing.totalDiscountAmount > 0;
  const amountDetails =
    paymentPlan.paymentMode === "full" && !hasDiscount
      ? {
          line_items: pricing.lineItems.map((item) => ({
            product_name: item.productName,
            quantity: item.quantity,
            unit_cost: item.unitCostCents,
          })),
          tax: {
            total_tax_amount: toCents(pricing.estimatedTaxes),
          },
        }
      : undefined;
  const shippingDetails = {
    address: {
      city: body.billing_details.city,
      country: body.billing_details.country,
      line1: body.billing_details.address_line1,
      postal_code: body.billing_details.postal_code,
      state: body.billing_details.province,
    },
    name: body.billing_details.full_name,
    phone: body.billing_details.phone,
  };

  if (currentPaymentPlan.status === "initial_payment_succeeded") {
    return jsonResponse(409, { error: "initial_payment_already_received" }, corsHeaders);
  }

  const existingPaymentIntentId =
    typeof order.external_order_id === "string" && order.external_order_id.startsWith("pi_")
      ? order.external_order_id
      : null;

  let paymentIntent:
    | Stripe.Response<Stripe.PaymentIntent>
    | Stripe.PaymentIntent
    | null = null;

  if (existingPaymentIntentId) {
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(existingPaymentIntentId);
    } catch {
      paymentIntent = null;
    }
  }

  if (
    paymentIntent &&
    (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action"
    ) &&
    paymentIntent.payment_method_types.length === 1 &&
    paymentIntent.payment_method_types[0] === "card"
  ) {
    try {
      await stripe.paymentIntents.cancel(paymentIntent.id);
    } catch {
      // Allow the create path below to decide whether a fresh intent can be used.
    }
    paymentIntent = null;
  }

  const stripeMetadata = {
    order_id: String(order.id),
    package_name: String(order.package_name),
    invoice_id: invoice?.id ?? "",
    invoice_token: invoice?.public_token ?? "",
    payment_mode: paymentPlan.paymentMode,
    installment_count: paymentPlan.installmentCount ? String(paymentPlan.installmentCount) : "",
    amount_due_today_cents: String(chargeAmountCents),
    order_total_cents: String(toCents(paymentPlan.orderTotal)),
    remaining_balance_cents: String(toCents(paymentPlan.remainingBalance)),
    applied_coupon_codes: pricing.appliedCoupons.map((coupon) => coupon.code).join(","),
  };
  const canUpdateExistingIntent =
    paymentIntent &&
    (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action"
    );

  try {
    if (!paymentIntent || paymentIntent.status === "canceled") {
      paymentIntent = await stripe.paymentIntents.create({
        amount: chargeAmountCents,
        amount_details: amountDetails,
        automatic_payment_methods: shouldEnableDynamicPaymentMethods ? { enabled: true } : undefined,
        currency: "cad",
        description: String(order.package_name),
        excluded_payment_method_types: paymentPlan.paymentMode === "installment"
          ? INSTALLMENT_EXCLUDED_PAYMENT_METHOD_TYPES
          : undefined,
        receipt_email: body.billing_details.email,
        shipping: shippingDetails,
        setup_future_usage: paymentPlan.paymentMode === "installment" ? "off_session" : undefined,
        metadata: stripeMetadata,
      });
    } else if (paymentIntent.status === "succeeded") {
      return jsonResponse(409, { error: "payment_intent_already_succeeded" }, corsHeaders);
    } else if (!canUpdateExistingIntent && paymentIntent.amount !== chargeAmountCents) {
      return jsonResponse(409, { error: "payment_intent_locked" }, corsHeaders);
    } else if (canUpdateExistingIntent) {
      paymentIntent = await stripe.paymentIntents.update(paymentIntent.id, {
        amount: chargeAmountCents,
        amount_details: amountDetails,
        description: String(order.package_name),
        excluded_payment_method_types: paymentPlan.paymentMode === "installment"
          ? INSTALLMENT_EXCLUDED_PAYMENT_METHOD_TYPES
          : undefined,
        receipt_email: body.billing_details.email,
        shipping: shippingDetails,
        setup_future_usage: paymentPlan.paymentMode === "installment" ? "off_session" : undefined,
        metadata: stripeMetadata,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe payment intent request failed.";
    console.error("create-payment-intent stripe request failed", {
      error: message,
      orderId: order.id,
      paymentIntentId: paymentIntent?.id ?? null,
    });
    return jsonResponse(500, { error: "stripe_payment_intent_request_failed", message }, corsHeaders);
  }

  const currentContact =
    currentMetadata.contact &&
    typeof currentMetadata.contact === "object" &&
    !Array.isArray(currentMetadata.contact)
      ? currentMetadata.contact as Record<string, unknown>
      : {};
  const { error: updateError } = await admin
    .from("orders")
    .update({
      amount: pricing.total,
      external_order_id: paymentIntent.id,
      payment_status: "pending_payment",
      metadata: {
        ...currentMetadata,
        applied_coupon_codes: pricing.appliedCoupons.map((coupon) => coupon.code),
        applied_coupons: pricing.appliedCoupons,
        ...(invoice
          ? {
              invoice: {
                ...currentInvoice,
                id: invoice.id,
                public_token: invoice.public_token,
                title: invoice.title,
                description: invoice.description,
                amount: pricing.total,
                currency: invoice.currency,
                customer_name: invoice.customer_name,
                customer_email: invoice.customer_email,
                status: invoice.status,
                expires_at: invoice.expires_at,
              },
            }
          : {}),
        contact: {
          ...currentContact,
          address_line1: body.billing_details.address_line1,
          city: body.billing_details.city,
          country: body.billing_details.country,
          full_name: body.billing_details.full_name,
          email: body.billing_details.email,
          phone: body.billing_details.phone,
          postal_code: body.billing_details.postal_code,
          province: body.billing_details.province,
        },
        pricing_summary: {
          ...currentPricingSummary,
          subtotal_before_discount: pricing.subtotalBeforeDiscount,
          subtotal_after_bundle_discount: pricing.subtotalAfterBundleDiscount,
          bundle_discount_amount: pricing.bundleDiscountAmount,
          bundle_discount_percent: pricing.bundleDiscountPercent,
          coupon_discount_amount: pricing.couponDiscountAmount,
          coupon_discount_percent: pricing.couponDiscountPercent,
          total_discount_amount: pricing.totalDiscountAmount,
          discount_amount: pricing.discountAmount,
          discount_percent: pricing.discountPercent,
          subtotal: pricing.subtotal,
          estimated_taxes: pricing.estimatedTaxes,
          total: pricing.total,
          currency: invoice?.currency ?? "CAD",
        },
        payment_plan: {
          ...currentPaymentPlan,
          payment_mode: paymentPlan.paymentMode,
          installment_count: paymentPlan.installmentCount,
          installment_amounts: paymentPlan.installmentAmounts,
          amount_due_today: paymentPlan.amountDueToday,
          remaining_balance: paymentPlan.remainingBalance,
          remaining_installments: paymentPlan.remainingInstallments,
          order_total: paymentPlan.orderTotal,
          status: paymentPlan.paymentMode === "installment" ? "initial_payment_pending" : "awaiting_full_payment",
          initial_payment_intent_id: paymentIntent.id,
          initial_payment_status: paymentIntent.status,
          setup_future_usage: paymentPlan.paymentMode === "installment" ? "off_session" : null,
        },
        stripe: {
          ...currentStripe,
          automatic_payment_methods_enabled: shouldEnableDynamicPaymentMethods,
          payment_intent_id: paymentIntent.id,
          amount_cents: paymentIntent.amount,
          currency: paymentIntent.currency,
          charge_type: paymentPlan.paymentMode,
        },
      },
    })
    .eq("id", body.order_id);

  if (updateError) {
    return jsonResponse(500, { error: "order_update_failed" }, corsHeaders);
  }

  if (!paymentIntent.client_secret) {
    return jsonResponse(500, { error: "missing_client_secret" }, corsHeaders);
  }

  return jsonResponse(
    200,
    {
      ok: true,
      order_id: order.id,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      applied_coupons: pricing.appliedCoupons,
      subtotal_before_discount: pricing.subtotalBeforeDiscount,
      subtotal_after_bundle_discount: pricing.subtotalAfterBundleDiscount,
      bundle_discount_amount: pricing.bundleDiscountAmount,
      bundle_discount_percent: pricing.bundleDiscountPercent,
      coupon_discount_amount: pricing.couponDiscountAmount,
      coupon_discount_percent: pricing.couponDiscountPercent,
      total_discount_amount: pricing.totalDiscountAmount,
      discount_amount: pricing.discountAmount,
      discount_percent: pricing.discountPercent,
      subtotal: pricing.subtotal,
      estimated_taxes: pricing.estimatedTaxes,
      amount_due_today: paymentPlan.amountDueToday,
      payment_mode: paymentPlan.paymentMode,
      installment_count: paymentPlan.installmentCount,
      remaining_balance: paymentPlan.remainingBalance,
      total: pricing.total,
      currency: invoice?.currency ?? "CAD",
    },
    corsHeaders,
  );
});
