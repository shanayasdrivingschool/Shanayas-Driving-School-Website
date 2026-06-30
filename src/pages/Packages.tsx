import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  CarFront,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  GraduationCap,
  Minus,
  Plus,
  Smartphone,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/components/cart/CartProvider";
import CustomPackagePromoCard from "@/components/CustomPackagePromoCard";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { formatCoursePrice, getCoursePriceForTier } from "@/data/coursePricing";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { packageCatalog } from "@/data/packageCatalog";
import type { CourseCatalogItem } from "@/data/courseCatalog";
import { officeLocation, serviceLocations, serviceLocationsById } from "@/data/serviceLocations";
import { buildCartItem, getCartItemKey } from "@/lib/cart";
import { clearCheckoutPaymentSession } from "@/lib/checkoutPaymentSession";

type CustomPackageBuilderDraft = {
  savedAt: number;
  selectedCourseIds: string[];
  selectedCustomLocationId: string;
  showFullCustomBuilder: boolean;
  isCustomCourseListOpen: boolean;
};

type FlyingCourseIndicator = {
  id: number;
  endX: number;
  endY: number;
  icon: "in-class" | "mixed" | "in-car";
  startX: number;
  startY: number;
  visible: boolean;
};

const CUSTOM_PACKAGE_BUILDER_SECTION_ID = "custom-package-builder";
const CUSTOM_PACKAGE_DRAFT_STORAGE_KEY = "packages.custom-package-builder-draft.v1";
const CUSTOM_PACKAGE_DRAFT_TTL_MS = 15 * 60 * 1000;

const clearCustomPackageBuilderDraft = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CUSTOM_PACKAGE_DRAFT_STORAGE_KEY);
};

const readCustomPackageBuilderDraft = (): CustomPackageBuilderDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_PACKAGE_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CustomPackageBuilderDraft>;
    const savedAt = typeof parsed.savedAt === "number" ? parsed.savedAt : NaN;

    if (!Number.isFinite(savedAt) || Date.now() - savedAt > CUSTOM_PACKAGE_DRAFT_TTL_MS) {
      clearCustomPackageBuilderDraft();
      return null;
    }

    const selectedCourseIds = Array.isArray(parsed.selectedCourseIds)
      ? Array.from(new Set(parsed.selectedCourseIds.filter((value): value is string => typeof value === "string" && value.trim().length > 0)))
      : [];

    const selectedCustomLocationId =
      typeof parsed.selectedCustomLocationId === "string" && parsed.selectedCustomLocationId in serviceLocationsById
        ? parsed.selectedCustomLocationId
        : officeLocation.id;

    return {
      savedAt,
      selectedCourseIds,
      selectedCustomLocationId,
      showFullCustomBuilder: Boolean(parsed.showFullCustomBuilder),
      isCustomCourseListOpen: Boolean(parsed.isCustomCourseListOpen),
    };
  } catch {
    clearCustomPackageBuilderDraft();
    return null;
  }
};

const hasCustomPackageBuilderDraftData = (draft: Omit<CustomPackageBuilderDraft, "savedAt">) => {
  return (
    draft.selectedCourseIds.length > 0 ||
    draft.selectedCustomLocationId !== officeLocation.id ||
    draft.showFullCustomBuilder ||
    draft.isCustomCourseListOpen
  );
};

const writeCustomPackageBuilderDraft = (draft: Omit<CustomPackageBuilderDraft, "savedAt">) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CUSTOM_PACKAGE_DRAFT_STORAGE_KEY,
    JSON.stringify({
      ...draft,
      savedAt: Date.now(),
    } satisfies CustomPackageBuilderDraft),
  );
};

const customCourseOrder = [
  "knowledge-test-prep-course",
  "beginner-driving-course",
  "confidence-booster-course",
  "defensive-driving-course",
  "refresher-driving-course",
  "advanced-driving-course",
  "new-to-canada",
  "parking-course",
  "winter-driving-course",
  "make-your-own-class",
  "lesson-road-test-prep-course",
  "road-test-prep-course",
  "mock-test-evaluation",
  "seniors-driving-course",
];

const customCourseOrderIndex = new Map(customCourseOrder.map((id, index) => [id, index]));

const paymentOptions = [
  { title: "Debit / Credit", icon: CreditCard },
  { title: "E-Transfer", icon: Smartphone },
  { title: "Cash", icon: Banknote },
  { title: "Klarna / Affirm", icon: Wallet },
];

const packageHeroBackground =
  "https://artofdrivingschooldarwin.com/wp-content/uploads/2023/08/woman-male-driving-instructor-during-driving-test-scaled.jpg";

const packageFaqs = [
  {
    question: "Are these packages fixed or can they be adjusted?",
    answer:
      "Fresh Start, Skill Builder, and Final Lap are structured package paths, but we can still adjust them based on your driving level and goals.",
  },
  {
    question: "Can I create my own package only?",
    answer:
      "Yes. Use the Make Your Own Package section to select the courses you want and we will help organize them into a personalized lesson plan.",
  },
  {
    question: "Do these packages include vehicle use for lessons?",
    answer:
      "Yes. All listed lesson packages include use of our dual-control insured training vehicles.",
  },
  {
    question: "Can I change my package?",
    answer:
      "Yes. You can change your package depending on your progress and your instructor's assessment.",
  },
  {
    question: "What if I need a course that is not in one preset package?",
    answer:
      "That is exactly what the custom package builder is for. You can mix and match the courses you need and request a package built around them.",
  },
];

