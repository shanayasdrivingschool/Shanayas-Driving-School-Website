import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpenCheck, Car, Layers, PhoneCall } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";

const popularDestinations = [
  {
    title: "Driving courses",
    description:
      "Beginner lessons, ICBC road test prep, defensive driving, and more — find the course that fits your stage.",
    href: "/courses",
    linkLabel: "View courses",
    icon: Car,
  },
  {
    title: "Lesson packages",
    description:
      "Structured multi-lesson packages that bundle training and savings for new and returning drivers.",
    href: "/packages",
    linkLabel: "Compare packages",
    icon: Layers,
  },
  {
    title: "Knowledge test practice",
    description:
      "Practice ICBC-style learner licence questions before you sit the real knowledge test.",
    href: "/knowledge-test-practice",
    linkLabel: "Start practicing",
    icon: BookOpenCheck,
  },
  {
    title: "Contact the school",
    description:
      "Questions about booking, scheduling, or which lesson to pick? We're happy to help.",
    href: "/contact",
    linkLabel: "Get in touch",
    icon: PhoneCall,
  },
] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="bg-white text-[#202121]">
      <section className="relative isolate w-full overflow-hidden bg-[#0f172a] text-white">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-24 top-1/3 h-[clamp(14rem,34vw,26rem)] w-[clamp(14rem,34vw,26rem)] rounded-[58%_42%_52%_48%/44%_56%_40%_60%] bg-[#1d52a1]/40 blur-3xl" />
          <div className="absolute -right-20 bottom-16 h-[clamp(10rem,26vw,20rem)] w-[clamp(10rem,26vw,20rem)] rounded-[52%_48%_58%_42%/56%_44%_60%_40%] bg-white/5 blur-2xl" />
        </div>

        <div
          className="relative z-30 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <SiteHeader tone="light" />

          <div className="flex items-end justify-center pb-24 pt-6 text-center sm:items-center sm:pb-28 sm:pt-10 md:pb-36">
            <div className="max-w-[min(100%,54rem)]">
              <p className="text-[clamp(0.9rem,2.8vw,1.3rem)] font-semibold text-slate-100">
                Wrong turn ahead
              </p>
              <p className="mt-2 text-[clamp(4.5rem,18vw,8.5rem)] font-black leading-[0.88] text-white">
                4<span className="text-[#F5B13A]">0</span>4
              </p>
              <h1
                className="mt-4 text-[clamp(2rem,8vw,4rem)] font-black leading-[0.98] text-white"
                style={{ textWrap: "balance" }}
              >
                Looks like you took a wrong turn
              </h1>
              <p
                className="mx-auto mt-4 max-w-3xl text-[clamp(1rem,4vw,1.4rem)] leading-[1.4] text-slate-100"
                style={{ textWrap: "pretty" }}
              >
                The page you're looking for doesn't exist or may have moved. No stress — even good
                drivers miss an exit now and then. Let's get you back on route.
              </p>

              <div className="responsive-cta-row mt-8 justify-center">
                <Link
                  to="/"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-slate-100"
                >
                  Back to homepage
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1d52a1]"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[64px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden className="h-full w-full">
            <path fill="#1d52a1" d="M0,40 A2400,2400 0 0,0 1440,40 L1440,200 L0,200 Z" />
            <path fill="#ffffff" d="M0,80 A2400,2400 0 0,0 1440,80 L1440,200 L0,200 Z" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Lost?</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
          Popular destinations
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          These pages cover most of what students are looking for. Pick a route and keep moving.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {popularDestinations.map((destination) => {
            const Icon = destination.icon;

            return (
              <article
                key={destination.href}
                className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{destination.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{destination.description}</p>
                <Link
                  to={destination.href}
                  className="mt-auto inline-flex items-center pt-5 text-sm font-bold text-[#E6242A] transition-colors hover:text-[#C41E23]"
                >
                  {destination.linkLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <SiteCtaSection
        eyebrow="Need a hand?"
        title={
          <>
            Not sure <span className="text-[#F5B13A]">where to start?</span>
          </>
        }
        description="Tell us your goal — first licence, road test prep, or confidence behind the wheel — and we'll point you to the right lesson or package."
        actions={
          <>
            <Link to="/apply" className={siteCtaPrimaryClassName}>
              Book your driving lesson
            </Link>
            <Link to="/contact" className={siteCtaSecondaryClassName}>
              Contact us
            </Link>
          </>
        }
        sectionClassName="bg-white"
      />

      <SiteFooter />
    </main>
  );
};

export default NotFound;
