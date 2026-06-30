import type { CheckoutPricingLineItem, CheckoutPricingItem } from "./checkoutPricing.ts";

const ESTIMATED_GST_RATE = 0.05;

const roundMoney = (value: number) => Number(value.toFixed(2));

type CouponRow = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  coupon_type: "one_time" | "periodic";
  discount_percent: number;
  auto_apply: boolean;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  usage_count: number;
  last_redeemed_at: string | null;
};

export type ValidatedCheckoutCoupon = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  couponType: "one_time" | "periodic";
  discountPercent: number;
};

export type CheckoutPricingSummary = {
  bundleDiscountAmount: number;
  bundleDiscountEligibleInCarCourseCount: number;
  bundleDiscountPercent: number;
  items: CheckoutPricingItem[];
  lineItems: CheckoutPricingLineItem[];
  subtotal: number;
  subtotalBeforeDiscount: number;
  estimatedTaxes: number;
  total: number;
};

export type DiscountedCheckoutPricing = CheckoutPricingSummary & {
  appliedCoupons: ValidatedCheckoutCoupon[];
  couponDiscountAmount: number;
  couponDiscountPercent: number;
  discountAmount: number;
  discountPercent: number;
  subtotalAfterBundleDiscount: number;
  totalDiscountAmount: number;
};

const mapCouponRow = (row: CouponRow): ValidatedCheckoutCoupon => ({
  id: row.id,
  code: row.code,
  label: row.label,
  description: row.description,
  couponType: row.coupon_type,
  discountPercent: Number(row.discount_percent ?? 0),
});

const assertCouponIsUsable = (coupon: CouponRow) => {
  if (!coupon.is_active) {
    throw new Error("coupon_not_active");
  }

  if (coupon.starts_at) {
    const startsAt = new Date(coupon.starts_at);
    if (!Number.isNaN(startsAt.getTime()) && startsAt > new Date()) {
      throw new Error("coupon_not_started");
    }
  }

  if (coupon.ends_at) {
    const endsAt = new Date(coupon.ends_at);
    if (!Number.isNaN(endsAt.getTime()) && endsAt < new Date()) {
      throw new Error("coupon_expired");
    }
  }

  if (coupon.coupon_type === "one_time" && coupon.usage_count > 0) {
    throw new Error("coupon_already_redeemed");
  }
};

export const normalizeCheckoutCouponCodes = (value: unknown) => {
  if (value === undefined || value === null) {
    return [] as string[];
  }

  if (!Array.isArray(value)) {
    throw new Error("invalid_coupon_payload");
  }

  return Array.from(
    new Set(
      value
        .map((entry) => (typeof entry === "string" ? entry.trim().toUpperCase() : ""))
        .filter((entry) => entry.length > 0),
    ),
  );
};

export const validateCheckoutCouponCodes = async (
  admin: {
    from: (table: string) => {
      select: (columns: string) => {
        in: (column: string, values: string[]) => Promise<{ data: CouponRow[] | null; error: { message: string } | null }>;
      };
    };
  },
  couponCodes: string[],
) => {
  if (couponCodes.length === 0) {
    return [] as ValidatedCheckoutCoupon[];
  }

  const { data, error } = await admin
    .from("coupons")
    .select(
      "id, code, label, description, coupon_type, discount_percent, auto_apply, is_active, starts_at, ends_at, usage_count, last_redeemed_at",
    )
    .in("code", couponCodes);

  if (error) {
    throw new Error("coupon_lookup_failed");
  }

  const rows = Array.isArray(data) ? data : [];
  const couponsByCode = new Map(rows.map((row) => [row.code, row]));

  return couponCodes.map((couponCode) => {
    const coupon = couponsByCode.get(couponCode);
    if (!coupon) {
      throw new Error("invalid_coupon_code");
    }

    assertCouponIsUsable(coupon);
    return mapCouponRow(coupon);
  });
};

export const applyCouponsToCheckoutPricing = (
  pricing: CheckoutPricingSummary,
  coupons: ValidatedCheckoutCoupon[],
): DiscountedCheckoutPricing => {
  const subtotalAfterBundleDiscount = pricing.subtotal;
  const couponDiscountPercent = Math.min(
    roundMoney(coupons.reduce((totalDiscount, coupon) => totalDiscount + coupon.discountPercent, 0)),
    100,
  );
  const couponDiscountAmount = roundMoney(subtotalAfterBundleDiscount * (couponDiscountPercent / 100));
  const subtotal = roundMoney(Math.max(subtotalAfterBundleDiscount - couponDiscountAmount, 0));
  const estimatedTaxes = roundMoney(subtotal * ESTIMATED_GST_RATE);
  const total = roundMoney(subtotal + estimatedTaxes);

  return {
    ...pricing,
    appliedCoupons: coupons,
    couponDiscountAmount,
    couponDiscountPercent,
    discountAmount: couponDiscountAmount,
    discountPercent: couponDiscountPercent,
    estimatedTaxes,
    subtotal,
    subtotalAfterBundleDiscount,
    totalDiscountAmount: roundMoney(pricing.bundleDiscountAmount + couponDiscountAmount),
    total,
  };
};
