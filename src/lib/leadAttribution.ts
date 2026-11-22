const STORAGE_KEY = "shanayas_lead_attribution";
const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

const clean = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 500) : "";

/** Keep the latest tagged visit within this tab, including navigation to /apply or /contact. */
export const captureLeadAttribution = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const current: Record<string, string> = {};
  for (const key of TRACKING_KEYS) {
    const value = clean(params.get(key));
    if (value) current[key] = value;
  }

  try {
    const saved = asRecord(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}"));
    if (current.fbclid) current.fbclid_time = current.fbclid === saved.fbclid && /^\d{13}$/.test(clean(saved.fbclid_time))
      ? clean(saved.fbclid_time) : String(Date.now());
    if (Object.keys(current).length) {
      // Replace the whole touch: an old fbclid must not override a later Google campaign.
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    }
    return Object.fromEntries([...TRACKING_KEYS, "fbclid_time"].flatMap((key) => clean(saved[key]) ? [[key, clean(saved[key])]] : []));
  } catch {
    if (current.fbclid && !current.fbclid_time) current.fbclid_time = String(Date.now());
    return current;
  }
};

export const withLeadAttribution = (payload: Record<string, unknown> = {}): Record<string, unknown> => {
  const captured = captureLeadAttribution();
  const previous = { ...asRecord(payload.attribution) };
  if (Object.keys(captured).length) {
    for (const key of [...TRACKING_KEYS, "fbclid_time"]) delete previous[key];
  }
  const attribution = { ...previous, ...captured };
  return Object.keys(attribution).length ? { ...payload, attribution } : payload;
};

/** Source is attribution evidence, separate from the page where a form was submitted. */
export const getLeadSource = (lead: { sourcePage: string; payload: unknown }): string => {
  const payload = asRecord(lead.payload);
  const attribution = asRecord(payload.attribution);
  const source = clean(attribution.utm_source || payload.utm_source || payload.source).toLowerCase();
  if (["meta", "facebook", "fb", "instagram", "ig", "facebook.com", "instagram.com"].includes(source)) return "Meta";
  if (source === "google") return "Google";
  // Explicit source takes priority over an older click ID.
  if (source) return source;
  if (clean(attribution.fbclid || payload.fbclid) || clean(payload.meta_lead_id) || lead.sourcePage === "/meta-lead-ad") return "Meta";
  if (clean(attribution.gclid || payload.gclid)) return "Google";
  if (lead.sourcePage === "/admin/manual") return "Manual";
  // Neither a website URL nor a Pixel browser cookie establishes acquisition source.
  return "Unknown";
};
