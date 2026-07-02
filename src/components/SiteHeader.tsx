import { type FormEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Phone, Search, ShoppingCart, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart/CartProvider";
import { searchSite } from "@/data/siteSearch";

type SiteHeaderProps = {
  tone?: "light" | "dark" | "brand";
  className?: string;
};

const logoUrl = "/logos/Driving School Logo Vertical - white.png";

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
  activePrefixes?: string[];
};

type HeaderLayoutMode = "desktop" | "compact" | "compact-minimal";

const DESKTOP_HEADER_BREAKPOINT = 1100;

const navItems: NavItem[] = [
  { label: "Home", href: "/", activePrefixes: ["/"] },
  { label: "Packages", href: "/packages", activePrefixes: ["/packages"] },
  { label: "Courses", href: "/courses", activePrefixes: ["/courses", "/course-quiz"] },
  { label: "About", href: "/about", activePrefixes: ["/about"] },
  {
    label: "Resources",
    children: [
      { label: "Driver's Licence Guide", href: "/newcomers-guide", activePrefixes: ["/newcomers-guide"] },
      { label: "Knowledge Test Practice", href: "/knowledge-test-practice", activePrefixes: ["/knowledge-test-practice"] },
      { label: "Blog", href: "/blog", activePrefixes: ["/blog"] },
    ],
  },
  {
    label: "Careers",
    children: [
      { label: "Ruley Rewards Program", href: "/affiliate/signup", activePrefixes: ["/affiliate"] },
      { label: "Now hiring", href: "/careers", activePrefixes: ["/careers"] },
    ],
  },
  { label: "Contact", href: "/contact", activePrefixes: ["/contact"] },
];

/* Persist pill position across re-mounts so it can animate from previous location */
let _savedPill = { left: 0, width: 0, opacity: 0 };

