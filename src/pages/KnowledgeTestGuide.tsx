import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  Facebook,
  IdCard,
  Lightbulb,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Monitor,
  ShieldCheck,
  Target,
  Twitter,
  Wifi,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";

const UNLOCK_STORAGE_KEY = "ktg:unlocked";
const EMAIL_STORAGE_KEY = "ktg:email";
const ICBC_HANDBOOK_URL = "https://www.icbc.com/assets/en/63cHBOAVpOAQGOOMBFhFbL/driver-full.pdf";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SITE_ORIGIN = "https://www.drivingschoolbc.ca";
const GUIDE_URL = `${SITE_ORIGIN}/knowledge-test-guide`;
const GUIDE_TITLE = "Free step by step ICBC knowledge test guide";
const shareLinks = [
  {
    label: "Share the guide on LinkedIn",
    icon: Linkedin,
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(GUIDE_URL)}`,
  },
  {
    label: "Share the guide on X",
    icon: Twitter,
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(GUIDE_URL)}&text=${encodeURIComponent(GUIDE_TITLE)}`,
  },
  {
    label: "Share the guide on Facebook",
    icon: Facebook,
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(GUIDE_URL)}`,
  },
];

type BulletGroup = {
  label: string;
  icon: typeof Monitor;
  items: string[];
};

const onlineRequirementGroups: BulletGroup[] = [
  {
    label: "To register you'll need",
    icon: IdCard,
    items: [
      "An email address.",
      "A piece of accepted primary ID to confirm your identity. Bring the same ID to your driver licensing appointment.",
      "A valid Visa, MasterCard, or American Express credit card. It does not need to be in your name.",
    ],
  },
  {
    label: "Your device setup",
    icon: Monitor,
    items: [
      "A desktop or laptop with a mouse or trackpad and a keyboard. The test cannot be taken on a smartphone or tablet.",
      "A working webcam that stays on for the entire test. This keeps the test fair and helps prevent cheating.",
      "A stable internet connection.",
      "Turn off notifications on your devices before you start.",
    ],
  },
  {
    label: "Your environment",
    icon: Lightbulb,
    items: [
      "A quiet space with no interruptions from other people or pets.",
      "Well lit, with no shadows or glare.",
      "You must be physically in Canada or the United States.",
    ],
  },
];

const testDayItems = [
  "Be at least 16 years old.",
  "Be ready to pass a vision test.",
  "Bring two pieces of accepted identification.",
];

const guidePreviewItems = [
  "Online vs in-person eligibility, side by side",
  "The official ICBC study handbook to download",
  "A free practice test and the 80% pass mark",
  "Exactly what to bring on test day",
];

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="mt-3 space-y-2.5">
    {items.map((item) => (
      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const StepBadge = ({ n }: { n: number }) => (
  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d52a1] text-lg font-black text-white">
    {n}
  </span>
);

const KnowledgeTestGuide = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_STORAGE_KEY) === "true") {
        setUnlocked(true);
      }
    } catch {
      /* localStorage unavailable, so the gate stays closed, which is fine */
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    try {
      localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
      localStorage.setItem(EMAIL_STORAGE_KEY, value);
    } catch {
      /* ignore persistence failure; still unlock for this session */
    }
    setUnlocked(true);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Masthead: solid brand-blue band */}
      <section className="relative bg-[#1d52a1] text-white">
        <SiteHeader tone="brand" />
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
            <Link to="/" className="text-white/80 transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="truncate text-white/55">Knowledge Test Guide</span>
          </nav>

          <h1
            className="mt-6 max-w-3xl text-[clamp(1.9rem,4.6vw,3rem)] font-black leading-[1.08]"
            style={{ textWrap: "balance" }}
          >
            Free step by step ICBC knowledge test guide
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Everything you need to book, study for, and pass your BC knowledge test, from eligibility to test day.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {!unlocked ? (
        /* Email gate */
        <AnimatedSection>
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                <div className="grid md:grid-cols-2">
                  {/* Value: what's inside */}
                  <div className="border-b border-slate-200 bg-[#F8FAFC] p-8 sm:p-10 md:border-b-0 md:border-r">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                      <Lock className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 text-2xl font-black text-slate-900">What's inside the guide</h2>
                    <ul className="mt-6 space-y-4">
                      {guidePreviewItems.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <h3 className="text-xl font-black text-slate-900">Unlock it free</h3>
                    <p className="mt-2 text-sm text-slate-600">Enter your email for instant access.</p>

                    <form onSubmit={handleSubmit} className="mt-6" noValidate>
                      <label htmlFor="ktg-email" className="text-sm font-bold text-slate-700">
                        Email address
                      </label>
                      <div className="relative mt-2">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="ktg-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError("");
                          }}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? "ktg-email-error" : undefined}
                          className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                        />
                      </div>
                      {error ? (
                        <p id="ktg-email-error" role="alert" className="mt-2 text-sm font-semibold text-[#E6242A]">
                          {error}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E6242A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                      >
                        Unlock the guide
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <p className="mt-4 text-xs text-slate-400">
                        We'll only use your email to help you on your driving journey. No spam.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      ) : (
        /* Unlocked guide */
        <>
          {/* Step 1: Eligibility */}
          <AnimatedSection>
            <section className="py-16 sm:py-20">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <StepBadge n={1} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Step 1</p>
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Confirm you're eligible</h2>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
                  You can take the knowledge test online or in person. Check the requirements for the option you prefer.
                </p>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  {/* Online */}
                  <article className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                        <Wifi className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900">Online knowledge test</h3>
                    </div>
                    <div className="mt-5 rounded-2xl bg-[#F2F2F2] px-4 py-3 text-sm font-semibold text-slate-700">
                      You can take the online test if you are at least 16 years old.
                    </div>

                    {onlineRequirementGroups.map((group) => {
                      const Icon = group.icon;
                      return (
                        <div key={group.label} className="mt-5">
                          <p className="flex items-center gap-2 text-sm font-black text-[#274556]">
                            <Icon className="h-4 w-4 text-[#1d52a1]" />
                            {group.label}
                          </p>
                          <CheckList items={group.items} />
                        </div>
                      );
                    })}
                  </article>

                  {/* In person */}
                  <article className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900">In-person knowledge test</h3>
                    </div>
                    <div className="mt-5 rounded-2xl bg-[#F2F2F2] px-4 py-3 text-sm font-semibold text-slate-700">
                      Prefer to test at a driver licensing office? Here's what you need.
                    </div>

                    <div className="mt-5">
                      <p className="flex items-center gap-2 text-sm font-black text-[#274556]">
                        <ShieldCheck className="h-4 w-4 text-[#1d52a1]" />
                        Requirements
                      </p>
                      <CheckList
                        items={[
                          "Be at least 16 years old.",
                          "Pass a vision test.",
                          "Bring two pieces of identification.",
                        ]}
                      />
                    </div>

                    <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[#F5B13A]/10 px-4 py-3">
                      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[#9a6400]" />
                      <p className="text-sm font-semibold text-[#9a6400]">
                        Tip: bring your glasses or contacts if you use them. You'll need to pass the vision test.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Step 2: Study */}
          <AnimatedSection>
            <section className="bg-[#F2F2F2] py-16 sm:py-20">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <StepBadge n={2} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Step 2</p>
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Study the official handbook</h2>
                  </div>
                </div>

                <div className="mt-8 grid items-center gap-8 rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)] sm:p-9 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900">ICBC "Learn to Drive Smart"</h3>
                    </div>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                      Every knowledge test question comes from this official ICBC handbook. Read it cover to cover. It
                      covers road signs, right-of-way rules, speed limits, and safe driving practices you'll be tested on.
                    </p>
                  </div>
                  <a
                    href={ICBC_HANDBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                  >
                    <Download className="h-4 w-4" />
                    Download the handbook (PDF)
                  </a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Step 3: Practice */}
          <AnimatedSection>
            <section className="py-16 sm:py-20">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <StepBadge n={3} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Step 3</p>
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Practice until you're ready</h2>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <article className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                        <Target className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900">Take our free practice test</h3>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-slate-600">
                      Run through ICBC-style questions as many times as you like. Practising under real conditions is the
                      fastest way to spot the topics you still need to review.
                    </p>
                    <Link
                      to="/knowledge-test-practice"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E6242A] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                    >
                      Start practising
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>

                  <article className="flex flex-col justify-center rounded-[30px] bg-[#1d52a1] p-7 text-center text-white shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-200">Passing score</p>
                    <p className="mt-2 text-6xl font-black leading-none text-[#F5B13A]">80%</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-100">
                      You need at least 80% to pass. Keep practising until you clear 80% comfortably and consistently
                      before you book the real test.
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Step 4: Test day */}
          <AnimatedSection>
            <section className="bg-[#F2F2F2] py-16 sm:py-20">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <StepBadge n={4} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Step 4</p>
                    <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">On the day of your test</h2>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
                  Whether you test online or in person, make sure you've got these covered before you begin.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                  {testDayItems.map((item, index) => {
                    const icons = [IdCard, Eye, CreditCard];
                    const Icon = icons[index] ?? CheckCircle2;
                    return (
                      <article
                        key={item}
                        className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
                      >
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-base font-semibold text-slate-700">{item}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <SiteCtaSection
              eyebrow="Ready to pass?"
              title={
                <>
                  Practise now, then <span className="text-[#F5B13A]">book your lessons</span>
                </>
              }
              description="Sharpen up with our free practice test, then let our instructors get you road-ready with calm, structured lessons."
              actions={
                <>
                  <Link to="/knowledge-test-practice" className={siteCtaPrimaryClassName}>
                    Take the practice test
                  </Link>
                  <Link to="/packages" className={siteCtaSecondaryClassName}>
                    View lesson packages
                  </Link>
                </>
              }
            />
          </AnimatedSection>
        </>
      )}

      <SiteFooter />
    </main>
  );
};

export default KnowledgeTestGuide;
