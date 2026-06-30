import type {
  AdminCouponRecord,
  AdminCouponsResponse,
  AdminAffiliateRecord,
  AdminAffiliatesResponse,
  AdminCommissionRecord,
  AdminCommissionsResponse,
  AdminCourseRecord,
  AdminCoursesResponse,
  AdminDashboardResponse,
  AdminInvoiceRecord,
  AdminInvoicesResponse,
  AdminKnowledgeTestQuestionsResponse,
  AdminLeadRecord,
  AdminLeadsResponse,
  AdminOrderRecord,
  AdminOrdersResponse,
  AdminPayoutCandidate,
  AdminPayoutRecord,
  AdminPayoutsResponse,
  AdminRateLimitRecord,
  AdminRateLimitsResponse,
  AdminReferralRecord,
  AdminReferralsResponse,
  AffiliateDetailsUpdateInput,
  AffiliateProfile,
  AffiliateStatus,
  CommissionStatus,
  CheckoutInvoiceStatus,
  CommissionStatusUpdateInput,
  LeadStatus,
  LeadStatusUpdateInput,
  PayoutActionInput,
  PreferredPayoutMethod,
} from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseClient";
import { COURSE_SELECT, mapCourseRowToAdminCourse } from "@/lib/courseService";
import { getCouponAvailability } from "@/lib/couponService";
import { KNOWLEDGE_TEST_QUESTION_SELECT, mapKnowledgeTestQuestionRow } from "@/lib/knowledgeTestService";

const ADMIN_FETCH_BATCH_SIZE = 500;
const MIN_PAYOUT_THRESHOLD = 50;

type SupabaseClient = NonNullable<typeof supabase>;

type AffiliateLookup = {
  affiliateId: string;
  affiliateName: string;
};

const ensureSupabaseClient = () => {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const ensureAuthenticatedUser = async (client: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

  return user;
};

const ensureAdminUser = async () => {
  const client = ensureSupabaseClient();
  const user = await ensureAuthenticatedUser(client);
  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("This account does not have admin access.");
  }

  return { client, user };
};

const fetchAllRows = async <T,>(
  queryPage: (from: number, to: number) => Promise<{ data: T[] | null; error: { message?: string } | null }>,
) => {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    const to = from + ADMIN_FETCH_BATCH_SIZE - 1;
    const { data, error } = await queryPage(from, to);
    if (error) {
      throw new Error(error.message ?? "Unable to load data from Supabase.");
    }

    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < ADMIN_FETCH_BATCH_SIZE) {
      return rows;
    }

    from += ADMIN_FETCH_BATCH_SIZE;
  }
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const mapAffiliateProfile = (row: Record<string, unknown>): AffiliateProfile => ({
  id: String(row.id),
  affiliateId: String(row.affiliate_id),
  authUserId: typeof row.auth_user_id === "string" ? row.auth_user_id : null,
  name: String(row.name),
  email: String(row.email),
  phone: typeof row.phone === "string" ? row.phone : null,
  age: typeof row.age === "number" ? row.age : null,
  isMinor: Boolean(row.is_minor),
  guardianName: typeof row.guardian_name === "string" ? row.guardian_name : null,
  guardianEmail: typeof row.guardian_email === "string" ? row.guardian_email : null,
  guardianPhone: typeof row.guardian_phone === "string" ? row.guardian_phone : null,
  guardianConsent: Boolean(row.guardian_consent),
  guardianConsentTimestamp: typeof row.guardian_consent_timestamp === "string" ? row.guardian_consent_timestamp : null,
  socialMediaLink: typeof row.social_media_link === "string" ? row.social_media_link : null,
  preferredPayoutMethod: row.preferred_payout_method as PreferredPayoutMethod,
  status: row.status as AffiliateStatus,
  commissionRate: Number(row.commission_rate ?? 0.05),
  cookieDurationDays: Number(row.cookie_duration_days ?? 30),
  notes: typeof row.notes === "string" ? row.notes : null,
  createdAt: String(row.created_at),
  approvedAt: typeof row.approved_at === "string" ? row.approved_at : null,
  blockedAt: typeof row.blocked_at === "string" ? row.blocked_at : null,
});

