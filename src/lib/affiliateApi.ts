import {
  buildAffiliateReferralLink,
  normalizeAffiliateCode,
} from "@/lib/affiliateProgram";
import {
  getDirectAdminCoupons,
  getDirectAdminCourses,
  getDirectAdminAffiliates,
  getDirectAdminCommissions,
  getDirectAdminDashboard,
  getDirectAdminInvoices,
  getDirectAdminKnowledgeTestQuestions,
  getDirectAdminLeads,
  getDirectAdminOrders,
  getDirectAdminPayouts,
  getDirectAdminRateLimits,
  getDirectAdminReferrals,
  submitDirectPayoutAction,
  updateDirectAffiliateDetails,
  updateDirectAffiliateStatus,
  updateDirectCommissionStatus,
  updateDirectLeadStatus,
} from "@/lib/adminApiDirect";
import type { User } from "@supabase/supabase-js";
import type {
  AdminDashboardResponse,
  AdminAffiliatesResponse,
  AdminCouponsResponse,
  AdminCommissionsResponse,
  AdminCoursesResponse,
  AdminInvoicesResponse,
  AdminLeadsResponse,
  AdminKnowledgeTestQuestionsResponse,
  AdminOrdersResponse,
  AdminPayoutsResponse,
  AdminRateLimitsResponse,
  AdminReferralsResponse,
  AdminSessionResponse,
  AffiliateDetailsUpdateInput,
  CommissionStatus,
  AffiliateProfile,
  AffiliateDashboardResponse,
  AffiliateRegistrationInput,
  AffiliateRegistrationResult,
  AffiliateStatusUpdateInput,
  CommissionStatusUpdateInput,
  LeadStatusUpdateInput,
  PaymentStatus,
  PayoutActionInput,
  PayoutStatus,
  PreferredPayoutMethod,
  PurchaseCommissionInput,
  PurchaseCommissionResult,
  ReferralTrackingResult,
} from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseClient";

const AFFILIATE_API_FUNCTION = "affiliate-api";

const ensureSupabase = () => {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const getAffiliateApiBaseUrl = () => `${supabaseUrl!.replace(/\/$/, "")}/functions/v1/${AFFILIATE_API_FUNCTION}`;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const EXISTING_AFFILIATE_ACCOUNT_MESSAGE =
  "An account with this email already exists. Please sign in instead.";

const mapAffiliateClientError = (error: unknown, fallback: string, serviceName: string) => {
  if (error instanceof Error) {
    if (/failed to fetch/i.test(error.message)) {
      return new Error(`Unable to reach ${serviceName}. Check your Supabase configuration, network connection, and browser extensions blocking requests.`);
    }

    return error;
  }

  return new Error(fallback);
};

const isExistingAffiliateSignUpError = (error: unknown) =>
  error instanceof Error &&
  /user already registered|already registered|already exists|duplicate/i.test(error.message);

const isAffiliateApiUnavailable = (error: unknown) =>
  error instanceof Error &&
  (
    /unable to reach .*affiliate api/i.test(error.message) ||
    /affiliate_api_not_configured/i.test(error.message) ||
    /route_not_found/i.test(error.message) ||
    /origin not allowed/i.test(error.message) ||
    /authentication_required/i.test(error.message) ||
    /invalid jwt|jwt expired/i.test(error.message)
  );

const getAuthHeaders = async (authenticated: boolean) => {
  const headers = new Headers({
    apikey: supabaseAnonKey!,
  });

  if (authenticated) {
    const client = ensureSupabase();
    const { data } = await client.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      throw new Error("You must be signed in to continue.");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

const requestAffiliateApi = async <T>(
  path: string,
  {
    method = "GET",
    body,
    authenticated = true,
  }: {
    method?: "GET" | "POST";
    body?: unknown;
    authenticated?: boolean;
  } = {},
) => {
  ensureSupabase();

  const headers = await getAuthHeaders(authenticated);
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${getAffiliateApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw mapAffiliateClientError(
      error,
      "Affiliate request failed.",
      "the affiliate API. Deploy the Supabase edge function and allow this site origin in ALLOWED_ORIGINS",
    );
  }

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Affiliate request failed.");
  }

  return payload as T;
};

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
  preferredPayoutMethod: row.preferred_payout_method as AffiliateProfile["preferredPayoutMethod"],
  status: row.status as AffiliateProfile["status"],
  commissionRate: Number(row.commission_rate ?? 0.05),
  cookieDurationDays: Number(row.cookie_duration_days ?? 30),
  createdAt: String(row.created_at),
  approvedAt: typeof row.approved_at === "string" ? row.approved_at : null,
  blockedAt: typeof row.blocked_at === "string" ? row.blocked_at : null,
});

