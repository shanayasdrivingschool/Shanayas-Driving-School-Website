import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  Eye,
  IdCard,
  Languages,
  Laptop,
  MapPin,
  MonitorCheck,
  ShieldCheck,
  Target,
  UserCheck,
  Wifi,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";

const OFFICIAL_URLS = {
  onlineTest: "https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test",
  getYourL: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L",
  handbook: "https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart",
  practiceTest: "https://www.icbc.com/driver-licensing/new-drivers/practice-knowledge-test",
  acceptedId: "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID",
  bookAppointment:
    "https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-knowledge-test-and-other-services",
  fees: "https://www.icbc.com/driver-licensing/visit-dl-office/Fees",
  glpAnnouncement: "https://news.gov.bc.ca/releases/2026PSSG0061-000847",
} as const;

const atAGlanceFacts = [
  { value: "16+", label: "Minimum age", icon: UserCheck },
  { value: "50", label: "Multiple-choice questions", icon: Target },
  { value: "40/50", label: "Correct answers to pass", icon: CheckCircle2 },
  { value: "45 min", label: "Maximum test time", icon: Clock3 },
  { value: "$15", label: "Fee for each attempt", icon: CreditCard },
  { value: "12", label: "Available test languages", icon: Languages },
];

const sourceLinks = [
  { label: "ICBC — take the online knowledge test", href: OFFICIAL_URLS.onlineTest },
  { label: "ICBC — get your learner's (L) licence", href: OFFICIAL_URLS.getYourL },
  { label: "ICBC — Learn to Drive Smart", href: OFFICIAL_URLS.handbook },
  { label: "ICBC — official practice knowledge test", href: OFFICIAL_URLS.practiceTest },
  { label: "ICBC — accepted identification", href: OFFICIAL_URLS.acceptedId },
  { label: "ICBC — book a knowledge-test appointment", href: OFFICIAL_URLS.bookAppointment },
  { label: "ICBC — driver licensing fees", href: OFFICIAL_URLS.fees },
  { label: "B.C. government — October 2026 GLP changes", href: OFFICIAL_URLS.glpAnnouncement },
];

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="mt-4 space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1d52a1]" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const OfficialLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-bold text-[#1d52a1] underline decoration-[#1d52a1]/35 underline-offset-4 hover:text-[#173f7b]"
  >
    {children}
  </a>
);

