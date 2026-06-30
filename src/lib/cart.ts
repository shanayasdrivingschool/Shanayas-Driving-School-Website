import type { CourseCatalogItem } from "@/data/courseCatalog";
import { courseCatalogById } from "@/data/courseCatalog";
import { optionalExtrasById } from "@/data/optionalExtras";
import {
  createPackageLocationPricing,
  formatCourseLessonDuration,
  getCourseLessonCount,
  getCoursePriceForTier,
} from "@/data/coursePricing";
import { getPackageIncludedCourses, packageCatalogById } from "@/data/packageCatalog";
import type { LessonDurationMinutes, ProductPricingTier } from "@/data/productTypes";
import { officeLocation, serviceLocationsById } from "@/data/serviceLocations";

export const CART_STORAGE_KEY = "driving-school-cart.v1";
export const ESTIMATED_GST_RATE = 0.05;
export const COURSE_BUNDLE_DISCOUNT_THRESHOLD = 3;
export const COURSE_BUNDLE_DISCOUNT_PERCENT = 5;
const CUSTOM_CLASS_COURSE_ID = "make-your-own-class";

export type CartItemType = "package" | "course" | "extra";

export type CustomClassObjective = {
  classNumber: number;
  objective: string;
};

export type CartEntryCustomization = {
  lessonDurationMinutes?: LessonDurationMinutes;
  learningObjective?: string;
  classObjectives?: CustomClassObjective[];
};

export type CartEntry = {
  itemType: CartItemType;
  productId: string;
  locationId: string;
  quantity: number;
  customization?: CartEntryCustomization;
};

export type CartItem = {
  key: string;
  itemType: CartItemType;
  productId: string;
  title: string;
  description: string;
  image: string;
  locationId: string;
  locationName: string;
  pricingTier: ProductPricingTier;
  price: number;
  quantity: number;
  sessionCount: number;
  sessionDetail: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  secondaryMetricDetail: string;
  levelLabel: string;
  deliveryFormat?: CourseCatalogItem["deliveryFormat"];
  editHref: string;
  customization?: CartEntryCustomization;
};

export type CartPricingSummary = {
  bundleDiscountAmount: number;
  bundleDiscountEligibleInCarCourseCount: number;
  bundleDiscountPercent: number;
  bundleDiscountRemaining: number;
  bundleDiscountUnlocked: boolean;
  estimatedTaxes: number;
  subtotal: number;
  subtotalBeforeDiscount: number;
  total: number;
};

type LessonSummaryCourse = Pick<CourseCatalogItem, "deliveryFormat" | "duration" | "pricing">;

const roundMoney = (value: number) => Number(value.toFixed(2));

const getLeadingCount = (value: string) => {
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
};

export const getCartItemKey = (itemType: CartItemType, productId: string, locationId: string) =>
  `${itemType}:${productId}:${locationId}`;

const sanitizeCustomClassObjectives = (value: unknown): CustomClassObjective[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const rawObjective = "objective" in item ? (item as { objective?: unknown }).objective : "";
      const rawClassNumber = "classNumber" in item ? (item as { classNumber?: unknown }).classNumber : index + 1;
      const classNumber =
        typeof rawClassNumber === "number" && Number.isFinite(rawClassNumber)
          ? Math.max(1, Math.floor(rawClassNumber))
          : index + 1;
      const objective = typeof rawObjective === "string" ? rawObjective.trim().slice(0, 180) : "";

      return {
        classNumber,
        objective,
      };
    })
    .filter((item): item is CustomClassObjective => Boolean(item))
    .slice(0, 20);
};

const sanitizeLearningObjective = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 500);
};

const sanitizeLessonDurationMinutes = (value: unknown): LessonDurationMinutes | undefined => {
  const duration = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return duration === 60 || duration === 90 ? duration : undefined;
};

