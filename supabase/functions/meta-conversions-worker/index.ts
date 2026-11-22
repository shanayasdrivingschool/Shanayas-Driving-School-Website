import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildMetaEvent, eventNameForStage, graphErrorCode, isExpiredEvent, numericId,
  record, retryDelaySeconds, safeEqual, textValue, type ConversionRow, type EventNames,
} from "../_shared/metaConversions.ts";

type InboxRow = { meta_lead_id: string; meta_page_id: string; meta_form_id: string | null; meta_ad_id: string | null; attempts: number; claim_token: string };
const json = (status: number, value: unknown) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });
  const env = (key: string) => Deno.env.get(key)?.trim() ?? "";
  const workerSecret = env("META_WORKER_SECRET");
  if (!workerSecret || !await safeEqual(request.headers.get("x-meta-worker-secret") ?? "", workerSecret)) return json(401, { error: "unauthorized" });
  const url = env("SUPABASE_URL");
  const roleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !roleKey) return json(503, { error: "database_not_configured" });
  const version = env("META_GRAPH_API_VERSION");
  if (!/^v\d+\.\d+$/.test(version)) return json(503, { error: "graph_version_not_configured" });
  const db = createClient(url, roleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const summary = { ingested: 0, sent: 0, failed: 0, skipped: 0, capiEnabled: env("META_CAPI_ENABLED") === "true" };
  const names: EventNames = {
    qualified: env("META_EVENT_QUALIFIED"), booked: env("META_EVENT_BOOKED"), unqualified: env("META_EVENT_UNQUALIFIED"),
  };
  // Four parallel requests of at most 10s each keep the batch comfortably within a lease.
  const batched = async <T>(rows: T[], work: (row: T) => Promise<void>) => {
    for (let i = 0; i < rows.length; i += 4) await Promise.all(rows.slice(i, i + 4).map(work));
  };
  const graph = async (path: string, token: string, body?: unknown) => {
    const response = await fetch(`https://graph.facebook.com/${version}/${path}`, {
      method: body ? "POST" : "GET",
      headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await response.json();
    if (!response.ok || record(data).error) throw new Error(graphErrorCode(data, response.status));
    return record(data);
  };
  const failureCode = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    // Only known safe internal error codes are persisted; never Graph message text or URLs.
    return /^(graph_http_\d+_code_[\w]+_subcode_[\w]+|invalid_graph_lead|invalid_graph_time|lead_insert_failed|event_not_accepted|invalid_event_time|invalid_site_origin|invalid_source_page|no_matching_identifiers)$/.test(message) ? message : "request_or_processing_failed";
  };
  const finish = async (table: string, key: string, id: string, claim: string, fields: Record<string, unknown>) => {
    const { error } = await db.from(table).update({ ...fields, locked_until: null, claim_token: null }).eq(key, id).eq("claim_token", claim).eq("status", "processing");
    if (error) throw new Error("queue_update_failed");
  };

  try {
    if (env("META_LEADGEN_ENABLED") === "true") {
      const pageToken = env("META_PAGE_ACCESS_TOKEN");
      const pageId = numericId(env("META_PAGE_ID"));
      if (!pageToken || !pageId) return json(503, { error: "leadgen_not_configured" });
      const { data, error } = await db.rpc("claim_meta_leadgen_inbox", { p_limit: 20 });
      if (error) return json(503, { error: "inbox_claim_failed" });
      await batched((data ?? []) as InboxRow[], async (row) => {
        try {
          if (row.meta_page_id !== pageId) {
            await finish("meta_leadgen_inbox", "meta_lead_id", row.meta_lead_id, row.claim_token, { status: "skipped", last_error: "page_not_allowed" });
            summary.skipped++; return;
          }
          const lead = await graph(`${row.meta_lead_id}?fields=id,created_time,field_data,ad_id,form_id`, pageToken);
          if (numericId(lead.id) !== row.meta_lead_id || !Array.isArray(lead.field_data)) throw new Error("invalid_graph_lead");
          const time = Date.parse(textValue(lead.created_time));
          if (!Number.isFinite(time) || time > Date.now() + 60_000) throw new Error("invalid_graph_time");
          const answers: Record<string, string[]> = {};
          for (const field of lead.field_data) {
            const item = record(field);
            const name = textValue(item.name, 100);
            if (name && Array.isArray(item.values)) Object.defineProperty(answers, name, { value: item.values.map((v) => textValue(v, 2000)), enumerable: true, configurable: true });
          }
          const first = (key: string) => answers[key]?.[0] || null;
          const { error: insertError } = await db.from("leads").upsert({
            lead_type: "student_assessment", status: "new", source_page: "/meta-lead-ad",
            full_name: first("full_name") || [first("first_name"), first("last_name")].filter(Boolean).join(" ") || null,
            email: first("email"), phone: first("phone_number"),
            meta_lead_id: row.meta_lead_id, meta_page_id: row.meta_page_id,
            meta_form_id: numericId(lead.form_id) || row.meta_form_id,
            meta_ad_id: numericId(lead.ad_id) || row.meta_ad_id,
            created_at: new Date(time).toISOString(), payload: { source: "meta", field_data: answers },
          }, { onConflict: "meta_lead_id", ignoreDuplicates: true });
          if (insertError) throw new Error("lead_insert_failed");
          await finish("meta_leadgen_inbox", "meta_lead_id", row.meta_lead_id, row.claim_token, { status: "sent", last_error: null });
          summary.ingested++;
        } catch (error) {
          await finish("meta_leadgen_inbox", "meta_lead_id", row.meta_lead_id, row.claim_token, {
            status: "failed", last_error: failureCode(error), next_attempt_at: new Date(Date.now() + retryDelaySeconds(row.attempts) * 1000).toISOString(),
          });
          summary.failed++;
        }
      });
    }

    if (!summary.capiEnabled) return json(200, summary);
    const accessToken = env("META_CAPI_ACCESS_TOKEN");
    const datasetId = numericId(env("META_DATASET_ID"));
    const mode = env("META_CAPI_MODE");
    const testCode = env("META_TEST_EVENT_CODE");
    const siteOrigin = env("META_SITE_ORIGIN");
    if (!accessToken || !datasetId || !["test", "production"].includes(mode) || (mode === "test" && !testCode) || !siteOrigin) return json(503, { error: "capi_not_configured" });
    try {
      const site = new URL(siteOrigin);
      if (site.protocol !== "https:" || site.username || site.password) throw new Error();
    } catch { return json(503, { error: "invalid_site_origin" }); }

    const { data, error } = await db.rpc("claim_meta_conversion_events", { p_limit: 20 });
    if (error) return json(503, { error: "events_claim_failed" });
    await batched((data ?? []) as ConversionRow[], async (row) => {
      try {
        if (row.delivery_mode && row.delivery_mode !== mode) {
          await finish("meta_conversion_events", "id", row.id, row.claim_token, {
            status: "pending", attempts: row.attempts - 1, last_error: "delivery_mode_changed",
            next_attempt_at: new Date(Date.now() + 3600_000).toISOString(),
          });
          return;
        }
        const stageNames = row.event_name && row.stage !== "new"
          ? { ...names, [row.stage]: row.event_name } : names;
        if (!eventNameForStage(row.stage, stageNames)) {
          // Stage names await owner confirmation. Keep pending without exhausting attempts.
          await finish("meta_conversion_events", "id", row.id, row.claim_token, {
            status: "pending", attempts: row.attempts - 1, last_error: "stage_not_configured",
            next_attempt_at: new Date(Date.now() + 3600_000).toISOString(),
          });
          return;
        }
        if (isExpiredEvent(row.event_time)) {
          await finish("meta_conversion_events", "id", row.id, row.claim_token, { status: "skipped", last_error: "event_too_old" });
          summary.skipped++; return;
        }
        const event = await buildMetaEvent(row, siteOrigin, stageNames);
        const body = { data: [event], ...(mode === "test" ? { test_event_code: testCode } : {}) };
        // Pin mode before the network request, including ambiguous timeout outcomes.
        const { error: pinError } = await db.from("meta_conversion_events").update({ delivery_mode: mode, event_name: event.event_name })
          .eq("id", row.id).eq("claim_token", row.claim_token).eq("status", "processing");
        if (pinError) throw new Error("queue_update_failed");
        const result = await graph(`${datasetId}/events`, accessToken, body);
        if (result.events_received !== 1) throw new Error("event_not_accepted");
        await finish("meta_conversion_events", "id", row.id, row.claim_token, {
          status: "sent", sent_at: new Date().toISOString(), last_error: null,
          delivery_mode: mode, fbtrace_id: textValue(result.fbtrace_id, 200) || null,
        });
        summary.sent++;
      } catch (error) {
        await finish("meta_conversion_events", "id", row.id, row.claim_token, {
          status: "failed", last_error: failureCode(error),
          next_attempt_at: new Date(Date.now() + retryDelaySeconds(row.attempts) * 1000).toISOString(),
        });
        summary.failed++;
      }
    });
    return json(200, summary);
  } catch {
    // Interrupted claims can be recovered after the lease expires.
    return json(503, { error: "worker_failed" });
  }
});
