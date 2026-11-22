import { createHmac, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import * as helpers from "../functions/_shared/metaConversions";

type Handler = (request: Request) => Promise<Response>;
type Database = ReturnType<typeof fakeDatabase>;
const fakeDatabase = (rows: unknown[] = [], failWrite = false) => {
  const updates: { table: string; fields: Record<string, unknown> }[] = [];
  const upserts: { table: string; data: unknown; options: unknown }[] = [];
  return {
    updates, upserts,
    rpc: vi.fn(async () => ({ data: rows, error: null })),
    from: (table: string) => ({
      upsert: async (data: unknown, options: unknown) => {
        upserts.push({ table, data, options });
        return { error: failWrite ? { code: "test_failure" } : null };
      },
      update: (fields: Record<string, unknown>) => {
        updates.push({ table, fields });
        const chain = {
          eq: (_key: string, _value: unknown) => chain,
          then: (resolve: (value: unknown) => unknown) => Promise.resolve({ error: null }).then(resolve),
        };
        return chain;
      },
    }),
  };
};

/** Execute the actual Deno handler, replacing only its SDK boundary and environment. */
const load = (name: string, env: Record<string, string>, db: Database, fetcher = vi.fn()) => {
  let handler: Handler | undefined;
  const source = readFileSync(`supabase/functions/${name}/index.ts`, "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(compiled, {
    exports: {},
    require: (id: string) => {
      if (id.startsWith("https://esm.sh/")) return { createClient: () => db };
      if (id.endsWith("metaConversions.ts")) return helpers;
      throw new Error(`Unexpected import ${id}`);
    },
    Deno: { env: { get: (key: string) => env[key] }, serve: (fn: Handler) => { handler = fn; } },
    fetch: fetcher, Request, Response, URL, TextEncoder, TextDecoder, Uint8Array,
    crypto: webcrypto, AbortSignal, console: { error: vi.fn() },
  });
  if (!handler) throw new Error("handler not registered");
  return handler;
};
const workerEnv = {
  SUPABASE_URL: "https://db.example", SUPABASE_SERVICE_ROLE_KEY: "dummy-service-key",
  META_WORKER_SECRET: "dummy-worker-secret", META_GRAPH_API_VERSION: "v25.0",
  META_CAPI_ENABLED: "true", META_CAPI_MODE: "test", META_TEST_EVENT_CODE: "TEST_DUMMY",
  META_CAPI_ACCESS_TOKEN: "dummy-access-token", META_DATASET_ID: "123",
  META_SITE_ORIGIN: "https://school.example",
};
const workerRequest = (secret = "dummy-worker-secret") => new Request("https://db.example/functions/v1/meta-conversions-worker", { method: "POST", headers: { "x-meta-worker-secret": secret } });
const eventRow = (extra: Record<string, unknown> = {}) => ({
  id: "event", lead_id: "lead", stage: "new", channel: "website", event_id: "lead:stable",
  event_time: new Date().toISOString(), attempts: 1, claim_token: "fencing-token",
  snapshot: { email: "student@example.test", source_page: "/apply" }, ...extra,
});

