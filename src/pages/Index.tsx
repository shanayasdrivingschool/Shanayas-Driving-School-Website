import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import BrandWaveDivider from "@/components/BrandWaveDivider";
import CustomPackagePromoCard from "@/components/CustomPackagePromoCard";
import InstallmentCtaSection from "@/components/InstallmentCtaSection";
import SafetyStandardsSection from "@/components/SafetyStandardsSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhyChooseCarousel from "@/components/WhyChooseCarousel";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName } from "@/components/SiteCtaSection";
import { TypingWords } from "@/components/ui/typing-words";
import { blogPosts } from "@/data/blogPosts";

type Program = {
  title: string;
  description: string;
  highlights: string[];
  cta: string;
};

type Advantage = {
  title: string;
  text: string;
  image: string;
};

type ProcessStep = {
  step: string;
  title: string;
  lead: string;
  detail: string;
  image: string;
  highlightText?: string;
  highlightStartsNewLine?: boolean;
};

const programs: Program[] = [
  {
    title: "Fresh Start",
    description: "A step-by-step plan for new drivers to build confidence safely.",
    highlights: [
      "Core driving fundamentals",
      "Parking and On - road skills ",
      "City & Highway Driving",
      "Progress tracking",
    ],
    cta: "/packages/fresh-start",
  },
  {
    title: "Skill Builder",
    description: "Focused prep for students who want a calm and confident test day.",
    highlights: [
      "Parking and merging confidence",
      "Busy-intersection practice",
      "Defensive driving techniques",
      "Targeted skill-building sessions",
    ],
    cta: "/packages/skill-builder",
  },
  {
    title: "Final Lap",
    description: "Designed for experienced drivers ready to complete their licensing journey",
    highlights: [
      "Mock test route sessions",
      "Road test evaluation checklist",
      "Last-minute confidence drills",
      "Test-day readiness strategy",
    ],
    cta: "/packages/final-lap",
  },
];

const advantages: Advantage[] = [
  {
    title: "ICBC Aligned Training Standards",
    text: "Structured lessons based on ICBC road safety guidelines, focusing on defensive driving, hazard awareness, and real-world decision making for confident test readiness.",
    image: "/why-choose/icbc-aligned-standards.webp",
  },
  {
    title: "Licensed & Patient Instructors",
    text: "Certified instructors provide calm, supportive coaching tailored to each learner's pace, helping students build confidence while developing safe lifelong driving habits.",
    image: "/why-choose/licensed-instructors.webp",
  },
  {
    title: "Dual Control Vehicles",
    text: "Training vehicles are equipped with instructor dual-control systems, allowing immediate intervention when needed to ensure maximum safety during every lesson.",
    image: "/why-choose/dual-control-vehicles-v2.webp",
  },
  {
    title: "Flexible Scheduling",
    text: "Convenient weekday and selected weekend lesson availability designed to fit student, school, and work schedules without added stress.",
    image: "/why-choose/flexible-scheduling-v2.webp",
  },
  {
    title: "Knowledge Test Preparation",
    text: "Comprehensive preparation covering road signs, traffic rules, and ICBC knowledge test strategies to help students succeed on their first attempt.",
    image: "/why-choose/knowledge-test-prep.webp",
  },
  {
    title: "Regular Progress Tracking Updates",
    text: "Ongoing performance assessments and feedback ensure students clearly understand their strengths, improvement areas, and road test readiness.",
    image: "/why-choose/progress-tracking-v2.webp",
  },
  {
    title: "Pick Up & Drop Off Available",
    text: "Door-to-door lesson options provide added convenience, allowing students to begin and finish training safely from home, school, or work locations.",
    image: "/why-choose/pickup-dropoff-v2.webp",
  },
  {
    title: "Modern Training Facility",
    text: "A clean, professional learning environment designed to support both in-car instruction and theory preparation in a comfortable setting.",
    image: "/why-choose/modern-facility-v2.webp",
  },
  {
    title: "Multi-Language Support",
    text: "Instruction available in multiple languages to ensure clear communication and a comfortable learning experience for students from diverse backgrounds.",
    image: "/why-choose/multi-language-v2.webp",
  }
];

