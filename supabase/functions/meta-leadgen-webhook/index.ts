import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { numericId, parseLeadgenNotifications, safeEqual, verifyMetaSignature } from "../_shared/metaConversions.ts";

const reply = (status: number, body: string) => new Response(body, { status, headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } });

Deno.serve(async (request: Request) => {
  const env = (key: string) => Deno.env.get(key)?.trim() ?? "";
  if (env("META_LEADGEN_ENABLED") !== "true") return reply(503, "leadgen_disabled");
  const verifyToken = env("META_WEBHOOK_VERIFY_TOKEN");
  const appSecret = env("META_APP_SECRET");
  const pageId = numericId(env("META_PAGE_ID"));
  const url = env("SUPABASE_URL");
  const roleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!verifyToken || !appSecret || !pageId || !url || !roleKey) return reply(503, "not_configured");
  if (request.method === "GET") {
    const params = new URL(request.url).searchParams;
    if (params.get("hub.mode") !== "subscribe" || !await safeEqual(params.get("hub.verify_token") ?? "", verifyToken)) return reply(403, "verification_failed");
    return reply(200, params.get("hub.challenge") ?? "");
  }
  if (request.method !== "POST") return reply(405, "method_not_allowed");
  // Bound raw bytes before parsing or signing; content-length alone is not trustworthy.
  if (!request.body) return reply(400, "missing_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 256_000) { await reader.cancel(); return reply(413, "body_too_large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const raw = new TextDecoder().decode(bytes);
  if (!await verifyMetaSignature(bytes, request.headers.get("x-hub-signature-256") ?? "", appSecret)) return reply(401, "invalid_signature");
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return reply(400, "invalid_json"); }
  const notifications = parseLeadgenNotifications(body, pageId);
  if (notifications.length) {
    const db = createClient(url, roleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await db.from("meta_leadgen_inbox").upsert(notifications, { onConflict: "meta_lead_id", ignoreDuplicates: true });
    // A non-2xx response asks Meta to retry; do not acknowledge an uncommitted write.
    if (error) { console.error("meta inbox write failed", { code: error.code }); return reply(503, "queue_unavailable"); }
  }
  return reply(200, "EVENT_RECEIVED");
});
