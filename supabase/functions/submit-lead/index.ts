import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, readAllowedOrigins } from "../_shared/cors.ts";

type LeadType = "contact" | "student_assessment" | "employee_application" | "custom_package_request";
type CaptchaProvider = "turnstile" | "recaptcha";

type LeadInsert = {
  lead_type: LeadType;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  source_page: string;
  status: string;
  payload: Record<string, unknown>;
  captcha_provider: CaptchaProvider | null;
  captcha_token: string | null;
  captcha_action: string | null;
};

const ALLOWED_LEAD_TYPES = new Set<LeadType>([
  "contact",
  "student_assessment",
  "employee_application",
  "custom_package_request",
]);

const ALLOWED_STATUSES = new Set([
  "new",
  "pending_review",
  "reviewed",
  "shortlisted",
  "rejected",
]);

const MAX_TEXT = {
  full_name: 180,
  email: 200,
  phone: 80,
  source_page: 140,
  status: 64,
  captcha_action: 64,
} as const;

const MAX_PAYLOAD_BYTES = 64_000;
const MAX_CAPTCHA_TOKEN = 5000;
const RATE_LIMIT_FUNCTION = "check_submit_lead_rate_limit";
const inMemoryRateLimits = new Map<string, { windowStartMs: number; count: number }>();

const CAPTCHA_REQUIRED = (Deno.env.get("CAPTCHA_REQUIRED") ?? "false").trim().toLowerCase() === "true";
const CAPTCHA_PROVIDER = (Deno.env.get("CAPTCHA_PROVIDER") ?? "").trim().toLowerCase();
const TURNSTILE_SECRET_KEY = (Deno.env.get("TURNSTILE_SECRET_KEY") ?? "").trim();
const RECAPTCHA_SECRET_KEY = (Deno.env.get("RECAPTCHA_SECRET_KEY") ?? "").trim();
const RECAPTCHA_MIN_SCORE = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") ?? "0.5");
const RATE_LIMIT_WINDOW_SECONDS = Math.max(1, Number(Deno.env.get("RATE_LIMIT_WINDOW_SECONDS") ?? "60"));
const RATE_LIMIT_MAX_REQUESTS = Math.max(1, Number(Deno.env.get("RATE_LIMIT_MAX_REQUESTS") ?? "8"));
const SUBMIT_LEAD_FUNCTION = "submit_lead_record";

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

const asPayloadObject = (value: unknown): Record<string, unknown> => {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("payload_must_be_object");
  }
  const serialized = JSON.stringify(value);
  if (serialized.length > MAX_PAYLOAD_BYTES) {
    throw new Error("payload_too_large");
  }
  return value as Record<string, unknown>;
};

const asLeadInsert = (value: unknown): LeadInsert => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("invalid_body");
  }

  const record = value as Record<string, unknown>;
  const leadTypeRaw = asOptionalString(record.lead_type, 64);
  if (!leadTypeRaw || !ALLOWED_LEAD_TYPES.has(leadTypeRaw as LeadType)) {
    throw new Error("invalid_lead_type");
  }

  const sourcePage = asOptionalString(record.source_page, MAX_TEXT.source_page);
  if (!sourcePage || !sourcePage.startsWith("/")) {
    throw new Error("invalid_source_page");
  }

  const statusRaw = asOptionalString(record.status, MAX_TEXT.status) ?? "new";
  const status = ALLOWED_STATUSES.has(statusRaw) ? statusRaw : "new";
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
    lead_type: leadTypeRaw as LeadType,
    full_name: asOptionalString(record.full_name, MAX_TEXT.full_name),
    email: asOptionalString(record.email, MAX_TEXT.email),
    phone: asOptionalString(record.phone, MAX_TEXT.phone),
    source_page: sourcePage,
    status,
    payload: asPayloadObject(record.payload),
    captcha_provider: captchaProvider,
    captcha_token: captchaToken,
    captcha_action: captchaAction,
  };
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

const enforceCaptcha = async (
  lead: LeadInsert,
  clientIp: string,
): Promise<CaptchaVerifyResult> => {
  const configuredProvider = normalizeCaptchaProvider(CAPTCHA_PROVIDER);
  const provider = lead.captcha_provider ?? configuredProvider;

  if (!CAPTCHA_REQUIRED && !lead.captcha_token) {
    return { ok: true };
  }

  if (!provider) {
    return { ok: false, reason: "captcha_provider_not_configured" };
  }
  if (!lead.captcha_token) {
    return { ok: false, reason: "captcha_token_missing" };
  }
  if (configuredProvider && provider !== configuredProvider) {
    return { ok: false, reason: "captcha_provider_not_allowed" };
  }

  if (provider === "turnstile") {
    return await verifyTurnstile(lead.captcha_token, clientIp, lead.captcha_action);
  }
  return await verifyRecaptcha(lead.captcha_token, clientIp, lead.captcha_action);
};

const checkInMemoryRateLimit = (
  key: string,
  windowSeconds: number,
  maxRequests: number,
) => {
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

const isCustomPackageLead = (lead: LeadInsert) =>
  lead.lead_type === "custom_package_request" ||
  (typeof lead.payload.request_type === "string" && lead.payload.request_type === "custom_package_request");

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

  let lead: LeadInsert;
  try {
    const body = await request.json();
    lead = asLeadInsert(body);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid_request";
    return jsonResponse(400, { error: reason }, corsHeaders);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const clientIp = getClientIp(request);
  const endpointKey = `/functions/v1/submit-lead:${lead.lead_type}`;
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
      console.error("submit-lead rate-limit check failed", {
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

  if (rateError) {
    console.error("submit-lead rate-limit check failed", {
      code: rateError.code ?? "fallback_mode",
      message: "rate-limit rpc unavailable, using in-memory fallback",
    });
  }

  const captcha = await enforceCaptcha(lead, clientIp);
  if (!captcha.ok) {
    return jsonResponse(400, { error: "captcha_failed", reason: captcha.reason ?? "captcha_failed" }, corsHeaders);
  }

  const { error } = await admin.rpc(SUBMIT_LEAD_FUNCTION, {
    p_lead_type: lead.lead_type,
    p_full_name: lead.full_name,
    p_email: lead.email,
    p_phone: lead.phone,
    p_source_page: lead.source_page,
    p_status: lead.status,
    p_payload: lead.payload,
  });

  if (error) {
    const message = error.message.toLowerCase();
    const isMissingSubmitFunction =
      error.code === "42883" ||
      (message.includes("function") && message.includes("does not exist"));

    if (isMissingSubmitFunction) {
      const { error: fallbackInsertError } = await admin.from("leads").insert({
        lead_type: lead.lead_type,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        source_page: lead.source_page,
        status: lead.status,
        payload: lead.payload,
      });

      if (!fallbackInsertError) {
        return jsonResponse(200, { ok: true }, corsHeaders);
      }

      console.error("submit-lead fallback insert failed", {
        code: fallbackInsertError.code,
        message: fallbackInsertError.message,
      });
      return jsonResponse(500, { error: "insert_failed" }, corsHeaders);
    }

    if (
      [
        "invalid_coupon_payload",
        "invalid_coupon_code",
        "coupon_not_active",
        "coupon_not_started",
        "coupon_expired",
        "coupon_already_redeemed",
      ].includes(message)
    ) {
      return jsonResponse(400, { error: message }, corsHeaders);
    }

    console.error("submit-lead insert failed", { code: error.code, message: error.message });
    return jsonResponse(500, { error: "insert_failed" }, corsHeaders);
  }

  return jsonResponse(200, { ok: true }, corsHeaders);
});