export const sanitizeCartEntryCustomization = (value: unknown): CartEntryCustomization | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const rawCustomization = value as Partial<CartEntryCustomization>;
  const lessonDurationMinutes = sanitizeLessonDurationMinutes(rawCustomization.lessonDurationMinutes);
  const learningObjective = sanitizeLearningObjective(rawCustomization.learningObjective);
  const classObjectives = sanitizeCustomClassObjectives(rawCustomization.classObjectives);

  if (!lessonDurationMinutes && !learningObjective && classObjectives.length === 0) {
    return undefined;
  }

  return {
    ...(lessonDurationMinutes ? { lessonDurationMinutes } : {}),
    ...(learningObjective ? { learningObjective } : {}),
    ...(classObjectives.length > 0 ? { classObjectives } : {}),
  };
};

export const getLessonSummary = (courses: LessonSummaryCourse[]) => {
  const sixtyMinuteLessons = courses.reduce((total, course) => total + (course.pricing.sixtyMinuteClasses ?? 0), 0);
  const ninetyMinuteLessons = courses.reduce((total, course) => total + (course.pricing.ninetyMinuteClasses ?? 0), 0);
  const inClassSessions = courses.reduce((total, course) => {
    if (course.deliveryFormat !== "In-class") {
      return total;
    }

    return total + getLeadingCount(course.duration);
  }, 0);
  const breakdown: string[] = [];

  if (ninetyMinuteLessons > 0) {
    breakdown.push(`${ninetyMinuteLessons} x 90 min lessons`);
  }

  if (sixtyMinuteLessons > 0) {
    breakdown.push(`${sixtyMinuteLessons} x 60 min lessons`);
  }

  if (inClassSessions > 0) {
    breakdown.push(`${inClassSessions} in-class sessions`);
  }

  return {
    totalSessions: sixtyMinuteLessons + ninetyMinuteLessons + inClassSessions,
    durationLabel: breakdown.join(" + ") || "Lesson schedule confirmed before payment.",
  };
};

const getLessonSummaryWithDuration = (
  courses: CourseCatalogItem[],
  lessonDurationMinutes?: LessonDurationMinutes,
) => {
  if (!lessonDurationMinutes) {
    return getLessonSummary(courses);
  }

  const selectableLessonCount = courses.reduce((total, course) => {
    if (course.pricing.fixedPrice !== undefined) {
      return total;
    }

    return total + getCourseLessonCount(course);
  }, 0);
  const inClassSessions = courses.reduce((total, course) => {
    if (course.deliveryFormat !== "In-class") {
      return total;
    }

    return total + getLeadingCount(course.duration);
  }, 0);
  const breakdown: string[] = [];

  if (selectableLessonCount > 0) {
    breakdown.push(
      `${selectableLessonCount} x ${lessonDurationMinutes} min ${
        selectableLessonCount === 1 ? "class" : "classes"
      }`,
    );
  }

  if (inClassSessions > 0) {
    breakdown.push(`${inClassSessions} in-class sessions`);
  }

  return {
    totalSessions: selectableLessonCount + inClassSessions,
    durationLabel: breakdown.join(" + ") || "Lesson schedule confirmed before payment.",
  };
};