const SiteHeader = ({ tone = "light", className = "" }: SiteHeaderProps) => {
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isInvertedTone = tone !== "dark";
  const usesPersistentSolidHeader = tone === "dark" || tone === "brand";
  const textClass = isInvertedTone ? "text-white" : "text-slate-900";
  const callNowLabelClass = isInvertedTone ? "text-white/70" : "text-slate-500";
  const callNowNumberClass = isInvertedTone ? "text-white" : "text-slate-900";
  const desktopActionShellBaseClass =
    isInvertedTone
      ? "items-center rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
      : "items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm";
  const desktopCartButtonBaseClass =
    isInvertedTone
      ? "relative h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur-sm transition-colors hover:bg-white/10"
      : "relative h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-50";
  const mobileActionButtonClass =
    "relative h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20";
  const compactBookingButtonClass =
    "shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#E6242A] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#C41E23] sm:px-6 sm:text-sm";
  const currentPath = location.pathname;
  const currentHash = location.hash;
  const cartCountLabel = itemCount > 99 ? "99+" : itemCount.toString();
  const shouldShowCartCount = itemCount > 0;
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchSite(searchQuery, 6);

  const getPathFromHref = (href: string) => href.split("#")[0];
  const getHashFromHref = (href: string) => {
    const hashIndex = href.indexOf("#");
    return hashIndex >= 0 ? href.slice(hashIndex) : "";
  };
  const isPathActive = (matchPrefixes: string[]) =>
    matchPrefixes.some((prefix) => {
      if (prefix === "/") {
        return currentPath === "/";
      }

      return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
    });
  const isLinkActive = (item: NavItem) => {
    if (!item.href) {
      return false;
    }

    const href = item.href;
    const hrefPath = getPathFromHref(href);
    const hrefHash = getHashFromHref(href);

    if (hrefHash) {
      return currentPath === hrefPath && currentHash === hrefHash;
    }

    return isPathActive(item.activePrefixes?.length ? item.activePrefixes : [hrefPath]);
  };
  const isItemActive = (item: NavItem): boolean => {
    if (item.href) {
      return isLinkActive(item);
    }

    return item.children?.some((child) => isItemActive(child)) ?? false;
  };
  const getNavItemKey = (item: NavItem, parentKey = "") => (parentKey ? `${parentKey}/${item.label}` : item.label);

  const navRef = useRef<HTMLElement>(null);
  const headerRowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const desktopNavMeasureRef = useRef<HTMLElement>(null);
  const desktopActionsMeasureRef = useRef<HTMLDivElement>(null);
  const compactActionsMeasureRef = useRef<HTMLDivElement>(null);
  const minimalActionsMeasureRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const lastScrollY = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);
  const [pill, setPill] = useState(_savedPill);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [useSolidHeader, setUseSolidHeader] = useState(usesPersistentSolidHeader);
  const hasInitRef = useRef(false);
  const [hoverDropdownLabel, setHoverDropdownLabel] = useState<string | null>(null);
  const [pinnedDropdownLabel, setPinnedDropdownLabel] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownState, setMobileDropdownState] = useState<Record<string, boolean>>({});
  const [headerLayoutMode, setHeaderLayoutMode] = useState<HeaderLayoutMode>("compact-minimal");
  const openDropdownLabel = pinnedDropdownLabel ?? hoverDropdownLabel;

  const activeIndex = navItems.findIndex((item) => isItemActive(item));
  const showDesktopNav = headerLayoutMode === "desktop";
  const showCompactBookingCta = !showDesktopNav && headerLayoutMode === "compact";

  const closeDesktopDropdowns = () => {
    setHoverDropdownLabel(null);
    setPinnedDropdownLabel(null);
  };

  const closeSearchPanel = () => {
    setIsSearchFocused(false);
  };

  const navigateToSearch = (rawQuery: string, closeMobileMenu = false) => {
    const nextQuery = rawQuery.trim();
    closeSearchPanel();

    if (closeMobileMenu) {
      setMobileMenuOpen(false);
      setMobileDropdownState({});
    }

    if (!nextQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  useEffect(() => {
    if (!showDesktopNav) {
      setPill((prev) => ({ ...prev, opacity: 0 }));
      _savedPill = { ..._savedPill, opacity: 0 };
      return;
    }

    const el = linkRefs.current[activeIndex];
    const nav = navRef.current;
    if (!el || !nav) {
      setPill((prev) => ({ ...prev, opacity: 0 }));
      _savedPill = { ..._savedPill, opacity: 0 };
      return;
    }

    const measure = () => {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const newPill = {
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      };

      if (!hasInitRef.current) {
        /* First render: skip transition, start at previous saved position then animate */
        hasInitRef.current = true;
        /* Force a layout read so the browser paints at the saved position first */
        requestAnimationFrame(() => {
          setPill(newPill);
          _savedPill = newPill;
        });
      } else {
        setPill(newPill);
        _savedPill = newPill;
      }
    };

    /* Small delay to let refs settle after mount */
    requestAnimationFrame(measure);
  }, [activeIndex, currentPath, showDesktopNav]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileDropdownState({});
    closeDesktopDropdowns();
  }, [currentPath]);

  useEffect(() => {
    if (currentPath === "/search") {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get("q")?.trim() ?? "");
      return;
    }

    setSearchQuery("");
    closeSearchPanel();
  }, [currentPath, location.search]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
    }
    setIsHeaderVisible(true);
    setUseSolidHeader(usesPersistentSolidHeader);
  }, [currentPath, usesPersistentSolidHeader]);

  useEffect(() => {
    closeDesktopDropdowns();
    closeSearchPanel();

    if (showDesktopNav) {
      setMobileMenuOpen(false);
      setMobileDropdownState({});
    }
  }, [showDesktopNav]);

  useEffect(() => {
    if (!openDropdownLabel && !isSearchFocused) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (navRef.current && !navRef.current.contains(target)) {
        closeDesktopDropdowns();
      }

      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        closeSearchPanel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      closeDesktopDropdowns();
      closeSearchPanel();
      searchInputRef.current?.blur();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchFocused, openDropdownLabel]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [mobileMenuOpen]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;

    const measureHeaderLayout = () => {
      const rowWidth = headerRowRef.current?.clientWidth ?? 0;
      const logoWidth = logoRef.current?.getBoundingClientRect().width ?? 0;
      const desktopNavWidth = desktopNavMeasureRef.current?.scrollWidth ?? 0;
      const desktopActionsWidth = desktopActionsMeasureRef.current?.scrollWidth ?? 0;
      const compactActionsWidth = compactActionsMeasureRef.current?.scrollWidth ?? 0;
      const minimalActionsWidth = minimalActionsMeasureRef.current?.scrollWidth ?? 0;

      if (!rowWidth || !logoWidth) return;

      const desktopRequiredWidth = logoWidth + desktopNavWidth + desktopActionsWidth + 40;
      const compactRequiredWidth = logoWidth + compactActionsWidth + 28;
      const minimalRequiredWidth = logoWidth + minimalActionsWidth + 16;

      let nextLayoutMode: HeaderLayoutMode = "compact-minimal";

      if (window.innerWidth >= DESKTOP_HEADER_BREAKPOINT && rowWidth >= desktopRequiredWidth) {
        nextLayoutMode = "desktop";
      } else if (rowWidth >= compactRequiredWidth) {
        nextLayoutMode = "compact";
      } else if (rowWidth >= minimalRequiredWidth) {
        nextLayoutMode = "compact-minimal";
      }

      setHeaderLayoutMode((previous) => (previous === nextLayoutMode ? previous : nextLayoutMode));
    };

    const scheduleMeasurement = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        measureHeaderLayout();
      });
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            scheduleMeasurement();
          });

    [
      headerRowRef.current,
      logoRef.current,
      desktopNavMeasureRef.current,
      desktopActionsMeasureRef.current,
      compactActionsMeasureRef.current,
      minimalActionsMeasureRef.current,
    ].forEach((element) => {
      if (element && resizeObserver) {
        resizeObserver.observe(element);
      }
    });

    window.addEventListener("resize", scheduleMeasurement);
    scheduleMeasurement();

    void document.fonts?.ready.then(() => {
      scheduleMeasurement();
    });

    return () => {
      window.removeEventListener("resize", scheduleMeasurement);
      resizeObserver?.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [cartCountLabel, tone]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY;
      const isNearTop = currentScrollY < 8;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      let nextIsHeaderVisible = true;
      let nextUseSolidHeader = usesPersistentSolidHeader;

      if (mobileMenuOpen) {
        nextIsHeaderVisible = true;
        nextUseSolidHeader = true;
      } else if (isNearTop) {
        nextIsHeaderVisible = true;
        nextUseSolidHeader = usesPersistentSolidHeader;
      } else if (isScrollingUp) {
        nextIsHeaderVisible = true;
        nextUseSolidHeader = true;
      } else {
        nextIsHeaderVisible = false;
        nextUseSolidHeader = usesPersistentSolidHeader;
      }

      setIsHeaderVisible((previous) => (previous === nextIsHeaderVisible ? previous : nextIsHeaderVisible));
      setUseSolidHeader((previous) => (previous === nextUseSolidHeader ? previous : nextUseSolidHeader));
      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        updateHeaderState();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeaderState();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [mobileMenuOpen, usesPersistentSolidHeader]);

  const renderMobileNavItems = (items: NavItem[], parentKey = "", depth = 0): ReactNode =>
    items.map((item) => {
      const itemKey = getNavItemKey(item, parentKey);
      const paddingStyle = { paddingLeft: `${12 + depth * 16}px` };

      if (item.children?.length) {
        const isMobileDropdownOpen = Boolean(mobileDropdownState[itemKey]);

        return (
          <div key={itemKey} className="space-y-1 py-1">
            <button
              type="button"
              onClick={() =>
                setMobileDropdownState((prev) => ({
                  ...prev,
                  [itemKey]: !prev[itemKey],
                }))
              }
              className="flex w-full items-center justify-between rounded-xl py-2.5 pr-3 text-left text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              style={paddingStyle}
              aria-expanded={isMobileDropdownOpen}
              aria-label={`Toggle ${item.label} menu`}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isMobileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-200 ${
                isMobileDropdownOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 space-y-1">{renderMobileNavItems(item.children, itemKey, depth + 1)}</div>
            </div>
          </div>
        );
      }

      const isActive = item.href ? isLinkActive(item) : false;
      const linkClass = `block rounded-xl py-2.5 pr-3 text-sm font-medium transition-colors ${
        isActive ? "bg-white text-[#1d52a1]" : "text-white/90 hover:bg-white/10"
      }`;

      return item.href!.includes("#") ? (
        <a
          key={itemKey}
          href={item.href}
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileDropdownState({});
          }}
          className={linkClass}
          style={paddingStyle}
        >
          {item.label}
        </a>
      ) : (
        <Link
          key={itemKey}
          to={item.href!}
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileDropdownState({});
          }}
          className={linkClass}
          style={paddingStyle}
        >
          {item.label}
        </Link>
      );
    });

  const renderDesktopDropdownItems = (items: NavItem[], parentKey: string): ReactNode =>
    items.map((item) => {
      const itemKey = getNavItemKey(item, parentKey);
      const isActive = isItemActive(item);
      const itemClassName = `block px-5 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#1d52a1]/10 text-[#1d52a1]"
          : "text-slate-700 hover:bg-slate-50 hover:text-[#1d52a1]"
      }`;

      if (item.children?.length) {
        return (
          <div key={itemKey} className="group/submenu relative">
            <button
              type="button"
              className={`${itemClassName} flex w-full items-center justify-between gap-3`}
            >
              <span>{item.label}</span>
              <ChevronDown className="-rotate-90 h-4 w-4 transition-transform duration-200 group-hover/submenu:translate-x-0.5" />
            </button>
            <div className="pointer-events-none absolute left-full top-0 z-10 pl-2 opacity-0 transition-all duration-200 ease-out group-hover/submenu:pointer-events-auto group-hover/submenu:translate-y-0 group-hover/submenu:opacity-100 group-focus-within/submenu:pointer-events-auto group-focus-within/submenu:opacity-100">
              <div className="min-w-[220px] rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                {renderDesktopDropdownItems(item.children, itemKey)}
              </div>
            </div>
          </div>
        );
      }

      return item.href!.includes("#") ? (
        <a
          key={itemKey}
          href={item.href}
          onClick={() => closeDesktopDropdowns()}
          className={itemClassName}
        >
          {item.label}
        </a>
      ) : (
        <Link
          key={itemKey}
          to={item.href!}
          onClick={() => closeDesktopDropdowns()}
          className={itemClassName}
        >
          {item.label}
        </Link>
      );
    });

  const mobileMenu = (
    <div
      className={`fixed inset-0 z-[200] transition-all duration-300 ${
        showDesktopNav ? "hidden" : ""
      } ${
        mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close mobile menu overlay"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-[86%] max-w-[320px] bg-[#0f172a] px-6 pb-8 pt-6 shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileDropdownState({});
            }}
            className="inline-block w-[96px]"
            aria-label="Go to home page"
          >
            <img src={logoUrl} alt="Shanaya's Driving School" decoding="async" className="w-full" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigateToSearch(searchQuery, true);
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search the site"
              className="w-full rounded-full border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/60 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Search the website"
            />
          </form>
          {searchQuery.trim() ? (
            <div className="mt-3 space-y-2">
              {searchResults.slice(0, 4).map((result) => (
                <Link
                  key={`${result.type}-${result.href}`}
                  to={result.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileDropdownState({});
                  }}
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{result.type}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{result.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{result.description}</p>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => navigateToSearch(searchQuery, true)}
                className="text-sm font-semibold text-[#F5C518] transition-colors hover:text-[#ffd74d]"
              >
                View all results
              </button>
            </div>
          ) : null}
        </div>

        <nav className="space-y-1">{renderMobileNavItems(navItems)}</nav>
        <div className="mt-6 border-t border-white/15 pt-5">
          <Link
            to="/apply"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileDropdownState({});
            }}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#E6242A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
          >
            Book your driving lesson
          </Link>
          <a
            href="tel:+12505423673"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileDropdownState({});
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            +1-250-542-3673
          </a>
          <Link
            to="/cart"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileDropdownState({});
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <ShoppingCart className="h-4 w-4" />
            View cart
            <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-[#E6242A] px-2 py-0.5 text-xs font-black text-white">
              {cartCountLabel}
            </span>
          </Link>
        </div>
      </aside>
    </div>
  );

  const headerBar = (
    <header
      className={`fixed inset-x-0 top-0 z-[110] transition-all duration-300 ${
        isHeaderVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      } ${
        useSolidHeader
          ? tone === "light"
            ? "bg-[#0f172a]/95 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md"
            : tone === "brand"
              ? "bg-[#1d52a1]/95 shadow-[0_8px_24px_rgba(29,82,161,0.28)] backdrop-blur-md"
            : "bg-white/95 border-b border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div ref={headerRowRef} className="flex items-center justify-between gap-3 py-4 md:py-5">
          <Link
            ref={logoRef}
            to="/"
            className="w-[120px] shrink-0 md:w-[140px] lg:w-[160px]"
            aria-label="Go to home page"
          >
            <img src={logoUrl} alt="Shanaya's Driving School" decoding="async" className="w-full" />
          </Link>

          <nav
            ref={navRef}
            className={`relative min-w-0 items-center gap-0.5 text-sm font-medium xl:gap-1.5 xl:text-base ${textClass} ${
              showDesktopNav ? "flex" : "hidden"
            }`}
          >
            {/* Animated pill background */}
            <span
              className="pointer-events-none absolute rounded-full bg-white transition-all duration-300 ease-in-out"
              style={{
                left: pill.left,
                width: pill.width,
                height: "36px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: pill.opacity,
              }}
            />

            {navItems.map((item, index) => {
              const isActive = isItemActive(item);
              const linkClass = isActive
                ? "relative z-10 rounded-full px-3.5 py-2 text-[#E6242A] transition-colors duration-300"
                : `relative z-10 rounded-full px-3.5 py-2 transition-colors duration-300 ${textClass}`;

              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (pinnedDropdownLabel) return;
                      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                      setHoverDropdownLabel(item.label);
                    }}
                    onMouseLeave={() => {
                      if (pinnedDropdownLabel) return;
                      dropdownTimeout.current = setTimeout(() => setHoverDropdownLabel(null), 150);
                    }}
                  >
                    <button
                      type="button"
                      ref={(el) => {
                        linkRefs.current[index] = el;
                      }}
                      className={`${linkClass} inline-flex items-center gap-1`}
                      onClick={() => {
                        closeSearchPanel();
                        setHoverDropdownLabel(null);
                        setPinnedDropdownLabel((previous) => (previous === item.label ? null : item.label));
                      }}
                      onFocus={() => {
                        if (!pinnedDropdownLabel) {
                          setHoverDropdownLabel(item.label);
                        }
                      }}
                      aria-expanded={openDropdownLabel === item.label}
                      aria-haspopup="menu"
                      aria-controls={`desktop-dropdown-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdownLabel === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`desktop-dropdown-${item.label}`}
                      className={`absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 origin-top pt-2 transition-all duration-200 ease-out ${
                        openDropdownLabel === item.label
                          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                          : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                      }`}
                    >
                      <div className="rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                        {renderDesktopDropdownItems(item.children, item.label)}
                      </div>
                    </div>
                  </div>
                );
              }

              return item.href!.includes("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  className={linkClass}
                  onClick={() => closeDesktopDropdowns()}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href!}
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  className={linkClass}
                  onClick={() => closeDesktopDropdowns()}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/apply"
              className={`${compactBookingButtonClass} ${showCompactBookingCta ? "inline-flex" : "hidden"}`}
            >
              Book your driving lesson
            </Link>
            <Link
              to="/cart"
              className={`${mobileActionButtonClass} ${showDesktopNav ? "hidden" : "inline-flex"}`}
              aria-label={`Open cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {shouldShowCartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-[#E6242A] px-1.5 py-0.5 text-[10px] font-black text-white">
                  {cartCountLabel}
                </span>
              ) : null}
            </Link>
            <Link
              to="/cart"
              className={`${desktopCartButtonBaseClass} ${showDesktopNav ? "inline-flex" : "hidden"}`}
              aria-label={`Open cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {shouldShowCartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-[#E6242A] px-1.5 py-0.5 text-[10px] font-black text-white">
                  {cartCountLabel}
                </span>
              ) : null}
            </Link>
            <div className={`${desktopActionShellBaseClass} ${showDesktopNav ? "flex" : "hidden"}`}>
              <Link
                to="/apply"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#E6242A] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#C41E23] xl:px-7 xl:text-sm"
              >
                Book your driving lesson
              </Link>
              <a
                href="tel:+12505423673"
                className="flex flex-col items-start px-4 pr-5"
                aria-label="Call now at 250-542-3673"
              >
                <span className={`text-[10px] font-bold uppercase leading-none tracking-[0.18em] ${callNowLabelClass}`}>
                  Call now
                </span>
                <span className={`whitespace-nowrap text-lg font-black leading-tight ${callNowNumberClass}`}>
                  250-542-3673
                </span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`${mobileActionButtonClass} ${showDesktopNav ? "hidden" : "inline-flex"}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-0">
          <nav
            ref={desktopNavMeasureRef}
            className={`absolute left-0 top-0 flex items-center gap-0.5 text-sm font-medium xl:gap-1.5 xl:text-base ${textClass}`}
          >
            {navItems.map((item) =>
              item.children ? (
                <span key={item.label} className="inline-flex items-center gap-1 rounded-full px-3.5 py-2">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </span>
              ) : (
                <span key={item.label} className="rounded-full px-3.5 py-2">
                  {item.label}
                </span>
              ),
            )}
          </nav>

          <div ref={desktopActionsMeasureRef} className="absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap">
            <span className={`${desktopCartButtonBaseClass} inline-flex`}>
              <ShoppingCart className="h-5 w-5" />
            </span>
            <div className={`${desktopActionShellBaseClass} flex`}>
              <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#E6242A] px-5 py-2.5 text-[13px] font-bold text-white xl:px-7 xl:text-sm">
                Book your driving lesson
              </span>
              <span className="flex flex-col items-start px-4 pr-5">
                <span className={`text-[10px] font-bold uppercase leading-none tracking-[0.18em] ${callNowLabelClass}`}>
                  Call now
                </span>
                <span className={`whitespace-nowrap text-lg font-black leading-tight ${callNowNumberClass}`}>
                  250-542-3673
                </span>
              </span>
            </div>
          </div>

          <div ref={compactActionsMeasureRef} className="absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap">
            <span className={`${compactBookingButtonClass} inline-flex`}>Book your driving lesson</span>
            <span className={`${mobileActionButtonClass} inline-flex`}>
              <ShoppingCart className="h-5 w-5" />
              {shouldShowCartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-[#E6242A] px-1.5 py-0.5 text-[10px] font-black text-white">
                  {cartCountLabel}
                </span>
              ) : null}
            </span>
            <span className={`${mobileActionButtonClass} inline-flex`}>
              <Menu className="h-5 w-5" />
            </span>
          </div>

          <div ref={minimalActionsMeasureRef} className="absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap">
            <span className={`${mobileActionButtonClass} inline-flex`}>
              <ShoppingCart className="h-5 w-5" />
              {shouldShowCartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-[#E6242A] px-1.5 py-0.5 text-[10px] font-black text-white">
                  {cartCountLabel}
                </span>
              ) : null}
            </span>
            <span className={`${mobileActionButtonClass} inline-flex`}>
              <Menu className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <>
      <div className={`h-[65.5px] md:h-[76.5px] ${className}`} />
      {typeof document !== "undefined" ? createPortal(headerBar, document.body) : headerBar}
      {typeof document !== "undefined" ? createPortal(mobileMenu, document.body) : null}
    </>
  );
};

export default SiteHeader;