const KnowledgeTestGuide = () => (
  <main className="min-h-screen bg-white text-slate-900">
    <section className="relative bg-[#1d52a1] text-white">
      <SiteHeader tone="brand" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/" className="text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-white/40">/</span>
          <span className="truncate text-white/65">Class 7 Knowledge Test Guide</span>
        </nav>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#F5B13A]">
          B.C. learner licensing resource
        </p>
        <h1
          className="mt-3 max-w-4xl text-[clamp(2rem,4.8vw,3.5rem)] font-black leading-[1.07]"
          style={{ textWrap: "balance" }}
        >
          B.C. Class 7 Knowledge Test: Online and In-Person Guide
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
          A source-backed guide to eligibility, study materials, test formats, fees, identification and the steps
          required before ICBC issues your learner&apos;s licence.
        </p>
        <p className="mt-5 text-sm font-semibold text-white/75">
          Information checked against the linked official sources on <time dateTime="2026-07-21">July 21, 2026</time>.
        </p>
      </div>
    </section>

    <AnimatedSection>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[28px] border border-amber-300 bg-amber-50 p-6 text-amber-950 sm:p-8">
            <div className="flex gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-black">Independent guidance, with official sources linked</h2>
                <p className="mt-3 text-sm leading-relaxed sm:text-base">
                  Shanaya&apos;s Driving School prepared and maintains this guide. We are independent from ICBC and this
                  page is not an ICBC publication. ICBC decides eligibility, test results and licence issuance, so use
                  the linked ICBC pages as the source of truth and recheck them before you apply.
                </p>
                <p className="mt-3 text-sm leading-relaxed sm:text-base">
                  To report a factual error, email{" "}
                  <a
                    href="mailto:book@drivingschoolbc.ca?subject=Correction%20to%20knowledge%20test%20guide"
                    className="font-bold underline underline-offset-4"
                  >
                    book@drivingschoolbc.ca
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">At a glance</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Current Class 7 test facts</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              You must be at least 16 and a B.C. resident to apply for a B.C. driver&apos;s licence. These figures apply
              to the passenger-vehicle knowledge test whether you take it online or in person.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {atAGlanceFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <article key={fact.label} className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6">
                  <Icon className="h-5 w-5 text-[#1d52a1]" aria-hidden="true" />
                  <p className="mt-4 text-3xl font-black text-[#1d52a1]">{fact.value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{fact.label}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="font-black text-slate-900">Available languages</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              English, Arabic, Croatian, French, Farsi, Traditional Chinese, Simplified Chinese, Punjabi, Russian,
              Spanish, Ukrainian and Vietnamese.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-[#1d52a1]/25 bg-[#1d52a1]/5 p-6 sm:p-7">
            <h2 className="text-xl font-black text-[#173f7b]">Parent or guardian consent: note the 2026 change</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
              As of this page&apos;s July 21 review date, applicants <strong>under 19</strong> need parent or legal guardian
              consent. The B.C. government says that, effective <strong>October 19, 2026</strong>, the consent threshold
              will be lowered from 19 to 18, so consent will apply to applicants under 18. Check ICBC&apos;s current
              instructions if you apply near or after that date. Read the{" "}
              <OfficialLink href={OFFICIAL_URLS.glpAnnouncement}>official B.C. announcement</OfficialLink>.
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Study first</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Start with ICBC&apos;s own materials</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            A private quiz is a supplement, not a substitute for the current driving guide and ICBC&apos;s practice test.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-black">1. Learn to Drive Smart</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Study ICBC&apos;s official passenger-vehicle guide, including signs, rules, observation, sharing the road
                and risk-management concepts. Return to the relevant chapter whenever a practice answer is unclear.
              </p>
              <a
                href={OFFICIAL_URLS.handbook}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white hover:bg-[#173f7b]"
              >
                Open the official guide
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                <MonitorCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-black">2. ICBC&apos;s official practice test</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Use ICBC&apos;s practice knowledge test after studying. It is based on the real test and can be repeated;
                ICBC also provides a separate road-signs practice test.
              </p>
              <a
                href={OFFICIAL_URLS.practiceTest}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E6242A] px-6 py-3 text-sm font-bold text-white hover:bg-[#C41E23]"
              >
                Use ICBC&apos;s practice test
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          </div>

          <article className="mt-6 rounded-[30px] border border-amber-300 bg-amber-50 p-7 sm:p-8">
            <h3 className="text-xl font-black text-amber-950">Optional: this site&apos;s independent practice bank</h3>
            <p className="mt-3 text-sm leading-relaxed text-amber-950 sm:text-base">
              Our question bank is not supplied, reviewed, approved or endorsed by ICBC. It uses a 20-question,
              30-minute study session, which differs from ICBC&apos;s 50-question, 45-minute Class 7 test. A score here
              does not predict an official result. Verify every uncertain rule in the current official guide.
            </p>
            <Link
              to="/knowledge-test-practice"
              className="mt-5 inline-flex items-center gap-2 font-bold text-amber-950 underline underline-offset-4"
            >
              Open the independent practice tool
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Choose a format</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Online knowledge test workflow</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            ICBC launched online passenger-vehicle knowledge tests on June 9, 2026. The online result is only the test
            result; ICBC must still issue your learner&apos;s licence before you can drive.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
              <Laptop className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">1. Register</h3>
              <CheckList
                items={[
                  "Provide an email address.",
                  "Use one accepted primary ID and keep it for your licensing-office visit.",
                  "Pay the $15 test fee with Visa, Mastercard or American Express; the card need not be in your name.",
                ]}
              />
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
              <Wifi className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">2. Check your setup</h3>
              <CheckList
                items={[
                  "Use a desktop or laptop with a mouse or trackpad, keyboard and working webcam; phones and tablets are not supported.",
                  "Use a stable internet connection in a quiet, well-lit space without interruptions.",
                  "Be physically located in Canada or the United States.",
                ]}
              />
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
              <Clock3 className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">3. Complete one session</h3>
              <CheckList
                items={[
                  "Start immediately after registering or use the emailed link within 72 hours.",
                  "Finish within 45 minutes in one session; the test cannot be paused.",
                  "Do not talk, consult study material or use another electronic device during the test.",
                ]}
              />
            </article>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[30px] border border-slate-200 bg-[#F8FAFC] p-7 sm:p-8">
              <h3 className="text-xl font-black">If you do not pass</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                ICBC says you may retake the online test after 24 hours. You must register again and pay another $15
                attempt fee. You may instead take the knowledge test at a driver licensing office.
              </p>
            </article>
            <article className="rounded-[30px] border border-slate-200 bg-[#F8FAFC] p-7 sm:p-8">
              <h3 className="text-xl font-black">Online monitoring and disqualification</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                ICBC may disqualify a session after repeated monitoring issues, such as leaving the test screen,
                moving the cursor outside the test border, an obscured or mismatched face, or webcam failure. You may
                try online again after 24 hours and pay again. After three online disqualifications, online testing is
                unavailable for six months, but in-person testing remains available.
              </p>
            </article>
          </div>

          <a
            href={OFFICIAL_URLS.onlineTest}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-7 py-3 text-sm font-bold text-white hover:bg-[#173f7b]"
          >
            Read ICBC&apos;s rules and start online
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Office option</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">In-person knowledge test workflow</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            The in-person Class 7 test has the same 50 questions, 40-correct pass requirement, 45-minute limit, $15
            attempt fee and 12 language choices. ICBC says in-person tests use a touchscreen kiosk and offer audio.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <MapPin className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-black">Book the correct location</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Use ICBC&apos;s office finder and appointment page. Your nearest service may be an ICBC driver licensing
                office, a Service BC centre or a driver licensing agent, and booking instructions differ by location.
                Follow the confirmation email and contact the location if you need an accommodation.
              </p>
              <OfficialLink href={OFFICIAL_URLS.bookAppointment}>Find an office and book with ICBC</OfficialLink>
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <IdCard className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-black">Bring the required items</h3>
              <CheckList
                items={[
                  "Two accepted pieces of ID: one primary and one secondary.",
                  "Parent or legal guardian consent if the age rule applies to you.",
                  "Payment for the $15 test and $10 Class 7 photo learner-licence fees.",
                  "Glasses or contact lenses if you use them for the required vision screening.",
                ]}
              />
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Check the accepted-ID and fee pages immediately before your visit; document and payment requirements
                can depend on your circumstances and location.
              </p>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={OFFICIAL_URLS.acceptedId}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1d52a1] shadow-sm"
            >
              Check accepted ID
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={OFFICIAL_URLS.fees}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1d52a1] shadow-sm"
            >
              Check current fees
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">After an online pass</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">A passing result is not a licence</h2>
          <div className="mt-7 rounded-[30px] bg-[#1d52a1] p-7 text-white sm:p-9">
            <p className="text-xl font-black sm:text-2xl">
              You are not licensed or legally allowed to drive until ICBC issues your learner&apos;s licence.
            </p>
            <p className="mt-4 max-w-4xl leading-relaxed text-white/85">
              After passing online, visit a driver licensing office. Depending on the office, ICBC says you may need
              to book a short appointment. Your online result is valid for one year.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                "Bring one primary and one secondary ID, including the same primary ID used for online registration.",
                "Bring the printed or digital email confirming your online pass.",
                "Bring an original consent form or your parent/guardian if the consent rule applies.",
                "Bring corrective lenses, if applicable, and complete ICBC's vision screening.",
                "Pay the separate $10 Class 7 photo learner-licence fee and any applicable outstanding debt.",
                "Complete ICBC's identity, photo and licence-issuance steps before driving.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/90">
                  <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[#F5B13A]" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section className="border-y border-slate-200 bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Verification</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Official sources used</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            These links support the test facts, application steps, identification requirements, fees and announced
            consent change described above. They were checked on July 21, 2026.
          </p>
          <ul className="mt-7 grid gap-3 lg:grid-cols-2">
            {sourceLinks.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#1d52a1] transition-colors hover:border-[#1d52a1]/40"
                >
                  <span>{source.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AnimatedSection>

    <section className="bg-[#274556] py-14 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F5B13A]">Your next official step</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-black sm:text-3xl">Study, practise, then choose online or in person</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Recheck ICBC&apos;s current requirements before paying or attending an office.
          </p>
        </div>
        <a
          href={OFFICIAL_URLS.getYourL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F5B13A] px-7 py-3 text-sm font-bold text-[#274556] hover:bg-[#f7bf5c]"
        >
          Read ICBC&apos;s Get your L page
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>

    <SiteFooter />
  </main>
);

export default KnowledgeTestGuide;