export const buildCartItem = (entry: CartEntry): CartItem | null => {
  const location = serviceLocationsById[entry.locationId] ?? officeLocation;
  const quantity =
    Number.isFinite(entry.quantity) && entry.quantity > 0 ? Math.max(1, Math.floor(entry.quantity)) : 1;

  if (entry.itemType === "package") {
    const pkg = packageCatalogById[entry.productId];

    if (!pkg) {
      return null;
    }

    const includedCourses = getPackageIncludedCourses(pkg.id);
    const lessonDurationMinutes = entry.customization?.lessonDurationMinutes;
    const lessonSummary = getLessonSummaryWithDuration(includedCourses, lessonDurationMinutes);
    const price = lessonDurationMinutes
      ? createPackageLocationPricing(pkg.title, includedCourses, lessonDurationMinutes)[location.pricingTier].amount
      : pkg.pricing[location.pricingTier].amount;
    const isTestPackage = includedCourses.length === 0;

    return {
      key: getCartItemKey("package", pkg.id, location.id),
      itemType: "package",
      productId: pkg.id,
      title: pkg.title,
      description: pkg.description,
      image: pkg.image,
      locationId: location.id,
      locationName: location.name,
      pricingTier: location.pricingTier,
      price,
      quantity,
      sessionCount: lessonSummary.totalSessions,
      sessionDetail: isTestPackage ? "No lessons included. Use this package to verify checkout." : lessonSummary.durationLabel,
      secondaryMetricLabel: "Included",
      secondaryMetricValue: isTestPackage ? "Demo checkout" : `${includedCourses.length} course items`,
      secondaryMetricDetail: isTestPackage ? "Temporary package for payment testing." : "Structured package plan.",
      levelLabel: isTestPackage ? "Test package" : "Structured package",
      editHref: `/packages/${pkg.id}`,
      customization: entry.customization,
    };
  }

  if (entry.itemType === "extra") {
    const extra = optionalExtrasById[entry.productId];

    if (!extra || typeof extra.price !== "number") {
      return null;
    }

    return {
      key: getCartItemKey("extra", extra.id, location.id),
      itemType: "extra",
      productId: extra.id,
      title: extra.title,
      description: extra.description,
      image: extra.image ?? "",
      locationId: location.id,
      locationName: location.name,
      pricingTier: location.pricingTier,
      price: extra.price,
      quantity,
      sessionCount: 0,
      sessionDetail: extra.detail ?? "Optional road test support add-on.",
      secondaryMetricLabel: "Add-on type",
      secondaryMetricValue: "Road test support",
      secondaryMetricDetail: "Optional extra",
      levelLabel: "Optional extra",
      editHref: `/extras/${extra.id}`,
    };
  }

  const course = courseCatalogById[entry.productId];

  if (!course) {
    return null;
  }

  const lessonDurationMinutes = entry.customization?.lessonDurationMinutes;
  const lessonSummary =
    lessonDurationMinutes && getCourseLessonCount(course) > 0
      ? {
          totalSessions: getCourseLessonCount(course),
          durationLabel: formatCourseLessonDuration(course, lessonDurationMinutes),
        }
      : getLessonSummary([course]);
  const price = getCoursePriceForTier(course, location.pricingTier, lessonDurationMinutes);
  const customization = (() => {
    if (course.id !== "make-your-own-class") {
      return entry.customization;
    }

    if (!entry.customization) {
      return undefined;
    }

    const baseCustomization = entry.customization.lessonDurationMinutes
      ? { lessonDurationMinutes: entry.customization.lessonDurationMinutes }
      : {};

    if (entry.customization.learningObjective) {
      return {
        ...baseCustomization,
        learningObjective: entry.customization.learningObjective,
      };
    }

    if (!entry.customization.classObjectives) {
      return Object.keys(baseCustomization).length > 0 ? baseCustomization : undefined;
    }

    return {
      ...baseCustomization,
      classObjectives: Array.from({ length: quantity }, (_, index) => {
        const classNumber = index + 1;
        const matchingObjective = entry.customization?.classObjectives?.find(
          (objective) => objective.classNumber === classNumber,
        );

        return {
          classNumber,
          objective: matchingObjective?.objective ?? "",
        };
      }),
    };
  })();

  return {
    key: getCartItemKey("course", course.id, location.id),
    itemType: "course",
    productId: course.id,
    title: course.title,
    description: course.description,
    image: course.image,
    locationId: location.id,
    locationName: location.name,
    pricingTier: location.pricingTier,
    price,
    quantity,
    sessionCount: lessonSummary.totalSessions,
    sessionDetail: course.detail || lessonSummary.durationLabel,
    secondaryMetricLabel: "Course format",
    secondaryMetricValue: course.deliveryFormat,
    secondaryMetricDetail: course.level,
    levelLabel: course.level,
    deliveryFormat: course.deliveryFormat,
    editHref: `/courses/${course.id}`,
    customization,
  };
};

