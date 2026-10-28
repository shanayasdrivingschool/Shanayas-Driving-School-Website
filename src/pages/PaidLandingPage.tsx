import { useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import { courseCatalogById } from "@/data/courseCatalog";
import { createCourseLocationPricing, formatCoursePrice } from "@/data/coursePricing";
import {
  paidLandingPagesById,
  paidLandingTestimonials,
  type PaidLandingGoal,
  type PaidLandingPageConfig,
  type PaidLandingPageId,
} from "@/data/paidLandingPages";
import {
  googleReviewsUrl,
  rating,
  ratingCheckedOn,
  reviewCount,
} from "@/data/beginnerCourseLanding";
import { getCaptchaVerification } from "@/lib/captcha";
import {
  pushClickToCall,
  pushLandingCtaClick,
  pushLandingFormStart,
  pushLandingView,
  pushLeadConversion,
} from "@/lib/analytics";
import { submitFreeTrialLead, type PaidLeadAttribution } from "@/lib/leadService";

const PHONE_DISPLAY = "(250) 542-3673";
const PHONE_HREF = "tel:+12505423673";
const SCHOOL_MAP_EMBED_URL = "https://www.google.com/maps?q=124-2770%20Leigh%20Rd%2C%20Langford%2C%20BC%20V9B%204G1&output=embed";
const ATTRIBUTION_KEY = "shanayas_paid_landing_attribution";
const CUSTOM_CLASS_DISCOUNT_THRESHOLD = 5;
const CUSTOM_CLASS_DISCOUNT_PERCENT = 30;
const MAX_CUSTOM_CLASS_COUNT = 12;

type PaidLandingPageProps = {
  pageId: PaidLandingPageId;
};

type TrackingContext = {
  landingPageId: string;
  sourcePage: string;
  contentGroup: string;
  funnel: string;
};

const fieldClassName =
  "mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-slate-900 outline-none transition focus:border-[#1d52a1] focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20";

const createLeadId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

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

const AdHeader = ({
  config,
  tracking,
  onPrimaryCta,
}: {
  config: PaidLandingPageConfig;
  tracking: TrackingContext;
  onPrimaryCta: (location: string) => void;
}) => (
  <header className="relative z-30 border-b border-white/15">
    <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
      <Link
        to="/"
        className="max-w-[12rem] text-base font-black leading-tight text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:max-w-none sm:text-lg"
        aria-label="Shanaya's Driving School home"
      >
        Shanaya&apos;s Driving School
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href={PHONE_HREF}
          onClick={() => pushClickToCall(tracking, "header")}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:px-4"
          aria-label={`Call Shanaya's Driving School at ${PHONE_DISPLAY}`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          <span className="sm:hidden">Call</span>
        </a>
        <button
          type="button"
          onClick={() => onPrimaryCta("header")}
          className="hidden min-h-[44px] rounded-full bg-[#E6242A] px-5 text-sm font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 md:inline-flex md:items-center"
        >
          {config.conversion.primaryCta}
        </button>
      </div>
    </div>
  </header>
);

const LeadForm = ({
  config,
  tracking,
  sourcePage,
}: {
  config: PaidLandingPageConfig;
  tracking: TrackingContext;
  sourcePage: string;
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState<PaidLandingGoal>(config.conversion.defaultGoal);
  const [startTiming, setStartTiming] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [licenceClass, setLicenceClass] = useState("");
  const [testDate, setTestDate] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formStartedRef = useRef(false);
  const leadIdRef = useRef(createLeadId());
  const attribution = useMemo(() => readAttribution(config.id), [config.id]);

  const registerFormStart = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    pushLandingFormStart(tracking);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isSubmitted) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const captcha = await getCaptchaVerification("paid_landing_lead_submit");
      const consentTimestamp = new Date().toISOString();
      await submitFreeTrialLead({
        fullName,
        phone,
        email,
        intent: "lesson_plan_request",
        sourcePage,
        goal,
        startTiming,
        serviceArea,
        licenceClass,
        testDate,
        marketingConsent,
        consentTimestamp,
        leadId: leadIdRef.current,
        attribution,
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });

      pushLeadConversion({
        intent: "lesson_plan_request",
        sourcePage,
        emailProvided: email.trim().length > 0,
        leadId: leadIdRef.current,
        landingPageId: config.id,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Paid landing lead submit failed:", error);
      setSubmitError(`We could not send your request. Please try again or call ${PHONE_DISPLAY}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center text-center" role="status">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-black text-slate-950">Request received</h2>
        <p className="mt-3 max-w-sm leading-relaxed text-slate-600">{config.conversion.thankYouCopy}</p>
        <a
          href={PHONE_HREF}
          onClick={() => pushClickToCall(tracking, "success")}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-[#1d52a1] px-6 text-sm font-black text-[#1d52a1] transition hover:bg-[#1d52a1] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/30"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={registerFormStart} className="space-y-3" noValidate={false}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${config.id}-name`} className="text-sm font-bold text-slate-800">
            Name <span className="text-[#E6242A]" aria-hidden="true">*</span>
          </label>
          <input
            id={`${config.id}-name`}
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor={`${config.id}-phone`} className="text-sm font-bold text-slate-800">
            Mobile number <span className="text-[#E6242A]" aria-hidden="true">*</span>
          </label>
          <input
            id={`${config.id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClassName}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${config.id}-goal`} className="text-sm font-bold text-slate-800">
            Main goal <span className="text-[#E6242A]" aria-hidden="true">*</span>
          </label>
          <select
            id={`${config.id}-goal`}
            required
            value={goal}
            onChange={(event) => setGoal(event.target.value as PaidLandingGoal)}
            className={fieldClassName}
          >
            <option value="beginner">Beginner</option>
            <option value="road-test">Road test preparation</option>
            <option value="refresher">Confidence / refresher</option>
            <option value="general">Other / not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${config.id}-start`} className="text-sm font-bold text-slate-800">
            Preferred start <span className="text-[#E6242A]" aria-hidden="true">*</span>
          </label>
          <select
            id={`${config.id}-start`}
            required
            value={startTiming}
            onChange={(event) => setStartTiming(event.target.value)}
            className={fieldClassName}
          >
            <option value="" disabled>Select one</option>
            <option value="within-7-days">Within 7 days</option>
            <option value="within-30-days">Within 30 days</option>
            <option value="researching">Just researching</option>
          </select>
        </div>
      </div>

      <details className="group rounded-xl border border-slate-200 bg-slate-50/80">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-3.5 text-sm font-bold text-[#1d52a1] marker:content-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
          Add optional details
          <Plus className="h-4 w-4 transition group-open:rotate-45" aria-hidden="true" />
        </summary>
        <div className="grid gap-3 border-t border-slate-200 p-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${config.id}-email`} className="text-sm font-bold text-slate-800">
              Email <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id={`${config.id}-email`}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClassName}
            />
          </div>

          {config.conversion.optionalFields.includes("serviceArea") ? (
            <div>
              <label htmlFor={`${config.id}-area`} className="text-sm font-bold text-slate-800">
                Pickup or lesson area <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <select
                id={`${config.id}-area`}
                value={serviceArea}
                onChange={(event) => setServiceArea(event.target.value)}
                className={fieldClassName}
              >
                <option value="">Choose an area</option>
                {config.serviceAreas.map((area) => <option key={area} value={area}>{area}</option>)}
                <option value="other">Another area</option>
              </select>
            </div>
          ) : null}

          {config.conversion.optionalFields.includes("licenceClass") ? (
            <div>
              <label htmlFor={`${config.id}-licence`} className="text-sm font-bold text-slate-800">
                Licence class <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <select
                id={`${config.id}-licence`}
                value={licenceClass}
                onChange={(event) => setLicenceClass(event.target.value)}
                className={fieldClassName}
              >
                <option value="">Choose one</option>
                <option value="class-7l">Class 7L</option>
                <option value="class-7n">Class 7N</option>
                <option value="class-5">Class 5</option>
                <option value="other">Other / not sure</option>
              </select>
            </div>
          ) : null}
          {config.conversion.optionalFields.includes("testDate") ? (
            <div>
              <label htmlFor={`${config.id}-test-date`} className="text-sm font-bold text-slate-800">
                Road-test date <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id={`${config.id}-test-date`}
                type="date"
                value={testDate}
                onChange={(event) => setTestDate(event.target.value)}
                className={fieldClassName}
              />
            </div>
          ) : null}

          <label className="flex items-start gap-2.5 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600 sm:col-span-2">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#1d52a1] focus:ring-[#1d52a1]"
            />
            <span>Optional: I agree to receive future promotions. This is separate from contacting me about this request.</span>
          </label>
        </div>
      </details>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#E6242A] px-6 text-base font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending request…" : "Request My Assessment"}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </button>

      {submitError ? <p role="alert" className="text-sm font-bold text-[#C41E23]">{submitError}</p> : null}

      <details className="group text-[11px] leading-relaxed text-slate-500">
        <summary className="cursor-pointer font-bold text-slate-600 underline decoration-slate-300 underline-offset-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
          Offer and privacy terms
        </summary>
        <p className="mt-2">
          {config.conversion.offerTerms} By submitting, you ask Shanaya&apos;s Driving School to contact you about this enquiry. See the{" "}
          <Link to="/policies/privacy-policy" className="font-bold text-[#1d52a1] underline underline-offset-2">privacy policy</Link>.
        </p>
      </details>
    </form>
  );
};

const HeroWithLeadForm = ({
  config,
  tracking,
  sourcePage,
  formContainerRef,
  onPrimaryCta,
}: {
  config: PaidLandingPageConfig;
  tracking: TrackingContext;
  sourcePage: string;
  formContainerRef: RefObject<HTMLDivElement>;
  onPrimaryCta: (location: string) => void;
}) => (
  <section className="relative isolate overflow-hidden bg-[#0B1A33] text-white">
    {config.hero.imageAsset ? (
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={config.hero.imageAsset}
          alt=""
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,26,51,0.96)_0%,rgba(11,26,51,0.91)_53%,rgba(11,26,51,0.78)_100%)]" />
      </div>
    ) : null}

    <AdHeader config={config} tracking={tracking} onPrimaryCta={onPrimaryCta} />

    <div className="relative z-20 mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.78fr)] lg:items-start lg:gap-12 lg:pb-20">
      <div className="pt-2 lg:pt-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8fc1ff]">{config.hero.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[2.15rem] font-black leading-[1.08] sm:text-5xl lg:text-[3.4rem]" style={{ textWrap: "balance" }}>
          {config.hero.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{config.hero.subhead}</p>

        <ul className="mt-6 grid gap-2.5 text-sm font-bold text-white/95 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {config.hero.proofPoints.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7FD1A6]" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {config.hero.priceHighlights?.length ? (
          <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            {config.hero.priceHighlights.map((price) => (
              <div key={price.detail} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">{price.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{price.detail}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onPrimaryCta("hero")}
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#E6242A] px-7 text-base font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            {config.conversion.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={PHONE_HREF}
            onClick={() => pushClickToCall(tracking, "hero")}
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-white px-7 text-base font-black text-white transition hover:bg-white hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div ref={formContainerRef} id="lead-form" className="scroll-mt-4 rounded-[24px] bg-white p-5 text-slate-950 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Free 30-minute assessment</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">{config.conversion.formHeading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Four quick details are enough to start. No payment is taken here.</p>
        <div className="mt-4">
          <LeadForm config={config} tracking={tracking} sourcePage={sourcePage} />
        </div>
      </div>
    </div>
  </section>
);

const TrustBar = () => (
  <section className="border-b border-slate-200 bg-white" aria-label="Service trust information">
    <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
      {[
        { Icon: BadgeCheck, title: "Licensed instruction", body: "School and instructor credentials are separate from ICBC endorsement." },
        { Icon: Car, title: "Dual-control training", body: "In-car lessons use a school vehicle equipped for instructor intervention." },
        { Icon: ShieldCheck, title: "Clear booking terms", body: "Price, duration and applicable policies are confirmed before payment." },
      ].map(({ Icon, title, body }) => (
        <div key={title} className="flex items-start gap-3">
          <Icon className="mt-0.5 h-6 w-6 shrink-0 text-[#1d52a1]" aria-hidden="true" />
          <div>
            <p className="font-black text-slate-950">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const CoreOfferCards = ({ tracking }: { tracking: TrackingContext }) => {
  const [customClassCount, setCustomClassCount] = useState(1);
  const beginnerCourse = courseCatalogById["beginner-driving-course"];
  const roadTestPackage = courseCatalogById["lesson-road-test-prep-course"];
  const customClass = courseCatalogById["make-your-own-class"];

  if (!beginnerCourse || !roadTestPackage || !customClass) return null;

  const beginnerPricing = createCourseLocationPricing(beginnerCourse).standard;
  const roadTestPricing = createCourseLocationPricing(roadTestPackage).standard;
  const customClassPricing = createCourseLocationPricing(customClass).standard;
  const customSubtotal = Number((customClassPricing.amount * customClassCount).toFixed(2));
  const customDiscountUnlocked = customClassCount >= CUSTOM_CLASS_DISCOUNT_THRESHOLD;
  const customTotal = customDiscountUnlocked
    ? Number((customSubtotal * (1 - CUSTOM_CLASS_DISCOUNT_PERCENT / 100)).toFixed(2))
    : customSubtotal;
  const classesUntilDiscount = Math.max(CUSTOM_CLASS_DISCOUNT_THRESHOLD - customClassCount, 0);
  const discountProgress = Math.min((customClassCount / CUSTOM_CLASS_DISCOUNT_THRESHOLD) * 100, 100);

  const trackPurchase = (location: string, label: string) => {
    pushLandingCtaClick(tracking, label, location);
  };

  return (
    <div className="mt-7 grid items-start gap-5 lg:grid-cols-3">
      <article className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#E6242A] bg-white p-5 shadow-[0_16px_38px_rgba(230,36,42,0.12)]">
        <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#E6242A] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
          Limited-time offer
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-950 lg:min-h-14 lg:pr-28">Beginner&apos;s Driving Course</h3>
          <p className="mt-1 text-sm font-bold text-[#1d52a1] lg:min-h-10">10 × 90-minute beginner lessons</p>
        </div>
        <div className="mt-3 lg:min-h-12">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {beginnerPricing.originalLabel ? (
              <span className="text-base font-bold text-slate-500 line-through">{beginnerPricing.originalLabel}</span>
            ) : null}
            <span className="text-2xl font-black text-slate-950">{beginnerPricing.label}</span>
            <span className="text-sm font-black text-[#C41E23]">30% off</span>
          </div>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">CAD + GST</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 lg:min-h-20">{beginnerCourse.description}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
          {beginnerCourse.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Limited-time 30% offer for eligible bookings. Cannot be combined with another promotion. Standard-area price shown before GST.
        </p>
        <div className="grid gap-1.5 pt-4">
          <Link
            to="/checkout?course=beginner-driving-course&location=langford"
            onClick={() => trackPurchase("product-beginner-driving-course", "Buy Beginner Course")}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#E6242A] px-5 text-sm font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/30"
          >
            Buy Beginner Course
          </Link>
          <Link to="/courses/beginner-driving-course" className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
            View full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>

      <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-950 lg:min-h-14">Road Test Package</h3>
          <p className="mt-1 text-sm font-bold text-[#1d52a1] lg:min-h-10">Road-test preparation + car rental</p>
        </div>
        <div className="mt-3 lg:min-h-12">
          <p className="text-2xl font-black text-slate-950">{roadTestPricing.label}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">CAD + GST</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 lg:min-h-20">{roadTestPackage.description}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
          {roadTestPackage.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-1.5 pt-5">
          <Link
            to="/checkout?course=lesson-road-test-prep-course&location=langford"
            onClick={() => trackPurchase("product-road-test-package", "Buy Road Test Package")}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#E6242A] px-5 text-sm font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/30"
          >
            Buy Road Test Package
          </Link>
          <Link to="/courses/lesson-road-test-prep-course" className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
            View full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>

      <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-950 lg:min-h-14">Choose Your Number of Classes</h3>
          <p className="mt-1 text-sm font-bold text-[#1d52a1] lg:min-h-10">Custom-focus 90-minute lessons</p>
        </div>
        <div className="mt-3 lg:min-h-12" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {customDiscountUnlocked ? (
              <span className="text-base font-bold text-slate-500 line-through">{formatCoursePrice(customSubtotal)}</span>
            ) : null}
            <span className="text-2xl font-black text-slate-950">{formatCoursePrice(customTotal)}</span>
            {customDiscountUnlocked ? <span className="text-sm font-black text-[#C41E23]">30% off</span> : null}
          </div>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">CAD + GST</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 lg:min-h-20">
          Select the number of custom lessons you want. Buy five or more in one booking to unlock 30% off.
        </p>

        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="custom-class-count" className="text-sm font-black text-slate-900">Number of classes</label>
            <div className="inline-flex items-center rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_rgba(203,213,225,1)]">
              <button
                type="button"
                onClick={() => setCustomClassCount((count) => Math.max(1, count - 1))}
                disabled={customClassCount === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#1d52a1] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Decrease custom class count"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <select
                id="custom-class-count"
                value={customClassCount}
                onChange={(event) => setCustomClassCount(Number(event.target.value))}
                className="h-9 min-w-[3.75rem] appearance-none bg-transparent px-2 text-center text-sm font-black text-slate-950 outline-none"
              >
                {Array.from({ length: MAX_CUSTOM_CLASS_COUNT }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCustomClassCount((count) => Math.min(MAX_CUSTOM_CLASS_COUNT, count + 1))}
                disabled={customClassCount === MAX_CUSTOM_CLASS_COUNT}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#1d52a1] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Increase custom class count"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex items-center justify-between gap-3 text-xs font-bold">
              <span className={customDiscountUnlocked ? "text-emerald-700" : "text-slate-600"} aria-live="polite">
                {customDiscountUnlocked
                  ? "30% discount unlocked"
                  : `${classesUntilDiscount} more ${classesUntilDiscount === 1 ? "class" : "classes"} to unlock 30% off`}
              </span>
              <span className="text-slate-500">{Math.min(customClassCount, CUSTOM_CLASS_DISCOUNT_THRESHOLD)}/{CUSTOM_CLASS_DISCOUNT_THRESHOLD}</span>
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-label="Progress toward the five-class discount"
              aria-valuemin={0}
              aria-valuemax={CUSTOM_CLASS_DISCOUNT_THRESHOLD}
              aria-valuenow={Math.min(customClassCount, CUSTOM_CLASS_DISCOUNT_THRESHOLD)}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${customDiscountUnlocked ? "bg-emerald-600" : "bg-[#1d52a1]"}`}
                style={{ width: `${discountProgress}%` }}
              />
            </div>
          </div>

          <p className="mt-3 border-t border-slate-200 pt-3 text-xs font-bold text-slate-500">
            {formatCoursePrice(customClassPricing.amount)} per class before any eligible discount
          </p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The 30% discount applies automatically to five or more custom classes in the same eligible standard-area booking.
        </p>
        <div className="grid gap-1.5 pt-4">
          <Link
            to={`/checkout?course=make-your-own-class&location=langford&quantity=${customClassCount}&duration=90`}
            onClick={() => trackPurchase("product-custom-classes", `Buy ${customClassCount} Custom Classes`)}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#E6242A] px-5 text-sm font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/30"
          >
            Buy {customClassCount} {customClassCount === 1 ? "Class" : "Classes"}
          </Link>
          <Link to="/courses/make-your-own-class" className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
            View full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </div>
  );
};

const PackageCards = ({ tracking }: { tracking: TrackingContext }) => (
  <section className="bg-[#F7F8FA] py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Limited-time lesson offers</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Compare lesson plans and prices</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
            Choose a beginner course, road-test package or a custom number of classes. Standard-area prices are shown in Canadian dollars before GST.
          </p>
        </div>
        <Link to="/pricing" className="inline-flex min-h-[44px] items-center gap-2 font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
          See all pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <CoreOfferCards tracking={tracking} />
    </div>
  </section>
);

const Benefits = ({ config }: { config: PaidLandingPageConfig }) => (
  <section className="bg-white py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Why this approach helps</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">A clearer next step for your driving goal</h2>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {config.benefits.map((benefit, index) => (
          <article key={benefit.title} className="rounded-2xl border border-slate-200 p-6">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1d52a1]/10 text-sm font-black text-[#1d52a1]">{index + 1}</span>
            <h3 className="mt-4 text-lg font-black text-slate-950">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="bg-[#0B1A33] py-14 text-white sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#8fc1ff]">How booking works</p>
        <h2 className="mt-2 text-3xl font-black sm:text-4xl">Three simple steps</h2>
      </div>
      <ol className="mt-9 grid gap-5 md:grid-cols-3">
        {[
          { title: "Tell us your goal", body: "Send your name, mobile number, preferred start window and main lesson goal." },
          { title: "We confirm the details", body: "The team checks your area and timing, then explains the free assessment and any relevant booking terms." },
          { title: "Start with a clear plan", body: "Meet the instructor for the assessment and discuss the lesson option that matches your current needs." },
        ].map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-white/15 bg-white/[0.06] p-6">
            <span className="text-sm font-black text-[#8fc1ff]">0{index + 1}</span>
            <h3 className="mt-3 text-xl font-black">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);
  const testimonials = paidLandingTestimonials.filter((testimonial) => (testimonial.stars ?? 0) >= 4);

  const updateScrollState = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollBack(carousel.scrollLeft > 4);
    setCanScrollForward(carousel.scrollLeft < maxScrollLeft - 4);
  };

  const scrollReviews = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.querySelector<HTMLElement>("[data-review-card]");
    const distance = firstCard ? firstCard.offsetWidth + 20 : carousel.clientWidth;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Student feedback</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">What individual learners reported</h2>
          </div>
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
            See all reviews on Google <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Google showed {rating} from {reviewCount} reviews when checked on {ratingCheckedOn}. The carousel features selected review excerpts in newest-first order; individual results vary.
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-600">Featured Google reviews</p>
          <div className="flex gap-2" aria-label="Review carousel controls">
            <button
              type="button"
              onClick={() => scrollReviews(-1)}
              disabled={!canScrollBack}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-[#1d52a1] hover:text-[#1d52a1] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Show previous review"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollReviews(1)}
              disabled={!canScrollForward}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1d52a1] text-white transition hover:bg-[#153f7d] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Show next review"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={updateScrollState}
          className="mt-4 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Google reviews carousel"
          tabIndex={0}
        >
          {testimonials.map((testimonial) => {
            const stars = testimonial.stars ?? 5;
            const initials = testimonial.name
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const publishedLabel = testimonial.publishedLabel ?? (
              testimonial.publishedAtDate
                ? new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(testimonial.publishedAtDate))
                : ""
            );

            return (
              <figure
                key={testimonial.id}
                data-review-card
                className="flex min-h-[23rem] shrink-0 basis-[88%] snap-start flex-col rounded-2xl border border-slate-200 bg-[#F7F8FA] p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-0.5 text-[#F5B13A]" role="img" aria-label={`${stars} out of 5 stars`}>
                    {Array.from({ length: stars }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />)}
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">Google</span>
                </div>
                {testimonial.quote ? (
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-slate-700">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                ) : (
                  <p className="mt-5 flex-1 text-base italic leading-relaxed text-slate-500">
                    This reviewer left a star rating without written comments.
                  </p>
                )}
                <figcaption className="mt-6 border-t border-slate-200 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1d52a1] text-sm font-black text-white">
                      <span aria-hidden="true">{initials}</span>
                      {testimonial.avatarUrl ? (
                        <img
                          src={testimonial.avatarUrl}
                          alt={`${testimonial.name}'s Google profile photo`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 text-sm">
                      <span className="block truncate font-black text-slate-950">{testimonial.name}</span>
                      <span className="block text-slate-500">
                        {testimonial.source}{publishedLabel ? ` · ${publishedLabel}` : ""}
                      </span>
                    </div>
                  </div>
                  {testimonial.reviewUrl ? (
                    <a
                      href={testimonial.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20"
                      aria-label={`Read ${testimonial.name}'s full review on Google`}
                    >
                      Read full review <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ServiceAreas = ({ config }: { config: PaidLandingPageConfig }) => (
  <section className="border-y border-slate-200 bg-[#F7F8FA] py-12 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Service areas</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Check your lesson area</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{config.serviceAreaIntro}</p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {config.serviceAreas.map((area) => (
              <li key={area} className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800">
                <MapPin className="h-4 w-4 text-[#1d52a1]" aria-hidden="true" />
                {area}
              </li>
            ))}
          </ul>
        </div>
        <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Shanaya's Driving School location map"
            src={SCHOOL_MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-72 w-full border-0 sm:h-80 lg:h-[22rem]"
          />
          <figcaption className="border-t border-slate-200 px-5 py-3 text-xs leading-relaxed text-slate-500">
            The map shows the Langford school location. Lesson pickup availability is confirmed separately for your address and preferred time.
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

const FAQ = ({ config }: { config: PaidLandingPageConfig }) => (
  <section className="bg-white py-14 sm:py-20">
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Questions before you request</p>
      <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Frequently asked questions</h2>
      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {config.faqs.map((faq) => (
          <details key={faq.question} className="group py-1">
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-black text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                className="text-xl text-[#1d52a1] transition-transform duration-300 ease-out group-open:rotate-45 motion-reduce:transition-none"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-open:grid-rows-[1fr] group-open:opacity-100 motion-reduce:transition-none">
              <div className="min-h-0 overflow-hidden">
                <div className="pb-5 pr-8 text-sm leading-relaxed text-slate-600">
                  <p>{faq.answer}</p>
                  {faq.link ? (
                    <Link to={faq.link.href} className="mt-2 inline-flex min-h-[44px] items-center gap-2 font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/20">
                      {faq.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = ({ config, tracking, onPrimaryCta }: { config: PaidLandingPageConfig; tracking: TrackingContext; onPrimaryCta: (location: string) => void }) => (
  <section className="bg-[#F7F8FA] py-14 sm:py-20">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="rounded-[28px] bg-[#1d52a1] px-6 py-10 text-center text-white shadow-xl sm:px-10">
        <CalendarDays className="mx-auto h-8 w-8 text-[#F5B13A]" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black sm:text-4xl">Ready to discuss your driving goals?</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/80">Request the free assessment. The team will confirm the time, area and terms before your appointment is booked.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => onPrimaryCta("final")} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#E6242A] px-7 font-black text-white transition hover:bg-[#c91f24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70">
            {config.conversion.primaryCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href={PHONE_HREF} onClick={() => pushClickToCall(tracking, "final")} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-white px-7 font-black text-white transition hover:bg-white hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70">
            <Phone className="h-4 w-4" aria-hidden="true" /> Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  </section>
);

const CompactFooter = () => (
  <footer className="bg-[#0B1A33] py-10 text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-lg font-black">Shanaya&apos;s Driving School</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">124-2770 Leigh Rd, Langford, BC V9B 4G1 · Independent driving school serving listed Greater Victoria and B.C. areas.</p>
        <a href={PHONE_HREF} className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-black text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60">
          <Phone className="h-4 w-4" aria-hidden="true" /> {PHONE_DISPLAY}
        </a>
      </div>
      <nav aria-label="Landing page policies" className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-white/80">
        <Link to="/policies/privacy-policy" className="underline underline-offset-4">Privacy</Link>
        <Link to="/policies/cancellation-and-rescheduling" className="underline underline-offset-4">Cancellation</Link>
        <Link to="/policies/terms-and-conditions" className="underline underline-offset-4">Terms</Link>
        <Link to="/contact" className="underline underline-offset-4">Contact</Link>
      </nav>
    </div>
  </footer>
);

const PaidLandingPage = ({ pageId }: PaidLandingPageProps) => {
  const config = paidLandingPagesById[pageId];
  const location = useLocation();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const viewTrackedRef = useRef(false);
  const [formVisible, setFormVisible] = useState(true);
  const sourcePage = location.pathname;
  const tracking = useMemo<TrackingContext>(() => ({
    landingPageId: config.id,
    sourcePage,
    contentGroup: config.analytics.contentGroup,
    funnel: config.analytics.funnel,
  }), [config, sourcePage]);

  useEffect(() => {
    if (viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    readAttribution(config.id);
    pushLandingView(tracking);
  }, [config.id, tracking]);

  useEffect(() => {
    const node = formContainerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [config.id]);

  const handlePrimaryCta = (ctaLocation: string) => {
    pushLandingCtaClick(tracking, config.conversion.primaryCta, ctaLocation);
    formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="bg-white pb-20 text-slate-950 lg:pb-0">
      <HeroWithLeadForm
        config={config}
        tracking={tracking}
        sourcePage={sourcePage}
        formContainerRef={formContainerRef}
        onPrimaryCta={handlePrimaryCta}
      />
      <TrustBar />
      {config.id === "near-me" ? <ServiceAreas config={config} /> : null}
      <PackageCards tracking={tracking} />
      <Benefits config={config} />
      <HowItWorks />
      <Testimonials />
      {config.id !== "near-me" ? <ServiceAreas config={config} /> : null}
      <FAQ config={config} />
      <FinalCTA config={config} tracking={tracking} onPrimaryCta={handlePrimaryCta} />
      <CompactFooter />

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0B1A33]/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${formVisible ? "translate-y-full" : "translate-y-0"}`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        aria-hidden={formVisible}
      >
        <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] gap-2.5">
          <button type="button" onClick={() => handlePrimaryCta("mobile-sticky")} className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#E6242A] px-4 text-sm font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70">
            Request assessment
          </button>
          <a href={PHONE_HREF} onClick={() => pushClickToCall(tracking, "mobile-sticky")} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-white px-4 text-sm font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70" aria-label={`Call ${PHONE_DISPLAY}`}>
            <Phone className="h-4 w-4" aria-hidden="true" /> Call
          </a>
        </div>
      </div>
    </main>
  );
};

export default PaidLandingPage;
