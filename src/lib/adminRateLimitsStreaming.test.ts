import { describe, expect, it, vi, beforeEach } from "vitest";

/* The point of these tests is the streaming contract: the first batch has to reach the
   caller before the last one is fetched, because that is what lets the page paint instead
   of sitting on a skeleton. Signing into the panel is not possible here, so the Supabase
   client and the admin gate are stubbed and the batching is driven directly. */

const range = vi.fn();

vi.mock("@/lib/adminAccess", () => ({
  requireAdminUser: async () => ({ client: fakeClient, user: { id: "admin-1" } }),
  ensureSupabaseClient: () => fakeClient,
  requireSessionUser: async () => ({ id: "admin-1" }),
  isAdminUser: async () => true,
  clearAdminAccessCache: () => undefined,
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {},
  isSupabaseConfigured: true,
  supabaseUrl: "https://example.supabase.co",
  supabaseAnonKey: "anon",
}));

const fakeClient = {
  from: () => ({ select: () => ({ order: () => ({ range }) }) }),
} as never;

const row = (n: number) => ({
  key: `k${n}`,
  endpoint: n % 2 === 0 ? "/a" : "/b",
  window_start: "2026-08-01T00:00:00Z",
  count: n % 7 === 0 ? 9 : 1,
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
});

const { getDirectAdminRateLimits } = await import("@/lib/adminApiDirect");

beforeEach(() => range.mockReset());

describe("getDirectAdminRateLimits streaming", () => {
  it("returns in one round trip and emits no partial when the table fits a batch", async () => {
    range.mockResolvedValueOnce({ data: Array.from({ length: 120 }, (_, i) => row(i)), error: null });
    const onPartial = vi.fn();

    const result = await getDirectAdminRateLimits(onPartial);

    expect(range).toHaveBeenCalledTimes(1);
    expect(onPartial).not.toHaveBeenCalled();
    expect(result.isPartial).toBe(false);
    expect(result.rateLimits).toHaveLength(120);
  });

  it("hands over the first batch before fetching the next", async () => {
    const seenAtFirstPartial: number[] = [];
    range
      .mockResolvedValueOnce({ data: Array.from({ length: 500 }, (_, i) => row(i)), error: null })
      .mockResolvedValueOnce({ data: Array.from({ length: 500 }, (_, i) => row(500 + i)), error: null })
      .mockResolvedValueOnce({ data: Array.from({ length: 10 }, (_, i) => row(1000 + i)), error: null });

    const onPartial = vi.fn((r: { rateLimits: unknown[] }) => {
      // how many fetches had happened when this partial was delivered
      seenAtFirstPartial.push(range.mock.calls.length);
    });

    const result = await getDirectAdminRateLimits(onPartial);

    // The first partial must arrive after fetch #1 and before fetch #2 completes.
    expect(seenAtFirstPartial[0]).toBe(1);
    expect(onPartial).toHaveBeenCalledTimes(2);
    expect(onPartial.mock.calls[0][0].rateLimits).toHaveLength(500);
    expect(onPartial.mock.calls[0][0]).toMatchObject({ isPartial: true });

    expect(result.isPartial).toBe(false);
    expect(result.rateLimits).toHaveLength(1010);
  });

  it("does not let a later partial mutate an earlier one", async () => {
    range
      .mockResolvedValueOnce({ data: Array.from({ length: 500 }, (_, i) => row(i)), error: null })
      .mockResolvedValueOnce({ data: [row(500)], error: null });

    const partials: { rateLimits: unknown[] }[] = [];
    await getDirectAdminRateLimits((p) => partials.push(p));

    expect(partials).toHaveLength(1);
    expect(partials[0].rateLimits).toHaveLength(500);
  });

  it("surfaces a Supabase error instead of returning a truncated table", async () => {
    range.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(getDirectAdminRateLimits()).rejects.toThrow("boom");
  });
});