const normalizePreferredPayoutMethod = (value: unknown): PreferredPayoutMethod =>
  value === "paypal" || value === "interac" ? value : "bank_transfer";

const normalizeOptionalText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const normalizeOptionalEmail = (value: unknown) => normalizeOptionalText(value)?.toLowerCase() ?? null;

const normalizeAffiliateAge = (value: unknown) => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  }

  return null;
};

const normalizeBooleanFlag = (value: unknown) => value === true || value === "true" || value === "1";

const buildAffiliateProfilePayload = (user: User) => {
  const age = normalizeAffiliateAge(user.user_metadata?.age);
  const isMinor = age !== null && age < 18;
  const guardianName = normalizeOptionalText(user.user_metadata?.guardian_name);
  const guardianEmail = normalizeOptionalEmail(user.user_metadata?.guardian_email);
  const guardianPhone = normalizeOptionalText(user.user_metadata?.guardian_phone);
  const guardianConsent = normalizeBooleanFlag(user.user_metadata?.guardian_consent);
  const guardianConsentTimestamp =
    typeof user.user_metadata?.guardian_consent_timestamp === "string"
      ? user.user_metadata.guardian_consent_timestamp
      : null;

  return {
    auth_user_id: user.id,
    name:
      typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim().length > 0
        ? user.user_metadata.full_name.trim()
        : (user.email?.split("@")[0] ?? "Affiliate"),
    email: user.email?.trim().toLowerCase() ?? "",
    phone:
      typeof user.user_metadata?.phone === "string" && user.user_metadata.phone.trim().length > 0
        ? user.user_metadata.phone.trim()
        : null,
    age,
    guardian_name: isMinor ? guardianName : null,
    guardian_email: isMinor ? guardianEmail : null,
    guardian_phone: isMinor ? guardianPhone : null,
    guardian_consent: isMinor ? guardianConsent : false,
    guardian_consent_timestamp: isMinor && guardianConsent ? guardianConsentTimestamp : null,
    social_media_link:
      typeof user.user_metadata?.social_media_link === "string" && user.user_metadata.social_media_link.trim().length > 0
        ? user.user_metadata.social_media_link.trim()
        : null,
    preferred_payout_method: normalizePreferredPayoutMethod(user.user_metadata?.preferred_payout_method),
  };
};

const ensureAffiliateProfileRecord = async (client: NonNullable<typeof supabase>, user: User) => {
  const { data: existingAffiliate, error: existingAffiliateError } = await client
    .from("affiliates")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existingAffiliateError) {
    throw existingAffiliateError;
  }

  if (existingAffiliate) {
    return mapAffiliateProfile(existingAffiliate as Record<string, unknown>);
  }

  if (user.user_metadata?.role !== "affiliate") {
    throw new Error("This account is not marked as an affiliate account.");
  }

  const { data: createdAffiliate, error: createdAffiliateError } = await client
    .from("affiliates")
    .upsert(buildAffiliateProfilePayload(user), { onConflict: "auth_user_id" })
    .select("*")
    .single();

  if (createdAffiliateError) {
    throw createdAffiliateError;
  }

  return mapAffiliateProfile(createdAffiliate as Record<string, unknown>);
};

