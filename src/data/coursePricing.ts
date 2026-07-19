import type { CourseCatalogItem } from "@/data/courseCatalog";
import type {
  LessonDurationMinutes,
  ProductLocationPricing,
  ProductLocationPricingMap,
  ProductPricingTier,
} from "@/data/productTypes";

export const STANDARD_SIXTY_MINUTE_RATE = 89;
export const STANDARD_NINETY_MINUTE_RATE = 133.5;
export const ISLAND_SIXTY_MINUTE_RATE = 109;
export const ISLAND_NINETY_MINUTE_RATE = 163.5;

const rateByTier: Record<ProductPricingTier, { sixtyMinute: number; ninetyMinute: number }> = {
  standard: {
    sixtyMinute: STANDARD_SIXTY_MINUTE_RATE,
    ninetyMinute: STANDARD_NINETY_MINUTE_RATE,
  },
  regional: {
    sixtyMinute: STANDARD_SIXTY_MINUTE_RATE,
    ninetyMinute: STANDARD_NINETY_MINUTE_RATE,
  },
  island: {
    sixtyMinute: ISLAND_SIXTY_MINUTE_RATE,
    ninetyMinute: ISLAND_NINETY_MINUTE_RATE,
  },
};

const badgeByTier: Record<ProductPricingTier, string> = {
  standard: "Standard service area",
  regional: "Regional service area",
  island: "Island service area",
};

const areaNamesByTier: Record<ProductPricingTier, string> = {
  standard: "Langford, Victoria, Colwood, and Sidney",
  regional: "Metchosin, Sooke, and Duncan",
  island: "Salt Spring Island",
};

const scheduleByTier: Record<ProductPricingTier, string> = {
  standard: "",
  regional: "Regional lessons are best booked earlier to secure the preferred instructor window.",
  island: "Island bookings are confirmed manually around instructor routing and ferry timing.",
};

