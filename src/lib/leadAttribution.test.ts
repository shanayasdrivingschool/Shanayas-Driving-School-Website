import { beforeEach, describe, expect, it, vi } from "vitest";
import { captureLeadAttribution, getLeadSource, withLeadAttribution } from "./leadAttribution";

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("lead acquisition source", () => {
  it.each(["meta", "facebook", "fb", "instagram", "ig"])("labels %s campaign leads as Meta", (source) => {
    expect(getLeadSource({ sourcePage: "/apply", payload: { attribution: { utm_source: source } } })).toBe("Meta");
  });

  it("keeps a Meta click through navigation to the application form", () => {
    window.history.replaceState({}, "", "/?fbclid=test-click&utm_campaign=lessons");
    captureLeadAttribution();
    window.history.replaceState({}, "", "/apply");
    const payload = withLeadAttribution({ request_type: "lesson_booking" });
    expect(payload.request_type).toBe("lesson_booking");
    expect(getLeadSource({ sourcePage: "/apply", payload })).toBe("Meta");
  });

  it("replaces stale campaign identifiers on a later tagged visit", () => {
    window.history.replaceState({}, "", "/?fbclid=old&utm_source=facebook");
    captureLeadAttribution();
    window.history.replaceState({}, "", "/?utm_source=google&gclid=new");
    const payload = withLeadAttribution({ attribution: { landing_page_id: "beginner", fbclid: "old" } });
    expect(payload.attribution).toEqual({ landing_page_id: "beginner", utm_source: "google", gclid: "new" });
    expect(getLeadSource({ sourcePage: "/apply", payload })).toBe("Google");
  });

  it("replaces stale paid-page UTMs when a new Meta click has no UTMs", () => {
    window.history.replaceState({}, "", "/?fbclid=new-meta-click");
    const payload = withLeadAttribution({ attribution: { utm_source: "google", gclid: "old" } });
    expect(getLeadSource({ sourcePage: "/contact", payload })).toBe("Meta");
  });

  it("does not infer Meta from the submission page or a Pixel browser cookie", () => {
    expect(getLeadSource({ sourcePage: "/beginner-driving-lessons-victoria", payload: { fbp: "pixel-cookie" } })).toBe("Unknown");
    expect(getLeadSource({ sourcePage: "/meta-lead-ad", payload: {} })).toBe("Meta");
  });

  it("still submits current attribution when session storage is unavailable", () => {
    window.history.replaceState({}, "", "/?utm_source=instagram");
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    try {
      expect(captureLeadAttribution()).toEqual({ utm_source: "instagram" });
    } finally {
      spy.mockRestore();
    }
  });
});
