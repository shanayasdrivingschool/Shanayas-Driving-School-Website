import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, readAllowedOrigins } from "../_shared/cors.ts";

type AffiliateStatus = "pending" | "approved" | "blocked";
type PaymentStatus =
  | "pending"
  | "pending_payment"
  | "processing_payment"
  | "paid"
  | "cancelled"
  | "refunded"
  | "failed";
type CommissionStatus = "pending" | "approved" | "paid" | "reversed" | "rejected";
type PayoutStatus = "pending" | "approved" | "paid" | "failed" | "cancelled";
type PreferredPayoutMethod = "bank_transfer" | "paypal" | "interac";
type LeadType = "contact" | "student_assessment" | "employee_application" | "custom_package_request";
type LeadStatus = "new" | "pending_review" | "reviewed" | "shortlisted" | "rejected";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const DEFAULT_PUBLIC_SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.drivingschoolbc.ca";
const DEFAULT_COMMISSION_RATE = Number(Deno.env.get("AFFILIATE_COMMISSION_RATE") ?? "0.05");
const MIN_PAYOUT_THRESHOLD = Number(Deno.env.get("AFFILIATE_MIN_PAYOUT_THRESHOLD") ?? "50");
const CLICK_RATE_LIMIT_WINDOW_SECONDS = Math.max(60, Number(Deno.env.get("AFFILIATE_CLICK_WINDOW_SECONDS") ?? "900"));
const CLICK_RATE_LIMIT_MAX_REQUESTS = Math.max(1, Number(Deno.env.get("AFFILIATE_CLICK_MAX_REQUESTS") ?? "12"));
const ADMIN_RATE_LIMIT_WINDOW_SECONDS = Math.max(60, Number(Deno.env.get("ADMIN_RATE_LIMIT_WINDOW_SECONDS") ?? "300"));
const ADMIN_RATE_LIMIT_MAX_REQUESTS = Math.max(20, Number(Deno.env.get("ADMIN_RATE_LIMIT_MAX_REQUESTS") ?? "180"));
const WEBHOOK_SECRET = (Deno.env.get("AFFILIATE_WEBHOOK_SECRET") ?? "").trim();
const ADMIN_FETCH_BATCH_SIZE = 500;

const configuredOrigins = readAllowedOrigins();

const jsonResponse = (status: number, body: Record<string, unknown>, corsHeaders: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });

const createAdminClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("affiliate_api_not_configured");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const normalizeText = (value: unknown, maxLength = 240) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
};

const normalizeEmail = (value: unknown) => normalizeText(value, 200)?.toLowerCase() ?? null;
const normalizeAffiliateCode = (value: unknown) => normalizeText(value, 32)?.toUpperCase() ?? null;

const normalizeNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeInteger = (value: unknown) => {
  const parsed = normalizeNumber(value);
  return parsed !== null ? Math.trunc(parsed) : null;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }
  return false;
};

const asRecord = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

const fetchAllRows = async <T>(
  queryPage: (from: number, to: number) => Promise<{ data: T[] | null; error: { message: string } | null }>,
) => {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    const to = from + ADMIN_FETCH_BATCH_SIZE - 1;
    const { data, error } = await queryPage(from, to);
    if (error) {
      throw new Error(error.message);
    }

    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < ADMIN_FETCH_BATCH_SIZE) {
      return rows;
    }

    from += ADMIN_FETCH_BATCH_SIZE;
  }
};

const getClientIp = (request: Request) => {
  const headerNames = [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-real-ip",
    "fly-client-ip",
    "x-client-ip",
    "fastly-client-ip",
  ] as const;

  for (const name of headerNames) {
    const raw = request.headers.get(name);
    if (!raw) continue;
    const first = raw.split(",")[0]?.trim();
    if (first) return first;
  }

  return null;
};

const getRoutePath = (request: Request) => {
  const pathname = new URL(request.url).pathname;
  const marker = "/affiliate-api";
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex === -1) return "/";
  const routePath = pathname.slice(markerIndex + marker.length);
  return routePath.length > 0 ? routePath : "/";
};

const parseJsonBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const buildReferralLink = (origin: string, affiliateCode: string) =>
  `${origin.replace(/\/$/, "")}/?ref=${encodeURIComponent(affiliateCode)}`;

const calculateCommission = (amount: number, rate: number) =>
  Math.round((amount * rate + Number.EPSILON) * 100) / 100;

const mapAffiliate = (row: Record<string, unknown>) => ({
  id: row.id,
  affiliateId: row.affiliate_id,
  authUserId: typeof row.auth_user_id === "string" ? row.auth_user_id : null,
  name: row.name,
  email: row.email,
  phone: row.phone,
  age: typeof row.age === "number" ? row.age : null,
  isMinor: Boolean(row.is_minor),
  guardianName: typeof row.guardian_name === "string" ? row.guardian_name : null,
  guardianEmail: typeof row.guardian_email === "string" ? row.guardian_email : null,
  guardianPhone: typeof row.guardian_phone === "string" ? row.guardian_phone : null,
  guardianConsent: Boolean(row.guardian_consent),
  guardianConsentTimestamp: typeof row.guardian_consent_timestamp === "string" ? row.guardian_consent_timestamp : null,
  socialMediaLink: row.social_media_link,
  preferredPayoutMethod: row.preferred_payout_method,
  status: row.status,
  commissionRate: Number(row.commission_rate ?? DEFAULT_COMMISSION_RATE),
  cookieDurationDays: Number(row.cookie_duration_days ?? 30),
  createdAt: row.created_at,
  approvedAt: row.approved_at,
  blockedAt: row.blocked_at,
});

const mapLead = (row: Record<string, unknown>) => {
  const payload = asRecord(row.payload);
  const requestType = typeof payload.request_type === "string" ? payload.request_type : null;

  return {
    id: String(row.id),
    leadType: String(row.lead_type) as LeadType,
    fullName: typeof row.full_name === "string" ? row.full_name : null,
    email: typeof row.email === "string" ? row.email : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    sourcePage: String(row.source_page),
    status: String(row.status ?? "new") as LeadStatus,
    payload,
    requestType,
    createdAt: String(row.created_at),
  };
};

const mapOrder = (
  row: Record<string, unknown>,
  affiliateMap: Map<string, { affiliateId: string; affiliateName: string }>,
) => ({
  id: String(row.id),
  externalOrderId: typeof row.external_order_id === "string" ? row.external_order_id : null,
  customerId: typeof row.customer_id === "string" ? row.customer_id : null,
  customerEmail: typeof row.customer_email === "string" ? row.customer_email : null,
  packageName: String(row.package_name),
  amount: Number(row.amount ?? 0),
  paymentStatus: String(row.payment_status) as PaymentStatus,
  affiliateId: typeof row.affiliate_id === "string"
    ? affiliateMap.get(String(row.affiliate_id))?.affiliateId ?? String(row.affiliate_id)
    : null,
  affiliateName: typeof row.affiliate_id === "string"
    ? affiliateMap.get(String(row.affiliate_id))?.affiliateName ?? null
    : null,
  affiliateClickId: typeof row.affiliate_click_id === "string" ? row.affiliate_click_id : null,
  referralCode: typeof row.referral_code === "string" ? row.referral_code : null,
  customerIp: typeof row.customer_ip === "string" ? row.customer_ip : null,
  customerUserAgent: typeof row.customer_user_agent === "string" ? row.customer_user_agent : null,
  fingerprintHash: typeof row.fingerprint_hash === "string" ? row.fingerprint_hash : null,
  isSelfReferral: Boolean(row.is_self_referral),
  isSuspicious: Boolean(row.is_suspicious),
  fraudFlags: Array.isArray(row.fraud_flags) ? row.fraud_flags.map(String) : [],
  metadata: asRecord(row.metadata),
  createdAt: String(row.created_at),
  purchasedAt: typeof row.purchased_at === "string" ? row.purchased_at : null,
});

