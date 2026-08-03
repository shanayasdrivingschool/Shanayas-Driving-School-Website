/**
 * GTM dataLayer events.
 *
 * The container (GTM-WBHTLPVS) is loaded unconditionally from index.html, so
 * window.dataLayer already exists by the time React runs. It is still created
 * defensively here: GTM's own snippet does the same, and a push that silently
 * no-ops would lose conversions rather than throw.
 */

/** GTM trigger: Custom Event, event name `lead_submit`. */
export const LEAD_SUBMIT_EVENT = "lead_submit";

export type LeadConversion = {
  /** Which CTA the visitor came through, e.g. "lesson_booking". */
  intent: string;
  /** Route the lead was captured on, so one trigger can serve several pages. */
  sourcePage: string;
  /** Email is optional on these forms; useful for scoring lead quality. */
  emailProvided: boolean;
};

/**
 * Records a confirmed lead.
 *
 * Call this only AFTER the lead is stored, never in the submit handler's opening
 * lines. GTM's built-in Form Submission trigger fires on the submit event itself,
 * which counts failed, rate-limited and captcha-blocked attempts as conversions
 * and inflates the number Google Ads bids against. These forms also never change
 * URL on success, so a thank-you-page trigger has nothing to match.
 */
export const pushLeadConversion = ({ intent, sourcePage, emailProvided }: LeadConversion) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: LEAD_SUBMIT_EVENT,
    lead_intent: intent,
    lead_source_page: sourcePage,
    lead_email_provided: emailProvided,
  });
};
