import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const Forbidden = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("403 Error: Access forbidden for route:", location.pathname);
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
              <p className="text-[clamp(0.9rem,2.8vw,1.3rem)] font-semibold text-slate-100">Access denied</p>
              <p className="mt-2 text-[clamp(4.5rem,18vw,8.5rem)] font-black leading-[0.88] text-white">
                4<span className="text-[#F5B13A]">0</span>3
              </p>
              <h1
                className="mt-4 text-[clamp(2rem,8vw,4rem)] font-black leading-[0.98] text-white"
                style={{ textWrap: "balance" }}
              >
                You don't have permission
              </h1>
              <p
                className="mx-auto mt-4 max-w-3xl text-[clamp(1rem,4vw,1.4rem)] leading-[1.4] text-slate-100"
                style={{ textWrap: "pretty" }}
              >
                Your account doesn't have access to this page. If you think this is a mistake, contact the school and
                we'll sort it out.
              </p>

              <div className="responsive-cta-row mt-8 justify-center">
                <Link
                  to="/"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-slate-100"
                >
                  Back to homepage
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1d52a1]"
                >
                  Contact us
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

      <SiteFooter />
    </main>
  );
};

export default Forbidden;
