import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import type { CartItem } from "@/lib/cart";
import type { CheckoutAppliedCoupon } from "@/lib/checkoutPaymentSession";
import { supabase } from "@/lib/supabaseClient";

type PaymentIntentCartItem = Pick<CartItem, "itemType" | "productId" | "locationId" | "quantity" | "customization">;

type BillingDetailsInput = {
  addressLine1: string;
  city: string;
  country: string;
  email: string;
  fullName: string;
  phone: string;
  postalCode: string;
  province: string;
};

type CreateCheckoutPaymentIntentInput = {
  appliedCouponCodes?: string[];
  billingDetails: BillingDetailsInput;
  invoiceToken?: string;
  items: PaymentIntentCartItem[];
  orderId: string;
};

type CreateCheckoutPaymentIntentResult = {
  appliedCoupons: CheckoutAppliedCoupon[];
  amountDueToday: number;
  bundleDiscountAmount: number;
  bundleDiscountPercent: number;
  clientSecret: string;
  couponDiscountAmount: number;
  couponDiscountPercent: number;
  discountAmount: number;
  discountPercent: number;
  estimatedTaxes: number;
  installmentCount: 2 | 3 | null;
  orderId: string;
  paymentIntentId: string;
  paymentMode: "full" | "installment";
  remainingBalance: number;
  subtotalAfterBundleDiscount: number;
  subtotalBeforeDiscount: number;
  subtotal: number;
  total: number;
};

const CREATE_PAYMENT_INTENT_FUNCTION = "create-payment-intent";

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const getResponseErrorMessage = async (response?: Response) => {
  if (!response) return null;

  try {
    const raw = await response.text();
    if (!raw.trim()) return null;

    try {
      const payload = JSON.parse(raw) as {
        error?: string;
        reason?: string;
        message?: string;
      };

      const parts = [payload.error, payload.reason, payload.message].filter(
        (value): value is string => typeof value === "string" && value.length > 0,
      );

      if (parts.length > 0) {
        return parts.join(" ");
      }
    } catch {
      return raw.trim();
    }
  } catch {
    return null;
  }

  return null;
};

const getFunctionErrorMessage = async (error: unknown, response?: Response) => {
  const responseMessage = await getResponseErrorMessage(response);
  if (responseMessage) {
    return responseMessage;
  }

  if (error instanceof FunctionsHttpError) {
    const contextMessage = await getResponseErrorMessage(error.context);
    if (contextMessage) {
      return contextMessage;
    }

    return "edge_function_http_error";
  }

  if (error instanceof FunctionsRelayError) {
    return "edge_function_relay_error";
  }

  if (error instanceof FunctionsFetchError) {
    const siteOrigin = typeof window !== "undefined" ? window.location.origin : "this site origin";
    return `Unable to reach the payment intent API. Confirm the create-payment-intent edge function is deployed and that its CORS configuration allows ${siteOrigin}.`;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "payment_intent_create_failed";
};

export const createCheckoutPaymentIntent = async (
  input: CreateCheckoutPaymentIntentInput,
): Promise<CreateCheckoutPaymentIntentResult> => {
  const client = ensureSupabase();

  const { data, error: functionError, response } = await client.functions.invoke(CREATE_PAYMENT_INTENT_FUNCTION, {
    body: {
      order_id: input.orderId,
      applied_coupon_codes: input.appliedCouponCodes ?? [],
      billing_details: {
        full_name: input.billingDetails.fullName,
        email: input.billingDetails.email,
        phone: input.billingDetails.phone,
        address_line1: input.billingDetails.addressLine1,
        city: input.billingDetails.city,
        province: input.billingDetails.province,
        postal_code: input.billingDetails.postalCode,
        country: input.billingDetails.country,
      },
      invoice_token: input.invoiceToken?.trim() || null,
      items: input.items.map((item) => ({
        item_type: item.itemType,
        product_id: item.productId,
        location_id: item.locationId,
        quantity: item.quantity,
        lesson_duration_minutes: item.customization?.lessonDurationMinutes ?? null,
      })),
    },
  });

  if (functionError) {
    throw new Error(await getFunctionErrorMessage(functionError, response));
  }

  const payload = data as Record<string, unknown> | null;

  if (
    !payload ||
    typeof payload.client_secret !== "string" ||
    typeof payload.order_id !== "string" ||
    typeof payload.payment_intent_id !== "string" ||
    typeof payload.subtotal !== "number" ||
    typeof payload.estimated_taxes !== "number" ||
    typeof payload.total !== "number" ||
    (typeof payload.amount_due_today !== "number" && typeof payload.total !== "number")
  ) {
    throw new Error("payment_intent_create_failed");
  }

  const appliedCoupons = Array.isArray(payload.applied_coupons)
    ? payload.applied_coupons
        .filter(
          (coupon): coupon is CheckoutAppliedCoupon =>
            Boolean(coupon) &&
            typeof coupon === "object" &&
            typeof coupon.id === "string" &&
            typeof coupon.code === "string" &&
            typeof coupon.label === "string" &&
            (coupon.couponType === "one_time" || coupon.couponType === "periodic") &&
            typeof coupon.discountPercent === "number",
        )
    : [];
  const amountDueToday = typeof payload.amount_due_today === "number" ? payload.amount_due_today : payload.total;
  const subtotalBeforeDiscount =
    typeof payload.subtotal_before_discount === "number" ? payload.subtotal_before_discount : payload.subtotal;
  const bundleDiscountAmount =
    typeof payload.bundle_discount_amount === "number" ? payload.bundle_discount_amount : 0;
  const subtotalAfterBundleDiscount =
    typeof payload.subtotal_after_bundle_discount === "number"
      ? payload.subtotal_after_bundle_discount
      : Number(Math.max(subtotalBeforeDiscount - bundleDiscountAmount, 0).toFixed(2));
  const couponDiscountAmount =
    typeof payload.coupon_discount_amount === "number"
      ? payload.coupon_discount_amount
      : typeof payload.discount_amount === "number"
        ? payload.discount_amount
        : 0;
  const couponDiscountPercent =
    typeof payload.coupon_discount_percent === "number"
      ? payload.coupon_discount_percent
      : typeof payload.discount_percent === "number"
        ? payload.discount_percent
        : 0;
  const remainingBalance =
    typeof payload.remaining_balance === "number"
      ? payload.remaining_balance
      : Number(Math.max(payload.total - amountDueToday, 0).toFixed(2));

  return {
    appliedCoupons,
    amountDueToday,
    bundleDiscountAmount,
    bundleDiscountPercent:
      typeof payload.bundle_discount_percent === "number"
        ? payload.bundle_discount_percent
        : bundleDiscountAmount > 0
          ? 5
          : 0,
    clientSecret: payload.client_secret,
    couponDiscountAmount,
    couponDiscountPercent,
    discountAmount: couponDiscountAmount,
    discountPercent: couponDiscountPercent,
    orderId: payload.order_id,
    paymentIntentId: payload.payment_intent_id,
    subtotalAfterBundleDiscount,
    subtotalBeforeDiscount,
    subtotal: payload.subtotal,
    estimatedTaxes: payload.estimated_taxes,
    total: payload.total,
    paymentMode: payload.payment_mode === "installment" ? "installment" : "full",
    installmentCount: payload.installment_count === 2 || payload.installment_count === 3 ? payload.installment_count : null,
    remainingBalance,
  };
};