const mapRateLimit = (row: Record<string, unknown>) => ({
  key: String(row.key),
  endpoint: String(row.endpoint),
  windowStart: String(row.window_start),
  count: Number(row.count ?? 0),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const requireAuthenticatedUser = async (request: Request, admin: ReturnType<typeof createAdminClient>) => {
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user;
};

const isAdminUser = async (admin: ReturnType<typeof createAdminClient>, userId: string) => {
  const { data, error } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
};

const requireAdminUser = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const user = await requireAuthenticatedUser(request, admin);
  if (!user) {
    return {
      user: null,
      response: jsonResponse(401, { error: "authentication_required" }, corsHeaders),
    };
  }

  const isAdmin = await isAdminUser(admin, user.id);
  if (!isAdmin) {
    return {
      user: null,
      response: jsonResponse(403, { error: "admin_access_required" }, corsHeaders),
    };
  }

  const routePath = getRoutePath(request);
  const adminRateLimitKey = `admin:${user.id}:${getClientIp(request) ?? "unknown"}:${routePath}`;
  const { data: adminRateLimitData, error: adminRateLimitError } = await admin.rpc("check_submit_lead_rate_limit", {
    p_key: adminRateLimitKey,
    p_endpoint: `admin${routePath}`,
    p_window_seconds: ADMIN_RATE_LIMIT_WINDOW_SECONDS,
    p_max_requests: ADMIN_RATE_LIMIT_MAX_REQUESTS,
  });

  if (adminRateLimitError) {
    throw adminRateLimitError;
  }

  const adminRateLimitRecord = Array.isArray(adminRateLimitData) ? adminRateLimitData[0] : null;
  if (!adminRateLimitRecord?.allowed) {
    return {
      user: null,
      response: jsonResponse(
        429,
        {
          error: "admin_rate_limit_exceeded",
          currentCount: Number(adminRateLimitRecord?.current_count ?? 0),
          retryAfterSeconds: Number(adminRateLimitRecord?.retry_after_seconds ?? 0),
        },
        corsHeaders,
      ),
    };
  }

  return { user, response: null };
};

const getAffiliateByAuthUser = async (admin: ReturnType<typeof createAdminClient>, userId: string) => {
  const { data, error } = await admin
    .from("affiliates")
    .select("*")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const getAffiliateByCode = async (admin: ReturnType<typeof createAdminClient>, referralCode: string) => {
  const { data, error } = await admin
    .from("affiliates")
    .select("*")
    .eq("affiliate_id", referralCode)
    .eq("status", "approved")
    .maybeSingle();

  if (error) throw error;
  return data;
};

const checkClickRateLimit = async (admin: ReturnType<typeof createAdminClient>, key: string) => {
  const { data, error } = await admin.rpc("check_submit_lead_rate_limit", {
    p_key: key,
    p_endpoint: "/affiliate/referral/track",
    p_window_seconds: CLICK_RATE_LIMIT_WINDOW_SECONDS,
    p_max_requests: CLICK_RATE_LIMIT_MAX_REQUESTS,
  });

  if (error) throw error;

  return (data?.[0] ?? {
    allowed: true,
    current_count: 1,
    retry_after_seconds: 0,
  }) as {
    allowed: boolean;
    current_count: number;
    retry_after_seconds: number;
  };
};

const handleRegister = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const name = normalizeText(record.name, 180);
  const email = normalizeEmail(record.email);
  const phone = normalizeText(record.phone, 80);
  const password = normalizeText(record.password, 120);
  const socialMediaLink = normalizeText(record.socialMediaLink, 240);
  const preferredPayoutMethod = normalizeText(record.preferredPayoutMethod, 40) as PreferredPayoutMethod | null;
  const age = normalizeInteger(record.age);
  const guardianName = normalizeText(record.guardianName ?? record.guardian_name, 180);
  const guardianEmail = normalizeEmail(record.guardianEmail ?? record.guardian_email);
  const guardianPhone = normalizeText(record.guardianPhone ?? record.guardian_phone, 80);
  const guardianConsent = normalizeBoolean(record.guardianConsent ?? record.guardian_consent);
  const acceptedReferralTermsAt = normalizeText(record.acceptedReferralTermsAt, 80);
  const acceptedReferralTermsVersion = normalizeText(record.acceptedReferralTermsVersion, 40);
  const acceptedPrivacyConsentAt = normalizeText(record.acceptedPrivacyConsentAt, 80);
  const referralLinkOrigin = normalizeText(record.referralLinkOrigin, 240) ?? request.headers.get("origin") ?? DEFAULT_PUBLIC_SITE_URL;
  const isMinor = age !== null && age < 18;

  if (!name || !email || !phone || !password || password.length < 8 || !preferredPayoutMethod) {
    return jsonResponse(400, { error: "missing_required_fields" }, corsHeaders);
  }

  if (age === null || age < 13 || age > 100) {
    return jsonResponse(400, { error: "Age must be provided and be between 13 and 100." }, corsHeaders);
  }

  if (isMinor && (!guardianName || !guardianEmail || !guardianPhone || !guardianConsent)) {
    return jsonResponse(400, { error: "Guardian consent is required for participants under 18." }, corsHeaders);
  }

  if (!["bank_transfer", "paypal", "interac"].includes(preferredPayoutMethod)) {
    return jsonResponse(400, { error: "invalid_payout_method" }, corsHeaders);
  }

  const { data: createdUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "affiliate",
      full_name: name,
      phone,
      age,
      guardian_name: isMinor ? guardianName : null,
      guardian_email: isMinor ? guardianEmail : null,
      guardian_phone: isMinor ? guardianPhone : null,
      guardian_consent: isMinor ? guardianConsent : false,
      guardian_consent_timestamp: isMinor && guardianConsent ? new Date().toISOString() : null,
      social_media_link: socialMediaLink,
      preferred_payout_method: preferredPayoutMethod,
      referral_terms_accepted_at: acceptedReferralTermsAt,
      referral_terms_version: acceptedReferralTermsVersion,
      privacy_consent_accepted_at: acceptedPrivacyConsentAt,
    },
  });

  if (authError || !createdUser.user) {
    return jsonResponse(400, { error: authError?.message ?? "unable_to_create_auth_user" }, corsHeaders);
  }

  const { data: affiliate, error: affiliateError } = await admin
    .from("affiliates")
    .select("*")
    .eq("auth_user_id", createdUser.user.id)
    .maybeSingle();

  if (affiliateError || !affiliate) {
    await admin.auth.admin.deleteUser(createdUser.user.id);
    return jsonResponse(400, { error: affiliateError?.message ?? "unable_to_create_affiliate_profile" }, corsHeaders);
  }

  return jsonResponse(
    201,
    {
      affiliate: mapAffiliate(affiliate as Record<string, unknown>),
      referralLink: buildReferralLink(referralLinkOrigin, String(affiliate.affiliate_id)),
    },
    corsHeaders,
  );
};

