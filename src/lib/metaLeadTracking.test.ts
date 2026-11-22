import { beforeEach, describe, expect, it, vi } from "vitest";
import { prepareMetaLeadPayload, trackStoredMetaLead } from "./metaLeadTracking";
import { captureLeadAttribution } from "./leadAttribution";

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  document.cookie = "_fbc=; Max-Age=0; path=/";
  document.cookie = "_fbp=; Max-Age=0; path=/";
  vi.unstubAllEnvs();
  window.fbq = undefined;
});

describe("website Meta tracking context", () => {
  it("does not block form submission when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {});
    try {
      expect(prepareMetaLeadPayload({}).meta_tracking).toMatchObject({ event_id: expect.stringMatching(/^lead:/) });
    } finally { vi.unstubAllGlobals(); }
  });

  it("uses the supplied client lead ID for browser/server deduplication", () => {
    const payload = prepareMetaLeadPayload({ client_lead_id: "existing-id", note: "keep" });
    expect(payload.meta_tracking).toMatchObject({ event_id: "lead:existing-id" });
    expect(payload.note).toBe("keep");
  });

  it("keeps the original fbclid timestamp across form navigation", () => {
    window.history.replaceState({}, "", "/?fbclid=click");
    const first = captureLeadAttribution();
    window.history.replaceState({}, "", "/apply");
    expect(prepareMetaLeadPayload({}).meta_tracking).toMatchObject({ fbc: `fb.1.${first.fbclid_time}.click` });
  });

  it("reads existing Pixel cookies without creating fake ones", () => {
    document.cookie = "_fbp=fb.1.1792317600000.browser; path=/";
    expect(prepareMetaLeadPayload({}).meta_tracking).toMatchObject({ fbp: "fb.1.1792317600000.browser", fbc: undefined });
  });

  it("keeps browser conversions disabled until explicitly configured", () => {
    const fbq = vi.fn(); window.fbq = fbq;
    const payload = prepareMetaLeadPayload({ client_lead_id: "existing-id" });
    trackStoredMetaLead(payload);
    expect(fbq).not.toHaveBeenCalled();
    vi.stubEnv("VITE_META_LEAD_EVENTS_ENABLED", "true");
    trackStoredMetaLead(payload);
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: "lead:existing-id" });
  });

  it("honours an explicit sharing opt-out and tolerates Pixel failure", () => {
    vi.stubEnv("VITE_META_LEAD_EVENTS_ENABLED", "true");
    window.fbq = vi.fn(() => { throw new Error("pixel blocked"); });
    trackStoredMetaLead(prepareMetaLeadPayload({ meta_tracking: { sharing_allowed: false } }));
    expect(window.fbq).not.toHaveBeenCalled();
    expect(() => trackStoredMetaLead(prepareMetaLeadPayload({}))).not.toThrow();
  });
});
