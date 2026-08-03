import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, CheckCircle2, ChevronDown, Car, MapPin, Phone, Star, Wallet } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteCtaSection from "@/components/SiteCtaSection";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCaptchaVerification } from "@/lib/captcha";
import { submitFreeTrialLead } from "@/lib/leadService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  alsoIdealFor,
  beginnerLandingPhone,
  beginnerLandingWhatsApp,
  bookingFacts,
  courseFacts,
  faqs,
  freeTrial,
  googleReviewsUrl,
  helpsWith,
  journeySteps,
  quickFacts,
  rating,
  ratingCheckedOn,
  reviewCount,
  reviews,
  sellingPoints,
  serviceAreaLinks,
} from "@/data/beginnerCourseLanding";

const PAGE_PATH = "/beginner-driving-lessons-victoria";

/* WhatsApp's own glyph — lucide has no WhatsApp mark, and substituting a generic
   speech bubble would not read as WhatsApp. Same path the site footer uses. */
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* Credibility shown above the fold-plus-one. Each of these is verifiable: the
   instructor licence against ICBC, the rest against what the school already
   publishes site-wide. No invented numbers, no unearned badges. */
const proofPoints = [
  { icon: BadgeCheck, label: "ICBC-licensed instructors", detail: "A licence separate from the school's own" },
  { icon: Car, label: "Dual-control vehicles", detail: "A second set of pedals on every lesson" },
  { icon: MapPin, label: "Pick-up and drop-off", detail: "Victoria, Langford and the Westshore" },
  { icon: Wallet, label: "No hidden fees", detail: "Published rates, confirmed before you book" },
];

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition-colors duration-200 focus:border-[#1d52a1] focus-visible:ring-4 focus-visible:ring-[#1d52a1]/25";

/* "a free assessment drive" until a duration is confirmed in the data file, so the
   page never advertises a length the school has not committed to. */
const trialLabel = freeTrial.durationMinutes
  ? `free ${freeTrial.durationMinutes}-minute assessment drive`
  : "free assessment drive";

type BookingIntent = "free_assessment_drive" | "lesson_booking";

const BookingForm = ({ intent }: { intent: BookingIntent }) => {
  const isLessonBooking = intent === "lesson_booking";
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h3 className="text-lg font-black text-emerald-900">Request received</h3>
        <p className="mt-2 text-sm text-emerald-800">
          {isLessonBooking
            ? "We will call you to confirm your lessons and find times that work."
            : `We will call you to arrange your ${trialLabel}.`}
        </p>
        {/* WhatsApp reaches the school straight away, so it is the honest answer to
            "how soon?" without promising a callback window. */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href={beginnerLandingWhatsApp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
          >
            <WhatsAppIcon />
            Message us now
          </a>
          <a
            href={beginnerLandingPhone.href}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-emerald-700 px-5 py-2.5 text-sm font-black text-emerald-800 transition-colors duration-200 hover:bg-emerald-700 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/40"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {beginnerLandingPhone.display}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setSubmitError("");
        setIsSubmitting(true);
        try {
          const captcha = await getCaptchaVerification("free_trial_submit");
          await submitFreeTrialLead({
            fullName,
            phone,
            email,
            note: isLessonBooking ? note : undefined,
            intent,
            sourcePage: PAGE_PATH,
            captchaProvider: captcha.provider ?? undefined,
            captchaToken: captcha.token ?? undefined,
            captchaAction: captcha.action ?? undefined,
          });
          setSubmitted(true);
        } catch (error) {
          console.error("Free trial submit failed:", error);
          setSubmitError(
            `Submission failed. Please try again, or call us on ${beginnerLandingPhone.display}.`,
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="trial-name">
          Your name <span aria-hidden="true" className="text-[#E6242A]">*</span>
        </label>
        <input
          id="trial-name"
          type="text"
          required
          autoFocus
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={`mt-1 ${inputClassName}`}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="trial-phone">
          Phone number <span aria-hidden="true" className="text-[#E6242A]">*</span>
        </label>
        <input
          id="trial-phone"
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={`mt-1 ${inputClassName}`}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="trial-email">
          Email address <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="trial-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`mt-1 ${inputClassName}`}
        />
      </div>

      {isLessonBooking ? (
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="trial-note">
            Anything we should know? <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="trial-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Preferred days or times, pick-up area, anything else"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors duration-200 focus:border-[#1d52a1] focus-visible:ring-4 focus-visible:ring-[#1d52a1]/25"
          />
        </div>
      ) : null}

      {/* The "Book an appointment online" link was removed: it sat directly above
          Submit and sent people to /apply, a 15-field form, competing with the four
          fields they were already completing. */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full cursor-pointer rounded-full bg-[#E6242A] px-4 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Submit"}
      </button>

      {submitError ? (
        <p role="alert" className="text-sm font-semibold text-[#E6242A]">
          {submitError}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">
        We use your details only to contact you about this request. No payment is taken here.
      </p>
    </form>
  );
};

const BeginnerDrivingLessons = () => {
  const [bookingIntent, setBookingIntent] = useState<BookingIntent | null>(null);
  /* The sticky bar only appears once the hero's own buttons have scrolled away.
     Showing both at once puts two "Call now" buttons within a thumb's width of
     each other on a phone, which reads as clutter rather than convenience. */
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  /* Keyboard-operable tab pattern for the journey stepper. */
  const [activeStep, setActiveStep] = useState(0);
  const [openNeed, setOpenNeed] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /* Selecting an area re-points the map. The chips stay useful as navigation too:
     the link to that area's lessons page appears under the map once one is picked. */
  const [activeArea, setActiveArea] = useState(0);

  useEffect(() => {
    const node = heroCtaRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { rootMargin: "-8px 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  /* The review block renders only when real reviews have been added to the data
     file, so the page never ships placeholder or invented testimonials. */
  const hasReviews = reviews.length > 0;
  const hasRating = rating !== null && reviewCount !== null;

  return (
    <main className="bg-white pb-20 text-[#202121] lg:pb-0">
      {/* One hero: headline, proof points, both calls to action and the booking
          form all above the fold. A landing page that splits the headline from its
          buttons reads as two competing heroes and pushes the form below the fold,
          which is what the title-band component elsewhere on the site produces. */}
      <section className="relative isolate w-full overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/landing/driving-lessons-saanich.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>
        <div
          className="absolute inset-0 z-10"
          style={{ background: "linear-gradient(180deg,rgba(11,26,51,0.86) 0%,rgba(11,26,51,0.78) 100%)" }}
        />

        <div className="relative z-30 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <SiteHeader tone="light" />

          <div className="grid gap-10 pb-12 pt-8 sm:pb-20 sm:pt-16 lg:pb-24">
            <div>
              <h1
                className="text-[2rem] font-black leading-[1.1] sm:text-5xl lg:text-[3.4rem]"
                style={{ textWrap: "balance" }}
              >
                Get ready for your road test, from your first lesson
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                Never driven before? Start with a {trialLabel}, then build the skills ICBC tests
                with lessons scheduled around your week.
              </p>

              <ul className="mt-6 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2">
                {courseFacts.covers.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-white/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7FD1A6]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div ref={heroCtaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
                {/* Primary intent: ready to book. The attention loop is the pulsing
                    ring on the sibling span only — the button itself never scales, so
                    the click target does not move under the pointer. Stops entirely
                    under prefers-reduced-motion. */}
                <span className="relative inline-flex">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#E6242A] animate-cta-ring motion-reduce:animate-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBookingIntent("lesson_booking")}
                    className="relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E6242A] px-7 py-3.5 text-base font-black text-white transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 motion-reduce:animate-none motion-reduce:hover:scale-100"
                  >
                    Book your lessons now
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
                {/* Secondary intent: not decided yet. */}
                <button
                  type="button"
                  onClick={() => setBookingIntent("free_assessment_drive")}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-white px-7 py-3.5 text-base font-black text-white transition-colors duration-200 hover:bg-white hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                >
                  Book a free trial
                </button>
              </div>
              <p className="mt-3 text-sm text-white/70">
                The assessment drive is free, with no obligation to book anything afterwards.
              </p>

              {/* Google rating badge. Gated on real figures: rendering stars without a
                  rating we can point at would be exactly the fabricated trust signal
                  this file's rules forbid. Fill rating/reviewCount/googleReviewsUrl in
                  src/data/beginnerCourseLanding.ts and it appears. */}
              {hasRating ? (
                <a
                  href={googleReviewsUrl || undefined}
                  target={googleReviewsUrl ? "_blank" : undefined}
                  rel={googleReviewsUrl ? "noopener noreferrer" : undefined}
                  className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-3 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                >
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </span>
                  <span className="text-sm text-white">
                    <span className="font-black">{rating}</span>
                    <span className="text-white/75"> from {reviewCount} Google reviews</span>
                  </span>
                </a>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* Proof strip. The Trust & Authority pattern puts credibility immediately
          after the hero, before any long-form content, because paid traffic decides
          in seconds. Every item here is checkable, not a slogan. */}
      <section className="border-b border-slate-200 bg-white">
        {/* Mobile: a looping marquee, so four proof points cost one row instead of
            four and the fold stays close to the hero. The list is duplicated to make
            the loop seamless; the copy is aria-hidden so it is not announced twice.
            Motion stops entirely under prefers-reduced-motion, where the strip
            becomes a normal horizontal scroller instead. */}
        <div className="group relative overflow-hidden py-6 motion-reduce:overflow-x-auto lg:hidden">
          <div className="flex w-max animate-scroll gap-8 pl-4 [animation-duration:26s] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) =>
              proofPoints.map((point) => (
                <div
                  key={`${copy}-${point.label}`}
                  className="flex w-[17rem] shrink-0 items-start gap-3"
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  <point.icon className="mt-0.5 h-6 w-6 shrink-0 text-[#1d52a1]" aria-hidden="true" />
                  <div>
                    <p className="font-black leading-tight text-[#202121]">{point.label}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{point.detail}</p>
                  </div>
                </div>
              )),
            )}
          </div>
          {/* soft edges so items enter and leave rather than being chopped off */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"
          />
        </div>

        {/* Desktop keeps the static grid: there is room for all four at once, and a
            moving strip would be motion for its own sake. */}
        <div className="mx-auto hidden max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-4 lg:py-10">
          {proofPoints.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <point.icon className="mt-0.5 h-6 w-6 shrink-0 text-[#1d52a1]" aria-hidden="true" />
              <div>
                <p className="font-black leading-tight text-[#202121]">{point.label}</p>
                <p className="mt-0.5 text-sm text-slate-600">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why lessons are needed. Declarative: every reason is readable without a
          click. Expanding adds what actually happens in a lesson, so the disclosure
          earns the interaction instead of just re-showing the summary. */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">
              Why lessons help
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#202121] sm:text-4xl">
              Why you need beginner lessons
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Almost everyone who books with us arrives in one of these three situations. In each
              one, the problem is not time behind the wheel, it is building the right habits in the
              right order before a road test.
            </p>
          </div>

          <ul className="mt-12 grid items-start gap-6 md:grid-cols-3">
            {helpsWith.map((need, index) => {
              const open = openNeed === index;
              return (
                <li
                  key={need.number}
                  className={`rounded-2xl border bg-white transition-all duration-200 ${
                    open ? "border-[#1d52a1] shadow-xl" : "border-slate-200 hover:border-[#1d52a1]/50 hover:shadow-lg"
                  }`}
                >
                  <div className="p-6">
                    <span
                      className={`text-3xl font-black tabular-nums transition-colors duration-200 ${
                        open ? "text-[#1d52a1]" : "text-[#1d52a1]/25"
                      }`}
                    >
                      {need.number}
                    </span>
                    <h3 className="mt-2 text-lg font-black leading-snug text-[#202121]">
                      {need.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setOpenNeed(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`need-panel-${index}`}
                      className="mt-2 inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-2 text-sm font-black text-[#1d52a1] transition-colors duration-200 hover:text-[#17408a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                    >
                      {open ? "Hide" : "What we do about it"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id={`need-panel-${index}`}
                      className={`grid transition-all duration-300 motion-reduce:transition-none ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-slate-600">
                        <span className="mt-2 block border-l-2 border-[#1d52a1]/30 pl-4">
                          {need.response}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {alsoIdealFor.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#F7F8FA] p-5">
                <p className="text-sm font-black text-[#202121]">Also ideal for: {item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>

          {/* One primary action for the whole section rather than three competing
              copies of the same button. */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setBookingIntent("free_assessment_drive")}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[#E6242A] px-7 py-3.5 text-base font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/40"
            >
              Book a free trial
            </button>
          </div>
        </div>
      </section>

      {/* Quick facts. Hidden on phones: the marquee above already carries
          dual-control and ICBC-licensed, so on a small screen this was the same
          claims a second time and pushed the real content further down. Hiding the
          whole section, not just the grid, so no empty bordered strip is left. */}
      <section className="hidden border-y border-slate-200 bg-[#F7F8FA] sm:block">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="text-center">
              <p className="text-2xl font-black text-[#1d52a1] sm:text-3xl">{fact.value}</p>
              <p className="mt-1 text-sm text-slate-600">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works. A real WAI-ARIA tab list: arrow keys, Home/End and roving
          tabindex, plus a progress rail so the four steps read as a sequence rather
          than four unrelated buttons. */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#202121] sm:text-4xl">How it works</h2>
            <p className="mt-2 text-slate-600">Four steps from first call to test-ready.</p>
          </div>

          <div
            role="tablist"
            aria-label="How lessons work"
            aria-orientation="horizontal"
            className="relative mt-12"
            onKeyDown={(event) => {
              const last = journeySteps.length - 1;
              let next: number | null = null;
              if (event.key === "ArrowRight") next = activeStep === last ? 0 : activeStep + 1;
              if (event.key === "ArrowLeft") next = activeStep === 0 ? last : activeStep - 1;
              if (event.key === "Home") next = 0;
              if (event.key === "End") next = last;
              if (next === null) return;
              event.preventDefault();
              setActiveStep(next);
              stepRefs.current[next]?.focus();
            }}
          >
            {/* progress rail, desktop only */}
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-slate-200 sm:block" aria-hidden="true">
              <div
                className="h-full bg-[#1d52a1] transition-all duration-300 motion-reduce:transition-none"
                style={{ width: `${(activeStep / (journeySteps.length - 1)) * 100}%` }}
              />
            </div>

            <ol className="relative grid gap-6 sm:grid-cols-4">
              {journeySteps.map((step, index) => {
                const selected = index === activeStep;
                const done = index < activeStep;
                return (
                  <li key={step.title} className="flex sm:block">
                    <button
                      ref={(node) => {
                        stepRefs.current[index] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`step-tab-${index}`}
                      aria-selected={selected}
                      aria-controls="step-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveStep(index)}
                      className="group flex w-full cursor-pointer items-center gap-3 text-left focus-visible:outline-none sm:block"
                    >
                      <span
                        className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-black tabular-nums shadow-sm transition-all duration-200 group-focus-visible:ring-4 group-focus-visible:ring-[#1d52a1]/40 ${
                          selected
                            ? "bg-[#1d52a1] text-white"
                            : done
                              ? "bg-[#1d52a1]/15 text-[#1d52a1]"
                              : "bg-slate-100 text-slate-500 group-hover:bg-[#1d52a1]/10 group-hover:text-[#1d52a1]"
                        }`}
                      >
                        {done ? <Check className="h-5 w-5" aria-hidden="true" /> : index + 1}
                      </span>
                      <span
                        className={`text-sm font-black transition-colors duration-200 sm:mt-3 sm:block ${
                          selected ? "text-[#1d52a1]" : "text-slate-600 group-hover:text-[#202121]"
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div
            id="step-panel"
            role="tabpanel"
            aria-labelledby={`step-tab-${activeStep}`}
            className="mt-8 rounded-2xl bg-[#F7F8FA] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">
                {journeySteps[activeStep].step}
              </p>
              <p className="text-sm text-slate-500" aria-live="polite">
                Step {activeStep + 1} of {journeySteps.length}
              </p>
            </div>
            <h3 className="mt-2 text-xl font-black text-[#202121] sm:text-2xl">
              {journeySteps[activeStep].title}
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
              {journeySteps[activeStep].body}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setBookingIntent("free_assessment_drive")}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[#E6242A] px-6 py-3 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/40"
              >
                Book a free trial
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep((n) => Math.max(0, n - 1))}
                  disabled={activeStep === 0}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-[#1d52a1] transition-colors duration-200 hover:border-[#1d52a1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/30 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous step"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((n) => Math.min(journeySteps.length - 1, n + 1))}
                  disabled={activeStep === journeySteps.length - 1}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-[#1d52a1] transition-colors duration-200 hover:border-[#1d52a1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/30 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next step"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why learn with us */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-[#1d52a1] sm:text-4xl">Why learn with us</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sellingPoints.map((point) => (
              <div key={point.title} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-black text-[#202121]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.body}</p>
                {point.evidenceHref ? (
                  <a
                    href={point.evidenceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-[44px] cursor-pointer items-center py-2 text-sm font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                  >
                    Check this on ICBC
                  </a>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Shanaya&apos;s Driving School is an independent driving school. ICBC&apos;s general
            directory lists the school in Langford for Class 5 and 7 driver training; that listing is
            a licensing record, not ICBC approval or endorsement.
          </p>
        </div>
      </section>

      {/* Areas covered — map driven by the chips, chips still link out */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#202121] sm:text-4xl">Areas we cover</h2>
            <p className="mt-2 text-slate-600">
              Instructors pick you up across Greater Victoria and the Westshore. Choose an area to see
              it on the map.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* aspect-ratio reserves the space so the lazy iframe cannot shift layout */}
            <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
              <iframe
                title={`Map of driving lesson coverage in ${serviceAreaLinks[activeArea].name}, B.C.`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${serviceAreaLinks[activeArea].name}, BC, Canada`,
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="aspect-[4/3] w-full border-0 sm:aspect-[16/11]"
              />
            </div>

            <div>
              <ul role="tablist" aria-label="Service areas" className="flex flex-wrap gap-3">
                {serviceAreaLinks.map((area, index) => {
                  const selected = index === activeArea;
                  return (
                    <li key={area.name}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveArea(index)}
                        className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/30 ${
                          selected
                            ? "border-[#1d52a1] bg-[#1d52a1] text-white shadow-md"
                            : "border-slate-200 bg-white text-[#1d52a1] hover:border-[#1d52a1] hover:bg-[#F7F8FA]"
                        }`}
                      >
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {area.name}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* The per-area description panel was removed at the owner's request.
                  The link to that area's lessons page is kept, since it was the only
                  navigation out of this section. */}
              {serviceAreaLinks[activeArea].href ? (
                <Link
                  to={serviceAreaLinks[activeArea].href as string}
                  className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                >
                  See driving lessons in {serviceAreaLinks[activeArea].name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}

              <p className="mt-3 text-sm text-slate-500">
                Not sure if we reach you? Call{" "}
                <a
                  href={beginnerLandingPhone.href}
                  className="inline-flex min-h-[44px] cursor-pointer items-center font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                >
                  {beginnerLandingPhone.display}
                </a>{" "}
                and ask.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Availability and booking */}
      <section className="bg-[#F7F8FA] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#202121] sm:text-4xl">Availability and booking</h2>
            <p className="mt-2 text-slate-600">How booking actually works, with nothing hidden.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bookingFacts.map((fact) => (
              <div
                key={fact.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg"
              >
                <CheckCircle2 className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
                <h3 className="mt-3 font-black text-[#202121]">{fact.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{fact.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setBookingIntent("free_assessment_drive")}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[#E6242A] px-7 py-3.5 text-base font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/40"
            >
              Book a free trial
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-[#F7F8FA] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-[#1d52a1] sm:text-4xl">Common questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left font-black text-[#202121]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {faq.answer}
                  {faq.link ? (
                    <Link
                      to={faq.link.href}
                      className="mt-1 inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                    >
                      {faq.link.label}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials. Placed near the end at the owner's request: the page argues
          its case first, then closes with proof. Every quote is verbatim from the
          school's public Google profile — see the editing rules in
          src/data/beginnerCourseLanding.ts before changing any wording. */}
      {hasReviews || hasRating ? (
        <section className="bg-[#F7F8FA] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              {hasRating ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </span>
                  <p className="text-slate-600">
                    <span className="text-lg font-black text-[#202121]">{rating}</span> from{" "}
                    {reviewCount} Google reviews
                    {ratingCheckedOn ? (
                      <span className="block text-xs text-slate-500">
                        Checked on {ratingCheckedOn}
                      </span>
                    ) : null}
                  </p>
                </div>
              ) : null}
              <h2 className="mt-4 text-3xl font-black text-[#202121] sm:text-4xl">
                What our students say
              </h2>
            </div>

            {hasReviews ? (
              <Carousel
                /* dragFree keeps momentum on a flick; watchDrag on means embla binds
                   both pointer and touch, so the cards swipe with a mouse drag and a
                   finger. Arrows stay for keyboard and pointer users who expect them. */
                opts={{ align: "start", loop: reviews.length > 2, dragFree: false, watchDrag: true }}
                className="mt-10"
              >
                <CarouselContent className="-ml-4 cursor-grab active:cursor-grabbing">
                  {reviews.map((review) => (
                    <CarouselItem
                      key={`${review.name}-${review.quote.slice(0, 24)}`}
                      className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                    >
                      <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex gap-0.5" aria-hidden="true">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#FBBC05] text-[#FBBC05]" />
                          ))}
                        </div>
                        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                          &ldquo;{review.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-4 text-sm">
                          <span className="font-black text-[#202121]">{review.name}</span>
                          <span className="block text-slate-500">{review.source}</span>
                        </figcaption>
                      </figure>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-6 flex justify-center gap-3">
                  <CarouselPrevious className="static h-12 w-12 translate-y-0" />
                  <CarouselNext className="static h-12 w-12 translate-y-0" />
                </div>
              </Carousel>
            ) : null}

            <div className="mt-8 text-center">
              {googleReviewsUrl ? (
                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-2 text-sm font-black text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/50"
                >
                  Read all our Google reviews
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Closing CTA. Uses the shared SiteCtaSection every other page ends with:
          the footer's wave divider is drawn to rise out of a light section, so a
          solid blue block here produced blue -> white wave -> blue footer. */}
      <SiteCtaSection
        eyebrow="Ready to start?"
        title="Book your free assessment drive"
        description="An instructor picks you up, assesses where you actually are, and tells you honestly what your road test needs. No cost, no obligation."
        actions={
          <>
            <button
              type="button"
              onClick={() => setBookingIntent("free_assessment_drive")}
              className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-full bg-[#E6242A] px-8 py-3 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E6242A]/40 sm:w-auto"
            >
              Book a free trial
            </button>
            <a
              href={beginnerLandingWhatsApp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:w-auto"
            >
              <WhatsAppIcon />
              {beginnerLandingWhatsApp.label}
            </a>
            <a
              href={beginnerLandingPhone.href}
              className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#1d52a1] px-8 py-3 text-sm font-black text-[#1d52a1] transition-colors duration-200 hover:bg-[#1d52a1] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d52a1]/30 sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {beginnerLandingPhone.display}
            </a>
          </>
        }
        supportingCopy="The assessment drive is free. Availability varies by area and time of day."
      />

      {/* The booking form moved out of the hero into a dialog, so every CTA on the
          page opens the same form instead of scrolling back to a panel. */}
      <Dialog open={bookingIntent !== null} onOpenChange={(open) => !open && setBookingIntent(null)}>
        {/* The shared DialogContent enters with zoom-in-95 + slide-in-from-top, which
            scales the text for 200ms and renders it doubled on some GPUs. Neutralising
            the scale and slide leaves a plain fade: same entrance, no transform on the
            glyphs, no ghosting. */}
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto data-[state=closed]:[--tw-exit-scale:1] data-[state=closed]:[--tw-exit-translate-y:0] data-[state=open]:[--tw-enter-scale:1] data-[state=open]:[--tw-enter-translate-y:0]">
          <DialogHeader>
            {/* pr-8 keeps the longest title clear of the absolutely-positioned close
                button, which it otherwise ran under on a 360px screen. */}
            <DialogTitle className="pr-8 text-2xl font-black leading-tight text-[#1d52a1]">
              {bookingIntent === "lesson_booking" ? "Book your lessons" : `Book your ${trialLabel}`}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {bookingIntent === "lesson_booking"
                ? "Leave your details and we will call to confirm your lessons and find times that fit around your week."
                : "Leave your details and we will call to arrange a time. An instructor assesses where you are, answers your questions and explains what your road test will need."}
            </DialogDescription>
          </DialogHeader>
          {bookingIntent ? <BookingForm intent={bookingIntent} /> : null}
        </DialogContent>
      </Dialog>

      <SiteFooter />

      {/* Sticky action bar for small screens. pb-safe keeps it clear of the iOS
          home indicator; <main> reserves matching bottom padding so the bar never
          covers footer content. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0B1A33]/95 backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
          heroCtaVisible ? "translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={heroCtaVisible}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* The site-wide scroll-to-top button is fixed bottom-right at z-50, so the
              bar reserves clearance for it instead of letting it sit on top of the
              primary CTA. */}
          <div className="mx-auto flex max-w-6xl items-center gap-3 py-3 pl-4 pr-[4.75rem]">
          <a
            href={beginnerLandingWhatsApp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            aria-label="Message Shanaya's Driving School on WhatsApp"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setBookingIntent("free_assessment_drive")}
            className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-full bg-[#E6242A] px-4 py-3 text-sm font-black text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          >
            Book free trial
          </button>
        </div>
      </div>
    </main>
  );
};

export default BeginnerDrivingLessons;