const handleTrackReferral = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const url = new URL(request.url);
  const referralCode = normalizeAffiliateCode(url.searchParams.get("ref"));
  const landingPath = normalizeText(url.searchParams.get("path"), 180) ?? "/";
  const fingerprintHash = normalizeText(url.searchParams.get("fingerprint"), 128);
  const ipAddress = getClientIp(request);

  if (!referralCode) {
    return jsonResponse(400, { error: "missing_referral_code" }, corsHeaders);
  }

  const affiliate = await getAffiliateByCode(admin, referralCode);
  if (!affiliate) {
    return jsonResponse(404, { error: "invalid_affiliate_code" }, corsHeaders);
  }

  const rateLimit = await checkClickRateLimit(admin, `affiliate:${referralCode}:${ipAddress ?? "unknown"}`);
  if (!rateLimit.allowed) {
    await admin.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      referral_code: referralCode,
      landing_path: landingPath,
      ip_address: ipAddress,
      user_agent: request.headers.get("user-agent"),
      fingerprint_hash: fingerprintHash,
      is_suspicious: true,
      suspicion_reason: "rate_limit_exceeded",
    });

    return jsonResponse(
      429,
      {
        error: "suspicious_click_blocked",
        retryAfterSeconds: rateLimit.retry_after_seconds,
      },
      corsHeaders,
    );
  }

  const isSuspicious = rateLimit.current_count >= Math.max(4, Math.floor(CLICK_RATE_LIMIT_MAX_REQUESTS / 2));

  const { data: click, error: clickError } = await admin
    .from("affiliate_clicks")
    .insert({
      affiliate_id: affiliate.id,
      referral_code: referralCode,
      landing_path: landingPath,
      ip_address: ipAddress,
      user_agent: request.headers.get("user-agent"),
      fingerprint_hash: fingerprintHash,
      is_suspicious: isSuspicious,
      suspicion_reason: isSuspicious ? "high_repeat_click_volume" : null,
    })
    .select("id")
    .single();

  if (clickError || !click) {
    return jsonResponse(400, { error: clickError?.message ?? "unable_to_record_click" }, corsHeaders);
  }

  return jsonResponse(
    200,
    {
      valid: true,
      affiliateId: affiliate.id,
      affiliateCode: affiliate.affiliate_id,
      affiliateName: affiliate.name,
      expiresInDays: affiliate.cookie_duration_days ?? 30,
      clickId: click.id,
    },
    corsHeaders,
  );
};

const handleAffiliateStats = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const user = await requireAuthenticatedUser(request, admin);
  if (!user) {
    return jsonResponse(401, { error: "authentication_required" }, corsHeaders);
  }

  const affiliate = await getAffiliateByAuthUser(admin, user.id);
  if (!affiliate) {
    return jsonResponse(404, { error: "affiliate_profile_not_found" }, corsHeaders);
  }

  const [
    clicksCountResult,
    orderTotalsResult,
    commissionTotalsResult,
    orderListResult,
    commissionListResult,
    payoutListResult,
  ] = await Promise.all([
    admin.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("affiliate_id", affiliate.id),
    admin.from("orders").select("amount, payment_status").eq("affiliate_id", affiliate.id),
    admin.from("affiliate_commissions").select("commission_amount, status").eq("affiliate_id", affiliate.id),
    admin
      .from("orders")
      .select("id, external_order_id, package_name, amount, payment_status, referral_code, is_suspicious, fraud_flags, created_at, purchased_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("affiliate_commissions")
      .select("id, order_id, purchase_amount, commission_amount, status, created_at, approved_at, paid_at, reversed_at, reversal_reason")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("payouts")
      .select("id, amount, payment_method, payment_status, created_at, requested_at, approved_at, paid_at, notes")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (
    clicksCountResult.error ||
    orderTotalsResult.error ||
    commissionTotalsResult.error ||
    orderListResult.error ||
    commissionListResult.error ||
    payoutListResult.error
  ) {
    return jsonResponse(400, { error: "unable_to_load_affiliate_dashboard" }, corsHeaders);
  }

  const totalPurchases = (orderTotalsResult.data ?? []).filter((order) => order.payment_status === "paid").length;
  const totalRevenue = (orderTotalsResult.data ?? [])
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.amount ?? 0), 0);
  const totalCommission = (commissionTotalsResult.data ?? [])
    .filter((commission) => ["pending", "approved", "paid"].includes(String(commission.status)))
    .reduce((sum, commission) => sum + Number(commission.commission_amount ?? 0), 0);
  const approvedCommission = (commissionTotalsResult.data ?? [])
    .filter((commission) => commission.status === "approved")
    .reduce((sum, commission) => sum + Number(commission.commission_amount ?? 0), 0);

  const orderLookupIds = Array.from(
    new Set((commissionListResult.data ?? []).map((commission) => String(commission.order_id))),
  );
  const orderLookupResult = orderLookupIds.length
    ? await admin.from("orders").select("id, external_order_id").in("id", orderLookupIds)
    : { data: [], error: null };

  if (orderLookupResult.error) {
    return jsonResponse(400, { error: "unable_to_load_commission_orders" }, corsHeaders);
  }

  const orderReferenceMap = new Map(
    (orderLookupResult.data ?? []).map((order) => [String(order.id), order.external_order_id as string | null]),
  );

  return jsonResponse(
    200,
    {
      affiliate: mapAffiliate(affiliate as Record<string, unknown>),
      referralLink: buildReferralLink(DEFAULT_PUBLIC_SITE_URL, String(affiliate.affiliate_id)),
      stats: {
        totalClicks: clicksCountResult.count ?? 0,
        totalPurchases,
        totalRevenue,
        totalCommission,
        pendingPayout: approvedCommission,
        approvedCommission,
        minimumPayout: MIN_PAYOUT_THRESHOLD,
      },
      orders: (orderListResult.data ?? []).map((order) => ({
        id: order.id,
        externalOrderId: order.external_order_id,
        packageName: order.package_name,
        amount: Number(order.amount ?? 0),
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        purchasedAt: order.purchased_at,
        referralCode: order.referral_code,
        isSuspicious: Boolean(order.is_suspicious),
        fraudFlags: Array.isArray(order.fraud_flags) ? order.fraud_flags : [],
      })),
      commissions: (commissionListResult.data ?? []).map((commission) => ({
        id: commission.id,
        orderId: commission.order_id,
        orderReference: orderReferenceMap.get(String(commission.order_id)) ?? null,
        commissionAmount: Number(commission.commission_amount ?? 0),
        purchaseAmount: Number(commission.purchase_amount ?? 0),
        status: commission.status,
        createdAt: commission.created_at,
        approvedAt: commission.approved_at,
        paidAt: commission.paid_at,
        reversedAt: commission.reversed_at,
        reversalReason: commission.reversal_reason,
      })),
      payouts: (payoutListResult.data ?? []).map((payout) => ({
        id: payout.id,
        amount: Number(payout.amount ?? 0),
        paymentMethod: payout.payment_method,
        paymentStatus: payout.payment_status,
        createdAt: payout.created_at,
        requestedAt: payout.requested_at,
        approvedAt: payout.approved_at,
        paidAt: payout.paid_at,
        notes: payout.notes,
      })),
    },
    corsHeaders,
  );
};

