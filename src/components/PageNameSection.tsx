import { ReactNode, useState } from "react";
import SiteHeader from "@/components/SiteHeader";

type PageNameSectionProps = {
  title: ReactNode;
  eyebrow: string;
  description: string;
  backgroundImage: string;
  backgroundImagePosition?: string;
  showOverlay?: boolean;
  overlayGradient?: string;
  waveColor?: string;
  minHeightClassName?: string;
  contentLayout?: "center" | "left";
  contentClassName?: string;
  titleClassName?: string;
};

const PageNameSection = ({
  title,
  eyebrow,
  description,
  backgroundImage,
  backgroundImagePosition = "center",
  showOverlay = true,
  overlayGradient = "linear-gradient(180deg,rgba(0,0,0,0.50) 0%,rgba(0,0,0,0.50) 100%)",
  waveColor = "#1d52a1",
  minHeightClassName = "min-h-[440px] sm:min-h-[520px] md:min-h-[600px]",
  contentLayout = "center",
  contentClassName = "",
  titleClassName = "text-[#1d52a1]",
}: PageNameSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
  <section
    className={`relative isolate w-full overflow-hidden text-white ${minHeightClassName}`}
  >
    <div className="absolute inset-0 z-0">
      {/* Shimmer placeholder while image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-[length:200%_100%]" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      )}
      <img
        src={backgroundImage}
        alt=""
        loading="eager"
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ objectPosition: backgroundImagePosition }}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
    {showOverlay ? <div className="absolute inset-0 z-10" style={{ background: overlayGradient }} /> : null}

    <div
      className="relative z-30 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <SiteHeader tone="light" />

      <div
        className={`flex min-h-[300px] items-end pb-20 pt-4 sm:items-center sm:pb-24 sm:pt-8 md:min-h-[420px] md:pb-32 ${
          contentLayout === "left" ? "justify-start text-left" : "justify-center text-center"
        } ${contentClassName}`}
      >
        <div className={contentLayout === "left" ? "max-w-[min(100%,48rem)]" : "max-w-[min(100%,54rem)]"}>
          {eyebrow ? <p className="text-[clamp(0.9rem,2.8vw,1.3rem)] font-semibold text-slate-100">{eyebrow}</p> : null}
          <h1
            className={`mt-3 text-[clamp(2rem,8vw,4rem)] font-black leading-[0.98] ${titleClassName}`}
            style={{ textWrap: "balance" }}
          >
            {title}
          </h1>
          <p
            className={`mt-4 max-w-4xl text-[clamp(1rem,4vw,1.6rem)] leading-[1.4] text-slate-100 ${
              contentLayout === "left" ? "" : "mx-auto"
            }`}
            style={{ textWrap: "pretty" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[64px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden className="h-full w-full">
        <path
          fill={waveColor}
          d="M0,40 A2400,2400 0 0,0 1440,40 L1440,200 L0,200 Z"
        />
        <path
          fill="#ffffff"
          d="M0,80 A2400,2400 0 0,0 1440,80 L1440,200 L0,200 Z"
        />
      </svg>
    </div>
  </section>
  );
};

export default PageNameSection;
