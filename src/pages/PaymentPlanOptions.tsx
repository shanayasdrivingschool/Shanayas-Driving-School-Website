import { useEffect, type ComponentType, type SVGProps } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, CreditCard, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type PaymentStep = {
  step: string;
  title: string;
  description: string;
  icon: IconType;
};

type PlanHighlight = {
  title: string;
  description: string;
  icon: IconType;
};

type Benefit = {
  title: string;
  text: string;
};

type PaymentOption = {
  title: string;
  badge?: string;
  details: string[];
};

type PackagePlan = {
  name: string;
  summary: string;
  popular?: boolean;
  options: PaymentOption[];
};

type Testimonial = {
  name: string;
  platform: string;
  quote: string;
};

const studentFormHref = "/apply";
const paymentPlanHeroBackground =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=80";

const primaryButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]";

const accentButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#E6242A] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]";

const sectionContainerClassName = "mx-auto max-w-6xl px-4 sm:px-6";

const planHighlights: PlanHighlight[] = [
  {
    title: "Clear schedule",
    description: "Your payment timeline is confirmed up front, so you know exactly what happens after registration.",
    icon: CalendarClock,
  },
  {
    title: "Automatic processing",
    description: "Recurring payments are processed on schedule without manual follow-up every few weeks.",
    icon: CreditCard,
  },
  {
    title: "Simple to manage",
    description: "Families and students can stay focused on lessons instead of juggling separate payment reminders.",
    icon: CheckCircle2,
  },
];

const paymentSteps: PaymentStep[] = [
  {
    step: "1",
    title: "Enrol and make your first payment",
    description: "Choose your package, complete registration, and activate your training plan with the first scheduled payment.",
    icon: CreditCard,
  },
  {
    step: "2",
    title: "Second payment is processed 4 weeks later",
    description: "Your next scheduled payment is processed automatically 4 weeks after the first one, so the timeline stays predictable.",
    icon: CalendarClock,
  },
  {
    step: "3",
    title: "Final payment is processed 4 weeks after that",
    description: "Your final scheduled payment is processed 4 weeks later, completing the plan on a clear, repeatable schedule.",
    icon: CheckCircle2,
  },
];

const recurringBenefits: Benefit[] = [
  {
    title: "Convenience",
    text: "Never miss a due date.",
  },
  {
    title: "Consistency",
    text: "Stay in good standing and avoid late fees.",
  },
  {
    title: "Easy management",
    text: "View history and update methods anytime through your account portal.",
  },
];