const handleAdminDashboard = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const [
    leadsCountResult,
    affiliatesCountResult,
    clicksCountResult,
    ordersCountResult,
    commissionsCountResult,
    payoutsCountResult,
    suspiciousClicksResult,
    suspiciousOrdersResult,
    recentLeadsResult,
    recentOrdersResult,
    recentAffiliatesResult,
  ] = await Promise.all([
    admin.from("leads").select("id", { count: "exact", head: true }),
    admin.from("affiliates").select("id", { count: "exact", head: true }),
    admin.from("affiliate_clicks").select("id", { count: "exact", head: true }),
    admin.from("orders").select("id", { count: "exact", head: true }),
    admin.from("affiliate_commissions").select("id", { count: "exact", head: true }),
    admin.from("payouts").select("id", { count: "exact", head: true }),
    admin.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("is_suspicious", true),
    admin.from("orders").select("id", { count: "exact", head: true }).eq("is_suspicious", true),
    admin
      .from("leads")
      .select("id, lead_type, full_name, email, phone, source_page, status, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("orders")
      .select("id, external_order_id, customer_id, customer_email, package_name, amount, payment_status, affiliate_id, affiliate_click_id, referral_code, customer_ip, customer_user_agent, fingerprint_hash, is_self_referral, is_suspicious, fraud_flags, metadata, created_at, purchased_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin.from("affiliates").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  if (
    leadsCountResult.error ||
    affiliatesCountResult.error ||
    clicksCountResult.error ||
    ordersCountResult.error ||
    commissionsCountResult.error ||
    payoutsCountResult.error ||
    suspiciousClicksResult.error ||
    suspiciousOrdersResult.error ||
    recentLeadsResult.error ||
    recentOrdersResult.error ||
    recentAffiliatesResult.error
  ) {
    return jsonResponse(400, { error: "unable_to_load_admin_dashboard" }, corsHeaders);
  }

  const recentOrderAffiliateIds = Array.from(
    new Set((recentOrdersResult.data ?? []).map((order) => String(order.affiliate_id)).filter((value) => value && value !== "null")),
  );
  const recentOrderAffiliatesResult = recentOrderAffiliateIds.length
    ? await admin.from("affiliates").select("id, affiliate_id, name").in("id", recentOrderAffiliateIds)
    : { data: [], error: null };

  if (recentOrderAffiliatesResult.error) {
    return jsonResponse(400, { error: "unable_to_load_admin_dashboard_affiliates" }, corsHeaders);
  }

  const recentOrderAffiliateMap = new Map(
    (recentOrderAffiliatesResult.data ?? []).map((affiliate) => [
      String(affiliate.id),
      {
        affiliateId: String(affiliate.affiliate_id),
        affiliateName: String(affiliate.name),
      },
    ]),
  );

  return jsonResponse(
    200,
    {
      totals: {
        totalLeads: leadsCountResult.count ?? 0,
        totalAffiliates: affiliatesCountResult.count ?? 0,
        totalReferralClicks: clicksCountResult.count ?? 0,
        totalOrders: ordersCountResult.count ?? 0,
        totalCommissions: commissionsCountResult.count ?? 0,
        totalPayouts: payoutsCountResult.count ?? 0,
        suspiciousActivityCount: (suspiciousClicksResult.count ?? 0) + (suspiciousOrdersResult.count ?? 0),
      },
      recentLeads: (recentLeadsResult.data ?? []).map((lead) => mapLead(lead as Record<string, unknown>)),
      recentOrders: (recentOrdersResult.data ?? []).map((order) =>
        mapOrder(order as Record<string, unknown>, recentOrderAffiliateMap)
      ),
      recentAffiliateSignups: (recentAffiliatesResult.data ?? []).map((affiliate) => ({
        ...mapAffiliate(affiliate as Record<string, unknown>),
        totalClicks: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        totalCommission: 0,
        pendingPayout: 0,
      })),
    },
    corsHeaders,
  );
};

const handleAdminLeads = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  try {
    const leadRows = await fetchAllRows((from, to) =>
      admin
        .from("leads")
        .select("id, lead_type, full_name, email, phone, source_page, status, payload, created_at")
        .order("created_at", { ascending: false })
        .range(from, to)
    );

    const leads = leadRows.map((lead) => mapLead(lead as Record<string, unknown>));
    const totals = leads.reduce(
      (acc, lead) => {
        const isCustomPackage = lead.leadType === "custom_package_request" || lead.requestType === "custom_package_request";
        if (isCustomPackage) {
          acc.customPackageRequests += 1;
        } else if (lead.leadType === "contact") {
          acc.contact += 1;
        } else if (lead.leadType === "student_assessment") {
          acc.studentAssessment += 1;
        } else if (lead.leadType === "employee_application") {
          acc.employeeApplications += 1;
        }
        return acc;
      },
      {
        contact: 0,
        studentAssessment: 0,
        employeeApplications: 0,
        customPackageRequests: 0,
      },
    );

    return jsonResponse(
      200,
      {
        leads,
        totals: {
          totalLeads: leads.length,
          ...totals,
        },
      },
      corsHeaders,
    );
  } catch (error) {
    return jsonResponse(400, { error: error instanceof Error ? error.message : "unable_to_load_leads" }, corsHeaders);
  }
};

const handleAdminLeadStatus = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const leadId = normalizeText(record.leadId, 64);
  const status = normalizeText(record.status, 32) as LeadStatus | null;

  if (!leadId || !status || !["new", "pending_review", "reviewed", "shortlisted", "rejected"].includes(status)) {
    return jsonResponse(400, { error: "invalid_lead_status_payload" }, corsHeaders);
  }

  const { error } = await admin.from("leads").update({ status }).eq("id", leadId);
  if (error) {
    return jsonResponse(400, { error: error.message }, corsHeaders);
  }

  return jsonResponse(200, { success: true }, corsHeaders);
};

const handleAdminAffiliateUpdate = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const affiliateId = normalizeText(record.affiliateId, 64);
  const name = normalizeText(record.name, 180);
  const email = normalizeEmail(record.email);
  const phone = normalizeText(record.phone, 80);
  const socialMediaLink = normalizeText(record.socialMediaLink, 240);
  const preferredPayoutMethod = normalizeText(record.preferredPayoutMethod, 40) as PreferredPayoutMethod | null;
  const status = normalizeText(record.status, 20) as AffiliateStatus | null;
  const commissionRate = normalizeNumber(record.commissionRate);
  const cookieDurationDays = normalizeInteger(record.cookieDurationDays);
  const note = normalizeText(record.note, 500);

  if (
    !affiliateId ||
    !name ||
    !email ||
    !preferredPayoutMethod ||
    !status ||
    commissionRate === null ||
    cookieDurationDays === null
  ) {
    return jsonResponse(400, { error: "missing_required_fields" }, corsHeaders);
  }

  if (!["bank_transfer", "paypal", "interac"].includes(preferredPayoutMethod)) {
    return jsonResponse(400, { error: "invalid_payout_method" }, corsHeaders);
  }

  if (!["pending", "approved", "blocked"].includes(status)) {
    return jsonResponse(400, { error: "invalid_affiliate_status" }, corsHeaders);
  }

  if (commissionRate < 0 || commissionRate > 1) {
    return jsonResponse(400, { error: "invalid_commission_rate" }, corsHeaders);
  }

  if (cookieDurationDays < 1 || cookieDurationDays > 365) {
    return jsonResponse(400, { error: "invalid_cookie_duration" }, corsHeaders);
  }

  const { data: currentAffiliate, error: currentAffiliateError } = await admin
    .from("affiliates")
    .select("auth_user_id, approved_at, blocked_at")
    .eq("id", affiliateId)
    .maybeSingle();

  if (currentAffiliateError || !currentAffiliate) {
    return jsonResponse(404, { error: "affiliate_not_found" }, corsHeaders);
  }

  const now = new Date().toISOString();
  const approvedAt = status === "approved"
    ? (typeof currentAffiliate.approved_at === "string" ? currentAffiliate.approved_at : now)
    : null;
  const blockedAt = status === "blocked"
    ? (typeof currentAffiliate.blocked_at === "string" ? currentAffiliate.blocked_at : now)
    : null;

  const { error } = await admin
    .from("affiliates")
    .update({
      name,
      email,
      phone,
      social_media_link: socialMediaLink,
      preferred_payout_method: preferredPayoutMethod,
      status,
      commission_rate: commissionRate,
      cookie_duration_days: cookieDurationDays,
      notes: note,
      approved_at: approvedAt,
      blocked_at: blockedAt,
    })
    .eq("id", affiliateId);

  if (error) {
    return jsonResponse(400, { error: error.message }, corsHeaders);
  }

  if (typeof currentAffiliate.auth_user_id === "string") {
    const { error: authError } = await admin.auth.admin.updateUserById(currentAffiliate.auth_user_id, {
      email,
      user_metadata: {
        role: "affiliate",
        full_name: name,
        phone: phone ?? "",
        social_media_link: socialMediaLink ?? "",
        preferred_payout_method: preferredPayoutMethod,
      },
    });

    if (authError) {
      return jsonResponse(400, { error: authError.message }, corsHeaders);
    }
  }

  return jsonResponse(200, { success: true }, corsHeaders);
};

