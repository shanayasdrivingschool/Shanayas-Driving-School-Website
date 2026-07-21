import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  IdCard,
  Languages,
  Laptop,
  MapPin,
  MonitorCheck,
  Target,
  UserCheck,
  Wifi,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import {
  KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO,
  KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL,
  knowledgeTestGuideFaqs,
  knowledgeTestGuideSections,
} from "@/data/knowledgeTestGuide";

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

const testLanguages =
  "English, Arabic, Croatian, French, Farsi, Traditional Chinese, Simplified Chinese, Punjabi, Russian, Spanish, Ukrainian and Vietnamese.";

const onlineSteps = [
  {
    title: "Register",
    icon: Laptop,
    items: [
      "Provide an email address.",
      "Use one accepted primary ID and keep it for your licensing-office visit.",
      "Pay the $15 test fee with Visa, Mastercard or American Express; the card need not be in your name.",
    ],
  },
  {
    title: "Check your setup",
    icon: Wifi,
    items: [
      "Use a desktop or laptop with a mouse or trackpad, keyboard and working webcam; phones and tablets are not supported.",
      "Use a stable internet connection in a quiet, well-lit space without interruptions.",
      "Be physically located in Canada or the United States.",
    ],
  },
  {
    title: "Complete one session",
    icon: Clock3,
    items: [
      "Start immediately after registering or use the emailed link within 72 hours.",
      "Finish within 45 minutes in one session; the test cannot be paused.",
      "Do not talk, consult study material or use another electronic device during the test.",
    ],
  },
];

