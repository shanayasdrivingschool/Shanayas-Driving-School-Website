import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { vehiclePhotos } from "@/data/vehiclePhotos";

const arrowClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[#1d52a1] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300";

export default function VehicleGallery() {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", loop: false });
  const [selected, setSelected] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSelected(api.selectedScrollSnap());
      setCanPrevious(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => { api.off("select", sync).off("reInit", sync); };
  }, [api]);

  const scrollTo = (index: number) => api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <div id="training-car-gallery" role="region" aria-roledescription="carousel" aria-label="Our training car" className="min-w-0 w-full" onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        scrollTo(selected + (event.key === "ArrowLeft" ? -1 : 1));
      }
    }}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#0B1A33]">Our training car</h3>
          <p id="car-gallery-hint" className="mt-1 text-sm text-slate-600">Swipe or use the arrows</p>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous car photo" aria-controls="training-car-photos" disabled={!canPrevious} onClick={() => scrollTo(selected - 1)} className={arrowClass}><ArrowLeft className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" aria-label="Next car photo" aria-controls="training-car-photos" disabled={!canNext} onClick={() => scrollTo(selected + 1)} className={arrowClass}><ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </div>
      <div ref={viewportRef} id="training-car-photos" tabIndex={0} aria-describedby="car-gallery-hint" className="overflow-hidden rounded-2xl bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
        <div className="flex touch-pan-y">
          {vehiclePhotos.map((photo, index) => (
            <div key={photo.id} role="group" aria-roledescription="slide" aria-label={`Car photo ${index + 1} of ${vehiclePhotos.length}`} className="min-w-0 shrink-0 grow-0 basis-full">
              <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 552px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" draggable={false} className="aspect-video w-full object-cover object-center" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm tabular-nums text-slate-600">Photo {selected + 1} of {vehiclePhotos.length}</p>
        <div className="flex" aria-label="Choose a car photo">
          {vehiclePhotos.map((photo, index) => (
            <button key={photo.id} type="button" aria-label={`Show car photo ${index + 1}`} aria-current={selected === index ? "true" : undefined} aria-controls="training-car-photos" onClick={() => scrollTo(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
              <span className={`h-2 rounded-full ${selected === index ? "w-5 bg-[#1d52a1]" : "w-2 bg-slate-300"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