const handleAdminOrders = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  try {
    const orderRows = await fetchAllRows((from, to) =>
      admin
        .from("orders")
        .select("id, external_order_id, customer_id, customer_email, package_name, amount, payment_status, affiliate_id, affiliate_click_id, referral_code, customer_ip, customer_user_agent, fingerprint_hash, is_self_referral, is_suspicious, fraud_flags, metadata, created_at, purchased_at")
        .order("created_at", { ascending: false })
        .range(from, to)
    );

    const affiliateIds = Array.from(
      new Set(orderRows.map((order) => String(order.affiliate_id)).filter((value) => value && value !== "null")),
    );
    const affiliatesResult = affiliateIds.length
      ? await admin.from("affiliates").select("id, affiliate_id, name").in("id", affiliateIds)
      : { data: [], error: null };

    if (affiliatesResult.error) {
      return jsonResponse(400, { error: "unable_to_load_order_affiliates" }, corsHeaders);
    }

    const affiliateMap = new Map(
      (affiliatesResult.data ?? []).map((affiliate) => [
        String(affiliate.id),
        {
          affiliateId: String(affiliate.affiliate_id),
          affiliateName: String(affiliate.name),
        },
      ]),
    );

    const orders = orderRows.map((order) => mapOrder(order as Record<string, unknown>, affiliateMap));

    return jsonResponse(
      200,
      {
        orders,
        totals: {
          totalOrders: orders.length,
          paid: orders.filter((order) => order.paymentStatus === "paid").length,
          pendingPayment: orders.filter((order) => order.paymentStatus === "pending" || order.paymentStatus === "pending_payment").length,
          processingPayment: orders.filter((order) => order.paymentStatus === "processing_payment").length,
          cancelled: orders.filter((order) => order.paymentStatus === "cancelled").length,
          refunded: orders.filter((order) => order.paymentStatus === "refunded").length,
          failed: orders.filter((order) => order.paymentStatus === "failed").length,
          suspicious: orders.filter((order) => order.isSuspicious).length,
        },
      },
      corsHeaders,
    );
  } catch (error) {
    return jsonResponse(400, { error: error instanceof Error ? error.message : "unable_to_load_orders" }, corsHeaders);
  }
};

const handleAdminRateLimits = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  try {
    const rateLimitRows = await fetchAllRows((from, to) =>
      admin
        .from("edge_rate_limits")
        .select("key, endpoint, window_start, count, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .range(from, to)
    );

    const rateLimits = rateLimitRows.map((row) => mapRateLimit(row as Record<string, unknown>));
    return jsonResponse(
      200,
      {
        rateLimits,
        totals: {
          totalWindows: rateLimits.length,
          flaggedWindows: rateLimits.filter((row) => row.count >= 5).length,
          uniqueEndpoints: new Set(rateLimits.map((row) => row.endpoint)).size,
        },
      },
      corsHeaders,
    );
  } catch (error) {
    return jsonResponse(400, { error: error instanceof Error ? error.message : "unable_to_load_rate_limits" }, corsHeaders);
  }
};

const handleAdminSession = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const user = await requireAuthenticatedUser(request, admin);
  if (!user) {
    return jsonResponse(401, { error: "authentication_required" }, corsHeaders);
  }

  return jsonResponse(200, { isAdmin: await isAdminUser(admin, user.id) }, corsHeaders);
};

const handleAdminAffiliates = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  let affiliateRows: Array<Record<string, unknown>>;
  let clickRows: Array<Record<string, unknown>>;
  let orderRows: Array<Record<string, unknown>>;
  let commissionRows: Array<Record<string, unknown>>;

  try {
    [affiliateRows, clickRows, orderRows, commissionRows] = await Promise.all([
      fetchAllRows((from, to) =>
        admin.from("affiliates").select("*").order("created_at", { ascending: false }).range(from, to)
      ) as Promise<Array<Record<string, unknown>>>,
      fetchAllRows((from, to) =>
        admin.from("affiliate_clicks").select("affiliate_id").range(from, to)
      ) as Promise<Array<Record<string, unknown>>>,
      fetchAllRows((from, to) =>
        admin.from("orders").select("affiliate_id, amount, payment_status").range(from, to)
      ) as Promise<Array<Record<string, unknown>>>,
      fetchAllRows((from, to) =>
        admin.from("affiliate_commissions").select("affiliate_id, commission_amount, status").range(from, to)
      ) as Promise<Array<Record<string, unknown>>>,
    ]);
  } catch {
    return jsonResponse(400, { error: "unable_to_load_admin_affiliates" }, corsHeaders);
  }

  const clickCounts = new Map<string, number>();
  for (const click of clickRows) {
    const key = String(click.affiliate_id);
    clickCounts.set(key, (clickCounts.get(key) ?? 0) + 1);
  }

  const orderMetrics = new Map<string, { purchases: number; revenue: number }>();
  for (const order of orderRows) {
    const key = String(order.affiliate_id);
    const current = orderMetrics.get(key) ?? { purchases: 0, revenue: 0 };
    if (order.payment_status === "paid") {
      current.purchases += 1;
      current.revenue += Number(order.amount ?? 0);
    }
    orderMetrics.set(key, current);
  }

  const commissionMetrics = new Map<string, { total: number; approved: number }>();
  for (const commission of commissionRows) {
    const key = String(commission.affiliate_id);
    const current = commissionMetrics.get(key) ?? { total: 0, approved: 0 };
    if (["pending", "approved", "paid"].includes(String(commission.status))) {
      current.total += Number(commission.commission_amount ?? 0);
    }
    if (commission.status === "approved") {
      current.approved += Number(commission.commission_amount ?? 0);
    }
    commissionMetrics.set(key, current);
  }

  const affiliates = affiliateRows.map((affiliate) => {
    const affiliateId = String(affiliate.id);
    const orderMetric = orderMetrics.get(affiliateId) ?? { purchases: 0, revenue: 0 };
    const commissionMetric = commissionMetrics.get(affiliateId) ?? { total: 0, approved: 0 };

    return {
      ...mapAffiliate(affiliate as Record<string, unknown>),
      totalClicks: clickCounts.get(affiliateId) ?? 0,
      totalPurchases: orderMetric.purchases,
      totalRevenue: orderMetric.revenue,
      totalCommission: commissionMetric.total,
      pendingPayout: commissionMetric.approved,
    };
  });

  return jsonResponse(
    200,
    {
      affiliates,
      totals: {
        totalAffiliates: affiliates.length,
        approvedAffiliates: affiliates.filter((affiliate) => affiliate.status === "approved").length,
        blockedAffiliates: affiliates.filter((affiliate) => affiliate.status === "blocked").length,
        pendingAffiliates: affiliates.filter((affiliate) => affiliate.status === "pending").length,
      },
    },
    corsHeaders,
  );
};

const handleAdminAffiliateStatus = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const affiliateId = normalizeText(record.affiliateId, 64);
  const status = normalizeText(record.status, 20) as AffiliateStatus | null;
  const note = normalizeText(record.note, 500);

  if (!affiliateId || !status || !["pending", "approved", "blocked"].includes(status)) {
    return jsonResponse(400, { error: "invalid_status_payload" }, corsHeaders);
  }

  const { error } = await admin
    .from("affiliates")
    .update({
      status,
      notes: note,
      approved_at: status === "approved" ? new Date().toISOString() : null,
      blocked_at: status === "blocked" ? new Date().toISOString() : null,
    })
    .eq("id", affiliateId);

  if (error) {
    return jsonResponse(400, { error: error.message }, corsHeaders);
  }

  return jsonResponse(200, { success: true }, corsHeaders);
};