const processSteps: ProcessStep[] = [
  {
  step: "01",
  title: "Welcome & Assessment",
  lead: "Your journey begins with a friendly introduction where we get to know you and understand your driving experience and goals.",
  detail:
    "If you are new to driving, we guide you through the basics. If you already have experience, we begin with a short assessment drive to understand your strengths and areas for improvement. This helps us create a lesson plan that matches your comfort level and builds confidence from the start. Ruley believes every great driver begins with a strong foundation.",
  highlightText: "Ruley believes every great driver begins with a strong foundation.",
  highlightStartsNewLine: true,
  image: "/process/our-process-1.svg.webp",
},
{
  step: "02",
  title: "Skill Building",
  lead: "This is where real progress begins. Tailored lessons designed to help you feel comfortable behind the wheel.",
  detail:
    "You will learn essential driving skills, including vehicle control, effective observation habits, smooth braking, parking techniques, and lane changes. Each lesson builds progressively to help you develop safe driving habits, improve road awareness, and gain confidence through consistent practice. Ruley says: The best drivers build confidence the right way: one skill, one lesson, one step at a time.",
  highlightText: "Ruley says: The best drivers build confidence the right way: one skill, one lesson, one step at a time.",
  highlightStartsNewLine: true,
  image: "/process/our-process-2.webp",
},
{
  step: "03",
  title: "Real Road Experience",
  lead: "Once the fundamentals are strong, we guide you into real traffic situations to develop practical driving confidence.",
  detail:
    "Students practice city driving, intersections, lane positioning, and defensive driving techniques in real road environments. Our dual control vehicles allow instructors to support you whenever needed, ensuring every lesson remains safe, calm, and encouraging. Ruley says: Real confidence grows when you practice in real traffic with the right support beside you.",
  highlightText: "Ruley says: Real confidence grows when you practice in real traffic with the right support beside you.",
  highlightStartsNewLine: true,
  image: "/process/our-process-3.webp",
},
{
  step: "04",
  title: "Mock Road Test Preparation",
  lead: "Before your actual test, we simulate the road test experience so you know exactly what to expect.",
  detail:
    "You will complete mock test routes based on real examination standards while receiving clear, constructive feedback from your instructor. This step is designed to reduce uncertainty, refine key driving skills, and help you feel prepared and confident on test day. Ruley reminds students that practice builds confidence.",
  highlightText: "Ruley reminds students that practice builds confidence.",
  highlightStartsNewLine: true,
  image: "/process/our-process-4.webp",
},
{
  step: "05",
  title: "Test Day Confidence",
  lead: "The final step prepares you mentally and practically so you arrive ready and confident for your driving test.",
  detail:
    "We review key driving skills, common test mistakes, and helpful strategies to keep you calm and focused. By test day, you understand what examiners expect and feel fully prepared to succeed. Our goal is simple. Help you drive into your test with confidence and leave with your license. Ruley says: The best test-day confidence comes from expert guidance and knowing what examiners look for.",
  highlightText: "Ruley says: The best test-day confidence comes from expert guidance and knowing what examiners look for.",
  highlightStartsNewLine: true,
  image: "/process/our-process-5.webp",
},
];

const renderProcessDetail = (step: ProcessStep) => {
  if (!step.highlightText || !step.detail.includes(step.highlightText)) {
    return step.detail;
  }

  const [before, after] = step.detail.split(step.highlightText);
  const beforeText = step.highlightStartsNewLine ? before.trimEnd() : before;

  return (
    <>
      {beforeText}
      {step.highlightStartsNewLine ? <br /> : null}
      <span className="font-semibold text-[#2563eb]">{step.highlightText}</span>
      {after}
    </>
  );
};

const heroVideoSrc = "/Misc/HeroSectionVid.webm";
const heroVideoPosterUrl = "/Misc/hero-video-poster.webp";

type HeroConnection = {
  effectiveType?: string;
  saveData?: boolean;
};

