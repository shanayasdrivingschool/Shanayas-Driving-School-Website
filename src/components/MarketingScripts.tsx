import { useEffect } from "react";

type GtagCommand = (...args: unknown[]) => void;
type FacebookPixelCommand = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  queue?: unknown[][];
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
    fbq?: FacebookPixelCommand;
    _fbq?: FacebookPixelCommand;
  }
}

const gaMeasurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const metaPixelId = (import.meta.env.VITE_META_PIXEL_ID ?? "").trim();

const appendScript = (id: string, src: string) => {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const installGoogleAnalytics = () => {
  if (!gaMeasurementId) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId);

  appendScript(
    "google-analytics-gtag",
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`,
  );
};

const installMetaPixel = () => {
  if (!metaPixelId || window.fbq) {
    return;
  }

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  }) as FacebookPixelCommand;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";

  window.fbq = fbq;
  window._fbq = fbq;
  window.fbq("init", metaPixelId);
  window.fbq("track", "PageView");

  appendScript("meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
};

const MarketingScripts = () => {
  useEffect(() => {
    installGoogleAnalytics();
    installMetaPixel();
  }, []);

  return null;
};

export default MarketingScripts;