const handleAdminReferrals = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  let clickRows: Array<Record<string, unknown>>;
  try {
    clickRows = await fetchAllRows((from, to) =>
      admin
        .from("affiliate_clicks")
        .select("id, affiliate_id, referral_code, ip_address, user_agent, landing_path, fingerprint_hash, is_suspicious, suspicion_reason, created_at")
        .order("created_at", { ascending: false })
        .range(from, to)
    ) as Array<Record<string, unknown>>;
  } catch {
    return jsonResponse(400, { error: "unable_to_load_referrals" }, corsHeaders);
  }

  const affiliateIds = Array.from(new Set(clickRows.map((click) => String(click.affiliate_id))));
  const affiliatesResult = affiliateIds.length
    ? await admin.from("affiliates").select("id, affiliate_id, name").in("id", affiliateIds)
    : { data: [], error: null };

  if (affiliatesResult.error) {
    return jsonResponse(400, { error: "unable_to_load_referral_affiliates" }, corsHeaders);
  }

  const affiliateMap = new Map(
    (affiliatesResult.data ?? []).map((affiliate) => [
      String(affiliate.id),
      {
        affiliateId: String(affiliate.affiliate_id),
        affiliateName: String(affiliate.name),
      },
    ]),
  );

  const referrals = clickRows.map((click) => ({
    id: click.id,
    affiliateId: affiliateMap.get(String(click.affiliate_id))?.affiliateId ?? click.referral_code,
    affiliateName: affiliateMap.get(String(click.affiliate_id))?.affiliateName ?? "Unknown affiliate",
    ipAddress: click.ip_address,
    userAgent: click.user_agent,
    landingPath: click.landing_path,
    fingerprintHash: click.fingerprint_hash,
    isSuspicious: Boolean(click.is_suspicious),
    suspicionReason: click.suspicion_reason,
    createdAt: click.created_at,
  }));

  return jsonResponse(
    200,
    {
      referrals,
      suspiciousCount: referrals.filter((referral) => referral.isSuspicious).length,
      totalClicks: referrals.length,
    },
    corsHeaders,
  );
};

const handleAdminCommissions = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  let commissionRows: Array<Record<string, unknown>>;
  try {
    commissionRows = await fetchAllRows((from, to) =>
      admin
        .from("affiliate_commissions")
        .select("id, affiliate_id, order_id, purchase_amount, commission_amount, status, created_at, approved_at, paid_at, reversed_at, reversal_reason")
        .order("created_at", { ascending: false })
        .range(from, to)
    ) as Array<Record<string, unknown>>;
  } catch {
    return jsonResponse(400, { error: "unable_to_load_commissions" }, corsHeaders);
  }

  const affiliateIds = Array.from(new Set(commissionRows.map((commission) => String(commission.affiliate_id))));
  const orderIds = Array.from(new Set(commissionRows.map((commission) => String(commission.order_id))));

  const [affiliatesResult, ordersResult] = await Promise.all([
    affiliateIds.length
      ? admin.from("affiliates").select("id, affiliate_id, name").in("id", affiliateIds)
      : Promise.resolve({ data: [], error: null }),
    orderIds.length
      ? admin.from("orders").select("id, external_order_id").in("id", orderIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (affiliatesResult.error || ordersResult.error) {
    return jsonResponse(400, { error: "unable_to_load_commission_lookups" }, corsHeaders);
  }

  const affiliateMap = new Map(
    (affiliatesResult.data ?? []).map((affiliate) => [
      String(affiliate.id),
      { affiliateId: String(affiliate.affiliate_id), affiliateName: String(affiliate.name) },
    ]),
  );
  const orderMap = new Map((ordersResult.data ?? []).map((order) => [String(order.id), order.external_order_id as string | null]));

  const commissions = commissionRows.map((commission) => ({
    id: commission.id,
    affiliateId: affiliateMap.get(String(commission.affiliate_id))?.affiliateId ?? "Unknown",
    affiliateName: affiliateMap.get(String(commission.affiliate_id))?.affiliateName ?? "Unknown affiliate",
    orderId: String(commission.order_id),
    orderReference: orderMap.get(String(commission.order_id)) ?? null,
    purchaseAmount: Number(commission.purchase_amount ?? 0),
    commissionAmount: Number(commission.commission_amount ?? 0),
    status: commission.status,
    createdAt: commission.created_at,
    approvedAt: commission.approved_at,
    paidAt: commission.paid_at,
    reversedAt: commission.reversed_at,
    reversalReason: commission.reversal_reason,
  }));

  return jsonResponse(
    200,
    {
      commissions,
      totals: {
        pending: commissions.filter((item) => item.status === "pending").length,
        approved: commissions.filter((item) => item.status === "approved").length,
        paid: commissions.filter((item) => item.status === "paid").length,
        reversed: commissions.filter((item) => item.status === "reversed").length,
      },
    },
    corsHeaders,
  );
};

const handleAdminCommissionStatus = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const commissionId = normalizeText(record.commissionId, 64);
  const status = normalizeText(record.status, 20) as CommissionStatus | null;
  const reversalReason = normalizeText(record.reversalReason, 500);

  if (!commissionId || !status || !["approved", "paid", "reversed", "rejected"].includes(status)) {
    return jsonResponse(400, { error: "invalid_commission_status_payload" }, corsHeaders);
  }

  const updatePayload: Record<string, unknown> = { status };
  if (status === "approved") updatePayload.approved_at = new Date().toISOString();
  if (status === "paid") updatePayload.paid_at = new Date().toISOString();
  if (status === "reversed" || status === "rejected") {
    updatePayload.reversed_at = new Date().toISOString();
    updatePayload.reversal_reason = reversalReason ?? "Commission removed by admin.";
  }

  const { error } = await admin.from("affiliate_commissions").update(updatePayload).eq("id", commissionId);
  if (error) {
    return jsonResponse(400, { error: error.message }, corsHeaders);
  }

  return jsonResponse(200, { success: true }, corsHeaders);
};

const getEligiblePayoutCommissions = async (
  admin: ReturnType<typeof createAdminClient>,
  affiliatePk: string,
) => {
  const [commissionsResult, payoutsResult] = await Promise.all([
    admin
      .from("affiliate_commissions")
      .select("id, commission_amount")
      .eq("affiliate_id", affiliatePk)
      .eq("status", "approved"),
    admin
      .from("payouts")
      .select("commission_ids, payment_status")
      .eq("affiliate_id", affiliatePk)
      .in("payment_status", ["pending", "approved", "paid"] satisfies PayoutStatus[]),
  ]);

  if (commissionsResult.error || payoutsResult.error) {
    throw new Error("unable_to_load_payout_commissions");
  }

  const reservedCommissionIds = new Set<string>();
  for (const payout of payoutsResult.data ?? []) {
    for (const commissionId of payout.commission_ids ?? []) {
      reservedCommissionIds.add(String(commissionId));
    }
  }

  return (commissionsResult.data ?? []).filter((commission) => !reservedCommissionIds.has(String(commission.id)));
};

const handleAdminPayouts = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  let payoutRows: Array<Record<string, unknown>>;
  try {
    payoutRows = await fetchAllRows((from, to) =>
      admin
        .from("payouts")
        .select("id, affiliate_id, amount, payment_method, payment_status, notes, created_at, requested_at, approved_at, paid_at")
        .order("created_at", { ascending: false })
        .range(from, to)
    ) as Array<Record<string, unknown>>;
  } catch {
    return jsonResponse(400, { error: "unable_to_load_payouts" }, corsHeaders);
  }

  const [affiliatesResult, candidatesResult] = await Promise.all([
    admin.from("affiliates").select("id, affiliate_id, name"),
    admin
      .from("affiliate_payout_candidates")
      .select("affiliate_pk, affiliate_id, name, preferred_payout_method, available_amount"),
  ]);

  if (affiliatesResult.error || candidatesResult.error) {
    return jsonResponse(400, { error: "unable_to_load_payouts" }, corsHeaders);
  }

  const affiliateMap = new Map(
    (affiliatesResult.data ?? []).map((affiliate) => [
      String(affiliate.id),
      { affiliateId: String(affiliate.affiliate_id), affiliateName: String(affiliate.name) },
    ]),
  );

  return jsonResponse(
    200,
    {
      payouts: payoutRows.map((payout) => ({
        id: payout.id,
        affiliateId: affiliateMap.get(String(payout.affiliate_id))?.affiliateId ?? "Unknown",
        affiliateName: affiliateMap.get(String(payout.affiliate_id))?.affiliateName ?? "Unknown affiliate",
        amount: Number(payout.amount ?? 0),
        paymentMethod: payout.payment_method,
        paymentStatus: payout.payment_status,
        createdAt: payout.created_at,
        requestedAt: payout.requested_at,
        approvedAt: payout.approved_at,
        paidAt: payout.paid_at,
        notes: payout.notes,
      })),
      eligibleAffiliates: (candidatesResult.data ?? []).map((candidate) => ({
        id: candidate.affiliate_pk,
        affiliateId: candidate.affiliate_id,
        affiliateName: candidate.name,
        payoutMethod: candidate.preferred_payout_method,
        availableAmount: Number(candidate.available_amount ?? 0),
      })),
    },
    corsHeaders,
  );
};

