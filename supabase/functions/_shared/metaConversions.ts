/** Pure payload/security helpers shared by the Edge Functions and local tests. */
export const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
export const textValue = (value: unknown, max = 500): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
export const numericId = (value: unknown): string => {
  const id = textValue(value, 40);
  return /^\d{1,40}$/.test(id) ? id : "";
};
export const sha256 = async (value: string): Promise<string> => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
};
export const safeEqual = async (a: string, b: string): Promise<boolean> => {
  // Fixed-size digest comparison avoids early exit on differing signature bytes.
  const [left, right] = await Promise.all([sha256(a), sha256(b)]);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
};
export const verifyMetaSignature = async (body: string | Uint8Array, signature: string, secret: string): Promise<boolean> => {
  if (!secret || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, typeof body === "string" ? new TextEncoder().encode(body) : new Uint8Array(body).buffer);
  const hex = Array.from(new Uint8Array(signed), (b) => b.toString(16).padStart(2, "0")).join("");
  return safeEqual(signature, `sha256=${hex}`);
};

export const normalizePhone = (value: unknown): string => {
  const input = textValue(value, 60);
  // Extension digits must not silently become part of the subscriber number.
  if (/(?:ext\.?|x|#)\s*\d+/i.test(input)) return "";
  let digits = input.replace(/\D/g, "");
  if (digits.length === 10 && !input.startsWith("+")) digits = `1${digits}`;
  return /^\d{7,15}$/.test(digits) ? digits : "";
};
const metaCookie = (value: unknown) => {
  const text = textValue(value, 500);
  return /^fb\.\d+\.\d{13}\.[A-Za-z0-9._-]+$/.test(text) ? text : "";
};
export const sanitizeWebsiteTracking = (value: unknown, userAgent: string, ip: string): Record<string, unknown> => {
  const input = record(value);
  const eventId = textValue(input.event_id, 200);
  return {
    ...(eventId && /^[A-Za-z0-9:_-]+$/.test(eventId) ? { event_id: eventId } : {}),
    ...(metaCookie(input.fbc) ? { fbc: metaCookie(input.fbc) } : {}),
    ...(metaCookie(input.fbp) ? { fbp: metaCookie(input.fbp) } : {}),
    ...(userAgent ? { client_user_agent: userAgent.slice(0, 500) } : {}),
    ...(ip && /^[0-9a-fA-F:.]+$/.test(ip) ? { client_ip_address: ip.slice(0, 64) } : {}),
    ...(input.sharing_allowed === false ? { sharing_allowed: false } : {}),
  };
};

export type ConversionRow = {
  id: string;
  lead_id: string;
  stage: string;
  channel: "website" | "crm";
  event_id: string;
  event_name?: string | null;
  event_time: string;
  snapshot: unknown;
  attempts: number;
  claim_token: string;
  delivery_mode?: "test" | "production" | null;
};
export type EventNames = Partial<Record<"qualified" | "booked" | "unqualified", string>>;
export const eventNameForStage = (stage: string, names: EventNames): string =>
  stage === "new" ? "Lead" : textValue(names[stage as keyof EventNames], 100);

export const buildMetaEvent = async (row: ConversionRow, siteOrigin: string, names: EventNames) => {
  const snapshot = record(row.snapshot);
  const tracking = record(snapshot.tracking);
  const eventName = eventNameForStage(row.stage, names);
  if (!eventName) throw new Error("stage_not_configured");
  const time = Math.floor(Date.parse(row.event_time) / 1000);
  if (!Number.isFinite(time)) throw new Error("invalid_event_time");
  const userData: Record<string, unknown> = {};
  const email = textValue(snapshot.email, 320).toLowerCase();
  const phone = normalizePhone(snapshot.phone);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) userData.em = [await sha256(email)];
  if (phone) userData.ph = [await sha256(phone)];
  if (numericId(snapshot.meta_lead_id)) userData.lead_id = numericId(snapshot.meta_lead_id);
  // Hash the stable CRM ID. Do not send any assessment answers or inferred demographics.
  userData.external_id = [await sha256(row.lead_id)];

  const isWebsiteLead = row.channel === "website" && row.stage === "new";
  if (row.channel === "website") {
    if (metaCookie(tracking.fbc)) userData.fbc = metaCookie(tracking.fbc);
    if (metaCookie(tracking.fbp)) userData.fbp = metaCookie(tracking.fbp);
  }
  if (isWebsiteLead) {
    if (textValue(tracking.client_user_agent)) userData.client_user_agent = textValue(tracking.client_user_agent);
    if (/^[0-9a-fA-F:.]+$/.test(textValue(tracking.client_ip_address))) userData.client_ip_address = textValue(tracking.client_ip_address, 64);
  }
  if (!userData.em && !userData.ph && !userData.lead_id && !userData.fbc && !userData.fbp) throw new Error("no_matching_identifiers");

  let eventSourceUrl: string | undefined;
  if (isWebsiteLead) {
    const origin = new URL(siteOrigin);
    if (origin.protocol !== "https:" || origin.username || origin.password) throw new Error("invalid_site_origin");
    const path = textValue(snapshot.source_page, 140).split(/[?#]/)[0];
    if (!path.startsWith("/") || path.startsWith("//")) throw new Error("invalid_source_page");
    const url = new URL(path, origin.origin);
    if (url.origin !== origin.origin) throw new Error("invalid_source_page");
    eventSourceUrl = url.href;
  }
  return {
    event_name: eventName,
    event_time: time,
    event_id: row.event_id,
    action_source: isWebsiteLead ? "website" : "system_generated",
    ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
    user_data: userData,
    // Instant Form CRM parameters apply only to actual Meta lead IDs.
    ...(row.channel === "crm" ? { custom_data: { event_source: "crm", lead_event_source: "Supabase" } } : {}),
  };
};

export type LeadgenNotification = { meta_lead_id: string; meta_page_id: string; meta_form_id: string | null; meta_ad_id: string | null };
export const parseLeadgenNotifications = (body: unknown, allowedPageId: string): LeadgenNotification[] => {
  const root = record(body);
  if (root.object !== "page" || !Array.isArray(root.entry)) return [];
  const rows = new Map<string, LeadgenNotification>();
  for (const entry of root.entry) {
    const item = record(entry);
    if (numericId(item.id) !== allowedPageId || !Array.isArray(item.changes)) continue;
    for (const change of item.changes) {
      const update = record(change);
      const value = record(update.value);
      const leadId = numericId(value.leadgen_id);
      if (update.field !== "leadgen" || !leadId || numericId(value.page_id) !== allowedPageId) continue;
      rows.set(leadId, { meta_lead_id: leadId, meta_page_id: allowedPageId, meta_form_id: numericId(value.form_id) || null, meta_ad_id: numericId(value.ad_id) || null });
    }
  }
  return [...rows.values()];
};

export const retryDelaySeconds = (attempts: number): number => Math.min(3600, 30 * 2 ** Math.max(0, attempts - 1));
export const isExpiredEvent = (eventTime: string, now = Date.now()): boolean =>
  !Number.isFinite(Date.parse(eventTime)) || now - Date.parse(eventTime) >= 7 * 24 * 60 * 60 * 1000;

/** Preserve IDs as strings and keep API error bodies/tokens/contact values out of logs. */
export const graphErrorCode = (body: unknown, status: number): string => {
  const error = record(record(body).error);
  return `graph_http_${status}_code_${typeof error.code === "number" ? error.code : "unknown"}_subcode_${typeof error.error_subcode === "number" ? error.error_subcode : "none"}`;
};
