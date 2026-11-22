import { webcrypto } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  buildMetaEvent, graphErrorCode, isExpiredEvent, normalizePhone, parseLeadgenNotifications,
  retryDelaySeconds, sanitizeWebsiteTracking, sha256, verifyMetaSignature, type ConversionRow,
} from "../../supabase/functions/_shared/metaConversions";

beforeAll(() => { vi.stubGlobal("crypto", webcrypto); });
const row = (changes: Partial<ConversionRow> = {}): ConversionRow => ({
  id: "event-id", lead_id: "crm-id", stage: "new", channel: "website", event_id: "lead:client-id",
  event_time: "2026-10-18T10:00:00Z", attempts: 1, claim_token: "claim",
  snapshot: { email: "  STUDENT@Example.com ", phone: "(250) 555-0123", source_page: "/apply?email=private@example.com", tracking: {
    fbc: "fb.1.1792317600000.click", fbp: "fb.1.1792317600000.browser",
    client_user_agent: "Browser", client_ip_address: "192.0.2.1",
  } }, ...changes,
});

describe("Meta event payloads", () => {
  it("hashes normalized contacts, preserves browser event identity and removes query strings", async () => {
    const event = await buildMetaEvent(row(), "https://school.example", {});
    expect(event.event_name).toBe("Lead");
    expect(event.event_id).toBe("lead:client-id");
    expect(event.event_time).toBe(1792317600);
    expect(event.event_source_url).toBe("https://school.example/apply");
    expect(event.action_source).toBe("website");
    expect(event.user_data.em).toEqual([await sha256("student@example.com")]);
    expect(event.user_data.ph).toEqual([await sha256("12505550123")]);
    expect(event.user_data.fbc).toBe("fb.1.1792317600000.click");
    expect(JSON.stringify(event)).not.toContain("STUDENT");
    expect(event).not.toHaveProperty("custom_data");
  });

  it("preserves a Meta lead ID larger than JavaScript's safe integer range", async () => {
    const event = await buildMetaEvent(row({ channel: "crm", stage: "qualified", snapshot: { meta_lead_id: "12345678901234567890" } }), "", { qualified: "LeadQualified" });
    expect(event.user_data.lead_id).toBe("12345678901234567890");
    expect(event.action_source).toBe("system_generated");
    expect(event.custom_data).toEqual({ event_source: "crm", lead_event_source: "Supabase" });
    expect(event).not.toHaveProperty("event_source_url");
  });

  it("does not invent a paid purchase or regional customer data from a booking", async () => {
    const event = await buildMetaEvent(row({ stage: "booked" }), "", { booked: "LeadConverted" });
    expect(event.event_name).toBe("LeadConverted");
    expect(event.user_data).not.toHaveProperty("country");
    expect(event.user_data).not.toHaveProperty("client_ip_address");
    expect(event).not.toHaveProperty("custom_data");
  });

  it("requires downstream configuration and usable matching identifiers", async () => {
    await expect(buildMetaEvent(row({ stage: "qualified" }), "", {})).rejects.toThrow("stage_not_configured");
    await expect(buildMetaEvent(row({ snapshot: {} }), "https://school.example", {})).rejects.toThrow("no_matching_identifiers");
  });

  it.each(["//evil.example/path", "/\\evil.example/path"])("rejects off-origin source path %s", async (path) => {
    await expect(buildMetaEvent(row({ snapshot: { email: "student@example.com", source_page: path } }), "https://school.example", {})).rejects.toThrow("invalid_source_page");
  });

  it("does not append extension digits to a phone number", () => {
    expect(normalizePhone("250-555-0123 ext 123")).toBe("");
    expect(normalizePhone("+44 20 7946 0958")).toBe("442079460958");
  });

  it("replaces untrusted network identity and strips unrelated form details", () => {
    const tracking = sanitizeWebsiteTracking({ event_id: "lead:id", client_ip_address: "fake", student_age: "17", fbc: "invalid" }, "Browser", "192.0.2.1");
    expect(tracking).toEqual({ event_id: "lead:id", client_user_agent: "Browser", client_ip_address: "192.0.2.1" });
  });
});

describe("Meta webhook security and retries", () => {
  it("checks the signature against the exact signed bytes and rejects changes/missing signatures", async () => {
    const body = '{"object":"page"}';
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode("secret"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const header = `sha256=${Buffer.from(signature).toString("hex")}`;
    expect(await verifyMetaSignature(body, header, "secret")).toBe(true);
    expect(await verifyMetaSignature(`${body} `, header, "secret")).toBe(false);
    expect(await verifyMetaSignature(body, "", "secret")).toBe(false);
    expect(await verifyMetaSignature(body, header, "wrong-secret")).toBe(false);
  });

  it("accepts only configured Page leadgen changes and deduplicates notifications", () => {
    const change = { field: "leadgen", value: { leadgen_id: "12345678901234567890", page_id: "100", form_id: "200" } };
    expect(parseLeadgenNotifications({ object: "page", entry: [
      { id: "100", changes: [change, change] }, { id: "999", changes: [change] },
    ] }, "100")).toEqual([{ meta_lead_id: "12345678901234567890", meta_page_id: "100", meta_form_id: "200", meta_ad_id: null }]);
  });

  it("uses bounded backoff and refuses expired event times", () => {
    expect([1, 2, 8, 20].map(retryDelaySeconds)).toEqual([30, 60, 3600, 3600]);
    expect(isExpiredEvent("2026-10-01", Date.parse("2026-10-18"))).toBe(true);
    expect(isExpiredEvent("bad")).toBe(true);
    expect(isExpiredEvent("2026-10-18", Date.parse("2026-10-18"))).toBe(false);
  });

  it("records numeric Graph failure codes without leaking error messages", () => {
    const safe = graphErrorCode({ error: { code: 190, error_subcode: 463, message: "sensitive token/email" } }, 400);
    expect(safe).toBe("graph_http_400_code_190_subcode_463");
  });
});
