import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { vehiclePhotos } from "@/data/vehiclePhotos";
import { type GoogleReview } from "@/data/googleReviews";
import { type PaidLandingVariant } from "@/data/paidLandingVariants";

export function LandingHeroProof({ review }: { review: GoogleReview }) {
  const photo = vehiclePhotos[0];
  return <aside aria-label="A learner’s experience" className="hidden min-w-0 overflow-hidden rounded-2xl lg:block border border-white/20 bg-white text-[#0B1A33]">
    <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 440px, 1px" width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" className="hidden aspect-video w-full object-cover lg:block" />
    <figure className="p-5 sm:p-7">
      <div className="flex gap-1 text-[#A66B00]" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />)}</div>
      <blockquote className="mt-3 text-lg font-medium leading-relaxed lg:text-xl">“{review.quote}”</blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
        <span className="font-bold">{review.name}</span>
        <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Read Google review</a>
      </figcaption>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">One learner’s experience. Individual results vary.</p>
    </figure>
  </aside>;
}

export function VariantLessonChoices({ variant, onChoose }: { variant: PaidLandingVariant; onChoose: (title: string, trigger: HTMLElement) => void }) {
  return <section aria-labelledby="pricing-heading" className="bg-[#F7F8FA] py-12 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 id="pricing-heading" className="max-w-3xl text-2xl font-black tracking-tight text-[#0B1A33] sm:text-3xl">{variant.choicesHeading}</h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{variant.intro}</p>
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {variant.choices.map((choice) => <article key={choice.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-[#0B1A33]">{choice.title}</h3>
          {choice.price && <div className="mt-4"><p className="text-2xl font-black text-[#0B1A33]">{choice.price}</p>{choice.duration && <p className="mt-1 text-xs text-slate-500">{choice.duration}</p>}</div>}
          <p className="mb-6 mt-4 text-sm leading-relaxed text-slate-600">{choice.body}</p>
          <button type="button" aria-label={`Request a callback about ${choice.title}`} onClick={(event) => onChoose(choice.title, event.currentTarget)} className="mt-auto inline-flex min-h-12 items-center justify-between gap-2 border-t border-slate-200 pt-3 text-left text-sm font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">Discuss this option <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></button>
        </article>)}
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600">Confirm availability, lesson length, practice-driving time and the price for your location before booking. <Link to="/policies/student-service-and-road-test-policy" className="inline-flex min-h-11 items-center font-semibold text-[#1d52a1] underline underline-offset-4">Lesson and booking terms</Link></p>
      <Link to="/pricing" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1d52a1] underline underline-offset-4">Compare all lesson prices <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </div>
  </section>;
}
