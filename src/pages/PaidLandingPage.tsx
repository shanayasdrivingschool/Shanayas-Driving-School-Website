import { useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { RoadTestConfidencePackages, RoadTestConfidenceStages } from "@/components/RoadTestConfidenceOffer";
import LandingMediaGallery from "@/components/LandingMediaGallery";
import VehicleGallery from "@/components/VehicleGallery";
import { LandingHeroProof, VariantLessonChoices } from "@/components/PaidLandingVariantContent";
import { applyPaidLandingVariant, getPaidLandingVariant, getVariantReviews, getControlReviews, type PaidLandingVariant } from "@/data/paidLandingVariants";
import PaidLandingReviews from "@/components/PaidLandingReviews";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { courseCatalogById } from "@/data/courseCatalog";
import { createCourseLocationPricing, formatCoursePrice, getCourseAddOnLessonPrice } from "@/data/coursePricing";
import { paidLandingPagesById, type PaidLandingPageConfig, type PaidLandingPageId } from "@/data/paidLandingPages";
import { branchLocations } from "@/data/branchLocations";
import { paidLandingOffers } from "@/data/paidLandingOffers";
import { googleReviewsUrl, rating, ratingCheckedOn, reviewCount } from "@/data/beginnerCourseLanding";
import { getCaptchaVerification } from "@/lib/captcha";
import { pushCallbackOpen, pushClickToCall, pushLandingCtaClick, pushLandingFormStart, pushLandingView, pushLeadConversion } from "@/lib/analytics";
import type { PaidLeadAttribution } from "@/lib/leadService";

const PHONE_DISPLAY = "(250) 542-3673";
const PHONE_HREF = "tel:+12505423673";
const ATTRIBUTION_KEY = "shanayas_paid_landing_attribution";
const primaryButton = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#C91F24] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ad191e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60";
const textLink = "inline-flex min-h-[44px] items-center gap-2 font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";
const fieldClassName = "mt-1.5 min-h-[48px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-base text-slate-900 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-blue-200";
type TrackingContext = { landingVariant?: string; landingPageId: string; sourcePage: string; contentGroup: string; funnel: string };
type CtaHandler = (location: string, trigger: HTMLElement, packageName?: string) => void;

const createLeadId = () => typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  ? crypto.randomUUID() : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const cleanAttributionValue = (value: string | null) => value?.trim().slice(0, 300) || undefined;

const readAttribution = (landingPageId: string): PaidLeadAttribution => {
  if (typeof window === "undefined") return { landingPageId };

  let saved: PaidLeadAttribution = {};
  try {
    saved = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}") as PaidLeadAttribution;
  } catch {
    saved = {};
  }

  const params = new URLSearchParams(window.location.search);
  const next: PaidLeadAttribution = {
    ...saved,
    landingPageId,
    campaign: cleanAttributionValue(params.get("campaign")) ?? saved.campaign,
    adGroup: cleanAttributionValue(params.get("adgroup")) ?? saved.adGroup,
    gclid: cleanAttributionValue(params.get("gclid")) ?? saved.gclid,
    utmSource: cleanAttributionValue(params.get("utm_source")) ?? saved.utmSource,
    utmMedium: cleanAttributionValue(params.get("utm_medium")) ?? saved.utmMedium,
    utmCampaign: cleanAttributionValue(params.get("utm_campaign")) ?? saved.utmCampaign,
    utmContent: cleanAttributionValue(params.get("utm_content")) ?? saved.utmContent,
    utmTerm: cleanAttributionValue(params.get("utm_term")) ?? saved.utmTerm,
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  } catch {
    // The lead can still be submitted when storage is disabled.
  }

  return next;
};