const afterPassChecklist = [
  "Bring one primary and one secondary ID, including the same primary ID used for online registration.",
  "Bring the printed or digital email confirming your online pass.",
  "Bring an original consent form or your parent/guardian if the consent rule applies.",
  "Bring corrective lenses, if applicable, and complete ICBC's vision screening.",
  "Pay the separate $10 Class 7 photo learner-licence fee and any applicable outstanding debt.",
  "Complete ICBC's identity, photo and licence-issuance steps before driving.",
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

const eyebrowClass = "text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.16em] text-slate-500";
const headingClass = "mt-3 text-3xl font-black sm:text-4xl";
const introClass = "mt-4 max-w-3xl leading-relaxed text-slate-600";
const sectionClass = "scroll-mt-28 py-16 sm:py-20";

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
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/" className="text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-white/40">/</span>
          <span className="truncate text-white/65">Class 7 Knowledge Test Guide</span>
        </nav>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[#F5B13A]">
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
          Information checked against the linked official sources on{" "}
          <time dateTime={KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO}>{KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL}</time>.
        </p>
      </div>
    </section>

    {/* Jump links: the guide is long, so give readers a direct route to the one
        thing they came for. Also makes the page eligible for Google jump-to links. */}
    <nav aria-label="On this page" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className={labelClass}>On this page</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {knowledgeTestGuideSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#1d52a1] hover:bg-[#1d52a1]/5 hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>

    <AnimatedSection>
      <section id="at-a-glance" className={sectionClass}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <aside className="border-l-4 border-amber-400 bg-amber-50/70 py-4 pl-5 pr-4 text-sm leading-relaxed text-amber-950">
            <p className="font-bold">Independent guidance, with official sources linked</p>
            <p className="mt-1.5">
              Shanaya&apos;s Driving School prepared and maintains this guide. We are independent from ICBC and this
              page is not an ICBC publication. ICBC decides eligibility, test results and licence issuance, so use the
              linked ICBC pages as the source of truth and recheck them before you apply. To report a factual error,
              email{" "}
              <a
                href="mailto:book@drivingschoolbc.ca?subject=Correction%20to%20knowledge%20test%20guide"
                className="font-semibold underline underline-offset-4"
              >
                book@drivingschoolbc.ca
              </a>
              .
            </p>
          </aside>

          <div className="mt-12">
            <p className={eyebrowClass}>At a glance</p>
            <h2 className={headingClass}>Current Class 7 test facts</h2>
            <p className={introClass}>
              You must be at least 16 and a B.C. resident to apply for a B.C. driver&apos;s licence. These figures
              apply to the passenger-vehicle knowledge test whether you take it online or in person.
            </p>
          </div>

          {/* One panel, six cells — instead of six separate cards. */}
          <dl className="mt-8 grid grid-cols-1 overflow-hidden rounded-[20px] border border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {atAGlanceFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.label}
                  className="border-b border-r border-slate-200 bg-[#F8FAFC] p-6 last:border-b-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
                >
                  <Icon className="h-5 w-5 text-[#1d52a1]" aria-hidden="true" />
                  <dd className="mt-4 text-3xl font-bold text-[#1d52a1]">{fact.value}</dd>
                  <dt className="mt-1 text-sm font-semibold text-slate-600">{fact.label}</dt>
                </div>
              );
            })}
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">The 12 languages are:</span> {testLanguages}
          </p>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h3 className="text-xl font-semibold text-[#173f7b]">
              Parent or guardian consent: note the 2026 change
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
              As of this page&apos;s review date, applicants <strong>under 19</strong> need parent or legal guardian
              consent. The B.C. government says that, effective <strong>October 19, 2026</strong>, the consent
              threshold will be lowered from 19 to 18, so consent will apply to applicants under 18. Check ICBC&apos;s
              current instructions if you apply near or after that date. Read the{" "}
              <OfficialLink href={OFFICIAL_URLS.glpAnnouncement}>official B.C. announcement</OfficialLink>.
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="study-materials" className={`${sectionClass} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Study first</p>
          <h2 className={headingClass}>Start with ICBC&apos;s own materials</h2>
          <p className={introClass}>
            A private quiz is a supplement, not a substitute for the current driving guide and ICBC&apos;s practice
            test.
          </p>

          <div className="mt-10 grid gap-x-12 lg:grid-cols-2">
            <div className="border-t border-slate-300 py-7">
              <BookOpen className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Learn to Drive Smart</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Study ICBC&apos;s official passenger-vehicle guide, including signs, rules, observation, sharing the
                road and risk-management concepts. Return to the relevant chapter whenever a practice answer is
                unclear.
              </p>
              <a
                href={OFFICIAL_URLS.handbook}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#173f7b]"
              >
                Open the official guide
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="border-t border-slate-300 py-7">
              <MonitorCheck className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">ICBC&apos;s official practice test</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Use ICBC&apos;s practice knowledge test after studying. It is based on the real test and can be
                repeated; ICBC also provides a separate road-signs practice test.
              </p>
              <a
                href={OFFICIAL_URLS.practiceTest}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E6242A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
              >
                Use ICBC&apos;s practice test
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="mt-10 border-l-4 border-amber-400 bg-amber-50/70 py-4 pl-5 pr-4 text-sm leading-relaxed text-amber-950">
            <p className="font-bold">Optional: this site&apos;s independent practice bank</p>
            <p className="mt-1.5">
              Our question bank is not supplied, reviewed, approved or endorsed by ICBC, and its session length
              differs from ICBC&apos;s 50-question, 45-minute Class 7 test. A score here does not predict an official
              result. Verify every uncertain rule in the current official guide.
            </p>
            <Link
              to="/knowledge-test-practice"
              className="mt-3 inline-flex items-center gap-2 font-bold text-amber-950 underline underline-offset-4"
            >
              Open the independent practice tool
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="online-test" className={sectionClass}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Choose a format</p>
          <h2 className={headingClass}>Online knowledge test workflow</h2>
          <p className={introClass}>
            ICBC launched online passenger-vehicle knowledge tests on June 9, 2026. The online result is only the test
            result; ICBC must still issue your learner&apos;s licence before you can drive.
          </p>

          <ol className="mt-10 grid gap-x-12 lg:grid-cols-2">
            {onlineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="border-t border-slate-300 py-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d52a1] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-[#1d52a1]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <CheckList items={step.items} />
                </li>
              );
            })}
          </ol>

          <div className="mt-10 grid gap-x-12 border-t border-slate-300 pt-8 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">If you do not pass</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                ICBC says you may retake the online test after 24 hours. You must register again and pay another $15
                attempt fee. You may instead take the knowledge test at a driver licensing office.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <h3 className="text-xl font-semibold">Online monitoring and disqualification</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                ICBC may disqualify a session after repeated monitoring issues, such as leaving the test screen,
                moving the cursor outside the test border, an obscured or mismatched face, or webcam failure. You may
                try online again after 24 hours and pay again. After three online disqualifications, online testing is
                unavailable for six months, but in-person testing remains available.
              </p>
            </div>
          </div>

          <a
            href={OFFICIAL_URLS.onlineTest}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#173f7b]"
          >
            Read ICBC&apos;s rules and start online
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="in-person-test" className={`${sectionClass} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Office option</p>
          <h2 className={headingClass}>In-person knowledge test workflow</h2>
          <p className={introClass}>
            The in-person Class 7 test has the same 50 questions, 40-correct pass requirement, 45-minute limit, $15
            attempt fee and 12 language choices. ICBC says in-person tests use a touchscreen kiosk and offer audio.
          </p>

          <div className="mt-10 grid gap-x-12 lg:grid-cols-2">
            <div className="border-t border-slate-300 py-7">
              <MapPin className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Book the correct location</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Use ICBC&apos;s office finder and appointment page. Your nearest service may be an ICBC driver
                licensing office, a Service BC centre or a driver licensing agent, and booking instructions differ by
                location. Follow the confirmation email and contact the location if you need an accommodation.
              </p>
              <p className="mt-4">
                <OfficialLink href={OFFICIAL_URLS.bookAppointment}>Find an office and book with ICBC</OfficialLink>
              </p>
            </div>

            <div className="border-t border-slate-300 py-7">
              <IdCard className="h-6 w-6 text-[#1d52a1]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Bring the required items</h3>
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
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={OFFICIAL_URLS.acceptedId}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:border-[#1d52a1]"
            >
              Check accepted ID
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={OFFICIAL_URLS.fees}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:border-[#1d52a1]"
            >
              Check current fees
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="after-you-pass" className={sectionClass}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>After an online pass</p>
          <h2 className={headingClass}>A passing result is not a licence</h2>
          <div className="mt-8 rounded-[20px] bg-[#1d52a1] p-7 text-white sm:p-9">
            <p className="text-xl font-bold sm:text-2xl">
              You are not licensed or legally allowed to drive until ICBC issues your learner&apos;s licence.
            </p>
            <p className="mt-4 max-w-4xl leading-relaxed text-white/85">
              After passing online, visit a driver licensing office. Depending on the office, ICBC says you may need
              to book a short appointment. Your online result is valid for one year.
            </p>

            <ul className="mt-7 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {afterPassChecklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F5B13A]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="faq" className={`${sectionClass} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Common questions</p>
          <h2 className={headingClass}>B.C. knowledge test questions, answered</h2>
          <p className={introClass}>
            Short answers to the questions learners ask most often. Each one reflects the official sources listed at
            the end of this guide.
          </p>

          <dl className="mt-10 max-w-3xl divide-y divide-slate-300 border-y border-slate-300">
            {knowledgeTestGuideFaqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <dt className="text-lg font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-2 leading-relaxed text-slate-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section id="sources" className={sectionClass}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Verification</p>
          <h2 className={headingClass}>Official sources used</h2>
          <p className={introClass}>
            These links support the test facts, application steps, identification requirements, fees and announced
            consent change described above. They were checked on {KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL}.
          </p>
          <ul className="mt-8 grid gap-x-12 border-t border-slate-300 lg:grid-cols-2">
            {sourceLinks.map((source) => (
              <li key={source.href} className="border-b border-slate-200">
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 py-4 text-sm font-semibold text-[#1d52a1] transition-colors hover:text-[#173f7b]"
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

    <section className="bg-[#1d52a1] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F5B13A]">Your next step</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-black sm:text-3xl">
          Studying is easier with someone who teaches this every week
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Our knowledge test prep course walks through signs, rules and the questions learners get wrong most often.
          When you are ready for the road test, our instructors take it from there.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/courses/knowledge-test-prep-course"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5B13A] px-7 py-3 text-sm font-bold text-[#173f7b] transition-colors hover:bg-[#f7bf5c]"
          >
            Knowledge Test Prep Course
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Book a driving lesson
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Applying now?{" "}
          <a
            href={OFFICIAL_URLS.getYourL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline underline-offset-4 hover:text-[#F5B13A]"
          >
            Read ICBC&apos;s Get your L page
          </a>{" "}
          and recheck current requirements before paying or attending an office.
        </p>
      </div>
    </section>

    <SiteFooter />
  </main>
);

export default KnowledgeTestGuide;
