import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ block: "start" });
        });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previousScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";

      return () => {
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }
  }, []);

  return null;
};

export default ScrollToTop;
