import type { CheckoutInstallmentCount, CheckoutPaymentMode } from "@/lib/checkoutPaymentPlan";

export type CheckoutAppliedCoupon = {
  id: string;
  code: string;
  label: string;
  couponType: "one_time" | "periodic";
  discountPercent: number;
};

export type CheckoutPaymentSession = {
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
  invoiceToken?: string | null;
  installmentCount: CheckoutInstallmentCount | null;
  itemSnapshot: Array<{
    key: string;
    quantity: number;
    selectionSignature?: string;
  }>;
  orderId: string;
  paymentMode: CheckoutPaymentMode;
  remainingBalance: number;
  subtotalAfterBundleDiscount: number;
  subtotalBeforeDiscount: number;
  subtotal: number;
  total: number;
};

export const CHECKOUT_PAYMENT_SESSION_STORAGE_KEY = "driving-school-checkout-payment.v1";

export const readCheckoutPaymentSession = (): CheckoutPaymentSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_PAYMENT_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CheckoutPaymentSession>;

    if (
      typeof parsed.clientSecret !== "string" ||
      typeof parsed.orderId !== "string" ||
      typeof parsed.subtotal !== "number" ||
      typeof parsed.estimatedTaxes !== "number" ||
      typeof parsed.total !== "number" ||
      !Array.isArray(parsed.itemSnapshot) ||
      parsed.itemSnapshot.some(
        (item) =>
          !item ||
          typeof item !== "object" ||
          typeof item.key !== "string" ||
          typeof item.quantity !== "number" ||
          (item.selectionSignature !== undefined && typeof item.selectionSignature !== "string"),
      )
    ) {
      return null;
    }

    const total = parsed.total;
    const subtotalBeforeDiscount =
      typeof parsed.subtotalBeforeDiscount === "number" ? parsed.subtotalBeforeDiscount : parsed.subtotal;
    const bundleDiscountAmount =
      typeof parsed.bundleDiscountAmount === "number" ? parsed.bundleDiscountAmount : 0;
    const subtotalAfterBundleDiscount =
      typeof parsed.subtotalAfterBundleDiscount === "number"
        ? parsed.subtotalAfterBundleDiscount
        : Number(Math.max(subtotalBeforeDiscount - bundleDiscountAmount, 0).toFixed(2));
    const amountDueToday =
      typeof parsed.amountDueToday === "number"
        ? parsed.amountDueToday
        : typeof total === "number"
          ? total
          : null;
    const appliedCoupons = Array.isArray(parsed.appliedCoupons)
      ? parsed.appliedCoupons.filter(
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

    if (typeof total !== "number" || typeof amountDueToday !== "number") {
      return null;
    }

    return {
      appliedCoupons,
      clientSecret: parsed.clientSecret,
      orderId: parsed.orderId,
      bundleDiscountAmount,
      bundleDiscountPercent:
        typeof parsed.bundleDiscountPercent === "number"
          ? parsed.bundleDiscountPercent
          : bundleDiscountAmount > 0
            ? 5
            : 0,
      couponDiscountAmount:
        typeof parsed.couponDiscountAmount === "number"
          ? parsed.couponDiscountAmount
          : typeof parsed.discountAmount === "number"
            ? parsed.discountAmount
            : 0,
      couponDiscountPercent:
        typeof parsed.couponDiscountPercent === "number"
          ? parsed.couponDiscountPercent
          : typeof parsed.discountPercent === "number"
            ? parsed.discountPercent
            : 0,
      subtotalBeforeDiscount,
      subtotalAfterBundleDiscount,
      subtotal: parsed.subtotal,
      estimatedTaxes: parsed.estimatedTaxes,
      total,
      amountDueToday,
      invoiceToken: typeof parsed.invoiceToken === "string" ? parsed.invoiceToken : null,
      discountAmount:
        typeof parsed.discountAmount === "number"
          ? parsed.discountAmount
          : typeof parsed.couponDiscountAmount === "number"
            ? parsed.couponDiscountAmount
            : 0,
      discountPercent:
        typeof parsed.discountPercent === "number"
          ? parsed.discountPercent
          : typeof parsed.couponDiscountPercent === "number"
            ? parsed.couponDiscountPercent
            : 0,
      paymentMode: parsed.paymentMode === "installment" ? "installment" : "full",
      installmentCount:
        parsed.installmentCount === 2 || parsed.installmentCount === 3 ? parsed.installmentCount : null,
      remainingBalance:
        typeof parsed.remainingBalance === "number"
          ? parsed.remainingBalance
          : Number((total - amountDueToday).toFixed(2)),
      itemSnapshot: parsed.itemSnapshot,
    };
  } catch {
    return null;
  }
};

export const writeCheckoutPaymentSession = (value: CheckoutPaymentSession) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CHECKOUT_PAYMENT_SESSION_STORAGE_KEY, JSON.stringify(value));
};

export const clearCheckoutPaymentSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CHECKOUT_PAYMENT_SESSION_STORAGE_KEY);
};
