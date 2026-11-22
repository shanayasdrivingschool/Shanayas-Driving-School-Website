import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { landingGalleryPhotos, landingGalleryVideo } from "@/data/landingGallery";

const arrowClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[#1d52a1] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300";
const itemCount = landingGalleryPhotos.length + 1;
const videoIndex = landingGalleryPhotos.length;
const slideClass = "min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3";
const frameClass = "relative h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white xl:h-[360px]";

export default function LandingMediaGallery() {
  const [viewportRef, api] = useEmblaCarousel({
    align: "start", loop: false, inViewThreshold: 0.5,
    // Native video controls retain their own pointer and seek interactions.
    watchDrag: (_api, event) => !(event.target instanceof Element && event.target.closest("video")),
  });
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(itemCount);
  const [videoVisible, setVideoVisible] = useState(false);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      const index = api.selectedScrollSnap();
      setSelected(index);
      setSnapCount(api.scrollSnapList().length);
      const isVideoVisible = api.slidesInView().includes(videoIndex);
      setVideoVisible(isVideoVisible);
      setCanPrevious(api.canScrollPrev());
      setCanNext(api.canScrollNext());
      if (!isVideoVisible && videoRef.current && !videoRef.current.paused) videoRef.current.pause();
    };
    sync();
    api.on("select", sync).on("reInit", sync).on("slidesInView", sync);
    return () => { api.off("select", sync).off("reInit", sync).off("slidesInView", sync); };
  }, [api]);

  useEffect(() => {
    const pause = () => { if (videoRef.current && !videoRef.current.paused) videoRef.current.pause(); };
    const onVisibility = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    if (galleryRef.current) observer.observe(galleryRef.current);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const scrollTo = (index: number) => api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoStarted(true);
    setVideoError(false);
    // Assign the source only in this user gesture: no MP4 download on page load
    // or merely swiping to the video. Keep play() within the gesture for mobile.
    if (!video.getAttribute("src")) video.src = landingGalleryVideo.src;
    void video.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setVideoError(true);
    });
  };

  return (
    <section ref={galleryRef} id="photos-video-gallery" aria-labelledby="media-gallery-heading" className="bg-[#F7F8FA] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="media-gallery-heading" className="text-3xl font-black tracking-tight text-[#0B1A33] sm:text-4xl">Photos &amp; Video</h2>
        <div role="region" aria-roledescription="carousel" aria-label="School photos and video" className="mt-5" onKeyDown={(event) => {
          if (event.target instanceof Element && event.target.closest("video")) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); scrollTo(selected + (event.key === "ArrowLeft" ? -1 : 1));
          }
        }}>
          {snapCount > 1 && <div className="mb-4 flex items-center justify-between gap-3">
            <p id="media-gallery-hint" className="text-sm text-slate-600">Swipe through photos and video</p>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous gallery item" aria-controls="school-gallery-items" disabled={!canPrevious} onClick={() => scrollTo(selected - 1)} className={arrowClass}><ArrowLeft className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" aria-label="Next gallery item" aria-controls="school-gallery-items" disabled={!canNext} onClick={() => scrollTo(selected + 1)} className={arrowClass}><ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </div>}
          <div ref={viewportRef} id="school-gallery-items" tabIndex={snapCount > 1 ? 0 : undefined} aria-describedby={snapCount > 1 ? "media-gallery-hint" : undefined} className="overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            <div className="-ml-4 flex touch-pan-y">
              {landingGalleryPhotos.map((photo, index) => (
                <div key={photo.id} role="group" aria-roledescription="slide" aria-label={`Photo ${index + 1} of ${itemCount} gallery items`} className={slideClass}>
                  <div className={frameClass}>
                  <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1280px) 395px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw" alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain" />
                  </div>
                </div>
              ))}
              <div role="group" aria-roledescription="slide" aria-label={`Video, item ${itemCount} of ${itemCount}`} className={slideClass}>
                <div className={frameClass}>
                <video ref={videoRef} aria-label="Video of a group beside Shanaya’s school car" width={landingGalleryVideo.width} height={landingGalleryVideo.height} poster={videoStarted ? landingGalleryVideo.poster : undefined} preload="none" playsInline controls={videoStarted} tabIndex={videoVisible && videoStarted ? 0 : -1} className={`h-full w-full bg-slate-950 object-contain ${videoStarted ? "block" : "hidden"}`} onError={() => setVideoError(true)} />
                {!videoStarted && <button type="button" aria-label="Play gallery video" tabIndex={videoVisible ? 0 : -1} onClick={playVideo} className="group relative flex h-full w-full items-center justify-center bg-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-300">
                  <img src={landingGalleryVideo.poster} alt={landingGalleryVideo.description} width={landingGalleryVideo.width} height={landingGalleryVideo.height} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-contain" />
                  <span className="relative flex items-center gap-3 rounded-full bg-[#0B1A33]/95 px-6 py-4 font-bold text-white group-hover:bg-[#1d52a1]"><Play className="h-6 w-6 fill-current" aria-hidden="true" />Play video<span className="text-sm font-normal text-white/80">{landingGalleryVideo.durationLabel}</span></span>
                </button>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p role="status" aria-live="polite" aria-atomic="true" className="text-sm tabular-nums text-slate-600">{snapCount > 1 ? `View ${selected + 1} of ${snapCount}` : "2 photos · 1 video"}</p>
            {snapCount > 1 && <div className="flex" aria-label="Choose a gallery view">
              {Array.from({ length: snapCount }, (_, index) => <button key={index} type="button" aria-label={`Show gallery view ${index + 1}`} aria-current={selected === index ? "true" : undefined} aria-controls="school-gallery-items" onClick={() => scrollTo(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"><span className={`h-2 rounded-full ${selected === index ? "w-5 bg-[#1d52a1]" : "w-2 bg-slate-300"}`} /></button>)}
            </div>}
          </div>
          {videoError && <p role="alert" className="mt-2 text-sm text-slate-700">The video could not start. <button type="button" onClick={playVideo} className="inline-flex min-h-11 items-center font-bold text-[#1d52a1] underline">Try again</button> or <a href={landingGalleryVideo.src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold text-[#1d52a1] underline">open the video</a>.</p>}
        </div>
      </div>
    </section>
  );
}