const ensureAuthenticatedUser = async (client: NonNullable<typeof supabase>) => {
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

const getAdminUserFlag = async (client: NonNullable<typeof supabase>, userId: string) => {
  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
};

const getDirectAffiliateDashboardData = async (): Promise<AffiliateDashboardResponse> => {
  const client = ensureSupabase();
  const user = await ensureAuthenticatedUser(client);

  const affiliate = await ensureAffiliateProfileRecord(client, user);

  const [
    clicksCountResult,
    orderTotalsResult,
    commissionTotalsResult,
    orderListResult,
    commissionListResult,
    payoutListResult,
  ] = await Promise.all([
    client.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("affiliate_id", affiliate.id),
    client.from("orders").select("amount, payment_status").eq("affiliate_id", affiliate.id),
    client.from("affiliate_commissions").select("commission_amount, status").eq("affiliate_id", affiliate.id),
    client
      .from("orders")
      .select("id, external_order_id, package_name, amount, payment_status, referral_code, is_suspicious, fraud_flags, created_at, purchased_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50),
    client
      .from("affiliate_commissions")
      .select("id, order_id, purchase_amount, commission_amount, status, created_at, approved_at, paid_at, reversed_at, reversal_reason")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(50),
    client
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
    throw new Error("Unable to load affiliate dashboard data from Supabase.");
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
    ? await client.from("orders").select("id, external_order_id").in("id", orderLookupIds)
    : { data: [], error: null };

  if (orderLookupResult.error) {
    throw new Error("Unable to resolve commission order references.");
  }

  const orderReferenceMap = new Map(
    (orderLookupResult.data ?? []).map((order) => [String(order.id), order.external_order_id as string | null]),
  );

  return {
    affiliate,
    referralLink: buildDashboardReferralLink(affiliate.affiliateId),
    stats: {
      totalClicks: clicksCountResult.count ?? 0,
      totalPurchases,
      totalRevenue,
      totalCommission,
      pendingPayout: approvedCommission,
      approvedCommission,
      minimumPayout: 50,
    },
    orders: (orderListResult.data ?? []).map((order) => ({
      id: String(order.id),
      externalOrderId: typeof order.external_order_id === "string" ? order.external_order_id : null,
      packageName: String(order.package_name),
      amount: Number(order.amount ?? 0),
      paymentStatus: order.payment_status as PaymentStatus,
      createdAt: String(order.created_at),
      purchasedAt: typeof order.purchased_at === "string" ? order.purchased_at : null,
      referralCode: typeof order.referral_code === "string" ? order.referral_code : null,
      isSuspicious: Boolean(order.is_suspicious),
      fraudFlags: Array.isArray(order.fraud_flags) ? order.fraud_flags.map(String) : [],
    })),
    commissions: (commissionListResult.data ?? []).map((commission) => ({
      id: String(commission.id),
      orderId: String(commission.order_id),
      orderReference: orderReferenceMap.get(String(commission.order_id)) ?? null,
      commissionAmount: Number(commission.commission_amount ?? 0),
      purchaseAmount: Number(commission.purchase_amount ?? 0),
      status: commission.status as CommissionStatus,
      createdAt: String(commission.created_at),
      approvedAt: typeof commission.approved_at === "string" ? commission.approved_at : null,
      paidAt: typeof commission.paid_at === "string" ? commission.paid_at : null,
      reversedAt: typeof commission.reversed_at === "string" ? commission.reversed_at : null,
      reversalReason: typeof commission.reversal_reason === "string" ? commission.reversal_reason : null,
    })),
    payouts: (payoutListResult.data ?? []).map((payout) => ({
      id: String(payout.id),
      amount: Number(payout.amount ?? 0),
      paymentMethod: payout.payment_method as PreferredPayoutMethod,
      paymentStatus: payout.payment_status as PayoutStatus,
      createdAt: String(payout.created_at),
      requestedAt: String(payout.requested_at),
      approvedAt: typeof payout.approved_at === "string" ? payout.approved_at : null,
      paidAt: typeof payout.paid_at === "string" ? payout.paid_at : null,
      notes: typeof payout.notes === "string" ? payout.notes : null,
    })),
  };
};

const getDirectAdminSession = async (): Promise<AdminSessionResponse> => {
  const client = ensureSupabase();
  const user = await ensureAuthenticatedUser(client);
  return {
    isAdmin: await getAdminUserFlag(client, user.id),
  };
};

const waitForAffiliateProfile = async (client: NonNullable<typeof supabase>, userId: string) => {
  for (const retryDelay of [0, 250, 500, 1000]) {
    if (retryDelay > 0) {
      await delay(retryDelay);
    }

    const { data, error } = await client
      .from("affiliates")
      .select("*")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return mapAffiliateProfile(data as Record<string, unknown>);
    }
  }

  return null;
};

export const registerAffiliate = async (input: AffiliateRegistrationInput): Promise<AffiliateRegistrationResult> => {
  const client = ensureSupabase();
  const email = input.email.trim().toLowerCase();
  const isMinor = input.age < 18;

  try {
    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email,
      password: input.password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/affiliate/login` : undefined,
        data: {
          role: "affiliate",
          full_name: input.name.trim(),
          phone: input.phone.trim(),
          age: input.age,
          guardian_name: isMinor ? input.guardianName?.trim() || null : null,
          guardian_email: isMinor ? input.guardianEmail?.trim().toLowerCase() || null : null,
          guardian_phone: isMinor ? input.guardianPhone?.trim() || null : null,
          guardian_consent: isMinor ? Boolean(input.guardianConsent) : false,
          guardian_consent_timestamp:
            isMinor && input.guardianConsent ? input.guardianConsentTimestamp ?? input.acceptedReferralTermsAt : null,
          social_media_link: input.socialMediaLink?.trim() || null,
          preferred_payout_method: input.preferredPayoutMethod,
          referral_terms_accepted_at: input.acceptedReferralTermsAt,
          referral_terms_version: input.acceptedReferralTermsVersion,
          privacy_consent_accepted_at: input.acceptedPrivacyConsentAt,
        },
      },
    });

    if (signUpError) {
      if (isExistingAffiliateSignUpError(signUpError)) {
        console.warn("Affiliate signup blocked because the account already exists.", { email });
        throw new Error(EXISTING_AFFILIATE_ACCOUNT_MESSAGE);
      }

      throw signUpError;
    }
    if (!signUpData.user) {
      throw new Error("Unable to create affiliate account.");
    }

    const requiresEmailConfirmation = !signUpData.session;

    // Supabase can return an obfuscated successful response for an already-registered email.
    if (requiresEmailConfirmation && (signUpData.user.identities?.length ?? 0) === 0) {
      console.warn("Affiliate signup blocked because the account already exists.", { email });
      throw new Error(EXISTING_AFFILIATE_ACCOUNT_MESSAGE);
    }
    const affiliate = requiresEmailConfirmation
      ? null
      : (await waitForAffiliateProfile(client, signUpData.user.id)) ?? await ensureAffiliateProfileRecord(client, signUpData.user);

    if (!requiresEmailConfirmation && !affiliate) {
      await client.auth.signOut();
      throw new Error("Affiliate profile was not created. Apply the latest Supabase schema and try again.");
    }

    return {
      affiliate,
      referralLink: affiliate
        ? buildAffiliateReferralLink(
            typeof window !== "undefined" ? window.location.origin : "https://www.drivingschoolbc.ca",
            affiliate.affiliateId,
          )
        : null,
      requiresEmailConfirmation,
      email,
    };
  } catch (error) {
    throw mapAffiliateClientError(error, "Unable to create affiliate account.", "Supabase Auth");
  }
};

export const signInAffiliate = async (email: string, password: string) => {
  const client = ensureSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  if (!data.user) {
    throw new Error("Unable to sign in.");
  }

  const existingAffiliate = await waitForAffiliateProfile(client, data.user.id);
  if (existingAffiliate) {
    return;
  }

  if (data.user.user_metadata?.role === "affiliate") {
    await ensureAffiliateProfileRecord(client, data.user);
    return;
  }

  await client.auth.signOut().catch(() => undefined);
  throw new Error("This account does not have affiliate access.");
};

export const signInAdmin = async (email: string, password: string) => {
  const client = ensureSupabase();
  const { error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    await client.auth.signOut().catch(() => undefined);
    throw userError ?? new Error("Unable to verify admin session.");
  }

  const isAdmin = await getAdminUserFlag(client, user.id);
  if (!isAdmin) {
    await client.auth.signOut().catch(() => undefined);
    throw new Error("This account does not have admin access.");
  }
};

export const signOutAffiliate = async () => {
  const client = ensureSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
};

export const signOutAdmin = signOutAffiliate;

export const trackAffiliateReferral = async (input: {
  referralCode: string;
  landingPath: string;
  fingerprintHash: string | null;
}) => {
  const params = new URLSearchParams();
  params.set("ref", normalizeAffiliateCode(input.referralCode));
  params.set("path", input.landingPath);
  if (input.fingerprintHash) {
    params.set("fingerprint", input.fingerprintHash);
  }

  return requestAffiliateApi<ReferralTrackingResult>(`/referral/track?${params.toString()}`, {
    authenticated: false,
  });
};

export const getAffiliateDashboardData = async () => {
  try {
    return await requestAffiliateApi<AffiliateDashboardResponse>("/affiliate/stats");
  } catch (error) {
    if (!isAffiliateApiUnavailable(error)) {
      throw error;
    }

    return getDirectAffiliateDashboardData();
  }
};

export const getAdminSession = async () => {
  return getDirectAdminSession();
};

export const getAdminDashboard = async () => {
  return getDirectAdminDashboard();
};

export const getAdminAffiliates = async () => {
  return getDirectAdminAffiliates();
};

export const getAdminCoupons = async () => {
  return getDirectAdminCoupons() as Promise<AdminCouponsResponse>;
};

export const getAdminCourses = async () => {
  return getDirectAdminCourses() as Promise<AdminCoursesResponse>;
};

export const getAdminKnowledgeTestQuestions = async () => {
  return getDirectAdminKnowledgeTestQuestions() as Promise<AdminKnowledgeTestQuestionsResponse>;
};

export const updateAffiliateStatus = async (input: AffiliateStatusUpdateInput) => {
  return updateDirectAffiliateStatus(input);
};

export const updateAffiliateDetails = async (input: AffiliateDetailsUpdateInput) => {
  return updateDirectAffiliateDetails(input);
};

export const getAdminLeads = async () => {
  return getDirectAdminLeads();
};

export const updateLeadStatus = async (input: LeadStatusUpdateInput) => {
  return updateDirectLeadStatus(input);
};

export const getAdminReferrals = async () => {
  return getDirectAdminReferrals();
};

export const getAdminOrders = async () => {
  return getDirectAdminOrders();
};

export const getAdminInvoices = async () => {
  return getDirectAdminInvoices() as Promise<AdminInvoicesResponse>;
};

export const getAdminCommissions = async () => {
  return getDirectAdminCommissions();
};

export const updateCommissionStatus = async (input: CommissionStatusUpdateInput) => {
  return updateDirectCommissionStatus(input);
};

export const getAdminPayouts = async () => {
  return getDirectAdminPayouts();
};

export const getAdminRateLimits = async () => {
  return getDirectAdminRateLimits();
};

export const submitPayoutAction = async (input: PayoutActionInput) => {
  return submitDirectPayoutAction(input);
};

export const recordAffiliatePurchase = (input: PurchaseCommissionInput) =>
  requestAffiliateApi<PurchaseCommissionResult>("/commission/create", {
    method: "POST",
    body: input,
    authenticated: false,
  });

export const buildDashboardReferralLink = (affiliateCode: string) =>
  buildAffiliateReferralLink(
    typeof window !== "undefined" ? window.location.origin : "https://www.drivingschoolbc.ca",
    affiliateCode,
  );