const HeroBackgroundMedia = () => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const connection = (navigator as Navigator & { connection?: HeroConnection }).connection;
    const saveData = connection?.saveData === true;
    const effectiveType = connection?.effectiveType ?? "";
    const isConstrainedConnection = ["slow-2g", "2g", "3g"].includes(effectiveType);

    if (prefersReducedMotion || !isDesktop || saveData || isConstrainedConnection) {
      return;
    }

    const enhancedWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const scheduleVideoLoad = () => {
      if (enhancedWindow.requestIdleCallback) {
        idleId = enhancedWindow.requestIdleCallback(() => setShouldLoadVideo(true), { timeout: 1200 });
        return;
      }

      timeoutId = window.setTimeout(() => setShouldLoadVideo(true), 500);
    };

    if (document.readyState === "complete") {
      scheduleVideoLoad();
    } else {
      window.addEventListener("load", scheduleVideoLoad, { once: true });
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (idleId && enhancedWindow.cancelIdleCallback) {
        enhancedWindow.cancelIdleCallback(idleId);
      }
      window.removeEventListener("load", scheduleVideoLoad);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <img
        src={heroVideoPosterUrl}
        alt="Driving lesson road scene for Shanaya's Driving School"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {shouldLoadVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroVideoPosterUrl}
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => setVideoReady(true)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={heroVideoSrc} type="video/webm" />
        </video>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20 bg-gradient-to-b from-black via-black/95 to-transparent md:h-24 lg:h-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-black/80 to-transparent md:w-28 lg:w-36" />
    </div>
  );
};

