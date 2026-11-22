import { withLeadAttribution } from "./leadAttribution";

const cookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const pair = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!pair) return "";
  try { return decodeURIComponent(pair.slice(name.length + 1)).slice(0, 500); } catch { return ""; }
};
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export const prepareMetaLeadPayload = (payload: Record<string, unknown> = {}): Record<string, unknown> => {
  const next = withLeadAttribution(payload);
  const previous = asRecord(next.meta_tracking);
  const generatedId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
  const clientId = typeof next.client_lead_id === "string" && /^[A-Za-z0-9_-]{1,150}$/.test(next.client_lead_id)
    ? next.client_lead_id : generatedId;
  const attribution = asRecord(next.attribution);
  const fbclid = typeof attribution.fbclid === "string" && /^[A-Za-z0-9._-]+$/.test(attribution.fbclid) ? attribution.fbclid : "";
  const clickTime = typeof attribution.fbclid_time === "string" && /^\d{13}$/.test(attribution.fbclid_time) ? attribution.fbclid_time : "";
  return {
    ...next,
    meta_tracking: {
      event_id: `lead:${clientId}`,
      ...(previous.sharing_allowed === false ? { sharing_allowed: false } : {}),
      fbc: fbclid && clickTime ? `fb.1.${clickTime}.${fbclid}` : cookie("_fbc") || undefined,
      fbp: cookie("_fbp") || undefined,
    },
  };
};

/** Opt-in after the GTM audit. The exact stored event ID is used on both channels. */
export const trackStoredMetaLead = (payload: Record<string, unknown>): void => {
  const tracking = asRecord(payload.meta_tracking);
  if (import.meta.env.VITE_META_LEAD_EVENTS_ENABLED !== "true" || tracking.sharing_allowed === false || typeof window === "undefined") return;
  try {
    window.fbq?.("track", "Lead", {}, { eventID: tracking.event_id });
  } catch {
    // Analytics must never turn a successfully saved lead into a form error.
  }
};
