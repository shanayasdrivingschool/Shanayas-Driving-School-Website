import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { reviewImages } from "@/data/reviewImages";
import { featuredGoogleReviews } from "@/data/googleReviews";
import { googleReviewsUrl } from "@/data/beginnerCourseLanding";

const textLink = "inline-flex min-h-[44px] items-center gap-2 font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";
const arrowButton = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#1d52a1] text-[#1d52a1] transition hover:bg-[#EAF0F8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300";

export default function PaidLandingReviews({ reviews = featuredGoogleReviews, prioritised = false }: { reviews?: typeof featuredGoogleReviews; prioritised?: boolean }) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", slidesToScroll: "auto", loop: false });
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSelected(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
      setCanPrevious(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => { api.off("select", sync).off("reInit", sync); };
  }, [api]);

  const scrollTo = (index: number) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    api?.scrollTo(index, reduceMotion);
  };

  return (
    <section aria-labelledby="reviews-heading" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 id="reviews-heading" className="text-3xl font-black tracking-tight text-[#0B1A33] sm:text-4xl">5-Star Rated by Learners</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{prioritised ? "Selected five-star Google review excerpts." : "Selected five-star Google review excerpts, newest first."} These are individual experiences; results vary.</p>
          </div>
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} shrink-0 text-sm`}>See all Google reviews <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <div role="region" aria-roledescription="carousel" aria-label="Learner reviews" className="mt-6" onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollTo(selected + (event.key === "ArrowLeft" ? -1 : 1));
          }
        }}>
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <p id="review-navigation-hint" className="text-sm text-slate-500">Swipe or use the arrows</p>
            <div className="flex items-center gap-3">
              <span role="status" aria-live="polite" aria-atomic="true" className="min-w-10 text-center text-sm tabular-nums text-slate-600">
                <span className="sr-only">Review group </span>{selected + 1}<span aria-hidden="true"> / </span><span className="sr-only"> of </span>{snapCount || 1}
              </span>
              <button type="button" aria-label="Previous reviews" aria-controls="learner-review-slides" disabled={!canPrevious} onClick={() => scrollTo(selected - 1)} className={arrowButton}><ArrowLeft className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" aria-label="Next reviews" aria-controls="learner-review-slides" disabled={!canNext} onClick={() => scrollTo(selected + 1)} className={`${arrowButton} enabled:bg-[#1d52a1] enabled:text-white enabled:hover:bg-[#16417f]`}><ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </div>
          <div ref={viewportRef} id="learner-review-slides" tabIndex={0} aria-describedby="review-navigation-hint" className="overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            <div className="-ml-6 flex touch-pan-y">
              {reviews.map((review, index) => {
                const photo = reviewImages[review.id];
                const initials = review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
                return (
                  <div key={review.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${reviews.length}`} className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3">
                    <figure className="flex h-full flex-col border-l border-slate-200 px-5 py-1 sm:px-6">
                      <div className="flex items-center gap-1 text-[#A66B00]" role="img" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }, (_, star) => <Star key={star} className="h-5 w-5 fill-current" aria-hidden="true" />)}
                      </div>
                      <blockquote className="mb-6 mt-4 flex-1 text-lg font-medium leading-relaxed text-[#0B1A33]">“{review.quote}”</blockquote>
                      <figcaption>
                        <div className="flex items-center gap-3">
                          <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#EAF0F8] text-sm font-bold text-[#1d52a1]" aria-hidden="true">
                            {initials}
                            {photo && <img src={photo.src} srcSet={photo.srcSet} sizes="44px" alt="" width={44} height={44} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-950">{review.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">Google review · {new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric", timeZone: "America/Vancouver" }).format(new Date(review.publishedAtDate))}</p>
                          </div>
                        </div>
                        <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-2 text-sm`} aria-label={`Read ${review.name}’s full Google review`}>Read their review <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center" aria-label="Choose a review group">
            {Array.from({ length: snapCount }, (_, index) => (
              <button key={index} type="button" aria-label={`Go to review group ${index + 1}`} aria-current={selected === index ? "true" : undefined} aria-controls="learner-review-slides" onClick={() => scrollTo(index)} className="group flex h-11 w-6 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                <span className={`h-2 rounded-full transition-all motion-reduce:transition-none ${selected === index ? "w-5 bg-[#1d52a1]" : "w-2 bg-slate-300 group-hover:bg-[#1d52a1]"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
