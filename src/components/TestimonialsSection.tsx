import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Review = {
  quote: string;
  name: string;
  business: string;
};

type TestimonialsSectionProps = {
  eyebrow?: string;
  title?: string;
  reviews?: Review[];
};

type MarqueeDirection = "left" | "right";

const BASE_SPEED = 0.42;
const SLOW_SPEED = 0.12;
const MOBILE_SLOWDOWN_MS = 2200;

const TestimonialCard = ({ review, className }: { review: Review; className?: string }) => (
  <article
    className={cn(
      "flex min-h-[170px] w-[clamp(15rem,78vw,21rem)] shrink-0 flex-col justify-between rounded-[20px] bg-white p-4 text-slate-800 sm:min-h-[190px] sm:w-[clamp(18rem,44vw,22rem)] sm:rounded-[28px] sm:p-6 lg:w-[clamp(19rem,31vw,28rem)]",
      className,
    )}
  >
    <div>
      <p className="text-[11px] text-[#1d52a1] sm:text-base">*****</p>
      <p className="mt-2 text-[11px] italic leading-5 text-slate-700 sm:mt-3 sm:text-base sm:leading-relaxed">
        {review.quote}
      </p>
    </div>
    <div className="mt-4 sm:mt-5">
      <p className="text-lg font-black leading-tight text-slate-900 sm:text-xl">{review.name}</p>
      <p className="text-[11px] text-slate-500 sm:text-sm">{review.business}</p>
    </div>
  </article>
);

const TestimonialsMarqueeRow = ({
  reviews,
  direction,
  reducedMotion,
}: {
  reviews: Review[];
  direction: MarqueeDirection;
  reducedMotion: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const slowTimeoutRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const currentSpeedRef = useRef(direction === "left" ? BASE_SPEED : -BASE_SPEED);
  const targetSpeedRef = useRef(direction === "left" ? BASE_SPEED : -BASE_SPEED);
  const isInViewRef = useRef(true);
  const isDocumentVisibleRef = useRef(typeof document === "undefined" ? true : document.visibilityState === "visible");
  const repeatedReviews = useMemo(() => [...reviews, ...reviews], [reviews]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reducedMotion) {
      track.style.transform = "translateX(0)";
      return;
    }

    let isMounted = true;

    const step = () => {
      if (!isMounted || !trackRef.current) return;

      if (!isInViewRef.current || !isDocumentVisibleRef.current) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      const loopWidth = trackRef.current.scrollWidth / 2;
      if (!loopWidth) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.08;
      positionRef.current += currentSpeedRef.current;

      if (positionRef.current >= loopWidth) {
        positionRef.current -= loopWidth;
      }

      if (positionRef.current < 0) {
        positionRef.current += loopWidth;
      }

      trackRef.current.style.transform = `translateX(-${positionRef.current}px)`;
      frameRef.current = requestAnimationFrame(step);
    };

    const initialLoopWidth = track.scrollWidth / 2;
    positionRef.current = direction === "right" && initialLoopWidth ? initialLoopWidth : 0;
    track.style.transform = `translateX(-${positionRef.current}px)`;
    frameRef.current = requestAnimationFrame(step);

    return () => {
      isMounted = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (slowTimeoutRef.current) window.clearTimeout(slowTimeoutRef.current);
    };
  }, [direction, reducedMotion, repeatedReviews]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const setNormalSpeed = () => {
    targetSpeedRef.current = direction === "left" ? BASE_SPEED : -BASE_SPEED;
  };

  const setSlowSpeed = () => {
    targetSpeedRef.current = direction === "left" ? SLOW_SPEED : -SLOW_SPEED;
  };

  const triggerMobileSlowdown = () => {
    setSlowSpeed();
    if (slowTimeoutRef.current) window.clearTimeout(slowTimeoutRef.current);
    slowTimeoutRef.current = window.setTimeout(() => {
      setNormalSpeed();
      slowTimeoutRef.current = null;
    }, MOBILE_SLOWDOWN_MS);
  };

  if (reducedMotion) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 sm:gap-5 sm:px-8 lg:grid-cols-2 lg:px-10">
        {reviews.map((review) => (
          <TestimonialCard key={`${direction}-${review.name}`} review={review} className="w-full" />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden px-4 py-2 touch-pan-y sm:px-8 sm:py-3 lg:px-10"
      onMouseEnter={setSlowSpeed}
      onMouseLeave={setNormalSpeed}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          triggerMobileSlowdown();
        }
      }}
    >
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform sm:gap-5">
        {repeatedReviews.map((review, index) => (
          <TestimonialCard key={`${direction}-${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = ({
  eyebrow = "Testimonials",
  title = "What our students are saying",
  reviews = [],
}: TestimonialsSectionProps) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(reviews.length / 2);
  const topRowReviews = reviews.slice(0, midpoint);
  const bottomRowReviews = reviews.slice(midpoint);
  const secondRowSource = bottomRowReviews.length > 0 ? bottomRowReviews : topRowReviews;

  return (
    <section className="bg-[#1d52a1] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="responsive-section-label text-center font-black text-white/25">{eyebrow}</p>
        <h3 className="responsive-section-title text-center font-black">{title}</h3>
      </div>
      <div className="mt-10 space-y-3 sm:space-y-6 md:mt-12">
        <TestimonialsMarqueeRow reviews={topRowReviews} direction="left" reducedMotion={reducedMotion} />
        <TestimonialsMarqueeRow reviews={secondRowSource} direction="right" reducedMotion={reducedMotion} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