const BUNDLE_DISCOUNT_THRESHOLD = 3;
const BUNDLE_DISCOUNT_PERCENT = 5;
const CUSTOM_CLASS_COURSE_ID = "make-your-own-class";

const getCoursePrerequisites = (course: CourseCatalogItem) => {
  switch (course.id) {
    case "advanced-driving-course":
      return "Comfort with everyday driving, lane changes, and traffic flow is recommended.";
    case "road-test-prep-course":
    case "lesson-road-test-prep-course":
    case "mock-test-evaluation":
      return "Best for students who already drive independently and are preparing for a road test.";
    case "refresher-driving-course":
      return "Ideal if you already hold or previously held a licence and want guided practice.";
    case "seniors-driving-course":
      return "No formal prerequisite. Designed for drivers who want a calm assessment and confidence refresh.";
    default:
      return "No formal prerequisite. We tailor the lesson plan to your current experience level.";
  }
};

const getCourseFlyIndicatorIcon = (course: CourseCatalogItem): FlyingCourseIndicator["icon"] => {
  if (course.deliveryFormat === "In-class") {
    return "in-class";
  }

  if (course.deliveryFormat === "In-class + In-car") {
    return "mixed";
  }

  return "in-car";
};

const useAnimatedNumber = (targetValue: number, durationMs = 350) => {
  const [animatedValue, setAnimatedValue] = useState(targetValue);
  const latestValueRef = useRef(targetValue);

  useEffect(() => {
    latestValueRef.current = animatedValue;
  }, [animatedValue]);

  useEffect(() => {
    if (Math.abs(targetValue - latestValueRef.current) < 0.01) {
      setAnimatedValue(targetValue);
      latestValueRef.current = targetValue;
      return;
    }

    const startValue = latestValueRef.current;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (targetValue - startValue) * easedProgress;
      setAnimatedValue(Number(nextValue.toFixed(2)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      latestValueRef.current = targetValue;
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, targetValue]);

  return animatedValue;
};

const BundleDiscountProgress = ({
  unlocked,
  value,
}: {
  unlocked: boolean;
  value: number;
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const carPosition = `clamp(1.25rem, ${clampedValue}%, calc(100% - 1.25rem))`;

  return (
    <div className="mt-4">
      <div className="relative px-1 pt-6">
        <div className="bundle-progress-track relative">
          <Progress
            value={clampedValue}
            className="bundle-progress-road h-2.5 border border-white/60 bg-emerald-100/90 shadow-[inset_0_1px_2px_rgba(20,128,74,0.08)] [&>div]:bg-[linear-gradient(90deg,#63e08c_0%,#2fb36f_50%,#1d52a1_100%)] [&>div]:shadow-[0_0_18px_rgba(29,82,161,0.25)]"
          />

          <div className="pointer-events-none absolute inset-0">
            <div
              aria-hidden="true"
              className="bundle-progress-car absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: carPosition }}
            >
              <div className="absolute right-[62%] top-1/2 h-[2px] w-9 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-emerald-300/80 to-sky-200/0 blur-[1px]" />
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-[0_10px_26px_rgba(20,128,74,0.22)] ${
                  unlocked ? "ring-4 ring-emerald-200/90" : "ring-4 ring-emerald-100/80"
                }`}
              >
                <CarFront className={`h-[18px] w-[18px] ${unlocked ? "text-[#14804A]" : "text-[#1d52a1]"}`} />
                <span className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-0.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
          <span>1 course</span>
          <span>2 courses</span>
          <span>{BUNDLE_DISCOUNT_THRESHOLD} courses</span>
        </div>
      </div>
    </div>
  );
};

const Packages = () => {
  const navigate = useNavigate();
  const { addCourse, addPackage, entries, items, removeItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const initialDraftRef = useRef<CustomPackageBuilderDraft | null>(readCustomPackageBuilderDraft());
  const customPlanSummaryRef = useRef<HTMLDivElement | null>(null);
  const mobileSummaryBarRef = useRef<HTMLDivElement | null>(null);
  const selectedCoursesListRef = useRef<HTMLDivElement | null>(null);
  const flyingIndicatorIdRef = useRef(0);
  const restoredDraft = initialDraftRef.current;
  const coursesQuery = usePublicCourses();
  const availableCustomCourses = useMemo(() => {
    return [...coursesQuery.data].sort((a, b) => {
      const aIndex = customCourseOrderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = customCourseOrderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  }, [coursesQuery.data]);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false,
  );
  const [isCustomCourseListOpen, setIsCustomCourseListOpen] = useState(() => restoredDraft?.isCustomCourseListOpen ?? false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(() => restoredDraft?.selectedCourseIds ?? []);
  const [showFullCustomBuilder, setShowFullCustomBuilder] = useState(() => restoredDraft?.showFullCustomBuilder ?? false);
  const [selectedCustomLocationId, setSelectedCustomLocationId] = useState(() => restoredDraft?.selectedCustomLocationId ?? officeLocation.id);
  const [isCustomLocationMenuOpen, setIsCustomLocationMenuOpen] = useState(false);
  const [activeDetailCourseId, setActiveDetailCourseId] = useState<string | null>(null);
  const [hasReviewedPlan, setHasReviewedPlan] = useState(false);
  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] = useState(false);
  const [flyingCourseIndicators, setFlyingCourseIndicators] = useState<FlyingCourseIndicator[]>([]);

  const selectedCustomCourses = availableCustomCourses.filter((course) => selectedCourseIds.includes(course.id));
  const selectedCustomLocation = serviceLocationsById[selectedCustomLocationId] ?? officeLocation;
  const packageCardItems = useMemo(
    () =>
      Object.fromEntries(
        packageCatalog
          .map((pkg) => [
            pkg.id,
            buildCartItem({
              itemType: "package",
              productId: pkg.id,
              locationId: officeLocation.id,
              quantity: 1,
            }),
          ])
          .filter((entry): entry is [string, NonNullable<ReturnType<typeof buildCartItem>>] => Boolean(entry[1])),
      ),
    [],
  );
  const packageCardQuantities = useMemo(
    () =>
      Object.fromEntries(
        items
          .filter((item) => item.itemType === "package" && item.locationId === officeLocation.id)
          .map((item) => [item.productId, item.quantity]),
      ) as Record<string, number>,
    [items],
  );
  const customPackageSubtotal = Number(
    selectedCustomCourses
      .reduce((total, course) => total + getCoursePriceForTier(course, selectedCustomLocation.pricingTier), 0)
      .toFixed(2),
  );
  const customPackageUsesIslandPricing = selectedCustomLocation.pricingTier === "island";
  const isCustomBuilderCollapsible = availableCustomCourses.length > 4;
  const isCustomBuilderCollapsed = !showFullCustomBuilder && isCustomBuilderCollapsible;
  const isCustomCourseListExpanded = isDesktop || isCustomCourseListOpen;
  const activeDetailCourse = availableCustomCourses.find((course) => course.id === activeDetailCourseId) ?? null;
  const hasSelectedCustomCourses = selectedCustomCourses.length > 0;
  const bundleEligibleCustomCourses = selectedCustomCourses.filter(
    (course) => course.id !== CUSTOM_CLASS_COURSE_ID && course.deliveryFormat !== "In-class",
  );
  const bundleDiscountBase = Number(
    bundleEligibleCustomCourses
      .reduce((total, course) => total + getCoursePriceForTier(course, selectedCustomLocation.pricingTier), 0)
      .toFixed(2),
  );
  const selectedInCarCourseCount = bundleEligibleCustomCourses.length;
  const bundleDiscountRemaining = Math.max(0, BUNDLE_DISCOUNT_THRESHOLD - selectedInCarCourseCount);
  const bundleDiscountUnlocked = hasSelectedCustomCourses && bundleDiscountRemaining === 0 && !customPackageUsesIslandPricing;
  const bundleProgressValue = Math.min((selectedInCarCourseCount / BUNDLE_DISCOUNT_THRESHOLD) * 100, 100);
  const bundleDiscountAmount = bundleDiscountUnlocked
    ? Number((bundleDiscountBase * (BUNDLE_DISCOUNT_PERCENT / 100)).toFixed(2))
    : 0;
  const customPackageEstimatedTotal = Number((customPackageSubtotal - bundleDiscountAmount).toFixed(2));
  const animatedCustomPackageTotal = useAnimatedNumber(customPackageUsesIslandPricing ? 0 : customPackageEstimatedTotal);
  const reviewStepComplete = hasSelectedCustomCourses && (isDesktop || hasReviewedPlan);
  const builderProgressValue = !hasSelectedCustomCourses ? 24 : reviewStepComplete ? 86 : 58;
  const builderSteps = [
    {
      step: "Step 1",
      label: "Choose Courses",
      complete: hasSelectedCustomCourses,
    },
    {
      step: "Step 2",
      label: "Review Plan",
      complete: reviewStepComplete,
    },
    {
      step: "Step 3",
      label: "Checkout",
      complete: false,
    },
  ].map((item, index) => ({
    ...item,
    active:
      (index === 0 && !hasSelectedCustomCourses) ||
      (index === 1 && hasSelectedCustomCourses && !reviewStepComplete) ||
      (index === 2 && reviewStepComplete),
  }));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const validCourseIds = new Set(availableCustomCourses.map((course) => course.id));
    setSelectedCourseIds((current) => {
      const filtered = current.filter((courseId) => validCourseIds.has(courseId));
      return filtered.length === current.length ? current : filtered;
    });
  }, [availableCustomCourses]);

  useEffect(() => {
    if (!hasSelectedCustomCourses) {
      setHasReviewedPlan(false);
      return;
    }

    if (isDesktop) {
      setHasReviewedPlan(true);
    }
  }, [hasSelectedCustomCourses, isDesktop]);

  useEffect(() => {
    if (!isMobile || !hasSelectedCustomCourses) {
      setIsMobileSummaryExpanded(false);
    }
  }, [hasSelectedCustomCourses, isMobile]);

  useEffect(() => {
    const draft = {
      selectedCourseIds,
      selectedCustomLocationId,
      showFullCustomBuilder,
      isCustomCourseListOpen,
    };

    if (hasCustomPackageBuilderDraftData(draft)) {
      writeCustomPackageBuilderDraft(draft);
      return;
    }

    clearCustomPackageBuilderDraft();
  }, [
    isCustomCourseListOpen,
    selectedCourseIds,
    selectedCustomLocationId,
    showFullCustomBuilder,
  ]);

  const toggleCourseSelection = (courseId: string, checked: boolean) => {
    setSelectedCourseIds((current) => {
      if (checked) {
        return current.includes(courseId) ? current : [...current, courseId];
      }

      return current.filter((id) => id !== courseId);
    });
  };

  const triggerFlyingCourseIndicator = (course: CourseCatalogItem, originElement: HTMLElement) => {
    const targetElement = isMobile ? mobileSummaryBarRef.current : selectedCoursesListRef.current;
    if (!targetElement) {
      return;
    }

    const originRect = originElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const nextId = flyingIndicatorIdRef.current + 1;
    flyingIndicatorIdRef.current = nextId;

    const startX = originRect.left + originRect.width / 2 - 18;
    const startY = originRect.top + originRect.height / 2 - 18;
    const endX = targetRect.left + Math.min(targetRect.width * 0.72, Math.max(targetRect.width - 42, 18));
    const endY = targetRect.top + Math.min(28, Math.max(targetRect.height / 2 - 18, 12));

    setFlyingCourseIndicators((current) => [
      ...current,
      {
        id: nextId,
        endX,
        endY,
        icon: getCourseFlyIndicatorIcon(course),
        startX,
        startY,
        visible: false,
      },
    ]);

    window.requestAnimationFrame(() => {
      setFlyingCourseIndicators((current) =>
        current.map((indicator) =>
          indicator.id === nextId
            ? {
                ...indicator,
                visible: true,
              }
            : indicator,
        ),
      );
    });

    window.setTimeout(() => {
      setFlyingCourseIndicators((current) => current.filter((indicator) => indicator.id !== nextId));
    }, 700);
  };

  const handleReviewCustomPlan = () => {
    setShowFullCustomBuilder(true);
    setHasReviewedPlan(true);
    window.setTimeout(() => {
      customPlanSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: isMobile ? "start" : "nearest",
      });
    }, 120);
  };

  const handleAddPackage = (packageId: string) => {
    const cartItem = packageCardItems[packageId];
    addPackage({ packageId, locationId: officeLocation.id });
    toast({
      title: "Package added to cart",
      description: cartItem
        ? `${cartItem.title} was added for ${cartItem.locationName}.`
        : "Your selected package was added to the cart.",
    });
  };

  const addSelectedCustomCoursesToCart = () => {
    const existingKeys = new Set(
      entries.map((entry) => getCartItemKey(entry.itemType, entry.productId, entry.locationId)),
    );
    const coursesToAdd = selectedCustomCourses.filter(
      (course) => !existingKeys.has(getCartItemKey("course", course.id, selectedCustomLocation.id)),
    );

    coursesToAdd.forEach((course) => {
      addCourse({ courseId: course.id, locationId: selectedCustomLocation.id });
    });

    return coursesToAdd.length;
  };

  const handleAddCustomCoursesToCart = () => {
    if (selectedCustomCourses.length === 0) {
      return;
    }

    clearCheckoutPaymentSession();
    const addedCount = addSelectedCustomCoursesToCart();

    toast({
      title: addedCount > 0 ? "Courses added to cart" : "Selected courses already in cart",
      description:
        addedCount > 0
          ? `${selectedCustomCourses.length} selected course${selectedCustomCourses.length === 1 ? "" : "s"} were added for ${selectedCustomLocation.name}.`
          : `Your selected courses are already in the cart for ${selectedCustomLocation.name}.`,
    });
  };

  const handleContinueCustomPackageCheckout = () => {
    if (selectedCustomCourses.length === 0) {
      return;
    }

    clearCheckoutPaymentSession();
    addSelectedCustomCoursesToCart();
    navigate("/checkout");
  };

  return (
    <main className={`bg-white text-[#202121] ${isMobile ? "pb-24" : ""}`}>
      <PageNameSection
        eyebrow=""
        title={<span className="text-white">Driving lesson packages</span>}
        description="Flexible training options designed to match your experience level, from beginner foundations to final test preparation."
        backgroundImage={packageHeroBackground}
        minHeightClassName="min-h-[460px] md:min-h-[540px]"
        contentLayout="center"
      />

      {flyingCourseIndicators.map((indicator) => (
        <div
          key={indicator.id}
          className="pointer-events-none fixed left-0 top-0 z-[70] flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-[0_12px_28px_rgba(37,99,235,0.32)] transition-all duration-700"
          style={{
            opacity: indicator.visible ? 0 : 1,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transform: indicator.visible
              ? `translate(${indicator.endX}px, ${indicator.endY}px) scale(0.7)`
              : `translate(${indicator.startX}px, ${indicator.startY}px) scale(1)`,
          }}
        >
          {indicator.icon === "in-class" ? (
            <GraduationCap className="h-4 w-4" />
          ) : indicator.icon === "mixed" ? (
            <BookOpen className="h-4 w-4" />
          ) : (
            <CarFront className="h-4 w-4" />
          )}
        </div>
      ))}

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Packages</p>
          <h2 className="mx-auto mt-2 max-w-4xl text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
            Driving Packages Designed Around Your Progress
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
            Start with a structured package or combine lessons from our full course list to create a training plan that
            fits your experience and learning goals.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packageCatalog.map((pkg) => {
              const packageCardItem = packageCardItems[pkg.id];
              const packageQuantity = packageCardQuantities[pkg.id] ?? 0;

              return (
                <article
                  key={pkg.id}
                  className={`relative flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ${
                    pkg.popular ? "border-2 border-[#1d52a1] shadow-md" : "border border-slate-200"
                  }`}
                >
                  {pkg.popular ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#E6242A] px-3 py-1 text-xs font-bold text-white">
                      Recommended
                    </span>
                  ) : null}

                  <div className="flex-1">
                    <div className="min-h-[176px] sm:min-h-[188px] lg:min-h-[200px]">
                      <h3 className="text-3xl font-black text-slate-900">{pkg.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{pkg.description}</p>
                    </div>

                    {packageCardItem ? (
                      <div className="mt-5">
                        <p className="text-sm font-semibold text-[#1d52a1]">{packageCardItem.sessionDetail}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 responsive-cta-row items-start">
                    <Link
                      to={`/packages/${pkg.id}`}
                      className={`inline-flex flex-1 self-start items-center justify-center whitespace-nowrap rounded-full px-7 py-3 text-sm font-bold transition-colors ${
                        pkg.popular ? "bg-[#E6242A] text-white hover:bg-[#C41E23]" : "bg-[#1d52a1] text-white hover:bg-[#17488d]"
                      }`}
                    >
                      Learn more
                    </Link>
                    {packageQuantity > 0 ? (
                      <div className="flex min-w-[170px] flex-none flex-col gap-2">
                        <div className="inline-flex w-full items-center justify-between rounded-full border-2 border-[#1d52a1] bg-white px-3 py-2 text-[#1d52a1]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(getCartItemKey("package", pkg.id, officeLocation.id), packageQuantity - 1)
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F2F2F2]"
                            aria-label={`Decrease quantity for ${pkg.title}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="whitespace-nowrap px-2 text-xs font-bold sm:text-sm">
                            Qty: {packageQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(getCartItemKey("package", pkg.id, officeLocation.id), packageQuantity + 1)
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F2F2F2]"
                            aria-label={`Increase quantity for ${pkg.title}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(getCartItemKey("package", pkg.id, officeLocation.id))}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#E6242A] hover:text-[#E6242A]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                        <Link
                          to="/cart"
                          className="inline-flex w-full items-center justify-center rounded-full bg-[#1d52a1] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#17488d]"
                        >
                          View cart
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddPackage(pkg.id)}
                        className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-[#1d52a1] px-7 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <CustomPackagePromoCard
            eyebrow=""
            description=""
            action={
              <a
                href="#custom-package-builder"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
              >
                Start building
              </a>
            }
          />
        </div>
      </section>

      <section id={CUSTOM_PACKAGE_BUILDER_SECTION_ID} className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Custom</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Make Your Own Package</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Pick any courses from our list and see your package price update instantly.
          </p>

          <div className="mx-auto mt-8 max-w-4xl">
            <div className="overflow-x-auto pb-1">
              <div className="relative grid min-w-[540px] grid-cols-3 items-start gap-4 sm:min-w-0 sm:gap-6">
                <div className="absolute left-[16.666%] right-[16.666%] top-5 h-[3px] rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1d52a1] to-[#2fb36f] transition-all duration-500"
                    style={{ width: `${builderProgressValue}%` }}
                  />
                </div>

                {builderSteps.map((item, index) => (
                  <div key={item.label} className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-sm font-black transition-all ${
                        item.complete
                          ? "border-[#1d52a1] bg-[#1d52a1] text-white"
                          : item.active
                            ? "border-[#E6242A] text-[#E6242A] shadow-[0_0_0_6px_rgba(230,36,42,0.08)]"
                            : "border-slate-300 text-slate-400"
                      }`}
                      aria-current={item.active ? "step" : undefined}
                    >
                      {item.complete ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <p
                      className={`mt-3 text-[11px] font-black uppercase tracking-[0.16em] ${
                        item.complete || item.active ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {item.step}
                    </p>
                    <p
                      className={`mt-1 whitespace-nowrap text-sm font-bold ${
                        item.complete || item.active ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-10">
            <div
              className={`grid gap-6 transition-all duration-500 md:items-start md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] ${
                isCustomBuilderCollapsed
                  ? "max-h-[760px] overflow-hidden sm:max-h-[860px] md:max-h-[720px] xl:max-h-[760px]"
                  : ""
              }`}
            >
                {isDesktop ? (
                <div ref={customPlanSummaryRef} className="order-2 h-fit self-start md:sticky md:top-[100px]">
                    <div className="flex flex-col rounded-[28px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 sm:text-4xl">Live package summary</h3>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-left shadow-sm">
                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Courses picked</p>
                          <p className="mt-1 text-3xl font-black text-[#1d52a1]">{selectedCustomCourses.length}</p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Selected courses</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {hasSelectedCustomCourses
                                ? "Remove anything instantly without losing your place."
                                : "Nothing selected yet. Pick any course from the list to start your plan."}
                            </p>
                          </div>
                          {hasSelectedCustomCourses ? (
                            <button
                              type="button"
                              onClick={() => setSelectedCourseIds([])}
                              className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[#E6242A] hover:text-[#E6242A]"
                            >
                              Clear all
                            </button>
                          ) : null}
                        </div>

                        <div ref={selectedCoursesListRef} className="mt-4 space-y-3">
                          {hasSelectedCustomCourses ? (
                            selectedCustomCourses.map((course) => {
                              const coursePrice = getCoursePriceForTier(course, selectedCustomLocation.pricingTier);

                              return (
                                <div
                                  key={course.id}
                                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black text-slate-900">{course.title}</p>
                                    <p className="mt-1 text-xs font-semibold text-[#1d52a1]">{course.detail}</p>
                                    <p className="mt-1 text-xs text-slate-500">{course.deliveryFormat}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!customPackageUsesIslandPricing ? (
                                      <span className="hidden whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 sm:inline-flex">
                                        {formatCoursePrice(coursePrice)}
                                      </span>
                                    ) : null}
                                    <button
                                      type="button"
                                      onClick={() => toggleCourseSelection(course.id, false)}
                                      aria-label={`Remove ${course.title}`}
                                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-[#E6242A] hover:text-[#E6242A]"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : null}
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start gap-3">
                            <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                            <div className="flex-1">
                              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Live estimated total</p>
                              <p
                                className={`mt-2 flex items-end gap-2 text-2xl font-black ${
                                  hasSelectedCustomCourses && customPackageUsesIslandPricing ? "text-[#E6242A]" : "text-slate-900"
                                }`}
                              >
                                <span>
                                  {hasSelectedCustomCourses
                                    ? customPackageUsesIslandPricing
                                      ? "Call for price"
                                      : formatCoursePrice(animatedCustomPackageTotal)
                                    : formatCoursePrice(animatedCustomPackageTotal)}
                                </span>
                                {hasSelectedCustomCourses && !customPackageUsesIslandPricing ? (
                                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">+ GST</span>
                                ) : null}
                              </p>
                              {bundleDiscountUnlocked && !customPackageUsesIslandPricing ? (
                                <p className="mt-1 text-xs font-semibold text-[#14804A]">
                                  Bundle discount applied from {formatCoursePrice(customPackageSubtotal)}.
                                </p>
                              ) : null}
                              {!hasSelectedCustomCourses || customPackageUsesIslandPricing ? (
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                  {!hasSelectedCustomCourses
                                    ? "Choose one or more courses to preview the estimated package total."
                                    : "Island lesson pricing is quoted manually. Please contact the team for an exact package price."}
                                </p>
                              ) : (
                                <p className="mt-2 text-sm text-slate-600">
                                  The total updates immediately as you add or remove courses from your custom plan.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {bundleDiscountUnlocked
                                ? `${BUNDLE_DISCOUNT_PERCENT}% off unlocked`
                                : `Add ${BUNDLE_DISCOUNT_THRESHOLD} to get ${BUNDLE_DISCOUNT_PERCENT}% off`}
                            </p>
                            <BundleDiscountProgress unlocked={bundleDiscountUnlocked} value={bundleProgressValue} />
                          </div>

                          <p id="custom-package-location-label" className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
                            Lesson location
                          </p>
                          <div className="mt-2">
                            <Popover open={isCustomLocationMenuOpen} onOpenChange={setIsCustomLocationMenuOpen}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  id="custom-package-location"
                                  aria-labelledby="custom-package-location-label custom-package-location"
                                  className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                                >
                                  <span>{selectedCustomLocation.name}</span>
                                  <ChevronDown
                                    className={`h-4 w-4 text-slate-500 transition-transform ${
                                      isCustomLocationMenuOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-[var(--radix-popover-trigger-width)] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                              >
                                {serviceLocations.map((location) => (
                                  <button
                                    key={location.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCustomLocationId(location.id);
                                      setIsCustomLocationMenuOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                                      location.id === selectedCustomLocationId
                                        ? "bg-[#1d52a1]/10 text-[#1d52a1]"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                  >
                                    <span>{location.name}</span>
                                    {location.id === selectedCustomLocationId ? <Check className="h-4 w-4" /> : null}
                                  </button>
                                ))}
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:pt-5">
                        <h4 className="text-xl font-black text-slate-900">Continue with your custom training package</h4>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          The courses you select will be moved into your cart and carried into checkout for {selectedCustomLocation.name}.
                        </p>

                        <div className="mt-5 space-y-3">
                          <button
                            type="button"
                            onClick={handleContinueCustomPackageCheckout}
                            disabled={!hasSelectedCustomCourses}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-colors ${
                              hasSelectedCustomCourses
                                ? "bg-[#E6242A] hover:bg-[#C41E23]"
                                : "cursor-not-allowed bg-slate-300"
                            }`}
                          >
                            Continue to checkout
                            <ArrowRight className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={handleAddCustomCoursesToCart}
                            disabled={!hasSelectedCustomCourses}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-full border-2 px-7 py-3 text-sm font-bold transition-colors ${
                              hasSelectedCustomCourses
                                ? "border-[#1d52a1] text-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"
                                : "cursor-not-allowed border-slate-200 text-slate-400"
                            }`}
                          >
                            Add to cart
                          </button>
                        </div>

                        {hasSelectedCustomCourses ? (
                          <p className="mt-4 text-sm text-slate-500">
                            {selectedCustomCourses.length} selected course{selectedCustomCourses.length === 1 ? "" : "s"} will be used for this checkout.
                          </p>
                        ) : null}

                        <Link
                          to="/courses"
                          className="mx-auto mt-4 flex w-fit items-center justify-center rounded-full border-2 border-[#1d52a1] px-7 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white sm:mx-0"
                        >
                          View Course Details
                        </Link>
                      </div>
                    </div>
                </div>
                ) : null}

                <div className="relative order-1 lg:order-1">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-center">
                      <p className="text-[36px] font-black uppercase leading-none tracking-wide text-[#E6242A]">Choose your courses</p>
                      <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-600">
                        Compare options quickly, add what fits, and open details only when you need the deeper breakdown.
                      </p>
                      <Link
                        to="/course-quiz"
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                      >
                        Need help? Take the quiz
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </Link>
                    </div>
                  </div>

                  <Collapsible
                    open={isCustomCourseListExpanded}
                    onOpenChange={(open) => {
                      if (!isDesktop) {
                        setIsCustomCourseListOpen(open);
                      }
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="mt-4 flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 text-left md:hidden"
                      >
                        <div>
                          <p className="text-base font-black text-slate-900">SELECT YOUR COURSE</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {selectedCustomCourses.length > 0
                              ? `${selectedCustomCourses.length} selected`
                              : `${availableCustomCourses.length} courses available`}
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                            isCustomCourseListOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down md:overflow-visible">
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {availableCustomCourses.map((course) => {
                          const isSelected = selectedCourseIds.includes(course.id);
                          const DeliveryIcon =
                            course.deliveryFormat === "In-class"
                              ? GraduationCap
                              : course.deliveryFormat === "In-class + In-car"
                                ? BookOpen
                                : CarFront;

                          return (
                            <article
                              key={course.id}
                              className={`flex h-full flex-col rounded-3xl border p-5 transition-all ${
                                isSelected
                                  ? "border-2 border-[#2563eb] bg-[#2563eb]/[0.06] shadow-sm shadow-[#2563eb]/10"
                                  : "border-slate-200 bg-white hover:border-[#1d52a1]/40 hover:shadow-sm"
                              }`}
                            >
                              <div className="min-w-0">
                                <h3 className="min-h-[2.7rem] overflow-hidden text-[1.05rem] font-black leading-tight text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:min-h-[3.2rem] sm:text-xl">
                                  {course.title}
                                </h3>
                                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  {course.duration}
                                </p>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                  {course.level}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                    course.deliveryFormat === "In-class"
                                      ? "bg-[#E6242A]/10 text-[#E6242A]"
                                      : course.deliveryFormat === "In-car"
                                        ? "bg-[#F3B233]/15 text-[#B77900]"
                                        : "bg-[#1d52a1]/10 text-[#1d52a1]"
                                  }`}
                                >
                                  <DeliveryIcon className="h-3.5 w-3.5" />
                                  {course.deliveryFormat}
                                </span>
                              </div>

                              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                                <div className="flex flex-col items-start gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setActiveDetailCourseId(course.id)}
                                    className="text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
                                  >
                                    View details
                                  </button>
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                    {customPackageUsesIslandPricing
                                      ? "Manual quote"
                                      : formatCoursePrice(getCoursePriceForTier(course, selectedCustomLocation.pricingTier))}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    if (!isSelected) {
                                      triggerFlyingCourseIndicator(course, event.currentTarget);
                                    }

                                    toggleCourseSelection(course.id, !isSelected);
                                  }}
                                  aria-pressed={isSelected}
                                  className={`inline-flex min-w-[124px] shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                                    isSelected
                                      ? "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                                      : "border-[#1d52a1] text-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"
                                  }`}
                                >
                                  {isSelected ? "Remove" : "Add course"}
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            {isCustomBuilderCollapsed ? (
              <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-3 sm:pb-5">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/95 to-white/0" />
                <button
                  type="button"
                  onClick={() => setShowFullCustomBuilder(true)}
                  aria-expanded={showFullCustomBuilder}
                  className="relative z-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(29,82,161,0.28)] transition-colors hover:bg-[#17488d]"
                >
                  Show more
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          {showFullCustomBuilder && isCustomBuilderCollapsible ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowFullCustomBuilder(false)}
                aria-expanded={showFullCustomBuilder}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1d52a1] px-6 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
              >
                Show less
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <Dialog open={Boolean(activeDetailCourse)} onOpenChange={(open) => !open && setActiveDetailCourseId(null)}>
        <DialogContent className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
          {activeDetailCourse ? (
            <div className="p-6 sm:p-7">
              <DialogHeader>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E6242A]">Course details</p>
                <DialogTitle className="mt-2 text-2xl font-black text-slate-900">{activeDetailCourse.title}</DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-relaxed text-slate-600">
                  {activeDetailCourse.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                  {activeDetailCourse.level}
                </span>
                <span className="rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1d52a1]">
                  {activeDetailCourse.deliveryFormat}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                  {activeDetailCourse.duration}
                </span>
              </div>

              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Included format</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{activeDetailCourse.detail}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Live price</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {customPackageUsesIslandPricing
                        ? "Manual quote required"
                        : formatCoursePrice(getCoursePriceForTier(activeDetailCourse, selectedCustomLocation.pricingTier))}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">What this course covers</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeDetailCourse.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">Prerequisites</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {getCoursePrerequisites(activeDetailCourse)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCourseIds.includes(activeDetailCourse.id)) {
                      setActiveDetailCourseId(null);
                      if (isMobile) {
                        setIsMobileSummaryExpanded(true);
                      } else {
                        handleReviewCustomPlan();
                      }
                      return;
                    }

                    toggleCourseSelection(activeDetailCourse.id, true);
                    setHasReviewedPlan(true);
                    if (isMobile) {
                      setIsMobileSummaryExpanded(true);
                    }
                    setActiveDetailCourseId(null);
                  }}
                  className={`inline-flex flex-1 items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                    selectedCourseIds.includes(activeDetailCourse.id)
                      ? "bg-[#1d52a1] text-white hover:bg-[#17488d]"
                      : "bg-[#E6242A] text-white hover:bg-[#C41E23]"
                  }`}
                >
                  {selectedCourseIds.includes(activeDetailCourse.id) ? "Review plan" : "Add to plan"}
                </button>
                <Link
                  to={`/courses/${activeDetailCourse.id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-[#1d52a1] px-6 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
                >
                  Open full course page
                </Link>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {isMobile ? (
        <div
          ref={mobileSummaryBarRef}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Live total</p>
              <p className="mt-1 text-lg font-black text-slate-900">
                {hasSelectedCustomCourses
                  ? customPackageUsesIslandPricing
                    ? "Call for price"
                    : formatCoursePrice(animatedCustomPackageTotal)
                  : formatCoursePrice(animatedCustomPackageTotal)}
              </p>
              <p className="truncate text-xs text-slate-500">
                {hasSelectedCustomCourses
                  ? `${selectedCustomCourses.length} course${selectedCustomCourses.length === 1 ? "" : "s"} selected`
                  : "Choose courses to build your plan"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSummaryExpanded((current) => !current)}
              aria-expanded={isMobileSummaryExpanded}
              aria-label={isMobileSummaryExpanded ? "Collapse package summary" : "Expand package summary"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
            >
              {isMobileSummaryExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={handleContinueCustomPackageCheckout}
              disabled={!hasSelectedCustomCourses}
              className={`inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                hasSelectedCustomCourses
                  ? "bg-[#1d52a1] text-white hover:bg-[#17488d]"
                  : "cursor-not-allowed bg-slate-300 text-white"
              }`}
            >
              Review & Checkout
            </button>
          </div>

          {isMobileSummaryExpanded ? (
            <div className="max-h-[70vh] overflow-y-auto border-t border-slate-200 px-4 pb-4 pt-4">
              <div className="space-y-3">
                {hasSelectedCustomCourses ? (
                  selectedCustomCourses.map((course) => (
                    <div key={course.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-900">{course.title}</p>
                        <p className="mt-1 text-xs font-semibold text-[#1d52a1]">{course.detail}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {customPackageUsesIslandPricing
                            ? "Manual quote"
                            : formatCoursePrice(getCoursePriceForTier(course, selectedCustomLocation.pricingTier))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCourseSelection(course.id, false)}
                        aria-label={`Remove ${course.title}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-[#E6242A] hover:text-[#E6242A]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                    Choose courses above to build your custom package.
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {bundleDiscountUnlocked
                    ? `${BUNDLE_DISCOUNT_PERCENT}% off unlocked`
                    : `Add ${BUNDLE_DISCOUNT_THRESHOLD} to get ${BUNDLE_DISCOUNT_PERCENT}% off`}
                </p>
                <BundleDiscountProgress unlocked={bundleDiscountUnlocked} value={bundleProgressValue} />

                <p id="custom-package-mobile-location-label" className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
                  Lesson location
                </p>
                <div className="mt-2">
                  <Popover open={isCustomLocationMenuOpen} onOpenChange={setIsCustomLocationMenuOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-labelledby="custom-package-mobile-location-label"
                        className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                      >
                        <span>{selectedCustomLocation.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-500 transition-transform ${
                            isCustomLocationMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[var(--radix-popover-trigger-width)] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                    >
                      {serviceLocations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => {
                            setSelectedCustomLocationId(location.id);
                            setIsCustomLocationMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                            location.id === selectedCustomLocationId
                              ? "bg-[#1d52a1]/10 text-[#1d52a1]"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>{location.name}</span>
                          {location.id === selectedCustomLocationId ? <Check className="h-4 w-4" /> : null}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddCustomCoursesToCart}
                    disabled={!hasSelectedCustomCourses}
                    className={`inline-flex w-full items-center justify-center rounded-full border-2 px-5 py-3 text-sm font-bold transition-colors ${
                      hasSelectedCustomCourses
                        ? "border-[#1d52a1] text-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"
                        : "cursor-not-allowed border-slate-200 text-slate-400"
                    }`}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueCustomPackageCheckout}
                    disabled={!hasSelectedCustomCourses}
                    className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white transition-colors ${
                      hasSelectedCustomCourses
                        ? "bg-[#E6242A] hover:bg-[#C41E23]"
                        : "cursor-not-allowed bg-slate-300"
                    }`}
                  >
                    Continue to checkout
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-6xl font-black text-gray-300/80 sm:text-7xl">How You Can Pay</p>
          <h2 className="text-3xl font-black text-[#1d52a1] sm:text-4xl">Payment Methods</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            We offer simple and flexible payment options so you can choose the method that works best for you.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {paymentOptions.map((option) => (
              <div key={option.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <option.icon className="mx-auto h-6 w-6 text-[#1d52a1]" />
                <p className="mt-2 text-sm font-semibold text-slate-700">{option.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl">FAQs</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl">Packages FAQ</h2>
          <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {packageFaqs.length} Frequently Asked Questions
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-2 shadow-sm sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {packageFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`package-faq-${index}`} className="border-slate-200">
                  <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline sm:text-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-slate-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <SiteCtaSection
        eyebrow="Start with confidence"
        title={
          <>
            Choose your <span className="text-[#F5B13A]">package</span>
          </>
        }
        description="Choose from a variety of packages designed to fit your driving needs. Contact us for more details."
        blobClassName="bg-[#e4e8eb]/45 sm:left-24 lg:left-32"
        actions={
          <>
            <Link to="/contact" className={siteCtaPrimaryClassName}>
              Ask about our packages
            </Link>
            <a href="tel:+12505423673" className={siteCtaSecondaryClassName}>
              Call Now
            </a>
          </>
        }
      />

      <SiteFooter />
    </main>
  );
};

export default Packages;