const Index = () => {
  const [visibleProcessRows, setVisibleProcessRows] = useState<boolean[]>(processSteps.map(() => false));
  const processRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleReveal = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLDivElement).dataset.index ?? -1);
        if (index < 0) return;

        setVisibleProcessRows((current) => {
          if (current[index]) return current;
          const next = [...current];
          next[index] = true;
          return next;
        });

        observer.unobserve(entry.target);
      });
    };

    const observer = new IntersectionObserver(handleReveal, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    processRowRefs.current.forEach((rowNode) => {
      if (rowNode) observer.observe(rowNode);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#ffffff] text-[#202121]">
      <section
        className="relative isolate min-h-[680px] w-full overflow-hidden text-white sm:min-h-[760px] md:min-h-[800px] lg:min-h-[860px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <HeroBackgroundMedia />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(67deg,rgba(0,0,0,0.68),rgba(113,113,113,0.55))]" />

        <div className="relative z-30 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <SiteHeader tone="light" />

          <div className="grid min-h-[540px] items-end gap-8 pb-28 pt-6 sm:min-h-[620px] sm:pb-36 sm:pt-10 lg:min-h-[700px] lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:pb-44">
            <div className="w-full max-w-[820px] text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider md:text-[13px]">
                Victoria & Langford's driving school, serving Greater Victoria & the Gulf Islands.
              </p>
              <h1
                className="mt-3 text-[clamp(1.7rem,5.4vw,3.12rem)] font-extrabold leading-[1.08] tracking-tight"
                style={{ textWrap: "balance" }}
              >
                <span className="block whitespace-nowrap">
                  We train{" "}
                  <TypingWords
                    words={["Confidence", "Safe Drivers", "Driving Skills", "Decision-Making"]}
                    className="text-[#F5C518]"
                    typingSpeed={90}
                    deletingSpeed={55}
                    pauseDuration={1100}
                  />
                </span>
                <span className="mt-1 block">that last beyond the test.</span>
              </h1>
              <p className="mt-4 max-w-[560px] text-[clamp(0.95rem,1.45vw,1.25rem)] leading-[1.4]">
                ICBC-aligned driving lessons in Victoria, Langford, and across Greater Victoria, built to grow confidence, hazard awareness, and real-world driving skills.
              </p>
              <div className="mt-6 responsive-cta-row justify-start md:gap-4">
                <Link
                  to="/courses"
                  className="w-full rounded-full bg-[#1d52a1] px-6 py-2 text-center text-[clamp(0.85rem,1.2vw,1.1rem)] font-medium text-white transition-colors hover:bg-[#17488d] sm:w-auto md:px-8 md:py-2.5"
                >
                  Courses
                </Link>
                <Link
                  to="/apply"
                  className="w-full rounded-full bg-[#E6242A] px-6 py-2 text-center text-[clamp(0.85rem,1.2vw,1.1rem)] font-medium text-white transition-colors hover:bg-[#C41E23] sm:w-auto md:px-8 md:py-2.5"
                >
                  Book now
                </Link>
              </div>
              <img
                src="/logos/hero-main.webp"
                alt="Driving school mascot"
                decoding="async"
                className="mx-auto mt-6 block h-[clamp(250px,62vw,360px)] w-full max-w-[min(100%,360px)] object-contain lg:hidden"
              />
            </div>

            <div className="relative hidden lg:flex lg:justify-start">
              <div className="w-full max-w-[620px] lg:-ml-8">
                <img
                  src="/logos/hero-main.webp"
                  alt="Driving school mascot"
                  decoding="async"
                  className="h-[clamp(360px,36vw,460px)] w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <BrandWaveDivider
          className="absolute inset-x-0 -bottom-px z-20 h-[170px] md:h-[235px] lg:h-[300px]"
          showBottomLine
        />
      </section>

      <AnimatedSection>
        <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="responsive-section-label text-center font-black text-gray-300/80">The Plan</p>
          <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#1d52a1] sm:text-sm">
            Professional Driving Education for Every Learner
          </p>
          <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">
            Your Roadmap to <span className="text-[#1d52a1]">Success</span>
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {[
  {
    icon: (
      // Clipboard / Assessment Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1"/>
        <path d="M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>
        <path d="M9 12h6M9 16h6"/>
      </svg>
    ),
    title: "Step 1 - Assess",
    text: "We evaluate your driving experience to create a structured training plan aligned with ICBC road test standards and BC's Graduated Licensing Program.",
  },
  {
    icon: (
      // Steering Wheel / Skill Building Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 2v8M2 12h8M22 12h-8"/>
      </svg>
    ),
    title: "Step 2 - Build",
    text: "We develop core vehicle control, hazard perception, defensive driving techniques, and safe decision-making skills required for BC road safety compliance.",
  },
  {
    icon: (
      // Map / Navigation Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6"/>
        <line x1="8" y1="3" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="21"/>
      </svg>
    ),
    title: "Step 3 - Practice",
    text: "We provide guided training in real Victoria road conditions, including intersections, lane changes, parking, merging, and mock road tests based on ICBC evaluation criteria.",
  },
  {
    icon: (
      // Shield / Success Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: "Step 4 - Succeed",
    text: "We conduct final readiness assessments and targeted refinement sessions to ensure you meet ICBC performance standards with confidence and consistency.",
  },
].map((item) => (
              <div key={item.title} className="flex items-start gap-5 p-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F5C518] text-[#202121]">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-xl font-black text-[#202121] sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="responsive-section-label text-center font-black text-gray-300/80">Why Us</p>
            <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">Why Choose Us</h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
              Trusted by families across Vancouver & Surrounding Gulf Islands
            </p>
            <div className="mt-10">
              <WhyChooseCarousel items={advantages} />
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="services" className="bg-[#F2F2F2] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="responsive-section-label text-center font-black text-gray-300/80">Courses</p>
            <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">
              Driving Courses Designed for all levels
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
              Our programs follow ICBC standards to help new drivers learn safe decision-making, hazard perception, real-world driving skills, and, above all, road test confidence.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {programs.map((program) => (
                <article
                  key={program.title}
                  className="flex h-full flex-col rounded-3xl bg-gradient-to-b from-[#F2F2F2] from-30% via-[#e8edf5] via-70% to-[#d0ddef] p-6 shadow-[0_16px_34px_rgba(14,30,64,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(29,82,161,0.18)]"
                >
                  <h3 className="text-3xl font-black text-[#202121]">{program.title}</h3>
                  <p className="mt-3 min-h-[56px] text-base leading-relaxed text-slate-600">{program.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {program.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={program.cta}
                    className="mt-6 inline-flex w-fit rounded-full bg-[#E6242A] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                  >
                    Learn more
                  </Link>
                </article>
              ))}
            </div>

            <CustomPackagePromoCard
              action={
                <Link
                  to="/packages#custom-package-builder"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  Start building
                </Link>
              }
            />

            <div className="mt-10 flex justify-center">
              <Link
                to="/courses"
                className="inline-flex w-full max-w-[320px] items-center justify-center rounded-full bg-[#1d52a1] px-10 py-3.5 text-base font-bold leading-none text-[#ffffff] transition-colors hover:bg-[#001b42] sm:w-auto"
              >
                View all courses
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <SafetyStandardsSection />
      </AnimatedSection>

      <AnimatedSection>
        <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="responsive-section-label text-center font-black text-gray-300/80">Our process</p>
          <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">How we do it</h2>

          <div className="relative mt-16">
            {processSteps.map((step, index) => {
              const textOnRight = index % 2 === 0;
              const numberTone = index % 2 === 0 ? "text-[#1d52a1]/30" : "text-[#E6242A]/20";
              const isLast = index === processSteps.length - 1;
              const isVisible = visibleProcessRows[index];

              return (
                <div
                  key={step.step}
                  ref={(node) => {
                    processRowRefs.current[index] = node;
                  }}
                  data-index={index}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(24px)",
                    filter: isVisible ? "blur(0px)" : "blur(6px)",
                    transition:
                      "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s cubic-bezier(0.22,1,0.36,1)",
                    willChange: "opacity, transform, filter",
                  }}
                >
                  {/* ===== Desktop: 3-col grid ===== */}
                  <div className="hidden lg:grid" style={{ gridTemplateColumns: "1fr auto 1fr", gap: "3rem", alignItems: "center", padding: "1.5rem 0" }}>
                    {/* Col 1 */}
                    <div>
                      {!textOnRight && (
                        <div className="relative pt-12 text-right">
                          <span className={`pointer-events-none absolute top-0 right-0 text-7xl font-black leading-none select-none ${numberTone}`}>
                            {step.step}
                          </span>
                          <h3 className="relative text-3xl font-black leading-tight text-slate-800">{step.title}</h3>
                          <p className="mt-3 text-base font-bold leading-snug text-slate-700">{step.lead}</p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-500">{renderProcessDetail(step)}</p>
                        </div>
                      )}
                    </div>

                    {/* Col 2 - image */}
                    <div style={{ width: "280px", height: "280px" }} className="flex-shrink-0">
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Col 3 */}
                    <div>
                      {textOnRight && (
                        <div className="relative pt-12 text-left">
                          <span className={`pointer-events-none absolute top-0 left-0 text-7xl font-black leading-none select-none ${numberTone}`}>
                            {step.step}
                          </span>
                          <h3 className="relative text-3xl font-black leading-tight text-slate-800">{step.title}</h3>
                          <p className="mt-3 text-base font-bold leading-snug text-slate-700">{step.lead}</p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-500">{renderProcessDetail(step)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ===== Mobile: stacked ===== */}
                  <div className="flex flex-col items-center gap-4 py-6 lg:hidden">
                    <div className="h-56 w-56 sm:h-64 sm:w-64">
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="relative w-full max-w-md pt-12 text-left">
                      <span className={`pointer-events-none absolute top-0 left-0 text-7xl font-black leading-none select-none ${numberTone}`}>
                        {step.step}
                      </span>
                      <h3 className="relative text-2xl font-black leading-tight text-slate-800">{step.title}</h3>
                      <p className="mt-3 text-base font-bold leading-snug text-slate-700">{step.lead}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">{renderProcessDetail(step)}</p>
                    </div>
                  </div>

                  {/* Connector */}
                  {!isLast && (
                    <div className="hidden md:flex justify-center">
                      <div style={{ height: "64px", width: "3px" }} className="bg-slate-300/60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </section>
      </AnimatedSection>

      {/* Knowledge Centre */}
      <AnimatedSection>
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="responsive-section-label text-center font-black text-gray-300/80">Knowledge Centre</p>
            <h2 className="text-center text-[clamp(1.75rem,5vw,2.75rem)] font-black text-[#1d52a1]">
              Educational Resources for New Drivers
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={post.heroImage.replace("w=1400", "w=600")}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1d52a1] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-slate-600">{post.description}</p>
                    <div className="mt-6">
                      <span className="inline-block rounded-full bg-[#1d52a1] px-6 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#174291]">
                        Read more
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <InstallmentCtaSection />
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="responsive-section-label text-center font-black text-gray-300/80">Local</p>
          <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">Service Area</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Trusted by families across Vancouver & Surrounding Gulf Islands
          </p>
        </div>

          <div className="mt-10 w-full">
              <iframe
                title="Driving school service area map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2646.263636375451!2d-123.52076622307371!3d48.451470971279875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548f0d12a28feb31%3A0x7844eb9adc8db1de!2s2770%20Leigh%20Rd%20%23124%2C%20Victoria%2C%20BC%20V9B%204G2%2C%20Canada!5e0!3m2!1sen!2s!4v1772209932126!5m2!1sen!2s"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[clamp(22rem,60vw,34rem)] w-full border-0"
              />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <SiteCtaSection
          eyebrow="Ready to begin?"
          title={
            <>
              Start your first <span className="text-[#F5B13A]">driving lesson</span>
            </>
          }
          description="Book a package that fits your stage and get clear, calm instruction designed to build confidence on the road."
          actions={
            <Link to="/contact" className={siteCtaPrimaryClassName}>
              Contact us
            </Link>
          }
        />
      </AnimatedSection>

      <SiteFooter />
    </main>
  );
};

export default Index;