export const sanitizeCartEntries = (value: unknown): CartEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const mergedEntries = new Map<string, CartEntry>();

  value.forEach((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return;
    }

    const entry = item as Partial<CartEntry> & { packageId?: unknown };
    const itemType: CartItemType =
      entry.itemType === "course" || entry.itemType === "package" || entry.itemType === "extra"
        ? entry.itemType
        : "package";
    const productId =
      typeof entry.productId === "string"
        ? entry.productId.trim()
        : typeof entry.packageId === "string"
          ? entry.packageId.trim()
          : "";
    const locationId = typeof entry.locationId === "string" ? entry.locationId.trim() : officeLocation.id;
    const customization = sanitizeCartEntryCustomization(entry.customization);
    const quantity =
      typeof entry.quantity === "number" && Number.isFinite(entry.quantity)
        ? Math.max(1, Math.floor(entry.quantity))
        : 1;

    const isValidProduct =
      itemType === "package"
        ? Boolean(packageCatalogById[productId])
        : itemType === "course"
          ? Boolean(courseCatalogById[productId])
          : Boolean(optionalExtrasById[productId]?.price);

    if (!productId || !isValidProduct) {
      return;
    }

    const normalizedLocationId = serviceLocationsById[locationId] ? locationId : officeLocation.id;
    const key = getCartItemKey(itemType, productId, normalizedLocationId);
    const existingEntry = mergedEntries.get(key);

    mergedEntries.set(key, {
      itemType,
      productId,
      locationId: normalizedLocationId,
      quantity: (existingEntry?.quantity ?? 0) + quantity,
      customization: customization ?? existingEntry?.customization,
    });
  });

  return Array.from(mergedEntries.values());
};

export const buildCartItems = (entries: CartEntry[]) =>
  entries.map((entry) => buildCartItem(entry)).filter((item): item is CartItem => Boolean(item));

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const getCartPricingSummary = (items: CartItem[]): CartPricingSummary => {
  const subtotalBeforeDiscount = roundMoney(items.reduce((total, item) => total + item.price * item.quantity, 0));
  const bundleEligibleItems = items.filter(
    (item) =>
      item.itemType === "course" &&
      item.productId !== CUSTOM_CLASS_COURSE_ID &&
      item.pricingTier !== "island",
  );
  const bundleDiscountEligibleInCarCourseCount = bundleEligibleItems.reduce((total, item) => {
    if (item.deliveryFormat === "In-class") {
      return total;
    }

    return total + item.quantity;
  }, 0);
  const bundleDiscountUnlocked =
    bundleEligibleItems.length > 0 &&
    bundleDiscountEligibleInCarCourseCount >= COURSE_BUNDLE_DISCOUNT_THRESHOLD;
  const bundleDiscountBase = roundMoney(
    bundleEligibleItems.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const bundleDiscountAmount = bundleDiscountUnlocked
    ? roundMoney(bundleDiscountBase * (COURSE_BUNDLE_DISCOUNT_PERCENT / 100))
    : 0;
  const subtotal = roundMoney(Math.max(subtotalBeforeDiscount - bundleDiscountAmount, 0));
  const estimatedTaxes = roundMoney(subtotal * ESTIMATED_GST_RATE);
  const total = roundMoney(subtotal + estimatedTaxes);

  return {
    bundleDiscountAmount,
    bundleDiscountEligibleInCarCourseCount,
    bundleDiscountPercent: bundleDiscountUnlocked ? COURSE_BUNDLE_DISCOUNT_PERCENT : 0,
    bundleDiscountRemaining: Math.max(
      COURSE_BUNDLE_DISCOUNT_THRESHOLD - bundleDiscountEligibleInCarCourseCount,
      0,
    ),
    bundleDiscountUnlocked,
    estimatedTaxes,
    subtotal,
    subtotalBeforeDiscount,
    total,
  };
};

export const getCartSubtotal = (items: CartItem[]) =>
  getCartPricingSummary(items).subtotal;

export const getCartEstimatedTaxes = (subtotal: number) =>
  roundMoney(subtotal * ESTIMATED_GST_RATE);

export const getCartTotal = (subtotal: number, estimatedTaxes: number) =>
  roundMoney(subtotal + estimatedTaxes);
