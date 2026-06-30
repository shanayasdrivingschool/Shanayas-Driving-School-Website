import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const GlobalSectionReveal = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const main = document.querySelector("main");
    if (!main) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>("section")).filter(
      (section) => !section.closest('[data-animated-section="true"]') && section.dataset.noGlobalReveal !== "true",
    );

    if (!sections.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => {
        section.dataset.globalReveal = "true";
        section.dataset.revealState = "visible";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          section.dataset.revealState = "visible";
          observer.unobserve(section);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -90px 0px",
      },
    );

    sections.forEach((section) => {
      section.dataset.globalReveal = "true";
      const isAlreadyVisible = section.getBoundingClientRect().top < window.innerHeight * 0.92;
      section.dataset.revealState = isAlreadyVisible ? "visible" : "hidden";
      if (!isAlreadyVisible) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
};

export default GlobalSectionReveal;
