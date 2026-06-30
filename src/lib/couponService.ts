import type { AdminCouponRecord, CouponRecord } from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseClient";

export type CouponAvailability = "active" | "scheduled" | "expired" | "redeemed" | "inactive";

const ensureSupabaseClient = () => {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const mapCoupon = (row: Record<string, unknown>): CouponRecord => ({
  id: String(row.id),
  code: String(row.code),
  label: String(row.label),
  description: typeof row.description === "string" ? row.description : null,
  couponType: String(row.coupon_type) as CouponRecord["couponType"],
  discountPercent: Number(row.discount_percent ?? 0),
  autoApply: Boolean(row.auto_apply),
  isActive: Boolean(row.is_active),
  startsAt: typeof row.starts_at === "string" ? row.starts_at : null,
  endsAt: typeof row.ends_at === "string" ? row.ends_at : null,
  usageCount: Number(row.usage_count ?? 0),
  lastRedeemedAt: typeof row.last_redeemed_at === "string" ? row.last_redeemed_at : null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

export const getCouponAvailability = (
  coupon: Pick<AdminCouponRecord, "couponType" | "isActive" | "startsAt" | "endsAt" | "usageCount">,
  now = new Date(),
): CouponAvailability => {
  if (!coupon.isActive) {
    return "inactive";
  }

  if (coupon.startsAt) {
    const startsAt = new Date(coupon.startsAt);
    if (!Number.isNaN(startsAt.getTime()) && startsAt > now) {
      return "scheduled";
    }
  }

  if (coupon.endsAt) {
    const endsAt = new Date(coupon.endsAt);
    if (!Number.isNaN(endsAt.getTime()) && endsAt < now) {
      return "expired";
    }
  }

  if (coupon.couponType === "one_time" && coupon.usageCount > 0) {
    return "redeemed";
  }

  return "active";
};

export const isCouponCurrentlyUsable = (coupon: Pick<AdminCouponRecord, "couponType" | "isActive" | "startsAt" | "endsAt" | "usageCount">) =>
  getCouponAvailability(coupon) === "active";

export const getPublicAutoApplyCoupons = async () => {
  const client = ensureSupabaseClient();
  const { data, error } = await client
    .from("coupons")
    .select("id, code, label, description, coupon_type, discount_percent, auto_apply, is_active, starts_at, ends_at, usage_count, last_redeemed_at, created_at, updated_at")
    .eq("auto_apply", true)
    .order("discount_percent", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => mapCoupon(row as Record<string, unknown>))
    .filter((coupon) => isCouponCurrentlyUsable(coupon));
};

export const findPublicCouponByCode = async (code: string) => {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    return null;
  }

  const client = ensureSupabaseClient();
  const { data, error } = await client
    .from("coupons")
    .select("id, code, label, description, coupon_type, discount_percent, auto_apply, is_active, starts_at, ends_at, usage_count, last_redeemed_at, created_at, updated_at")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const coupon = mapCoupon(data as Record<string, unknown>);
  return isCouponCurrentlyUsable(coupon) ? coupon : null;
};
