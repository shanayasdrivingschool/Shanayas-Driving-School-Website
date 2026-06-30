import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, readAllowedOrigins } from "../_shared/cors.ts";

type CaptchaProvider = "turnstile" | "recaptcha";

type CheckoutInsert = {
  address_line1: string;
  city: string;
  country: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  postal_code: string;
  province: string;
  source_page: string;
  package_name: string;
  amount: number;
  invoice_token: string | null;
  metadata: Record<string, unknown>;
  captcha_provider: CaptchaProvider | null;
  captcha_token: string | null;
  captcha_action: string | null;
};

const MAX_TEXT = {
  address_line1: 240,
  city: 120,
  country: 2,
  full_name: 180,
  email: 200,
  phone: 80,
  postal_code: 24,
  province: 120,
  source_page: 140,
  package_name: 240,
  captcha_action: 64,
} as const;

const MAX_METADATA_BYTES = 64_000;
const MAX_CAPTCHA_TOKEN = 5000;
const RATE_LIMIT_FUNCTION = "check_submit_lead_rate_limit";
const SUBMIT_CHECKOUT_FUNCTION = "submit_checkout_record";
const inMemoryRateLimits = new Map<string, { windowStartMs: number; count: number }>();

const CAPTCHA_REQUIRED = (Deno.env.get("CAPTCHA_REQUIRED") ?? "false").trim().toLowerCase() === "true";
const CAPTCHA_PROVIDER = (Deno.env.get("CAPTCHA_PROVIDER") ?? "").trim().toLowerCase();
const TURNSTILE_SECRET_KEY = (Deno.env.get("TURNSTILE_SECRET_KEY") ?? "").trim();
const RECAPTCHA_SECRET_KEY = (Deno.env.get("RECAPTCHA_SECRET_KEY") ?? "").trim();
const RECAPTCHA_MIN_SCORE = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") ?? "0.5");
const RATE_LIMIT_WINDOW_SECONDS = Math.max(1, Number(Deno.env.get("RATE_LIMIT_WINDOW_SECONDS") ?? "60"));
const RATE_LIMIT_MAX_REQUESTS = Math.max(1, Number(Deno.env.get("RATE_LIMIT_MAX_REQUESTS") ?? "8"));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const configuredOrigins = readAllowedOrigins();

const jsonResponse = (status: number, body: Record<string, unknown>, corsHeaders: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });

const asOptionalString = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
};

const asRequiredString = (value: unknown, maxLength: number, errorMessage: string) => {
  const normalized = asOptionalString(value, maxLength);
  if (!normalized) {
    throw new Error(errorMessage);
  }

  return normalized;
};

const asCountryCode = (value: unknown) => {
  const normalized = asRequiredString(value, MAX_TEXT.country, "invalid_country").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error("invalid_country");
  }

  return normalized;
};

const asRequiredNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error("invalid_amount");
};

const asOptionalUuid = (value: unknown, errorMessage: string) => {
  const normalized = asOptionalString(value, 64);
  if (!normalized) {
    return null;
  }

  if (!UUID_PATTERN.test(normalized)) {
    throw new Error(errorMessage);
  }

  return normalized;
};

const normalizeCaptchaProvider = (value: string | null): CaptchaProvider | null => {
  if (value === "turnstile" || value === "recaptcha") return value;
  return null;
};

const getClientIp = (request: Request): string => {
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

  return "unknown";
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(digest);
};

const asMetadataObject = (value: unknown): Record<string, unknown> => {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("metadata_must_be_object");
  }

  const serialized = JSON.stringify(value);
  if (serialized.length > MAX_METADATA_BYTES) {
    throw new Error("metadata_too_large");
  }

  return value as Record<string, unknown>;
};