export const formatCoursePrice = (amount: number) => {
  const hasCents = !Number.isInteger(amount);
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

const getCourseDiscountPercent = (course: CourseCatalogItem) => Math.max(0, Math.min(course.pricing.discountPercent ?? 0, 100));

export const getCourseLessonCount = (course: CourseCatalogItem) =>
  (course.pricing.sixtyMinuteClasses ?? 0) + (course.pricing.ninetyMinuteClasses ?? 0);

export const isCourseLessonDurationSelectable = (course: CourseCatalogItem) =>
  course.pricing.fixedPrice === undefined && getCourseLessonCount(course) > 0;

export const getDefaultCourseLessonDuration = (course: CourseCatalogItem): LessonDurationMinutes =>
  (course.pricing.sixtyMinuteClasses ?? 0) > 0 && (course.pricing.ninetyMinuteClasses ?? 0) === 0 ? 60 : 90;

const getLessonRateForTier = (tier: ProductPricingTier, lessonDurationMinutes: LessonDurationMinutes) => {
  const rates = rateByTier[tier];
  return lessonDurationMinutes === 60 ? rates.sixtyMinute : rates.ninetyMinute;
};

export const formatCourseLessonDuration = (
  course: CourseCatalogItem,
  lessonDurationMinutes?: LessonDurationMinutes,
) => {
  if (!lessonDurationMinutes || !isCourseLessonDurationSelectable(course)) {
    return course.duration;
  }

  const lessonCount = getCourseLessonCount(course);
  return `${lessonCount} x ${lessonDurationMinutes} min ${lessonCount === 1 ? "class" : "classes"}`;
};

export const getCourseBasePriceForTier = (
  course: CourseCatalogItem,
  tier: ProductPricingTier,
  lessonDurationMinutes?: LessonDurationMinutes,
) => {
  if (course.pricing.fixedPrice !== undefined) {
    return Number(course.pricing.fixedPrice.toFixed(2));
  }

  if (lessonDurationMinutes) {
    const durationPrice =
      lessonDurationMinutes === 60 ? course.pricing.sixtyMinutePrice : course.pricing.ninetyMinutePrice;
    if (durationPrice !== undefined) {
      return Number(durationPrice.toFixed(2));
    }

    return Number((getCourseLessonCount(course) * getLessonRateForTier(tier, lessonDurationMinutes)).toFixed(2));
  }

  if (course.pricing.sixtyMinutePrice !== undefined && (course.pricing.ninetyMinuteClasses ?? 0) === 0) {
    return Number(course.pricing.sixtyMinutePrice.toFixed(2));
  }

  if (course.pricing.ninetyMinutePrice !== undefined && (course.pricing.sixtyMinuteClasses ?? 0) === 0) {
    return Number(course.pricing.ninetyMinutePrice.toFixed(2));
  }

  const rates = rateByTier[tier];
  const total =
    (course.pricing.sixtyMinuteClasses ?? 0) * rates.sixtyMinute +
    (course.pricing.ninetyMinuteClasses ?? 0) * rates.ninetyMinute;

  return Number(total.toFixed(2));
};

export const getCoursePriceForTier = (
  course: CourseCatalogItem,
  tier: ProductPricingTier,
  lessonDurationMinutes?: LessonDurationMinutes,
) => {
  const basePrice = getCourseBasePriceForTier(course, tier, lessonDurationMinutes);
  const discountPercent = getCourseDiscountPercent(course);
  const discountedPrice = basePrice * (1 - discountPercent / 100);
  return Number(discountedPrice.toFixed(2));
};

const getCombinedCourseBasePriceForTier = (
  courses: CourseCatalogItem[],
  tier: ProductPricingTier,
  lessonDurationMinutes?: LessonDurationMinutes,
) =>
  Number(
    courses
      .reduce((total, course) => total + getCourseBasePriceForTier(course, tier, lessonDurationMinutes), 0)
      .toFixed(2),
  );

const getCombinedCoursePriceForTier = (
  courses: CourseCatalogItem[],
  tier: ProductPricingTier,
  lessonDurationMinutes?: LessonDurationMinutes,
) =>
  Number(
    courses
      .reduce((total, course) => total + getCoursePriceForTier(course, tier, lessonDurationMinutes), 0)
      .toFixed(2),
  );

const createLocationPricingEntry = (
  productLabel: string,
  tier: ProductPricingTier,
  basePrice: number,
  finalPrice: number,
  discountPercent: number,
  itemType: "course" | "package",
): ProductLocationPricing => {
  const hasDiscount = finalPrice < basePrice;
  const discountedNote = hasDiscount
    ? `${productLabel} is offered at a discounted ${itemType} price of ${formatCoursePrice(finalPrice)} from ${formatCoursePrice(basePrice)} for ${areaNamesByTier[tier]} bookings.`
    : `${productLabel} is offered at a full ${itemType} price of ${formatCoursePrice(finalPrice)} for ${areaNamesByTier[tier]} bookings.`;

  return {
    badge: badgeByTier[tier],
    amount: finalPrice,
    label: formatCoursePrice(finalPrice),
    originalAmount: hasDiscount ? basePrice : undefined,
    originalLabel: hasDiscount ? formatCoursePrice(basePrice) : undefined,
    discountPercent: hasDiscount ? discountPercent : undefined,
    note: discountedNote,
    schedule: scheduleByTier[tier],
  };
};

export const createCourseLocationPricing = (
  course: CourseCatalogItem,
  lessonDurationMinutes?: LessonDurationMinutes,
): ProductLocationPricingMap => ({
  standard: createLocationPricingEntry(
    course.title,
    "standard",
    getCourseBasePriceForTier(course, "standard", lessonDurationMinutes),
    getCoursePriceForTier(course, "standard", lessonDurationMinutes),
    getCourseDiscountPercent(course),
    "course",
  ),
  regional: createLocationPricingEntry(
    course.title,
    "regional",
    getCourseBasePriceForTier(course, "regional", lessonDurationMinutes),
    getCoursePriceForTier(course, "regional", lessonDurationMinutes),
    getCourseDiscountPercent(course),
    "course",
  ),
  island: createLocationPricingEntry(
    course.title,
    "island",
    getCourseBasePriceForTier(course, "island", lessonDurationMinutes),
    getCoursePriceForTier(course, "island", lessonDurationMinutes),
    getCourseDiscountPercent(course),
    "course",
  ),
});

export const createPackageLocationPricing = (
  packageTitle: string,
  courses: CourseCatalogItem[],
  lessonDurationMinutes?: LessonDurationMinutes,
): ProductLocationPricingMap => ({
  standard: createLocationPricingEntry(
    packageTitle,
    "standard",
    getCombinedCourseBasePriceForTier(courses, "standard", lessonDurationMinutes),
    getCombinedCoursePriceForTier(courses, "standard", lessonDurationMinutes),
    0,
    "package",
  ),
  regional: createLocationPricingEntry(
    packageTitle,
    "regional",
    getCombinedCourseBasePriceForTier(courses, "regional", lessonDurationMinutes),
    getCombinedCoursePriceForTier(courses, "regional", lessonDurationMinutes),
    0,
    "package",
  ),
  island: createLocationPricingEntry(
    packageTitle,
    "island",
    getCombinedCourseBasePriceForTier(courses, "island", lessonDurationMinutes),
    getCombinedCoursePriceForTier(courses, "island", lessonDurationMinutes),
    0,
    "package",
  ),
});
