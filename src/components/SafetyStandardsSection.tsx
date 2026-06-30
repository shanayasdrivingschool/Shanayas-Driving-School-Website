import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { CheckCircle2 } from "lucide-react";

const safetyPoints = [
  "Licensed Instructors",
  "ICBC-Aligned Training Standards",
  "Dual Control Vehicles",
  "Insured and Licensed",
  "Skill Assessment",
  "Structured Lesson Plans",
  "Safety-First Approach",
  "Regular Progress Tracking",
  "Commitment to Safer Communities",
];

const SafetyCarousel = ({ items }: { items: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const scrollPos = useRef(0);
  const isPaused = useRef(false);
  const isInViewRef = useRef(true);
  const isDocumentVisibleRef = useRef(
    typeof document === "undefined" ? true : document.visibilityState === "visible",
  );
  const dragState = useRef({ isDragging: false, startX: 0, startScroll: 0 });
  const speed = 0.6;
  const looped = [...items, ...items, ...items, ...items];

  const tick = useCallback(() => {
    const el = trackRef.current;
    if (!el || !isInViewRef.current || !isDocumentVisibleRef.current) {
      rafRef.current = 0;
      return;
    }

    if (!isPaused.current && !dragState.current.isDragging) {
      scrollPos.current += speed;
      const halfScroll = el.scrollWidth / 2;
      if (scrollPos.current >= halfScroll) {
        scrollPos.current -= halfScroll;
      }
      el.style.transform = `translateX(-${scrollPos.current}px)`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startAnimation = useCallback(() => {
    if (rafRef.current !== 0) {
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current === 0) {
      return;
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          startAnimation();
          return;
        }

        stopAnimation();
      },
      { threshold: 0.1 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === "visible";

      if (isDocumentVisibleRef.current) {
        startAnimation();
        return;
      }

      stopAnimation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation, stopAnimation]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    isPaused.current = true;
    dragState.current = { isDragging: true, startX: e.clientX, startScroll: scrollPos.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging) return;

    const delta = dragState.current.startX - e.clientX;
    scrollPos.current = dragState.current.startScroll + delta;
    const el = trackRef.current;

    if (el) {
      const halfScroll = el.scrollWidth / 2;
      if (scrollPos.current < 0) scrollPos.current += halfScroll;
      if (scrollPos.current >= halfScroll) scrollPos.current -= halfScroll;
      el.style.transform = `translateX(-${scrollPos.current}px)`;
    }
  };

  const onPointerUp = () => {
    dragState.current.isDragging = false;
    isPaused.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative mt-10 cursor-grab select-none overflow-hidden active:cursor-grabbing"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        if (!dragState.current.isDragging) {
          isPaused.current = false;
          startAnimation();
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

      <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ transform: "translateX(0)" }}>
        {looped.map((point, index) => (
          <article
            key={`${point}-${index}`}
            className="flex-shrink-0 rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm"
          >
            <CheckCircle2 className="mx-auto h-6 w-6 text-[#1d52a1]" />
            <h3 className="mt-3 whitespace-nowrap text-xl font-black text-slate-900">{point}</h3>
          </article>
        ))}
      </div>
    </div>
  );
};

type SafetyStandardsSectionProps = {
  className?: string;
};

const SafetyStandardsSection = ({
  className = "bg-white py-16 sm:py-20",
}: SafetyStandardsSectionProps) => (
  <section className={className}>
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Safety</p>
      <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
        Standards & Certification
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
        Every lesson follows recognized standards, ensuring consistent, professional instruction and a supportive
        learning environment.
      </p>
      <SafetyCarousel items={safetyPoints} />
    </div>
  </section>
);

export default SafetyStandardsSection;