describe("conversion worker handler", () => {
  it("rejects unauthorized calls before database access or network requests", async () => {
    const db = fakeDatabase(); const fetcher = vi.fn();
    const response = await load("meta-conversions-worker", workerEnv, db, fetcher)(workerRequest("wrong"));
    expect(response.status).toBe(401);
    expect(db.rpc).not.toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled();
  });

  it("does not claim or send conversions when disabled or missing test configuration", async () => {
    for (const env of [{ ...workerEnv, META_CAPI_ENABLED: "false" }, { ...workerEnv, META_TEST_EVENT_CODE: "" }]) {
      const db = fakeDatabase(); const fetcher = vi.fn();
      const response = await load("meta-conversions-worker", env, db, fetcher)(workerRequest());
      expect([200, 503]).toContain(response.status);
      expect(db.rpc).not.toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled();
    }
  });

  it("sends test events, pins mode, and records accepted delivery", async () => {
    const db = fakeDatabase([eventRow()]);
    const fetcher = vi.fn(async () => Response.json({ events_received: 1, fbtrace_id: "trace" }));
    const response = await load("meta-conversions-worker", workerEnv, db, fetcher)(workerRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ sent: 1, failed: 0 });
    const [url, options] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://graph.facebook.com/v25.0/123/events");
    const body = JSON.parse(String(options.body));
    expect(body.test_event_code).toBe("TEST_DUMMY");
    expect(body.data[0].event_id).toBe("lead:stable");
    expect(body.data[0].user_data.em[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(db.updates[0].fields).toEqual({ delivery_mode: "test", event_name: "Lead" });
    expect(db.updates.at(-1)?.fields).toMatchObject({ status: "sent", delivery_mode: "test", fbtrace_id: "trace", claim_token: null });
  });

  it("retries Graph failures without saving contact-bearing error text", async () => {
    const db = fakeDatabase([eventRow()]);
    const fetcher = vi.fn(async () => Response.json({ error: { code: 190, message: "token/contact-sensitive" } }, { status: 400 }));
    const response = await load("meta-conversions-worker", workerEnv, db, fetcher)(workerRequest());
    expect(await response.json()).toMatchObject({ failed: 1, sent: 0 });
    const fields = db.updates.at(-1)?.fields;
    expect(fields).toMatchObject({ status: "failed", last_error: "graph_http_400_code_190_subcode_none" });
    expect(Date.parse(String(fields?.next_attempt_at))).toBeGreaterThan(Date.now());
    expect(JSON.stringify(db.updates)).not.toContain("token/contact-sensitive");
  });

  it("does not treat an unaccepted 200 response as delivered", async () => {
    const db = fakeDatabase([eventRow()]);
    const fetcher = vi.fn(async () => Response.json({ events_received: 0 }));
    await load("meta-conversions-worker", workerEnv, db, fetcher)(workerRequest());
    expect(db.updates.at(-1)?.fields).toMatchObject({ status: "failed", last_error: "event_not_accepted" });
  });

  it("holds unconfigured stages and mode changes, and skips expired events without sending", async () => {
    for (const row of [eventRow({ stage: "qualified" }), eventRow({ delivery_mode: "production" }), eventRow({ event_time: "2020-01-01" })]) {
      const db = fakeDatabase([row]); const fetcher = vi.fn();
      await load("meta-conversions-worker", workerEnv, db, fetcher)(workerRequest());
      expect(fetcher).not.toHaveBeenCalled();
      expect(["pending", "skipped"]).toContain(db.updates.at(-1)?.fields.status);
    }
  });

  it("keeps the originally attempted stage name on retry after configuration changes", async () => {
    const db = fakeDatabase([eventRow({ stage: "qualified", event_name: "OriginalQualified", attempts: 2 })]);
    const fetcher = vi.fn(async () => Response.json({ events_received: 1 }));
    await load("meta-conversions-worker", { ...workerEnv, META_EVENT_QUALIFIED: "RenamedQualified" }, db, fetcher)(workerRequest());
    const options = fetcher.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(options.body)).data[0].event_name).toBe("OriginalQualified");
  });

  it("retrieves Instant Form answers and inserts a Meta-labelled lead without overwriting duplicates", async () => {
    const db = fakeDatabase([{ meta_lead_id: "12345678901234567890", meta_page_id: "100", attempts: 1, claim_token: "claim" }]);
    const fetcher = vi.fn(async () => Response.json({ id: "12345678901234567890", created_time: new Date().toISOString(), field_data: [
      { name: "full_name", values: ["Test Student"] }, { name: "email", values: ["student@example.test"] },
    ] }));
    const response = await load("meta-conversions-worker", { ...workerEnv, META_CAPI_ENABLED: "false", META_LEADGEN_ENABLED: "true", META_PAGE_ID: "100", META_PAGE_ACCESS_TOKEN: "dummy-page-token" }, db, fetcher)(workerRequest());
    expect(await response.json()).toMatchObject({ ingested: 1 });
    expect(db.upserts[0]).toMatchObject({ table: "leads", options: { ignoreDuplicates: true }, data: { meta_lead_id: "12345678901234567890", source_page: "/meta-lead-ad", full_name: "Test Student", payload: { source: "meta" } } });
  });
});

const webhookEnv = { ...workerEnv, META_LEADGEN_ENABLED: "true", META_APP_SECRET: "dummy-app-secret", META_WEBHOOK_VERIFY_TOKEN: "verify", META_PAGE_ID: "100" };
const notification = JSON.stringify({ object: "page", entry: [{ id: "100", changes: [{ field: "leadgen", value: { page_id: "100", leadgen_id: "999", form_id: "200" } }] }] });
const webhookRequest = (body = notification, signed = true) => new Request("https://db.example/functions/v1/meta-leadgen-webhook", {
  method: "POST", body, headers: { "x-hub-signature-256": signed ? `sha256=${createHmac("sha256", "dummy-app-secret").update(body).digest("hex")}` : "wrong" },
});

describe("leadgen webhook handler", () => {
  it("requires the correct handshake token", async () => {
    const handler = load("meta-leadgen-webhook", webhookEnv, fakeDatabase());
    const response = await handler(new Request("https://db.example?hub.mode=subscribe&hub.verify_token=verify&hub.challenge=123"));
    expect(response.status).toBe(200); expect(await response.text()).toBe("123");
    expect((await handler(new Request("https://db.example?hub.mode=subscribe&hub.verify_token=wrong"))).status).toBe(403);
  });

  it("rejects unsigned bodies and oversized requests without writes", async () => {
    const db = fakeDatabase(); const handler = load("meta-leadgen-webhook", webhookEnv, db);
    expect((await handler(webhookRequest(notification, false))).status).toBe(401);
    expect((await handler(webhookRequest("x".repeat(256001)))).status).toBe(413);
    expect(db.upserts).toHaveLength(0);
  });

  it("acknowledges only after a durable queue insert", async () => {
    const db = fakeDatabase();
    expect((await load("meta-leadgen-webhook", webhookEnv, db)(webhookRequest())).status).toBe(200);
    expect(db.upserts[0]).toMatchObject({ table: "meta_leadgen_inbox", options: { ignoreDuplicates: true }, data: [{ meta_lead_id: "999", meta_page_id: "100" }] });
    const unavailable = fakeDatabase([], true);
    expect((await load("meta-leadgen-webhook", webhookEnv, unavailable)(webhookRequest())).status).toBe(503);
  });
});