const mapLead = (row: Record<string, unknown>): AdminLeadRecord => {
  const payload = asRecord(row.payload);
  const requestType = typeof payload.request_type === "string" ? payload.request_type : null;

  return {
    id: String(row.id),
    leadType: String(row.lead_type) as AdminLeadRecord["leadType"],
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
  affiliateMap: Map<string, AffiliateLookup>,
): AdminOrderRecord => ({
  id: String(row.id),
  externalOrderId: typeof row.external_order_id === "string" ? row.external_order_id : null,
  customerId: typeof row.customer_id === "string" ? row.customer_id : null,
  customerEmail: typeof row.customer_email === "string" ? row.customer_email : null,
  packageName: String(row.package_name),
  amount: Number(row.amount ?? 0),
  paymentStatus: String(row.payment_status) as AdminOrderRecord["paymentStatus"],
  affiliateRecordId: typeof row.affiliate_id === "string" ? row.affiliate_id : null,
  affiliateId:
    typeof row.affiliate_id === "string"
      ? affiliateMap.get(String(row.affiliate_id))?.affiliateId ?? String(row.affiliate_id)
      : null,
  affiliateName:
    typeof row.affiliate_id === "string"
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

const mapRateLimit = (row: Record<string, unknown>): AdminRateLimitRecord => ({
  key: String(row.key),
  endpoint: String(row.endpoint),
  windowStart: String(row.window_start),
  count: Number(row.count ?? 0),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const mapCoupon = (row: Record<string, unknown>): AdminCouponRecord => ({
  id: String(row.id),
  code: String(row.code),
  label: String(row.label),
  description: typeof row.description === "string" ? row.description : null,
  couponType: String(row.coupon_type) as AdminCouponRecord["couponType"],
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

const mapInvoice = (row: Record<string, unknown>): AdminInvoiceRecord => ({
  id: String(row.id),
  publicToken: String(row.public_token),
  title: String(row.title),
  description: typeof row.description === "string" ? row.description : null,
  amount: Number(row.amount ?? 0),
  currency: typeof row.currency === "string" ? row.currency : "CAD",
  customerName: typeof row.customer_name === "string" ? row.customer_name : null,
  customerEmail: typeof row.customer_email === "string" ? row.customer_email : null,
  status: String(row.status) as CheckoutInvoiceStatus,
  expiresAt: typeof row.expires_at === "string" ? row.expires_at : null,
  paidAt: typeof row.paid_at === "string" ? row.paid_at : null,
  lastOrderId: typeof row.last_order_id === "string" ? row.last_order_id : null,
  metadata: asRecord(row.metadata),
  createdBy: typeof row.created_by === "string" ? row.created_by : null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const isInvoiceExpired = (invoice: Pick<AdminInvoiceRecord, "status" | "expiresAt" | "paidAt">) => {
  if (invoice.status !== "open" || invoice.paidAt) {
    return false;
  }

  if (!invoice.expiresAt) {
    return false;
  }

  const expiresAt = new Date(invoice.expiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now();
};

const mapCourse = (row: Record<string, unknown>): AdminCourseRecord => mapCourseRowToAdminCourse(row);
const mapKnowledgeTestQuestion = (row: Record<string, unknown>) => mapKnowledgeTestQuestionRow(row);

const getAffiliateLookupMap = async (client: SupabaseClient, affiliateIds: string[]) => {
  if (affiliateIds.length === 0) {
    return new Map<string, AffiliateLookup>();
  }

  const { data, error } = await client
    .from("affiliates")
    .select("id, affiliate_id, name")
    .in("id", affiliateIds);

  if (error) {
    throw error;
  }

  return new Map(
    (data ?? []).map((affiliate) => [
      String(affiliate.id),
      {
        affiliateId: String(affiliate.affiliate_id),
        affiliateName: String(affiliate.name),
      },
    ]),
  );
};

const getOrderReferenceMap = async (client: SupabaseClient, orderIds: string[]) => {
  if (orderIds.length === 0) {
    return new Map<string, string | null>();
  }

  const { data, error } = await client
    .from("orders")
    .select("id, external_order_id")
    .in("id", orderIds);

  if (error) {
    throw error;
  }

  return new Map((data ?? []).map((order) => [String(order.id), typeof order.external_order_id === "string" ? order.external_order_id : null]));
};

const getEligiblePayoutCommissions = async (client: SupabaseClient, affiliatePk: string) => {
  const [commissionsResult, payoutsResult] = await Promise.all([
    client
      .from("affiliate_commissions")
      .select("id, commission_amount")
      .eq("affiliate_id", affiliatePk)
      .eq("status", "approved"),
    client
      .from("payouts")
      .select("commission_ids, payment_status")
      .eq("affiliate_id", affiliatePk)
      .in("payment_status", ["pending", "approved", "paid"]),
  ]);

  if (commissionsResult.error || payoutsResult.error) {
    throw new Error("Unable to load payout commissions.");
  }

  const reservedCommissionIds = new Set<string>();
  for (const payout of payoutsResult.data ?? []) {
    for (const commissionId of payout.commission_ids ?? []) {
      reservedCommissionIds.add(String(commissionId));
    }
  }

  return (commissionsResult.data ?? []).filter((commission) => !reservedCommissionIds.has(String(commission.id)));
};

export const getDirectAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const { client } = await ensureAdminUser();

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
    client.from("leads").select("id", { count: "exact", head: true }),
    client.from("affiliates").select("id", { count: "exact", head: true }),
    client.from("affiliate_clicks").select("id", { count: "exact", head: true }),
    client.from("orders").select("id", { count: "exact", head: true }),
    client.from("affiliate_commissions").select("id", { count: "exact", head: true }),
    client.from("payouts").select("id", { count: "exact", head: true }),
    client.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("is_suspicious", true),
    client.from("orders").select("id", { count: "exact", head: true }).eq("is_suspicious", true),
    client
      .from("leads")
      .select("id, lead_type, full_name, email, phone, source_page, status, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    client
      .from("orders")
      .select("id, external_order_id, customer_id, customer_email, package_name, amount, payment_status, affiliate_id, affiliate_click_id, referral_code, customer_ip, customer_user_agent, fingerprint_hash, is_self_referral, is_suspicious, fraud_flags, metadata, created_at, purchased_at")
      .order("created_at", { ascending: false })
      .limit(5),
    client.from("affiliates").select("*").order("created_at", { ascending: false }).limit(5),
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
    throw new Error("Unable to load the admin dashboard.");
  }

  const recentOrderAffiliateIds = Array.from(
    new Set((recentOrdersResult.data ?? []).map((order) => String(order.affiliate_id)).filter((value) => value && value !== "null")),
  );
  const affiliateMap = await getAffiliateLookupMap(client, recentOrderAffiliateIds);

  return {
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
    recentOrders: (recentOrdersResult.data ?? []).map((order) => mapOrder(order as Record<string, unknown>, affiliateMap)),
    recentAffiliateSignups: (recentAffiliatesResult.data ?? []).map((affiliate) => ({
      ...mapAffiliateProfile(affiliate as Record<string, unknown>),
      totalClicks: 0,
      totalPurchases: 0,
      totalRevenue: 0,
      totalCommission: 0,
      pendingPayout: 0,
    })),
  };
};

export const getDirectAdminLeads = async (): Promise<AdminLeadsResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("leads")
      .select("id, lead_type, full_name, email, phone, source_page, status, payload, created_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const leads = rows.map((lead) => mapLead(lead as Record<string, unknown>));
  const totals = leads.reduce(
    (accumulator, lead) => {
      const effectiveType = lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;
      if (effectiveType === "contact") accumulator.contact += 1;
      if (effectiveType === "student_assessment") accumulator.studentAssessment += 1;
      if (effectiveType === "employee_application") accumulator.employeeApplications += 1;
      if (effectiveType === "custom_package_request") accumulator.customPackageRequests += 1;
      return accumulator;
    },
    {
      contact: 0,
      studentAssessment: 0,
      employeeApplications: 0,
      customPackageRequests: 0,
    },
  );

  return {
    leads,
    totals: {
      totalLeads: leads.length,
      ...totals,
    },
  };
};

export const updateDirectLeadStatus = async (input: LeadStatusUpdateInput) => {
  const { client } = await ensureAdminUser();
  const { error } = await client
    .from("leads")
    .update({ status: input.status })
    .eq("id", input.leadId);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const getDirectAdminAffiliates = async (): Promise<AdminAffiliatesResponse> => {
  const { client } = await ensureAdminUser();
  const [affiliateRows, clickRows, orderRows, commissionRows] = await Promise.all([
    fetchAllRows(async (from, to) => client.from("affiliates").select("*").order("created_at", { ascending: false }).range(from, to)),
    fetchAllRows(async (from, to) => client.from("affiliate_clicks").select("affiliate_id").range(from, to)),
    fetchAllRows(async (from, to) => client.from("orders").select("affiliate_id, amount, payment_status").range(from, to)),
    fetchAllRows(async (from, to) => client.from("affiliate_commissions").select("affiliate_id, commission_amount, status").range(from, to)),
  ]);

  const clickCounts = new Map<string, number>();
  for (const click of clickRows) {
    const key = String((click as Record<string, unknown>).affiliate_id);
    clickCounts.set(key, (clickCounts.get(key) ?? 0) + 1);
  }

  const orderMetrics = new Map<string, { purchases: number; revenue: number }>();
  for (const order of orderRows) {
    const record = order as Record<string, unknown>;
    const key = String(record.affiliate_id);
    const current = orderMetrics.get(key) ?? { purchases: 0, revenue: 0 };
    if (record.payment_status === "paid") {
      current.purchases += 1;
      current.revenue += Number(record.amount ?? 0);
    }
    orderMetrics.set(key, current);
  }

  const commissionMetrics = new Map<string, { total: number; approved: number }>();
  for (const commission of commissionRows) {
    const record = commission as Record<string, unknown>;
    const key = String(record.affiliate_id);
    const current = commissionMetrics.get(key) ?? { total: 0, approved: 0 };
    if (["pending", "approved", "paid"].includes(String(record.status))) {
      current.total += Number(record.commission_amount ?? 0);
    }
    if (record.status === "approved") {
      current.approved += Number(record.commission_amount ?? 0);
    }
    commissionMetrics.set(key, current);
  }

  const affiliates = affiliateRows.map((affiliate) => {
    const affiliateRecord = affiliate as Record<string, unknown>;
    const affiliatePk = String(affiliateRecord.id);
    const orderMetric = orderMetrics.get(affiliatePk) ?? { purchases: 0, revenue: 0 };
    const commissionMetric = commissionMetrics.get(affiliatePk) ?? { total: 0, approved: 0 };

    return {
      ...mapAffiliateProfile(affiliateRecord),
      totalClicks: clickCounts.get(affiliatePk) ?? 0,
      totalPurchases: orderMetric.purchases,
      totalRevenue: orderMetric.revenue,
      totalCommission: commissionMetric.total,
      pendingPayout: commissionMetric.approved,
    } satisfies AdminAffiliateRecord;
  });

  return {
    affiliates,
    totals: {
      totalAffiliates: affiliates.length,
      approvedAffiliates: affiliates.filter((affiliate) => affiliate.status === "approved").length,
      blockedAffiliates: affiliates.filter((affiliate) => affiliate.status === "blocked").length,
      pendingAffiliates: affiliates.filter((affiliate) => affiliate.status === "pending").length,
    },
  };
};

export const updateDirectAffiliateStatus = async (input: { affiliateId: string; status: AffiliateStatus; note?: string }) => {
  const { client } = await ensureAdminUser();
  const now = new Date().toISOString();
  const { error } = await client
    .from("affiliates")
    .update({
      status: input.status,
      notes: input.note,
      approved_at: input.status === "approved" ? now : null,
      blocked_at: input.status === "blocked" ? now : null,
    })
    .eq("id", input.affiliateId);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const updateDirectAffiliateDetails = async (input: AffiliateDetailsUpdateInput) => {
  const { client } = await ensureAdminUser();
  const { data: currentAffiliate, error: currentAffiliateError } = await client
    .from("affiliates")
    .select("approved_at, blocked_at")
    .eq("id", input.affiliateId)
    .maybeSingle();

  if (currentAffiliateError || !currentAffiliate) {
    throw new Error("Affiliate not found.");
  }

  const now = new Date().toISOString();
  const approvedAt =
    input.status === "approved"
      ? (typeof currentAffiliate.approved_at === "string" ? currentAffiliate.approved_at : now)
      : null;
  const blockedAt =
    input.status === "blocked"
      ? (typeof currentAffiliate.blocked_at === "string" ? currentAffiliate.blocked_at : now)
      : null;

  const { error } = await client
    .from("affiliates")
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone?.trim() ? input.phone.trim() : null,
      social_media_link: input.socialMediaLink?.trim() ? input.socialMediaLink.trim() : null,
      preferred_payout_method: input.preferredPayoutMethod,
      status: input.status,
      commission_rate: input.commissionRate,
      cookie_duration_days: input.cookieDurationDays,
      notes: input.note?.trim() ? input.note.trim() : null,
      approved_at: approvedAt,
      blocked_at: blockedAt,
    })
    .eq("id", input.affiliateId);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const getDirectAdminReferrals = async (): Promise<AdminReferralsResponse> => {
  const { client } = await ensureAdminUser();
  const clickRows = await fetchAllRows(async (from, to) =>
    client
      .from("affiliate_clicks")
      .select("id, affiliate_id, referral_code, ip_address, user_agent, landing_path, fingerprint_hash, is_suspicious, suspicion_reason, created_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const affiliateIds = Array.from(new Set(clickRows.map((click) => String((click as Record<string, unknown>).affiliate_id)).filter(Boolean)));
  const affiliateMap = await getAffiliateLookupMap(client, affiliateIds);

  const referrals = clickRows.map((click) => {
    const record = click as Record<string, unknown>;
    return {
      id: String(record.id),
      affiliateRecordId: typeof record.affiliate_id === "string" ? record.affiliate_id : null,
      affiliateId: affiliateMap.get(String(record.affiliate_id))?.affiliateId ?? String(record.referral_code ?? "Unknown"),
      affiliateName: affiliateMap.get(String(record.affiliate_id))?.affiliateName ?? "Unknown affiliate",
      referralCode: typeof record.referral_code === "string" ? record.referral_code : null,
      ipAddress: typeof record.ip_address === "string" ? record.ip_address : null,
      userAgent: typeof record.user_agent === "string" ? record.user_agent : null,
      landingPath: String(record.landing_path),
      fingerprintHash: typeof record.fingerprint_hash === "string" ? record.fingerprint_hash : null,
      isSuspicious: Boolean(record.is_suspicious),
      suspicionReason: typeof record.suspicion_reason === "string" ? record.suspicion_reason : null,
      createdAt: String(record.created_at),
    } satisfies AdminReferralRecord;
  });

  return {
    referrals,
    suspiciousCount: referrals.filter((referral) => referral.isSuspicious).length,
    totalClicks: referrals.length,
  };
};

export const getDirectAdminOrders = async (): Promise<AdminOrdersResponse> => {
  const { client } = await ensureAdminUser();
  const orderRows = await fetchAllRows(async (from, to) =>
    client
      .from("orders")
      .select("id, external_order_id, customer_id, customer_email, package_name, amount, payment_status, affiliate_id, affiliate_click_id, referral_code, customer_ip, customer_user_agent, fingerprint_hash, is_self_referral, is_suspicious, fraud_flags, metadata, created_at, purchased_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const affiliateIds = Array.from(new Set(orderRows.map((order) => String((order as Record<string, unknown>).affiliate_id)).filter((value) => value && value !== "null")));
  const affiliateMap = await getAffiliateLookupMap(client, affiliateIds);
  const orders = orderRows.map((order) => mapOrder(order as Record<string, unknown>, affiliateMap));

  return {
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
  };
};

export const getDirectAdminInvoices = async (): Promise<AdminInvoicesResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("checkout_invoices")
      .select("id, public_token, title, description, amount, currency, customer_name, customer_email, status, expires_at, paid_at, last_order_id, metadata, created_by, created_at, updated_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const invoices = rows.map((row) => mapInvoice(row as Record<string, unknown>));

  return {
    invoices,
    totals: {
      totalInvoices: invoices.length,
      openInvoices: invoices.filter((invoice) => invoice.status === "open" && !isInvoiceExpired(invoice)).length,
      draftInvoices: invoices.filter((invoice) => invoice.status === "draft").length,
      paidInvoices: invoices.filter((invoice) => invoice.status === "paid").length,
      cancelledInvoices: invoices.filter((invoice) => invoice.status === "cancelled").length,
      expiredInvoices: invoices.filter((invoice) => isInvoiceExpired(invoice)).length,
      openAmount: invoices
        .filter((invoice) => invoice.status === "open" && !isInvoiceExpired(invoice))
        .reduce((sum, invoice) => sum + invoice.amount, 0),
      paidAmount: invoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    },
  };
};

export const getDirectAdminCommissions = async (): Promise<AdminCommissionsResponse> => {
  const { client } = await ensureAdminUser();
  const commissionRows = await fetchAllRows(async (from, to) =>
    client
      .from("affiliate_commissions")
      .select("id, affiliate_id, order_id, purchase_amount, commission_rate, commission_amount, status, created_at, approved_at, paid_at, reversed_at, reversal_reason")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const affiliateIds = Array.from(new Set(commissionRows.map((commission) => String((commission as Record<string, unknown>).affiliate_id)).filter(Boolean)));
  const orderIds = Array.from(new Set(commissionRows.map((commission) => String((commission as Record<string, unknown>).order_id)).filter(Boolean)));
  const [affiliateMap, orderMap] = await Promise.all([
    getAffiliateLookupMap(client, affiliateIds),
    getOrderReferenceMap(client, orderIds),
  ]);

  const commissions = commissionRows.map((commission) => {
    const record = commission as Record<string, unknown>;
    return {
      id: String(record.id),
      affiliateRecordId: String(record.affiliate_id),
      affiliateId: affiliateMap.get(String(record.affiliate_id))?.affiliateId ?? "Unknown",
      affiliateName: affiliateMap.get(String(record.affiliate_id))?.affiliateName ?? "Unknown affiliate",
      orderId: String(record.order_id),
      orderReference: orderMap.get(String(record.order_id)) ?? null,
      purchaseAmount: Number(record.purchase_amount ?? 0),
      commissionRate: Number(record.commission_rate ?? 0.05),
      commissionAmount: Number(record.commission_amount ?? 0),
      status: String(record.status) as CommissionStatus,
      createdAt: String(record.created_at),
      approvedAt: typeof record.approved_at === "string" ? record.approved_at : null,
      paidAt: typeof record.paid_at === "string" ? record.paid_at : null,
      reversedAt: typeof record.reversed_at === "string" ? record.reversed_at : null,
      reversalReason: typeof record.reversal_reason === "string" ? record.reversal_reason : null,
    } satisfies AdminCommissionRecord;
  });

  return {
    commissions,
    totals: {
      pending: commissions.filter((item) => item.status === "pending").length,
      approved: commissions.filter((item) => item.status === "approved").length,
      paid: commissions.filter((item) => item.status === "paid").length,
      reversed: commissions.filter((item) => item.status === "reversed").length,
    },
  };
};

export const updateDirectCommissionStatus = async (input: CommissionStatusUpdateInput) => {
  const { client } = await ensureAdminUser();
  const updatePayload: Record<string, unknown> = { status: input.status };
  if (input.status === "approved") updatePayload.approved_at = new Date().toISOString();
  if (input.status === "paid") updatePayload.paid_at = new Date().toISOString();
  if (input.status === "reversed" || input.status === "rejected") {
    updatePayload.reversed_at = new Date().toISOString();
    updatePayload.reversal_reason = input.reversalReason ?? "Commission removed by admin.";
  }

  const { error } = await client
    .from("affiliate_commissions")
    .update(updatePayload)
    .eq("id", input.commissionId);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const getDirectAdminPayouts = async (): Promise<AdminPayoutsResponse> => {
  const { client } = await ensureAdminUser();
  const payoutRows = await fetchAllRows(async (from, to) =>
    client
      .from("payouts")
      .select("id, affiliate_id, amount, payment_method, payment_status, commission_ids, notes, created_at, requested_at, approved_at, paid_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const [affiliatesResult, candidatesResult] = await Promise.all([
    client.from("affiliates").select("id, affiliate_id, name"),
    client.from("affiliate_payout_candidates").select("affiliate_pk, affiliate_id, name, preferred_payout_method, available_amount"),
  ]);

  if (affiliatesResult.error || candidatesResult.error) {
    throw new Error("Unable to load payouts.");
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

  return {
    payouts: payoutRows.map((payout) => {
      const record = payout as Record<string, unknown>;
      return {
        id: String(record.id),
        affiliateRecordId: String(record.affiliate_id),
        affiliateId: affiliateMap.get(String(record.affiliate_id))?.affiliateId ?? "Unknown",
        affiliateName: affiliateMap.get(String(record.affiliate_id))?.affiliateName ?? "Unknown affiliate",
        amount: Number(record.amount ?? 0),
        paymentMethod: record.payment_method as AdminPayoutRecord["paymentMethod"],
        paymentStatus: record.payment_status as AdminPayoutRecord["paymentStatus"],
        createdAt: String(record.created_at),
        requestedAt: String(record.requested_at),
        approvedAt: typeof record.approved_at === "string" ? record.approved_at : null,
        paidAt: typeof record.paid_at === "string" ? record.paid_at : null,
        notes: typeof record.notes === "string" ? record.notes : null,
        commissionIds: Array.isArray(record.commission_ids) ? record.commission_ids.map(String) : [],
      } satisfies AdminPayoutRecord;
    }),
    eligibleAffiliates: (candidatesResult.data ?? []).map((candidate) => ({
      id: String(candidate.affiliate_pk),
      affiliateId: String(candidate.affiliate_id),
      affiliateName: String(candidate.name),
      payoutMethod: candidate.preferred_payout_method as AdminPayoutCandidate["payoutMethod"],
      availableAmount: Number(candidate.available_amount ?? 0),
    })),
  };
};

export const getDirectAdminCoupons = async (): Promise<AdminCouponsResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("coupons")
      .select("id, code, label, description, coupon_type, discount_percent, auto_apply, is_active, starts_at, ends_at, usage_count, last_redeemed_at, created_at, updated_at")
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const coupons = rows.map((row) => mapCoupon(row as Record<string, unknown>));

  return {
    coupons,
    totals: {
      totalCoupons: coupons.length,
      activeCoupons: coupons.filter((coupon) => getCouponAvailability(coupon) === "active").length,
      oneTimeCoupons: coupons.filter((coupon) => coupon.couponType === "one_time").length,
      periodicCoupons: coupons.filter((coupon) => coupon.couponType === "periodic").length,
      redeemedCoupons: coupons.filter((coupon) => coupon.couponType === "one_time" && coupon.usageCount > 0).length,
    },
  };
};

export const getDirectAdminCourses = async (): Promise<AdminCoursesResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("courses")
      .select(COURSE_SELECT)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .range(from, to),
  );

  const courses = rows.map((row) => mapCourse(row as Record<string, unknown>));

  return {
    courses,
    totals: {
      totalCourses: courses.length,
      visibleCourses: courses.filter((course) => course.isVisible).length,
      hiddenCourses: courses.filter((course) => !course.isVisible).length,
      discountedCourses: courses.filter((course) => course.discountPercent > 0).length,
    },
  };
};

export const getDirectAdminKnowledgeTestQuestions = async (): Promise<AdminKnowledgeTestQuestionsResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("questions")
      .select(KNOWLEDGE_TEST_QUESTION_SELECT)
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const questions = rows.map((row) => mapKnowledgeTestQuestion(row as Record<string, unknown>));

  return {
    questions,
    totals: {
      totalQuestions: questions.length,
      categoriesCovered: new Set(questions.map((question) => question.category)).size,
      withExplanations: questions.filter((question) => question.explanation?.trim()).length,
      roadSigns: questions.filter((question) => question.category === "road_signs").length,
      rulesOfTheRoad: questions.filter((question) => question.category === "rules_of_the_road").length,
      hazardAwareness: questions.filter((question) => question.category === "hazard_awareness").length,
      safeDriving: questions.filter((question) => question.category === "safe_driving").length,
      roadMarkings: questions.filter((question) => question.category === "road_markings").length,
    },
  };
};

export const submitDirectPayoutAction = async (input: PayoutActionInput) => {
  const { client } = await ensureAdminUser();

  if (input.action === "create") {
    const { data: affiliate, error: affiliateError } = await client
      .from("affiliates")
      .select("id, preferred_payout_method")
      .eq("id", input.affiliateId)
      .maybeSingle();

    if (affiliateError || !affiliate) {
      throw new Error("Affiliate not found.");
    }

    const eligibleCommissions = await getEligiblePayoutCommissions(client, input.affiliateId);
    const totalAmount = eligibleCommissions.reduce((sum, commission) => sum + Number(commission.commission_amount ?? 0), 0);

    if (totalAmount < MIN_PAYOUT_THRESHOLD) {
      throw new Error("minimum_payout_threshold_not_met");
    }

    const { error } = await client.from("payouts").insert({
      affiliate_id: input.affiliateId,
      amount: totalAmount,
      payment_method: affiliate.preferred_payout_method,
      commission_ids: eligibleCommissions.map((commission) => commission.id),
      notes: input.note?.trim() ? input.note.trim() : null,
      payment_status: "pending",
    });

    if (error) {
      throw error;
    }

    return { success: true };
  }

  const { data: payout, error: payoutError } = await client
    .from("payouts")
    .select("id, commission_ids")
    .eq("id", input.payoutId)
    .maybeSingle();

  if (payoutError || !payout) {
    throw new Error("Payout not found.");
  }

  if (input.action === "approve") {
    const { error } = await client
      .from("payouts")
      .update({
        payment_status: "approved",
        approved_at: new Date().toISOString(),
        notes: input.note?.trim() ? input.note.trim() : null,
      })
      .eq("id", input.payoutId);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  if (input.action === "cancel") {
    const { error } = await client
      .from("payouts")
      .update({
        payment_status: "cancelled",
        notes: input.note?.trim() ? input.note.trim() : null,
      })
      .eq("id", input.payoutId);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  const paidAt = new Date().toISOString();
  const { error: updatePayoutError } = await client
    .from("payouts")
    .update({
      payment_status: "paid",
      paid_at: paidAt,
      notes: input.note?.trim() ? input.note.trim() : null,
    })
    .eq("id", input.payoutId);

  if (updatePayoutError) {
    throw updatePayoutError;
  }

  if ((payout.commission_ids ?? []).length > 0) {
    const { error: commissionError } = await client
      .from("affiliate_commissions")
      .update({ status: "paid", paid_at: paidAt })
      .in("id", payout.commission_ids);

    if (commissionError) {
      throw commissionError;
    }
  }

  return { success: true };
};

export const getDirectAdminRateLimits = async (): Promise<AdminRateLimitsResponse> => {
  const { client } = await ensureAdminUser();
  const rows = await fetchAllRows(async (from, to) =>
    client
      .from("edge_rate_limits")
      .select("key, endpoint, window_start, count, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .range(from, to),
  );

  const rateLimits = rows.map((row) => mapRateLimit(row as Record<string, unknown>));
  return {
    rateLimits,
    totals: {
      totalWindows: rateLimits.length,
      flaggedWindows: rateLimits.filter((row) => row.count >= 5).length,
      uniqueEndpoints: new Set(rateLimits.map((row) => row.endpoint)).size,
    },
  };
};