const handleAdminPayoutAction = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return adminCheck.response;

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const action = normalizeText(record.action, 20);
  const note = normalizeText(record.note, 500);

  if (action === "create") {
    const affiliatePk = normalizeText(record.affiliateId, 64);
    if (!affiliatePk) {
      return jsonResponse(400, { error: "affiliate_id_required" }, corsHeaders);
    }

    const { data: affiliate, error: affiliateError } = await admin
      .from("affiliates")
      .select("id, preferred_payout_method")
      .eq("id", affiliatePk)
      .maybeSingle();

    if (affiliateError || !affiliate) {
      return jsonResponse(404, { error: "affiliate_not_found" }, corsHeaders);
    }

    const eligibleCommissions = await getEligiblePayoutCommissions(admin, affiliatePk);
    const totalAmount = eligibleCommissions.reduce((sum, commission) => sum + Number(commission.commission_amount ?? 0), 0);

    if (totalAmount < MIN_PAYOUT_THRESHOLD) {
      return jsonResponse(400, { error: "minimum_payout_threshold_not_met" }, corsHeaders);
    }

    const { error: payoutError } = await admin.from("payouts").insert({
      affiliate_id: affiliatePk,
      amount: totalAmount,
      payment_method: affiliate.preferred_payout_method,
      commission_ids: eligibleCommissions.map((commission) => commission.id),
      notes: note,
      payment_status: "pending",
    });

    if (payoutError) {
      return jsonResponse(400, { error: payoutError.message }, corsHeaders);
    }

    return jsonResponse(200, { success: true }, corsHeaders);
  }

  const payoutId = normalizeText(record.payoutId, 64);
  if (!payoutId || !action || !["approve", "paid", "cancel"].includes(action)) {
    return jsonResponse(400, { error: "invalid_payout_action" }, corsHeaders);
  }

  const { data: payout, error: payoutError } = await admin
    .from("payouts")
    .select("id, commission_ids")
    .eq("id", payoutId)
    .maybeSingle();

  if (payoutError || !payout) {
    return jsonResponse(404, { error: "payout_not_found" }, corsHeaders);
  }

  if (action === "approve") {
    const { error } = await admin
      .from("payouts")
      .update({ payment_status: "approved", approved_at: new Date().toISOString(), notes: note })
      .eq("id", payoutId);
    if (error) return jsonResponse(400, { error: error.message }, corsHeaders);
    return jsonResponse(200, { success: true }, corsHeaders);
  }

  if (action === "cancel") {
    const { error } = await admin.from("payouts").update({ payment_status: "cancelled", notes: note }).eq("id", payoutId);
    if (error) return jsonResponse(400, { error: error.message }, corsHeaders);
    return jsonResponse(200, { success: true }, corsHeaders);
  }

  const paidAt = new Date().toISOString();
  const { error: updatePayoutError } = await admin
    .from("payouts")
    .update({ payment_status: "paid", paid_at: paidAt, notes: note })
    .eq("id", payoutId);

  if (updatePayoutError) {
    return jsonResponse(400, { error: updatePayoutError.message }, corsHeaders);
  }

  if ((payout.commission_ids ?? []).length > 0) {
    const { error: commissionError } = await admin
      .from("affiliate_commissions")
      .update({ status: "paid", paid_at: paidAt })
      .in("id", payout.commission_ids);

    if (commissionError) {
      return jsonResponse(400, { error: commissionError.message }, corsHeaders);
    }
  }

  return jsonResponse(200, { success: true }, corsHeaders);
};

const requireWebhookOrAdmin = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const secret = (request.headers.get("x-affiliate-webhook-secret") ?? "").trim();
  if (WEBHOOK_SECRET && secret === WEBHOOK_SECRET) {
    return { ok: true, response: null };
  }

  const adminCheck = await requireAdminUser(request, admin, corsHeaders);
  if (adminCheck.response) return { ok: false, response: adminCheck.response };
  return { ok: true, response: null };
};