const asCheckoutInsert = (value: unknown): CheckoutInsert => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("invalid_body");
  }

  const record = value as Record<string, unknown>;
  const sourcePage = asOptionalString(record.source_page, MAX_TEXT.source_page);
  if (!sourcePage || !sourcePage.startsWith("/")) {
    throw new Error("invalid_source_page");
  }

  const packageName = asOptionalString(record.package_name, MAX_TEXT.package_name);
  if (!packageName) {
    throw new Error("invalid_package_name");
  }

  const amount = asRequiredNumber(record.amount);
  if (amount < 0) {
    throw new Error("invalid_amount");
  }

  const captchaProvider = normalizeCaptchaProvider(asOptionalString(record.captcha_provider, 32)?.toLowerCase() ?? null);
  const captchaToken = asOptionalString(record.captcha_token, MAX_CAPTCHA_TOKEN);
  const captchaAction = asOptionalString(record.captcha_action, MAX_TEXT.captcha_action);
  if (captchaAction && !/^[a-zA-Z0-9:_-]+$/.test(captchaAction)) {
    throw new Error("invalid_captcha_action");
  }
  if (captchaToken && !captchaProvider) {
    throw new Error("captcha_provider_missing");
  }

  return {
    address_line1: asRequiredString(record.address_line1, MAX_TEXT.address_line1, "invalid_address_line1"),
    city: asRequiredString(record.city, MAX_TEXT.city, "invalid_city"),
    country: asCountryCode(record.country),
    full_name: asOptionalString(record.full_name, MAX_TEXT.full_name),
    email: asOptionalString(record.email, MAX_TEXT.email)?.toLowerCase() ?? null,
    phone: asOptionalString(record.phone, MAX_TEXT.phone),
    postal_code: asRequiredString(record.postal_code, MAX_TEXT.postal_code, "invalid_postal_code"),
    province: asRequiredString(record.province, MAX_TEXT.province, "invalid_province"),
    source_page: sourcePage,
    package_name: packageName,
    amount,
    invoice_token: asOptionalUuid(record.invoice_token, "invalid_invoice_token"),
    metadata: asMetadataObject(record.metadata),
    captcha_provider: captchaProvider,
    captcha_token: captchaToken,
    captcha_action: captchaAction,
  };
};

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
  metadata: Record<string, unknown> | null;
};

type CaptchaVerifyResult = {
  ok: boolean;
  reason?: string;
};

