import type {
  AdminAffiliateUpsertInput,
  AdminCommissionUpsertInput,
  AdminCouponUpsertInput,
  AdminCourseUpsertInput,
  AdminInvoiceUpsertInput,
  AdminKnowledgeTestQuestionUpsertInput,
  AdminLeadUpsertInput,
  AdminOrderUpsertInput,
  AdminPayoutUpsertInput,
  AdminRateLimitUpsertInput,
  AdminReferralUpsertInput,
} from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseClient";

const ensureSupabaseClient = () => {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const ensureAdminClient = async () => {
  const client = ensureSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

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

  return client;
};

const nullableString = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const maybeIsoString = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const syncCommissionPaymentState = async (commissionIds: string[], status: "approved" | "paid", paidAt?: string | null) => {
  if (commissionIds.length === 0) {
    return;
  }

  const client = await ensureAdminClient();
  const payload =
    status === "paid"
      ? { status: "paid", paid_at: paidAt ?? new Date().toISOString() }
      : { status: "approved", paid_at: null };

  const { error } = await client
    .from("affiliate_commissions")
    .update(payload)
    .in("id", commissionIds);

  if (error) {
    throw error;
  }
};

export const saveAdminLead = async (input: AdminLeadUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    lead_type: input.leadType,
    full_name: nullableString(input.fullName),
    email: nullableString(input.email),
    phone: nullableString(input.phone),
    source_page: input.sourcePage.trim(),
    status: input.status,
    payload: input.payload,
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("leads").update(payload).eq("id", input.id)
    : client.from("leads").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminLead = async (leadId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("leads").delete().eq("id", leadId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminAffiliate = async (input: AdminAffiliateUpsertInput) => {
  const client = await ensureAdminClient();
  const payload: Record<string, unknown> = {
    auth_user_id: nullableString(input.authUserId),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: nullableString(input.phone),
    age: typeof input.age === "number" ? input.age : null,
    guardian_name: nullableString(input.guardianName),
    guardian_email: nullableString(input.guardianEmail)?.toLowerCase() ?? null,
    guardian_phone: nullableString(input.guardianPhone),
    guardian_consent: Boolean(input.guardianConsent),
    social_media_link: nullableString(input.socialMediaLink),
    preferred_payout_method: input.preferredPayoutMethod,
    status: input.status,
    commission_rate: input.commissionRate,
    cookie_duration_days: input.cookieDurationDays,
    notes: nullableString(input.notes),
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
    ...(input.approvedAt ? { approved_at: input.approvedAt } : {}),
    ...(input.blockedAt ? { blocked_at: input.blockedAt } : {}),
  };

  const affiliateCode = nullableString(input.affiliateCode);
  if (affiliateCode) {
    payload.affiliate_id = affiliateCode;
  }

  const query = input.id
    ? client.from("affiliates").update(payload).eq("id", input.id)
    : client.from("affiliates").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminAffiliate = async (affiliateId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("affiliates").delete().eq("id", affiliateId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminReferral = async (input: AdminReferralUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    affiliate_id: input.affiliateRecordId,
    referral_code: input.referralCode.trim(),
    landing_path: input.landingPath.trim(),
    ip_address: nullableString(input.ipAddress),
    user_agent: nullableString(input.userAgent),
    fingerprint_hash: nullableString(input.fingerprintHash),
    is_suspicious: input.isSuspicious,
    suspicion_reason: input.isSuspicious ? nullableString(input.suspicionReason) : null,
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("affiliate_clicks").update(payload).eq("id", input.id)
    : client.from("affiliate_clicks").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminReferral = async (referralId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("affiliate_clicks").delete().eq("id", referralId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminOrder = async (input: AdminOrderUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    external_order_id: nullableString(input.externalOrderId),
    customer_id: nullableString(input.customerId),
    customer_email: nullableString(input.customerEmail),
    package_name: input.packageName.trim(),
    amount: input.amount,
    payment_status: input.paymentStatus,
    affiliate_id: nullableString(input.affiliateRecordId ?? undefined),
    affiliate_click_id: nullableString(input.affiliateClickId ?? undefined),
    referral_code: nullableString(input.referralCode),
    customer_ip: nullableString(input.customerIp),
    customer_user_agent: nullableString(input.customerUserAgent),
    fingerprint_hash: nullableString(input.fingerprintHash),
    is_self_referral: input.isSelfReferral,
    is_suspicious: input.isSuspicious,
    fraud_flags: input.fraudFlags,
    metadata: input.metadata,
    purchased_at: maybeIsoString(input.purchasedAt),
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("orders").update(payload).eq("id", input.id)
    : client.from("orders").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminOrder = async (orderId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("orders").delete().eq("id", orderId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminInvoice = async (input: AdminInvoiceUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    ...(input.publicToken ? { public_token: input.publicToken } : {}),
    title: input.title.trim(),
    description: nullableString(input.description),
    amount: input.amount,
    currency: (input.currency?.trim().toUpperCase() ?? "CAD"),
    customer_name: nullableString(input.customerName),
    customer_email: nullableString(input.customerEmail)?.toLowerCase() ?? null,
    status: input.status,
    expires_at: maybeIsoString(input.expiresAt),
    paid_at: maybeIsoString(input.paidAt),
    last_order_id: nullableString(input.lastOrderId),
    metadata: input.metadata,
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("checkout_invoices").update(payload).eq("id", input.id)
    : client.from("checkout_invoices").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminInvoice = async (invoiceId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("checkout_invoices").delete().eq("id", invoiceId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminCommission = async (input: AdminCommissionUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    affiliate_id: input.affiliateRecordId,
    order_id: input.orderId,
    purchase_amount: input.purchaseAmount,
    commission_rate: input.commissionRate,
    commission_amount: input.commissionAmount,
    status: input.status,
    reversal_reason: nullableString(input.reversalReason),
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
    approved_at: maybeIsoString(input.approvedAt),
    paid_at: maybeIsoString(input.paidAt),
    reversed_at: maybeIsoString(input.reversedAt),
  };

  const query = input.id
    ? client.from("affiliate_commissions").update(payload).eq("id", input.id)
    : client.from("affiliate_commissions").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminCommission = async (commissionId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("affiliate_commissions").delete().eq("id", commissionId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminPayout = async (input: AdminPayoutUpsertInput) => {
  const client = await ensureAdminClient();
  const previous = input.id
    ? await client
        .from("payouts")
        .select("commission_ids, payment_status")
        .eq("id", input.id)
        .maybeSingle()
    : { data: null, error: null };

  if (previous.error) {
    throw previous.error;
  }

  const payload = {
    affiliate_id: input.affiliateRecordId,
    amount: input.amount,
    payment_method: input.paymentMethod,
    payment_status: input.paymentStatus,
    commission_ids: input.commissionIds,
    notes: nullableString(input.notes),
    requested_at: maybeIsoString(input.requestedAt) ?? new Date().toISOString(),
    approved_at: maybeIsoString(input.approvedAt),
    paid_at: maybeIsoString(input.paidAt),
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("payouts").update(payload).eq("id", input.id)
    : client.from("payouts").insert(payload);

  const { error } = await query;
  if (error) throw error;

  const previousCommissionIds = (previous.data?.commission_ids ?? []).map(String);
  if (previousCommissionIds.length > 0 && input.paymentStatus !== "paid") {
    await syncCommissionPaymentState(previousCommissionIds, "approved");
  }

  if (input.commissionIds.length > 0 && input.paymentStatus === "paid") {
    await syncCommissionPaymentState(input.commissionIds, "paid", input.paidAt);
  }

  return { success: true };
};

export const deleteAdminPayout = async (payoutId: string) => {
  const client = await ensureAdminClient();
  const { data: payout, error: payoutError } = await client
    .from("payouts")
    .select("commission_ids")
    .eq("id", payoutId)
    .maybeSingle();

  if (payoutError) {
    throw payoutError;
  }

  const { error } = await client.from("payouts").delete().eq("id", payoutId);
  if (error) throw error;

  const commissionIds = (payout?.commission_ids ?? []).map(String);
  if (commissionIds.length > 0) {
    await syncCommissionPaymentState(commissionIds, "approved");
  }

  return { success: true };
};

export const saveAdminRateLimit = async (input: AdminRateLimitUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    key: input.key,
    endpoint: input.endpoint.trim(),
    window_start: input.windowStart,
    count: input.count,
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
    updated_at: input.updatedAt ?? new Date().toISOString(),
  };

  if (input.originalKey) {
    const { error } = await client
      .from("edge_rate_limits")
      .update(payload)
      .eq("key", input.originalKey);

    if (error) throw error;
    return { success: true };
  }

  const { error } = await client.from("edge_rate_limits").insert(payload);
  if (error) throw error;
  return { success: true };
};

export const deleteAdminRateLimit = async (key: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("edge_rate_limits").delete().eq("key", key);
  if (error) throw error;
  return { success: true };
};

export const saveAdminCoupon = async (input: AdminCouponUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    code: input.code.trim().toUpperCase(),
    label: input.label.trim(),
    description: nullableString(input.description),
    coupon_type: input.couponType,
    discount_percent: input.discountPercent,
    auto_apply: input.autoApply,
    is_active: input.isActive,
    starts_at: maybeIsoString(input.startsAt),
    ends_at: maybeIsoString(input.endsAt),
    usage_count: input.usageCount,
    last_redeemed_at: maybeIsoString(input.lastRedeemedAt),
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("coupons").update(payload).eq("id", input.id)
    : client.from("coupons").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminCoupon = async (couponId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("coupons").delete().eq("id", couponId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminCourse = async (input: AdminCourseUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    level: input.level,
    delivery_format: input.deliveryFormat,
    duration: input.duration.trim(),
    detail: input.detail.trim(),
    description: input.description.trim(),
    highlights: input.highlights,
    tone: input.tone.trim(),
    image: input.image.trim(),
    quiz_tags: input.quizTags,
    fixed_price: input.fixedPrice ?? null,
    sixty_minute_classes: input.sixtyMinuteClasses,
    ninety_minute_classes: input.ninetyMinuteClasses,
    discount_percent: input.discountPercent,
    is_visible: input.isVisible,
    display_order: input.displayOrder,
  };

  const query = input.recordId
    ? client.from("courses").update(payload).eq("id", input.recordId)
    : client.from("courses").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const deleteAdminCourse = async (recordId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("courses").delete().eq("id", recordId);
  if (error) throw error;
  return { success: true };
};

export const saveAdminKnowledgeTestQuestion = async (input: AdminKnowledgeTestQuestionUpsertInput) => {
  const client = await ensureAdminClient();
  const payload = {
    question_text: input.questionText.trim(),
    option_a: input.optionA.trim(),
    option_b: input.optionB.trim(),
    option_c: input.optionC.trim(),
    option_d: input.optionD.trim(),
    correct_option: input.correctOption,
    explanation: nullableString(input.explanation),
    category: input.category,
    ...(input.createdAt ? { created_at: input.createdAt } : {}),
  };

  const query = input.id
    ? client.from("questions").update(payload).eq("id", input.id)
    : client.from("questions").insert(payload);

  const { error } = await query;
  if (error) throw error;
  return { success: true };
};

export const importAdminKnowledgeTestQuestions = async (inputs: AdminKnowledgeTestQuestionUpsertInput[]) => {
  if (inputs.length === 0) {
    return { success: true, inserted: 0, updated: 0 };
  }

  const client = await ensureAdminClient();
  const BATCH_SIZE = 100;
  const payloads = inputs.map((input) => ({
    id: input.id,
    question_text: input.questionText.trim(),
    option_a: input.optionA.trim(),
    option_b: input.optionB.trim(),
    option_c: input.optionC.trim(),
    option_d: input.optionD.trim(),
    correct_option: input.correctOption,
    explanation: nullableString(input.explanation),
    category: input.category,
    created_at: input.createdAt ?? undefined,
  }));

  const withId = payloads.filter((payload) => payload.id);
  const withoutId = payloads
    .filter((payload) => !payload.id)
    .map(({ id, ...payload }) => payload);

  for (let index = 0; index < withId.length; index += BATCH_SIZE) {
    const batch = withId.slice(index, index + BATCH_SIZE);
    const { error } = await client.from("questions").upsert(batch, { onConflict: "id" });
    if (error) throw error;
  }

  for (let index = 0; index < withoutId.length; index += BATCH_SIZE) {
    const batch = withoutId.slice(index, index + BATCH_SIZE);
    const { error } = await client.from("questions").insert(batch);
    if (error) throw error;
  }

  return {
    success: true,
    inserted: withoutId.length,
    updated: withId.length,
  };
};

export const deleteAdminKnowledgeTestQuestion = async (questionId: string) => {
  const client = await ensureAdminClient();
  const { error } = await client.from("questions").delete().eq("id", questionId);
  if (error) throw error;
  return { success: true };
};