const upsertCommissionForOrder = async (
  admin: ReturnType<typeof createAdminClient>,
  payload: {
    affiliatePk: string;
    orderPk: string;
    purchaseAmount: number;
    commissionRate: number;
    commissionAmount: number;
    status: CommissionStatus;
    reversalReason?: string | null;
  },
) => {
  const existing = await admin
    .from("affiliate_commissions")
    .select("id")
    .eq("order_id", payload.orderPk)
    .maybeSingle();

  if (existing.error) throw existing.error;

  const updatePayload: Record<string, unknown> = {
    affiliate_id: payload.affiliatePk,
    order_id: payload.orderPk,
    purchase_amount: payload.purchaseAmount,
    commission_rate: payload.commissionRate,
    commission_amount: payload.commissionAmount,
    status: payload.status,
    reversal_reason: payload.reversalReason ?? null,
  };

  if (payload.status === "approved") updatePayload.approved_at = new Date().toISOString();
  if (payload.status === "paid") updatePayload.paid_at = new Date().toISOString();
  if (payload.status === "reversed" || payload.status === "rejected") updatePayload.reversed_at = new Date().toISOString();

  if (existing.data) {
    const { data, error } = await admin
      .from("affiliate_commissions")
      .update(updatePayload)
      .eq("order_id", payload.orderPk)
      .select("id, status, commission_amount")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await admin
    .from("affiliate_commissions")
    .insert(updatePayload)
    .select("id, status, commission_amount")
    .single();

  if (error) throw error;
  return data;
};

const handleCommissionCreate = async (
  request: Request,
  admin: ReturnType<typeof createAdminClient>,
  corsHeaders: HeadersInit,
) => {
  const authorization = await requireWebhookOrAdmin(request, admin, corsHeaders);
  if (!authorization.ok) {
    return authorization.response!;
  }

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, { error: "invalid_body" }, corsHeaders);
  }

  const record = body as Record<string, unknown>;
  const externalOrderId = normalizeText(record.externalOrderId, 120);
  const packageName = normalizeText(record.packageName, 180);
  const paymentStatus = normalizeText(record.paymentStatus, 20) as PaymentStatus | null;
  const amount = normalizeNumber(record.amount);
  const customerEmail = normalizeEmail(record.customerEmail);
  const customerId = normalizeText(record.customerId, 64);
  const customerIp = normalizeText(record.customerIp, 64) ?? getClientIp(request);
  const customerUserAgent = normalizeText(record.customerUserAgent, 500) ?? request.headers.get("user-agent");
  const fingerprintHash = normalizeText(record.fingerprintHash, 128);
  const referralCode = normalizeAffiliateCode(record.referralCode);

  if (!externalOrderId || !packageName || amount === null || amount < 0 || !paymentStatus) {
    return jsonResponse(400, { error: "missing_order_fields" }, corsHeaders);
  }

  if (!["pending", "pending_payment", "processing_payment", "paid", "cancelled", "refunded", "failed"].includes(paymentStatus)) {
    return jsonResponse(400, { error: "invalid_payment_status" }, corsHeaders);
  }

  const affiliate = referralCode ? await getAffiliateByCode(admin, referralCode) : null;
  const latestClickResult =
    affiliate && referralCode
      ? await admin
          .from("affiliate_clicks")
          .select("id, is_suspicious, suspicion_reason")
          .eq("affiliate_id", affiliate.id)
          .eq("referral_code", referralCode)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null, error: null };

  if (latestClickResult.error) {
    return jsonResponse(400, { error: "unable_to_load_latest_referral_click" }, corsHeaders);
  }

  const fraudFlags: string[] = [];
  const isSelfReferral = Boolean(
    affiliate &&
      customerEmail &&
      String(affiliate.email).toLowerCase() === customerEmail.toLowerCase(),
  );
  if (isSelfReferral) {
    fraudFlags.push("self_referral_email_match");
  }
  if (latestClickResult.data?.is_suspicious) {
    fraudFlags.push("suspicious_click_pattern");
  }

  const orderUpsertPayload = {
    external_order_id: externalOrderId,
    customer_id: customerId,
    customer_email: customerEmail,
    package_name: packageName,
    amount,
    payment_status: paymentStatus,
    affiliate_id: affiliate?.id ?? null,
    affiliate_click_id: latestClickResult.data?.id ?? null,
    referral_code: referralCode,
    customer_ip: customerIp,
    customer_user_agent: customerUserAgent,
    fingerprint_hash: fingerprintHash,
    is_self_referral: isSelfReferral,
    is_suspicious: latestClickResult.data?.is_suspicious ?? false,
    fraud_flags: fraudFlags,
    metadata: {
      referral_code: referralCode,
      webhook_recorded_at: new Date().toISOString(),
    },
    purchased_at: paymentStatus === "paid" ? new Date().toISOString() : null,
  };

  const existingOrder = await admin
    .from("orders")
    .select("id")
    .eq("external_order_id", externalOrderId)
    .maybeSingle();

  if (existingOrder.error) {
    return jsonResponse(400, { error: "unable_to_load_order" }, corsHeaders);
  }

  const orderMutation = existingOrder.data
    ? admin.from("orders").update(orderUpsertPayload).eq("id", existingOrder.data.id).select("id").single()
    : admin.from("orders").insert(orderUpsertPayload).select("id").single();

  const { data: savedOrder, error: orderError } = await orderMutation;
  if (orderError || !savedOrder) {
    return jsonResponse(400, { error: orderError?.message ?? "unable_to_save_order" }, corsHeaders);
  }

  let commissionResult: { id: string; status: CommissionStatus; commission_amount: number } | null = null;
  const commissionRate = Number(affiliate?.commission_rate ?? DEFAULT_COMMISSION_RATE);
  const commissionAmount = calculateCommission(amount, commissionRate);

  if (affiliate && (isSelfReferral || latestClickResult.data?.is_suspicious)) {
    commissionResult = await upsertCommissionForOrder(admin, {
      affiliatePk: affiliate.id,
      orderPk: savedOrder.id,
      purchaseAmount: amount,
      commissionRate,
      commissionAmount,
      status: "rejected",
      reversalReason: isSelfReferral
        ? "Self referral blocked."
        : latestClickResult.data?.suspicion_reason ?? "Suspicious referral traffic.",
    });
  } else if (affiliate && paymentStatus === "paid") {
    commissionResult = await upsertCommissionForOrder(admin, {
      affiliatePk: affiliate.id,
      orderPk: savedOrder.id,
      purchaseAmount: amount,
      commissionRate,
      commissionAmount,
      status: "pending",
    });
  } else if (affiliate && ["cancelled", "refunded"].includes(paymentStatus)) {
    commissionResult = await upsertCommissionForOrder(admin, {
      affiliatePk: affiliate.id,
      orderPk: savedOrder.id,
      purchaseAmount: amount,
      commissionRate,
      commissionAmount,
      status: "reversed",
      reversalReason: paymentStatus === "refunded" ? "Order refunded." : "Order cancelled.",
    });
  }

  return jsonResponse(
    200,
    {
      orderId: savedOrder.id,
      commissionId: commissionResult?.id ?? null,
      commissionStatus: commissionResult?.status ?? null,
      commissionAmount: commissionResult ? Number(commissionResult.commission_amount ?? 0) : null,
      rejectedReason: isSelfReferral
        ? "Self referrals are not allowed."
        : latestClickResult.data?.is_suspicious
          ? latestClickResult.data?.suspicion_reason ?? "Suspicious referral traffic."
          : null,
    },
    corsHeaders,
  );
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders({
    origin,
    configuredOrigins,
    allowedHeaders: "authorization, x-client-info, apikey, content-type, x-affiliate-webhook-secret",
    allowedMethods: "GET, POST, OPTIONS",
  });
  if (!corsHeaders) {
    return new Response("Origin not allowed.", { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error) {
    return jsonResponse(
      500,
      { error: error instanceof Error ? error.message : "affiliate_api_not_configured" },
      corsHeaders,
    );
  }

  try {
    const routePath = getRoutePath(request);

    if (request.method === "POST" && routePath === "/register") {
      return await handleRegister(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/referral/track") {
      return await handleTrackReferral(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/commission/create") {
      return await handleCommissionCreate(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/affiliate/stats") {
      return await handleAffiliateStats(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/session") {
      return await handleAdminSession(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/dashboard") {
      return await handleAdminDashboard(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/leads") {
      return await handleAdminLeads(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/admin/lead-status") {
      return await handleAdminLeadStatus(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/affiliates") {
      return await handleAdminAffiliates(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/admin/affiliate-status") {
      return await handleAdminAffiliateStatus(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/admin/affiliate-update") {
      return await handleAdminAffiliateUpdate(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/referrals") {
      return await handleAdminReferrals(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/orders") {
      return await handleAdminOrders(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/commissions") {
      return await handleAdminCommissions(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/admin/commission-status") {
      return await handleAdminCommissionStatus(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/payouts") {
      return await handleAdminPayouts(request, admin, corsHeaders);
    }

    if (request.method === "GET" && routePath === "/admin/rate-limits") {
      return await handleAdminRateLimits(request, admin, corsHeaders);
    }

    if (request.method === "POST" && routePath === "/admin/payout") {
      return await handleAdminPayoutAction(request, admin, corsHeaders);
    }

    return jsonResponse(404, { error: "route_not_found" }, corsHeaders);
  } catch (error) {
    console.error("affiliate-api failure", error);
    return jsonResponse(
      500,
      { error: error instanceof Error ? error.message : "unexpected_affiliate_api_error" },
      corsHeaders,
    );
  }
});