const verifyTurnstile = async (token: string, clientIp: string, expectedAction: string | null): Promise<CaptchaVerifyResult> => {
  if (!TURNSTILE_SECRET_KEY) {
    return { ok: false, reason: "turnstile_secret_missing" };
  }

  const body = new URLSearchParams();
  body.set("secret", TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (clientIp !== "unknown") {
    body.set("remoteip", clientIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    return { ok: false, reason: "turnstile_request_failed" };
  }

  const payload = (await response.json()) as {
    success?: boolean;
    action?: string;
  };

  if (!payload.success) {
    return { ok: false, reason: "turnstile_failed" };
  }

  if (expectedAction && payload.action && payload.action !== expectedAction) {
    return { ok: false, reason: "turnstile_action_mismatch" };
  }

  return { ok: true };
};

const verifyRecaptcha = async (token: string, clientIp: string, expectedAction: string | null): Promise<CaptchaVerifyResult> => {
  if (!RECAPTCHA_SECRET_KEY) {
    return { ok: false, reason: "recaptcha_secret_missing" };
  }

  const body = new URLSearchParams();
  body.set("secret", RECAPTCHA_SECRET_KEY);
  body.set("response", token);
  if (clientIp !== "unknown") {
    body.set("remoteip", clientIp);
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    return { ok: false, reason: "recaptcha_request_failed" };
  }

  const payload = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
  };

  if (!payload.success) {
    return { ok: false, reason: "recaptcha_failed" };
  }

  if (typeof payload.score === "number" && payload.score < RECAPTCHA_MIN_SCORE) {
    return { ok: false, reason: "recaptcha_low_score" };
  }

  if (expectedAction && payload.action && payload.action !== expectedAction) {
    return { ok: false, reason: "recaptcha_action_mismatch" };
  }

  return { ok: true };
};

const enforceCaptcha = async (checkout: CheckoutInsert, clientIp: string): Promise<CaptchaVerifyResult> => {
  const configuredProvider = normalizeCaptchaProvider(CAPTCHA_PROVIDER);
  const provider = checkout.captcha_provider ?? configuredProvider;

  if (!CAPTCHA_REQUIRED && !checkout.captcha_token) {
    return { ok: true };
  }

  if (!provider) {
    return { ok: false, reason: "captcha_provider_not_configured" };
  }

  if (!checkout.captcha_token) {
    return { ok: false, reason: "captcha_token_missing" };
  }

  if (configuredProvider && provider !== configuredProvider) {
    return { ok: false, reason: "captcha_provider_not_allowed" };
  }

  if (provider === "turnstile") {
    return await verifyTurnstile(checkout.captcha_token, clientIp, checkout.captcha_action);
  }

  return await verifyRecaptcha(checkout.captcha_token, clientIp, checkout.captcha_action);
};

const checkInMemoryRateLimit = (key: string, windowSeconds: number, maxRequests: number) => {
  const now = Date.now();
  const windowMs = Math.max(1, windowSeconds) * 1000;
  const bucketStartMs = Math.floor(now / windowMs) * windowMs;
  const current = inMemoryRateLimits.get(key);

  if (!current || current.windowStartMs !== bucketStartMs) {
    inMemoryRateLimits.set(key, { windowStartMs: bucketStartMs, count: 1 });
    return { allowed: true, retry_after_seconds: windowSeconds };
  }

  current.count += 1;
  inMemoryRateLimits.set(key, current);

  const retryAfter = Math.max(0, Math.ceil((bucketStartMs + windowMs - now) / 1000));
  return { allowed: current.count <= maxRequests, retry_after_seconds: retryAfter };
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
  invoiceToken: string | null,
) => {
  if (!invoiceToken) {
    return null;
  }

  const { data, error } = await admin
    .from("checkout_invoices")
    .select("id, public_token, title, description, amount, currency, customer_name, customer_email, status, expires_at, paid_at, metadata")
    .eq("public_token", invoiceToken)
    .maybeSingle();

  if (error) {
    console.error("submit-checkout invoice lookup failed", {
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
    metadata:
      data.metadata && typeof data.metadata === "object" && !Array.isArray(data.metadata)
        ? data.metadata as Record<string, unknown>
        : null,
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

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders({
    origin,
    configuredOrigins,
    allowedHeaders: "authorization, x-client-info, apikey, content-type",
    allowedMethods: "POST, OPTIONS",
  });
  if (!corsHeaders) {
    return new Response("Forbidden", { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" }, corsHeaders);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { error: "server_not_configured" }, corsHeaders);
  }

  let checkout: CheckoutInsert;
  try {
    const body = await request.json();
    checkout = asCheckoutInsert(body);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid_request";
    return jsonResponse(400, { error: reason }, corsHeaders);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const clientIp = getClientIp(request);
  const endpointKey = "/functions/v1/submit-checkout";
  const rateKey = await sha256Hex(`${endpointKey}:${clientIp}`);

  const { data: rateData, error: rateError } = await admin.rpc(RATE_LIMIT_FUNCTION, {
    p_key: rateKey,
    p_endpoint: endpointKey,
    p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    p_max_requests: RATE_LIMIT_MAX_REQUESTS,
  });

  let rateAllowed = false;
  let retryAfterSeconds = RATE_LIMIT_WINDOW_SECONDS;
  if (rateError) {
    const isMissingRateFunction =
      rateError.code === "42883" ||
      rateError.message.toLowerCase().includes("function") ||
      rateError.message.toLowerCase().includes("does not exist");

    if (isMissingRateFunction) {
      const fallback = checkInMemoryRateLimit(rateKey, RATE_LIMIT_WINDOW_SECONDS, RATE_LIMIT_MAX_REQUESTS);
      rateAllowed = fallback.allowed;
      retryAfterSeconds = fallback.retry_after_seconds;
    } else {
      console.error("submit-checkout rate-limit check failed", {
        code: rateError.code,
        message: rateError.message,
      });
      return jsonResponse(500, { error: "rate_limit_check_failed" }, corsHeaders);
    }
  } else {
    const rateRow = Array.isArray(rateData)
      ? rateData[0] as { allowed?: boolean; retry_after_seconds?: number }
      : null;
    rateAllowed = rateRow?.allowed === true;
    retryAfterSeconds = rateRow?.retry_after_seconds ?? RATE_LIMIT_WINDOW_SECONDS;
  }

  if (!rateAllowed) {
    return jsonResponse(
      429,
      {
        error: "rate_limited",
        retry_after_seconds: retryAfterSeconds,
      },
      corsHeaders,
    );
  }

  const captcha = await enforceCaptcha(checkout, clientIp);
  if (!captcha.ok) {
    return jsonResponse(400, { error: "captcha_failed", reason: captcha.reason ?? "captcha_failed" }, corsHeaders);
  }

  let invoice: CheckoutInvoiceRecord | null = null;
  try {
    invoice = await resolveCheckoutInvoice(admin, checkout.invoice_token);
  } catch (error) {
    return jsonResponse(
      400,
      { error: error instanceof Error ? error.message : "invoice_lookup_failed" },
      corsHeaders,
    );
  }

  const normalizedAmount = invoice ? Number(invoice.amount.toFixed(2)) : checkout.amount;
  const normalizedPackageName = invoice ? invoice.title : checkout.package_name;
  const normalizedMetadata = {
    ...checkout.metadata,
    request_type: invoice ? "checkout_invoice" : checkout.metadata.request_type,
    source_page: checkout.source_page,
    contact: {
      address_line1: checkout.address_line1,
      city: checkout.city,
      country: checkout.country,
      full_name: checkout.full_name,
      email: checkout.email,
      phone: checkout.phone,
      postal_code: checkout.postal_code,
      province: checkout.province,
    },
    ...(invoice
      ? {
          applied_coupon_codes: [],
          pricing_summary: {
            subtotal_before_discount: normalizedAmount,
            subtotal_after_bundle_discount: normalizedAmount,
            bundle_discount_amount: 0,
            bundle_discount_percent: 0,
            coupon_discount_amount: 0,
            coupon_discount_percent: 0,
            subtotal: normalizedAmount,
            estimated_taxes: 0,
            total: normalizedAmount,
            currency: invoice.currency,
          },
          selected_items: [],
          invoice: {
            id: invoice.id,
            public_token: invoice.public_token,
            title: invoice.title,
            description: invoice.description,
            amount: normalizedAmount,
            currency: invoice.currency,
            customer_name: invoice.customer_name,
            customer_email: invoice.customer_email,
            expires_at: invoice.expires_at,
            metadata: invoice.metadata ?? {},
          },
        }
      : {}),
  };

  const { data, error } = await admin.rpc(SUBMIT_CHECKOUT_FUNCTION, {
    p_customer_email: checkout.email,
    p_package_name: normalizedPackageName,
    p_amount: normalizedAmount,
    p_metadata: normalizedMetadata,
  });

  let orderId =
    !error && typeof data === "string"
      ? data
      : null;

  if (error) {
    const normalizedErrorMessage = error.message.toLowerCase();
    const isMissingSubmitFunction =
      error.code === "42883" ||
      error.code === "PGRST202" ||
      (normalizedErrorMessage.includes("function") &&
        (normalizedErrorMessage.includes("does not exist") || normalizedErrorMessage.includes("schema cache"))) ||
      normalizedErrorMessage.includes("could not find the function public.submit_checkout_record");

    if (!isMissingSubmitFunction) {
      console.error("submit-checkout insert failed", { code: error.code, message: error.message });
      return jsonResponse(500, { error: "insert_failed", reason: error.message, code: error.code }, corsHeaders);
    }

    const { data: fallbackOrder, error: fallbackInsertError } = await admin
      .from("orders")
      .insert({
        customer_email: checkout.email,
        package_name: normalizedPackageName,
        amount: normalizedAmount,
        payment_status: "pending_payment",
        metadata: normalizedMetadata,
      })
      .select("id")
      .single();

    if (fallbackInsertError || !fallbackOrder) {
      console.error("submit-checkout fallback insert failed", {
        code: fallbackInsertError?.code,
        message: fallbackInsertError?.message,
      });
      return jsonResponse(500, { error: "insert_failed", reason: fallbackInsertError?.message ?? "missing_order_id", code: fallbackInsertError?.code ?? null }, corsHeaders);
    }

    orderId = fallbackOrder.id;
  }

  if (!orderId) {
    return jsonResponse(500, { error: "insert_failed", reason: "missing_order_id" }, corsHeaders);
  }

  if (invoice) {
    const { error: invoiceUpdateError } = await admin
      .from("checkout_invoices")
      .update({ last_order_id: orderId })
      .eq("id", invoice.id);

    if (invoiceUpdateError) {
      console.error("submit-checkout invoice update failed", {
        code: invoiceUpdateError.code,
        message: invoiceUpdateError.message,
        invoiceId: invoice.id,
        orderId,
      });
      return jsonResponse(500, { error: "invoice_update_failed" }, corsHeaders);
    }
  }

  return jsonResponse(200, { ok: true, order_id: orderId }, corsHeaders);
});