const packagePlans: PackagePlan[] = [
  {
    name: "Basic Package",
    summary: "A straightforward option for students who want a simple plan with clear instalment choices.",
    options: [
      {
        title: "Option 1 - Pay in Full",
        badge: "Best Value",
        details: ["Full Amount due upon registration."],
      },
      {
        title: "Option 2 - Two Instalments",
        details: ["First Half due upon registration.", "Second Half due 4 weeks from first payment."],
      },
      {
        title: "Option 3 - Three Instalments",
        details: [
          "First Third due upon registration.",
          "Second Third due 4 weeks from first payment.",
          "Final Third due 4 weeks from second payment.",
        ],
      },
    ],
  },
  {
    name: "Intermediate Package",
    summary: "A balanced option for students who want more flexibility while keeping the schedule easy to follow.",
    popular: true,
    options: [
      {
        title: "Option 1 - Pay in Full",
        badge: "Best Value",
        details: ["Full Amount due upon registration."],
      },
      {
        title: "Option 2 - Two Instalments",
        details: ["First Half due upon registration.", "Second Half due 4 weeks from first payment."],
      },
      {
        title: "Option 3 - Three Instalments",
        details: [
          "First Third due upon registration.",
          "Second Third due 4 weeks from first payment.",
          "Final Third due 4 weeks from second payment.",
        ],
      },
    ],
  },
  {
    name: "Advanced Package",
    summary: "Ideal for students who want the most room to spread costs across a longer payment schedule.",
    options: [
      {
        title: "Option 1 - Pay in Full",
        badge: "Best Value",
        details: ["Full Amount due upon registration."],
      },
      {
        title: "Option 2 - Two Instalments",
        details: ["First Half due upon registration.", "Second Half due 4 weeks from first payment."],
      },
      {
        title: "Option 3 - Three Instalments",
        details: [
          "First Third due upon registration.",
          "Second Third due 4 weeks from first payment.",
          "Final Third due 4 weeks from second payment.",
        ],
      },
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Olivia R.",
    platform: "Google",
    quote:
      "The payment plan made it much easier to start lessons right away. Everything was clear, automatic, and easy to manage.",
  },
  {
    name: "Daniel M.",
    platform: "Facebook",
    quote:
      "I appreciated how straightforward the instalments were. No hidden surprises, and the team explained the timeline clearly.",
  },
  {
    name: "Sarah K.",
    platform: "Google",
    quote:
      "As a parent booking lessons for my teen, the flexible plan helped us budget properly while keeping the process stress-free.",
  },
];

const PaymentPlanOptions = () => {
  useEffect(() => {
    document.title = "Payment Plan Options | Shanaya's Driving School";
  }, []);

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Flexible payment options for students and families"
        title={<span className="text-white">Payment plan options</span>}
        description="Shanaya's Driving School offers clear installment schedules that make it easier to register with confidence and manage payments without surprises."
        backgroundImage={paymentPlanHeroBackground}
        minHeightClassName="min-h-[480px] md:min-h-[560px]"
        contentLayout="center"
        titleClassName="text-white"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className={sectionContainerClassName}>
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Simple</p>
          <h2 className="mx-auto mt-2 max-w-4xl text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
            Flexible schedules with one clear process
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
            Once your package is selected, the payment plan follows a straightforward timeline so you know what is due,
            when it is processed, and how the schedule moves forward.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {planHighlights.map((highlight) => (
              <article
                key={highlight.title}
                data-global-reveal="true"
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] text-[#202121]">
                  <highlight.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{highlight.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{highlight.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/payment-plan-options#packages" className={primaryButtonClassName}>
              View options
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={studentFormHref} className={accentButtonClassName}>
              Book now
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className={sectionContainerClassName}>
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Steps</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
            How our payment plans work
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Every installment plan follows the same sequence, giving students and families a predictable timeline from
            registration to final payment.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {paymentSteps.map((item) => (
              <article
                key={item.step}
                data-global-reveal="true"
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5C518] text-lg font-black text-[#202121]">
                    {item.step}
                  </span>
                  <div>
                    <item.icon className="h-6 w-6 text-[#1d52a1]" />
                    <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className={`${sectionContainerClassName} max-w-4xl`}>
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl">Details</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl">What Are Recurring Payments?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Recurring payments are scheduled deductions processed automatically at the set intervals in your plan.
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-2 shadow-sm sm:px-8">
            <Accordion type="single" collapsible defaultValue="recurring" className="w-full">
              <AccordionItem value="recurring" className="border-slate-200">
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline sm:text-xl">
                  Why we use recurring payment schedules
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-slate-600">
                  Once your plan is set up, each payment is processed automatically on schedule without requiring manual
                  action. That means less admin, fewer reminders, and a simpler experience while you focus on lesson
                  progress and road-readiness.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {recurringBenefits.map((benefit) => (
              <article
                key={benefit.title}
                data-global-reveal="true"
                className="rounded-2xl border border-slate-200 bg-[#F2F2F2] p-5"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F5C518] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#202121]">
                  <CheckCircle2 className="h-4 w-4" />
                  {benefit.title}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className={sectionContainerClassName}>
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Plans</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Choose Your Package</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Every package includes the same straightforward payment paths, so you can pick the schedule that best fits
            your budget and timeline.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {packagePlans.map((plan) => (
              <article
                key={plan.name}
                data-global-reveal="true"
                className={`relative flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ${
                  plan.popular ? "border-2 border-[#1d52a1] shadow-md" : "border border-slate-200"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#E6242A] px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </span>
                ) : null}

                <div className="min-h-[144px]">
                  <h3 className="text-3xl font-black text-slate-900">{plan.name}</h3>
                  <p className="mt-2 text-sm italic text-slate-500">Taxes Included in Pricing</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{plan.summary}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {plan.options.map((option) => (
                    <section key={option.title} className="rounded-2xl border border-slate-200 bg-[#F2F2F2] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-900">{option.title}</p>
                        {option.badge ? (
                          <span className="rounded-full bg-[#F5C518] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#202121]">
                            {option.badge}
                          </span>
                        ) : null}
                      </div>

                      <ul className="mt-3 space-y-2">
                        {option.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <Link
                  to={studentFormHref}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-7 py-3 text-sm font-bold transition-colors ${
                    plan.popular ? "bg-[#E6242A] text-white hover:bg-[#C41E23]" : "bg-[#1d52a1] text-white hover:bg-[#17488d]"
                  }`}
                >
                  Book now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid items-start gap-8 rounded-[36px] bg-[#1d52a1] p-6 text-white shadow-[0_22px_55px_rgba(29,82,161,0.18)] sm:p-8 lg:grid-cols-[0.14fr_0.86fr]">
            <div className="flex items-start justify-center lg:justify-start">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C518] text-4xl font-black text-[#202121]">
                "
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Our approach</p>
              <div className="mt-4 h-1 w-16 rounded-full bg-[#F5C518]" aria-hidden="true" />
              <p className="mt-6 text-2xl font-black italic leading-relaxed sm:text-3xl">
                "Our key focus is to create a welcoming and safe environment for every student."
              </p>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-[#F5C518]">
                Shandra MacMaster, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className={sectionContainerClassName}>
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Reviews</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
            Here&apos;s What People Say About Us
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Families and learners choose payment plans because they are easy to understand, easy to follow, and easy
            to manage.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((review) => (
              <article
                key={review.name}
                data-global-reveal="true"
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-[#F5C518]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${review.name}-star-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{review.quote}</p>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-lg font-black text-slate-900">{review.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1d52a1]">{review.platform}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteCtaSection
        eyebrow="Start with confidence"
        title={
          <>
            Choose the <span className="text-[#F5B13A]">payment plan</span> that fits your schedule
          </>
        }
        description="Register for the package that suits your stage, choose a payment schedule that feels manageable, and let our team guide the rest."
        actions={
          <>
            <Link to={studentFormHref} className={siteCtaPrimaryClassName}>
              Book now
            </Link>
            <Link to="/payment-plan-options#packages" className={siteCtaSecondaryClassName}>
              View options
            </Link>
          </>
        }
        sectionClassName="bg-white"
        imageSrc="/logos/cta-mascot.png"
        imageAlt="Driving school mascot"
      />

      <SiteFooter />
    </main>
  );
};

export default PaymentPlanOptions;
