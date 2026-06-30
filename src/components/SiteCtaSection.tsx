import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const siteCtaPrimaryClassName =
  "inline-flex w-full items-center justify-center rounded-full bg-[#F5B13A] px-6 py-3 text-sm font-bold text-[#202121] transition-colors hover:bg-[#df9f2f] sm:w-auto sm:px-8";

export const siteCtaSecondaryClassName =
  "inline-flex w-full items-center justify-center rounded-full border-2 border-[#274556] bg-white/70 px-6 py-3 text-sm font-bold text-[#274556] transition-colors hover:bg-[#274556] hover:text-white sm:w-auto sm:px-8";

type SiteCtaSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  supportingCopy?: ReactNode;
  sectionClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  blobClassName?: string;
};

const SiteCtaSection = ({
  eyebrow,
  title,
  description,
  actions,
  supportingCopy,
  sectionClassName,
  titleClassName,
  descriptionClassName,
  imageSrc = "/logos/cta-mascot.png",
  imageAlt = "Shanaya driving school mascot",
  imageClassName,
  blobClassName,
}: SiteCtaSectionProps) => (
  <section className={cn("relative overflow-hidden py-14 sm:py-20", sectionClassName)}>
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className={cn(
          "absolute left-0 top-8 h-[clamp(12rem,36vw,27rem)] w-[clamp(12rem,36vw,27rem)] translate-y-0 rounded-[58%_42%_52%_48%/44%_56%_40%_60%] bg-[#e4e8eb] sm:left-12 sm:top-1/2 sm:-translate-y-1/2 lg:left-20",
          blobClassName,
        )}
      />
    </div>

    <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
      <div className="relative z-10 max-w-2xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1d52a1]">{eyebrow}</p>
        ) : null}
        <h2
          className={cn("text-[clamp(2rem,6vw,3.6rem)] font-black leading-[1.02] text-[#274556]", titleClassName)}
          style={{ textWrap: "balance" }}
        >
          {title}
        </h2>
        <div
          className={cn("mt-5 max-w-2xl text-base text-slate-600 sm:text-lg", descriptionClassName)}
          style={{ textWrap: "pretty" }}
        >
          {description}
        </div>
        <div className="mt-8 responsive-cta-row">{actions}</div>
        {supportingCopy ? <div className="mt-4 max-w-2xl text-sm font-medium text-slate-500">{supportingCopy}</div> : null}
      </div>

      <div className="relative z-10">
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={cn("mx-auto h-[clamp(220px,55vw,420px)] w-full object-contain", imageClassName)}
        />
      </div>
    </div>
  </section>
);

export default SiteCtaSection;
