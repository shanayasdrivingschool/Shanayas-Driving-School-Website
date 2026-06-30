import type {
  AffiliateStatus,
  CommissionStatus,
  PayoutStatus,
  PreferredPayoutMethod,
} from "@/lib/affiliateTypes";

export const AFFILIATE_COOKIE_NAME = "affiliate_id";
export const AFFILIATE_COOKIE_DURATION_DAYS = 30;
export const AFFILIATE_COMMISSION_RATE = 0.05;
export const AFFILIATE_MIN_PAYOUT = 50;

export const payoutMethodLabels: Record<PreferredPayoutMethod, string> = {
  bank_transfer: "Bank transfer",
  paypal: "PayPal",
  interac: "Interac e-Transfer",
};

export const affiliateStatusLabels: Record<AffiliateStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  blocked: "Blocked",
};

export const commissionStatusLabels: Record<CommissionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  reversed: "Reversed",
  rejected: "Rejected",
};

export const payoutStatusLabels: Record<PayoutStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const calculateAffiliateCommission = (purchaseAmount: number) =>
  Math.round((purchaseAmount * AFFILIATE_COMMISSION_RATE + Number.EPSILON) * 100) / 100;

export const buildAffiliateReferralLink = (origin: string, affiliateCode: string) =>
  `${origin.replace(/\/$/, "")}/apply?ref=${encodeURIComponent(affiliateCode)}`;

export const formatAffiliateCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const normalizeAffiliateCode = (value: string) => value.trim().toUpperCase();