const CallLink = ({ tracking, location, className = "", short = false }: { tracking: TrackingContext; location: string; className?: string; short?: boolean }) => (
  <a href={PHONE_HREF} onClick={() => pushClickToCall(tracking, location)} className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${className}`}>
    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />{short ? "Call Now" : `Call ${PHONE_DISPLAY}`}
  </a>
);

const CallbackDialog = ({ config, tracking, open, onOpenChange, triggerRef, selectedPackage, variant }: {
  config: PaidLandingPageConfig;
  tracking: TrackingContext;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement>;
  selectedPackage?: string;
  variant?: PaidLandingVariant;
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionLock = useRef(false);
  const formStartedRef = useRef(false);
  const leadIdRef = useRef(createLeadId());
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const attribution = useMemo(() => readAttribution(config.id), [config.id]);

  useEffect(() => { if (isSubmitted) successRef.current?.focus(); }, [isSubmitted]);
  useEffect(() => { if (submitError) errorRef.current?.focus(); }, [submitError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionLock.current || isSubmitted) return;
    if (!fullName.trim() || phone.replace(/\D/g, "").length < 10) {
      setSubmitError("Please enter your full name and a phone number with at least 10 digits.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    submissionLock.current = true;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const captcha = await getCaptchaVerification("paid_landing_lead_submit");
      // Keep the CRM client off the initial landing-page download.
      const { submitFreeTrialLead } = await import("@/lib/leadService");
      await submitFreeTrialLead({
        fullName, phone, email,
        // Preserve the existing CRM request type and event triggers. The note is
        // surfaced in admin and lead emails, including the optional notes.
        intent: "lesson_plan_request",
        sourcePage: tracking.sourcePage,
        goal: config.conversion.defaultGoal,
        note: ["Free callback requested.", config.supportProgramme ? "Programme: Road Test Confidence." : null, variant ? `Landing variant: ${variant.id} (${variant.adGroup}).` : null, selectedPackage ? `${variant ? "Lesson interest" : "Package interest"}: ${selectedPackage}.` : null, notes.trim() ? `Notes: ${notes.trim()}` : null].filter(Boolean).join(" "),
        marketingConsent: false,
        consentTimestamp: new Date().toISOString(),
        leadId: leadIdRef.current,
        attribution,
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });
      setIsSubmitted(true);
      pushLeadConversion({ intent: "lesson_plan_request", sourcePage: tracking.sourcePage, emailProvided: true, leadId: leadIdRef.current, landingPageId: config.id, landingVariant: variant?.id });
    } catch (error) {
      console.error("Paid landing callback request failed:", error);
      setSubmitError(`We could not send your request. Please try again or call ${PHONE_DISPLAY}.`);
      submissionLock.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = isSubmitted ? (
    <div ref={successRef} tabIndex={-1} role="status" className="rounded-xl bg-slate-50 p-5 focus:outline-none focus:ring-2 focus:ring-blue-300">
      <Check className="h-8 w-8 text-emerald-700" aria-hidden="true" />
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{config.conversion.thankYouCopy}</p>
      <CallLink tracking={tracking} location="success" className="mt-4 border border-[#1d52a1] text-[#1d52a1]" />
    </div>
  ) : (
    <form aria-label="Request a callback" onSubmit={handleSubmit} onChangeCapture={() => {
      if (!formStartedRef.current) { formStartedRef.current = true; pushLandingFormStart(tracking); }
    }} className="space-y-4" aria-busy={isSubmitting}>
      <div>
        <label htmlFor={`${config.id}-name`} className="text-sm font-bold">Full name <span className="font-normal text-slate-500">(required)</span></label>
        <input id={`${config.id}-name`} name="fullName" type="text" autoComplete="name" required maxLength={150} value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClassName} />
      </div>
      <div>
        <label htmlFor={`${config.id}-phone`} className="text-sm font-bold">Phone number <span className="font-normal text-slate-500">(required)</span></label>
        <input id={`${config.id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClassName} />
      </div>
      <div>
        <label htmlFor={`${config.id}-email`} className="text-sm font-bold">Email address <span className="font-normal text-slate-500">(required)</span></label>
        <input id={`${config.id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClassName} />
      </div>
      <div>
        <label htmlFor={`${config.id}-notes`} className="text-sm font-bold">Notes <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id={`${config.id}-notes`} name="notes" rows={3} maxLength={2000} placeholder={variant?.notesPlaceholder ?? "Anything you’d like us to know"} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${fieldClassName} resize-y py-3`} />
      </div>
      <button type="submit" disabled={isSubmitting} className={`${primaryButton} w-full`}>
        {isSubmitting ? "Sending request…" : "Request a Callback"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className="text-center text-sm text-slate-600">No payment required to enquire.</p>
      {submitError && <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300">{submitError}</p>}
      <p className="text-xs leading-relaxed text-slate-500">By submitting, you ask Shanaya’s Driving School to contact you about this enquiry. <Link to="/policies/privacy-policy" className="text-[#1d52a1] underline underline-offset-2">Privacy policy</Link>.</p>
    </form>
  );

  // Form state lives outside the portalled content so closing and reopening
  // the dialog preserves entered details, pending requests and confirmation.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 text-slate-950 sm:p-7 [&>button:last-child]:right-2 [&>button:last-child]:top-2 [&>button:last-child]:flex [&>button:last-child]:h-11 [&>button:last-child]:w-11 [&>button:last-child]:items-center [&>button:last-child]:justify-center"
        onOpenAutoFocus={(event) => {
          if (isSubmitted) { event.preventDefault(); successRef.current?.focus(); }
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
        }}
      >
        <DialogTitle className="pr-8 text-2xl font-black leading-tight">{isSubmitted ? "Callback request received" : "Request a Callback"}</DialogTitle>
        <DialogDescription className={isSubmitted ? "sr-only" : "text-sm leading-relaxed text-slate-600"}>
          {isSubmitted ? "Your callback request was submitted successfully." : config.conversion.formDescription}
        </DialogDescription>
        {selectedPackage && !isSubmitted && <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-[#1d52a1]">{variant ? "Lesson interest" : "Package interest"}: {selectedPackage}</p>}
        {content}
      </DialogContent>
    </Dialog>
  );
};

const PackageCards = ({ config, tracking }: { config: PaidLandingPageConfig; tracking: TrackingContext }) => (
  <section aria-labelledby="pricing-heading" className="bg-[#F7F8FA] py-12 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 id="pricing-heading" className="text-2xl font-black tracking-tight sm:text-3xl">{config.pricingHeading}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">Prices are in Canadian dollars before GST. Standard-area prices are shown; confirm the price for your location, availability and booking terms with our team.</p>
      <div className="mt-7 grid items-stretch gap-5 lg:grid-cols-3">
        {config.products.map(({ id }) => {
          const course = courseCatalogById[id];
          const offer = paidLandingOffers[id];
          if (!course || !offer) return null;
          const price = createCourseLocationPricing(course).standard;
          const mockPrice90 = id === "mock-test-evaluation" ? createCourseLocationPricing(course, 90).standard : null;
          return (
            <article key={id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-bold text-[#0B1A33]">{offer.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#1d52a1]">{offer.duration ?? course.duration}</p>
              <div className="mt-5 border-y border-slate-100 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {price.originalLabel && <p className="text-lg text-slate-500"><span className="sr-only">Regular price: </span><s>{price.originalLabel}</s></p>}
                  <p className="text-3xl font-black tracking-tight">{price.originalLabel && <span className="sr-only">Discounted price: </span>}{price.label}<span className="ml-2 text-sm font-medium text-slate-500">CAD + GST</span></p>
                </div>
                {mockPrice90 && <p className="mt-2 text-sm text-slate-600">Or {mockPrice90.label} CAD + GST for 90 minutes</p>}
                {price.originalLabel && <p className="mt-2 text-xs leading-relaxed text-slate-500">{price.discountPercent}% catalogue discount for eligible self-funded, standard-area bookings. Sponsored or third-party-funded enrolments pay the standard rate. Cannot be combined with another promotion. Confirm the current offer and total before booking. <Link to="/policies/promotions-and-discounts" className="inline-flex min-h-11 items-center text-[#1d52a1] underline underline-offset-4">Discount eligibility and terms</Link></p>}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{offer.description}</p>
              <details className="mt-3 text-sm text-slate-700"><summary className="flex min-h-11 cursor-pointer items-center font-semibold text-[#1d52a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">Lesson details</summary><ul className="mt-2 space-y-3">
                {offer.highlights.map((item) => <li key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" aria-hidden="true" /><span>{item}</span></li>)}
              </ul></details>
              {id === "lesson-road-test-prep-course" && <p className="mt-4 text-xs leading-relaxed text-slate-500">Optional 60-minute practice lessons: {formatCoursePrice(getCourseAddOnLessonPrice(course))} CAD + GST each. The package already includes one hour of preparation. Confirm test-centre coverage and pickup arrangements in your written quote.</p>}
              <div className="mt-auto grid gap-1 pt-5">
                <Link to={`/courses/${id}`} onClick={() => pushLandingCtaClick(tracking, "Book Your Course Now", `product-${id}`)} className={primaryButton}>Book Your Course Now <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>
          );
        })}
      </div>
      {config.id === "road-test" ? (
        <p className="mt-5 text-sm text-slate-600">New to driving? <Link to="/lp/beginner-driving-lessons" className={textLink}>Explore our beginner driving lessons.</Link></p>
      ) : <Link to="/pricing" className={`${textLink} mt-5 text-sm`}>Explore all lesson prices <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
    </div>
  </section>
);

const InstructorAndVehicle = () => (
  <section aria-labelledby="instructor-heading" className="bg-white py-12 sm:py-16">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="instructor-heading" className="text-2xl font-black tracking-tight sm:text-3xl">Learn With an Instructor Who Understands Your Goals</h2>
        <p className="mt-4 leading-relaxed text-slate-600">Tell us what you want to work on and where you would like more support. Discuss your experience with the instructor, practise at a suitable pace and use feedback to plan your next lessons.</p>
        <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
          {["Patient, supportive instruction", "Personalised feedback", "Dual-control training vehicle"].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#1d52a1]" aria-hidden="true" />{item}</li>)}
        </ul>
        <Link to="/icbc-approved-driving-school" className={`${textLink} mt-4 text-sm`}>School licensing information <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
      <VehicleGallery />
    </div>
  </section>
);

const HowItWorks = ({ config, variant }: { config: PaidLandingPageConfig; variant?: PaidLandingVariant }) => (
  <section aria-labelledby="steps-heading" className="border-y border-slate-200 bg-[#F7F8FA] py-12 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 id="steps-heading" className="text-2xl font-black tracking-tight sm:text-3xl">Getting Started Is Simple</h2>
      <ol className="mt-7 grid gap-7 md:grid-cols-3">
        {(variant?.steps ?? [
          { title: config.id === "road-test" ? "Tell Us About Your Test" : "Tell Us About Your Goals", body: config.id === "road-test" ? "Request a callback, then share your test date, location and preparation needs." : "Request a callback, then tell us about your experience, lesson area and goals." },
          { title: config.id === "road-test" ? "Get Your Preparation Plan" : "Explore Your Lesson Options", body: "Discuss suitable lessons, pricing and availability with our team." },
          { title: "Book Your Lessons", body: "Confirm your preferred available lesson or package and get started." },
        ]).map((step, index) => <li key={step.title}><span className="text-sm font-bold text-[#1d52a1]">0{index + 1}</span><h3 className="mt-2 text-lg font-bold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p></li>)}
      </ol>
    </div>
  </section>
);

const FAQAndAreas = ({ config }: { config: PaidLandingPageConfig }) => (
  <section aria-labelledby="faq-heading" className="bg-white py-12 sm:py-16">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <h2 id="faq-heading" className="text-2xl font-black tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {config.faqs.map((faq) => <details key={faq.question} className="group">
            <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 [&::-webkit-details-marker]:hidden">{faq.question}<span aria-hidden="true" className="text-xl text-[#1d52a1] group-open:rotate-45">+</span></summary>
            <div className="pb-5 text-sm leading-relaxed text-slate-600"><p>{faq.answer}</p>{faq.link && <Link to={faq.link.href} className={`${textLink} mt-2`}>{faq.link.label}</Link>}</div>
          </details>)}
        </div>
      </div>
      <div className="self-start rounded-2xl bg-[#F7F8FA] p-6">
        <MapPin className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
        <h2 className="mt-3 text-xl font-bold">{config.id === "road-test" ? "Road-Test Preparation Across Greater Victoria" : "Driving Lessons Across Greater Victoria"}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{config.serviceAreaIntro}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{config.serviceAreas.map((area) => <li key={area} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">{area}</li>)}</ul>
        <p className="mt-5 text-xs leading-relaxed text-slate-600">Pickup arrangements and availability are confirmed for your address and preferred time.</p>
        <div id="lesson-locations" className="mt-5 space-y-4 border-t border-slate-200 pt-4">
          {branchLocations.map((branch) => <div key={branch.id}><h3 className="text-sm font-bold">{branch.label}</h3><p className="mt-1 text-sm text-slate-600">{branch.street}, {branch.city}, BC {branch.postalCode}</p><a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} text-sm`}>Directions to {branch.city === "Victoria" ? "James Bay" : "Langford"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a></div>)}
        </div>
      </div>
    </div>
  </section>
);

const PaidLandingPage = ({ pageId }: { pageId: PaidLandingPageId }) => {
  const location = useLocation();
  const variant = getPaidLandingVariant(pageId, location.search);
  const config = useMemo(() => applyPaidLandingVariant(paidLandingPagesById[pageId], variant), [pageId, variant]);
  const reviews = useMemo(() => variant ? getVariantReviews(variant) : getControlReviews(pageId), [variant, pageId]);
  const viewKey = `${location.pathname}:${variant?.id ?? "control"}`;
  const callbackTriggerRef = useRef<HTMLElement>(null);
  const viewedPathRef = useRef("");
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>();
  const tracking = useMemo<TrackingContext>(() => ({ landingVariant: variant?.id, landingPageId: config.id, sourcePage: location.pathname, contentGroup: config.analytics.contentGroup, funnel: config.analytics.funnel }), [config, location.pathname, variant]);

  useEffect(() => {
    if (viewedPathRef.current === viewKey) return;
    viewedPathRef.current = viewKey;
    readAttribution(config.id);
    pushLandingView(tracking);
  }, [config.id, viewKey, tracking]);

  const onPrimaryCta: CtaHandler = (ctaLocation, trigger, packageName) => {
    pushLandingCtaClick(tracking, trigger.textContent?.trim() || config.conversion.primaryCta, ctaLocation);
    if (!callbackOpen) pushCallbackOpen(tracking, ctaLocation);
    setSelectedPackage(packageName);
    callbackTriggerRef.current = trigger;
    setCallbackOpen(true);
  };

  return (
    <div className="paid-landing-page bg-white text-slate-950 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
      <header className="border-b border-white/15 bg-[#0B1A33] text-white">
        <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="max-w-[12rem] text-base font-black leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:max-w-none">Shanaya’s Driving School</Link>
          <div className="flex items-center gap-3"><CallLink tracking={tracking} location="header" short className="border border-white/30" /><button type="button" onClick={(event) => onPrimaryCta("header", event.currentTarget)} className={`${primaryButton} hidden md:inline-flex`}>Request a Callback</button></div>
        </div>
      </header>
      <main>
        <section aria-labelledby="landing-heading" className="bg-[#0B1A33] text-white">
          <div className={`mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20 grid items-center gap-7 lg:grid-cols-[1.2fr_1fr] lg:gap-12`}>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-200">{config.hero.eyebrow}</p>
              <h1 id="landing-heading" className="mt-3 max-w-2xl text-[2rem] font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]" style={{ textWrap: "balance" }}>{config.hero.h1}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{config.hero.subhead}</p>
              {config.hero.priceHighlights && <div className="mt-4" aria-label="Standard lesson rates">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">{config.hero.priceHighlights.map((rate) => <p key={rate.detail}>{rate.detail}: {rate.label}</p>)}</div>
                <p className="mt-1 text-xs leading-relaxed text-white/75">Standard-area rates + GST. Courses, packages and eligible discounts may differ.</p>
              </div>}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={(event) => onPrimaryCta("hero", event.currentTarget)} className={primaryButton}>Request a Callback <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                <CallLink tracking={tracking} location="hero" className="border border-white/40 hover:bg-white/10" />
              </div>
              {!config.supportProgramme && <p className="mt-3 text-sm text-white/80">Free callback. No payment required to enquire.</p>}
              {config.id === "near-me" && <div className="mt-4 text-sm leading-relaxed text-white/85">
                {branchLocations.map((branch) => <p key={branch.id}><span className="font-semibold">{branch.city === "Victoria" ? "James Bay" : "Langford"}:</span> {branch.street}</p>)}
                <p className="mt-1 text-xs text-white/75">Pickup and any travel charge confirmed for your address and time.</p>
              </div>}
              {config.supportProgramme && <p className="mt-3 text-sm text-white/80">No payment to enquire. We’ll confirm the package terms before you book.</p>}
              <p className="mt-4 text-xs leading-relaxed text-white/80 lg:hidden">Patient instruction · Dual-control training vehicles</p>
              <div className="mt-5 hidden lg:block">
                <ul className="space-y-2 text-sm text-white/80">{config.hero.proofPoints.map((point) => <li key={point} className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-200" aria-hidden="true" />{point}</li>)}</ul>
              </div>
              {rating && reviewCount ? <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-[44px] items-center gap-2 text-xs leading-relaxed text-white/75 underline underline-offset-4"><Star className="h-4 w-4 shrink-0 fill-amber-300 text-amber-300" aria-hidden="true" /><span>{rating}/5 from {reviewCount} Google reviews · checked {ratingCheckedOn}</span></a> : null}
            </div>
            <LandingHeroProof review={reviews[0]} />
          </div>
        </section>
        {config.supportProgramme && <RoadTestConfidencePackages onPrimaryCta={onPrimaryCta} />}
        {variant ? <VariantLessonChoices variant={variant} onChoose={(title, trigger) => onPrimaryCta("lesson-choice", trigger, title)} /> : !config.supportProgramme && <PackageCards config={config} tracking={tracking} />}
        <PaidLandingReviews reviews={reviews} prioritised />
        <InstructorAndVehicle />
        {config.supportProgramme ? <RoadTestConfidenceStages /> : <HowItWorks config={config} variant={variant} />}
        <FAQAndAreas config={config} />
        <LandingMediaGallery />
        <section aria-labelledby="final-heading" className="bg-[#0B1A33] px-4 py-12 text-center text-white sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <MessageCircle className="mx-auto h-7 w-7 text-blue-200" aria-hidden="true" />
            <h2 id="final-heading" className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">{config.finalHeading}</h2>
            <p className="mt-4 leading-relaxed text-white/80">{variant?.finalCopy ?? `Speak with our team about your ${config.id === "road-test" ? "preparation" : "lesson"} options, availability and next steps.`}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={(event) => onPrimaryCta("final", event.currentTarget)} className={primaryButton}>Request a Callback</button><CallLink tracking={tracking} location="final" className="border border-white/40 hover:bg-white/10" /></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/15 bg-[#0B1A33] py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-4 sm:px-6 lg:flex-row">
          <div><p className="font-black">Shanaya’s Driving School</p><div className="mt-2 space-y-2 text-sm text-white/70">{branchLocations.map((branch) => <p key={branch.id}><span className="font-semibold">{branch.footerLabel}:</span> {branch.street}, {branch.city}, BC {branch.postalCode}</p>)}</div><div className="mt-2 flex flex-col items-start"><a href={PHONE_HREF} onClick={() => pushClickToCall(tracking, "footer")} className="inline-flex min-h-[44px] items-center text-sm underline underline-offset-4">{PHONE_DISPLAY}</a><a href="mailto:book@drivingschoolbc.ca" className="inline-flex min-h-[44px] items-center break-all text-sm underline underline-offset-4">book@drivingschoolbc.ca</a></div></div>
          <nav aria-label="Landing page policies" className="flex flex-wrap content-start gap-x-5 text-sm text-white/80">{[{ label: "Privacy Policy", path: "privacy-policy" }, { label: "Terms and Conditions", path: "terms-and-conditions" }, { label: "Cancellation Policy", path: "cancellation-and-rescheduling" }].map(({ label, path }) => <Link key={path} to={`/policies/${path}`} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{label}</Link>)}<Link to="/contact" className="inline-flex min-h-[44px] items-center underline underline-offset-4">Contact</Link></nav>
        </div>
      </footer>
      <CallbackDialog key={viewKey} variant={variant} config={config} tracking={tracking} open={callbackOpen} onOpenChange={setCallbackOpen} triggerRef={callbackTriggerRef} selectedPackage={selectedPackage} />
      <div data-testid="mobile-callback-bar" className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#0B1A33] px-4 pt-3 lg:hidden ${callbackOpen ? "hidden" : ""}`} style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] gap-2"><button type="button" onClick={(event) => onPrimaryCta("mobile-sticky", event.currentTarget)} className={primaryButton}>Request Callback</button><CallLink tracking={tracking} location="mobile-sticky" short className="border border-white/40 text-white" /></div>
      </div>
    </div>
  );
};

export default PaidLandingPage;
