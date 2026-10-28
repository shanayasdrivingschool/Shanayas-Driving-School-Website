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
export const LANDING_VIEW_EVENT = "landing_view";
export const CTA_CLICK_EVENT = "assessment_cta_click";
export const FORM_START_EVENT = "form_start";
export const CLICK_TO_CALL_EVENT = "click_to_call";

export type LeadConversion = {
  /** Which CTA the visitor came through, e.g. "lesson_booking". */
  intent: string;
  /** Route the lead was captured on, so one trigger can serve several pages. */
  sourcePage: string;
  /** Email is optional on these forms; useful for scoring lead quality. */
  emailProvided: boolean;
  /** Stable client-generated ID sent with the stored lead for reconciliation. */
  leadId?: string;
  /** Paid landing page configuration ID, when the lead came from that funnel. */
  landingPageId?: string;
};

type LandingEventContext = {
  landingPageId: string;
  sourcePage: string;
  contentGroup: string;
  funnel: string;
};

const pushDataLayerEvent = (event: string, payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
};

export const pushLandingView = (context: LandingEventContext) => {
  pushDataLayerEvent(LANDING_VIEW_EVENT, {
    landing_page_id: context.landingPageId,
    lead_source_page: context.sourcePage,
    content_group: context.contentGroup,
    funnel: context.funnel,
  });
};

export const pushLandingCtaClick = (
  context: LandingEventContext,
  ctaName: string,
  ctaLocation: string,
) => {
  pushDataLayerEvent(CTA_CLICK_EVENT, {
    landing_page_id: context.landingPageId,
    lead_source_page: context.sourcePage,
    content_group: context.contentGroup,
    funnel: context.funnel,
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
};

export const pushLandingFormStart = (context: LandingEventContext) => {
  pushDataLayerEvent(FORM_START_EVENT, {
    landing_page_id: context.landingPageId,
    lead_source_page: context.sourcePage,
    content_group: context.contentGroup,
    funnel: context.funnel,
  });
};

export const pushClickToCall = (context: LandingEventContext, ctaLocation: string) => {
  pushDataLayerEvent(CLICK_TO_CALL_EVENT, {
    landing_page_id: context.landingPageId,
    lead_source_page: context.sourcePage,
    content_group: context.contentGroup,
    funnel: context.funnel,
    cta_location: ctaLocation,
  });
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
export const pushLeadConversion = ({
  intent,
  sourcePage,
  emailProvided,
  leadId,
  landingPageId,
}: LeadConversion) => {
  pushDataLayerEvent(LEAD_SUBMIT_EVENT, {
    lead_intent: intent,
    lead_source_page: sourcePage,
    lead_email_provided: emailProvided,
    lead_id: leadId,
    landing_page_id: landingPageId,
  });
};
