export type CheckoutPricingItem = {
  itemType: "package" | "course" | "extra";
  productId: string;
  locationId: string;
  quantity: number;
  lessonDurationMinutes?: 60 | 90;
};

export type CheckoutPricingLineItem = CheckoutPricingItem & {
  deliveryFormat?: "In-class" | "In-car" | "In-class + In-car";
  lineTotal: number;
  pricingTier: PricingTier;
  productName: string;
  unitCostCents: number;
  unitPrice: number;
};

type PricingTier = "standard" | "regional" | "island";

const ESTIMATED_GST_RATE = 0.05;
const COURSE_BUNDLE_DISCOUNT_THRESHOLD = 3;
const COURSE_BUNDLE_DISCOUNT_PERCENT = 5;
const CUSTOM_CLASS_COURSE_ID = "make-your-own-class";
const STANDARD_SIXTY_MINUTE_RATE = 89;
const STANDARD_NINETY_MINUTE_RATE = 133.5;
const ISLAND_SIXTY_MINUTE_RATE = 109;
const ISLAND_NINETY_MINUTE_RATE = 163.5;

const pricingTierByLocationId: Record<string, PricingTier> = {
  sidney: "standard",
  victoria: "standard",
  colwood: "standard",
  langford: "standard",
  metchosin: "regional",
  sooke: "regional",
  duncan: "regional",
  "salt-spring-island": "island",
};

const coursePricingById = {
  "beginner-driving-course": { ninetyMinuteClasses: 10 },
  "knowledge-test-prep-course": { fixedPrice: 300 },
  "parking-course": { ninetyMinuteClasses: 3 },
  "make-your-own-class": { ninetyMinuteClasses: 1 },
  "lesson-road-test-prep-course": { ninetyMinuteClasses: 1 },
  "road-test-prep-course": { ninetyMinuteClasses: 1 },
  "new-to-canada": { ninetyMinuteClasses: 3 },
  "defensive-driving-course": { ninetyMinuteClasses: 5 },
  "refresher-driving-course": { ninetyMinuteClasses: 2 },
  "mock-test-evaluation": { sixtyMinuteClasses: 1 },
  "confidence-booster-course": { ninetyMinuteClasses: 8 },
  "advanced-driving-course": { ninetyMinuteClasses: 5 },
  "winter-driving-course": { ninetyMinuteClasses: 1 },
  "seniors-driving-course": { ninetyMinuteClasses: 1 },
} as const;

const courseDeliveryFormatById: Record<keyof typeof coursePricingById, "In-class" | "In-car" | "In-class + In-car"> = {
  "beginner-driving-course": "In-car",
  "knowledge-test-prep-course": "In-class",
  "parking-course": "In-car",
  "make-your-own-class": "In-car",
  "lesson-road-test-prep-course": "In-car",
  "road-test-prep-course": "In-car",
  "new-to-canada": "In-car",
  "defensive-driving-course": "In-car",
  "refresher-driving-course": "In-car",
  "mock-test-evaluation": "In-car",
  "confidence-booster-course": "In-car",
  "advanced-driving-course": "In-car",
  "winter-driving-course": "In-car",
  "seniors-driving-course": "In-class + In-car",
};

const courseTitleById: Record<keyof typeof coursePricingById, string> = {
  "beginner-driving-course": "Beginner's Driving Course",
  "knowledge-test-prep-course": "Knowledge Test Prep Course",
  "parking-course": "Parking Course",
  "make-your-own-class": "Make Your Own Class",
  "lesson-road-test-prep-course": "Lesson + Road Test Prep Course",
  "road-test-prep-course": "Road Test Prep Course",
  "new-to-canada": "New to Canada",
  "defensive-driving-course": "Defensive Driving Course",
  "refresher-driving-course": "Refresher Driving Course",
  "mock-test-evaluation": "Mock Test Evaluation",
  "confidence-booster-course": "Confidence Booster Course",
  "advanced-driving-course": "Advanced Driving Course",
  "winter-driving-course": "Winter Driving Course",
  "seniors-driving-course": "Enhanced Road Assessment",
};

const packageCourseIdsById: Record<string, readonly string[]> = {
  "fresh-start": [
    "knowledge-test-prep-course",
    "beginner-driving-course",
    "parking-course",
    "make-your-own-class",
  ],
  "skill-builder": [
    "defensive-driving-course",
    "refresher-driving-course",
    "new-to-canada",
    "parking-course",
    "road-test-prep-course",
    "lesson-road-test-prep-course",
    "mock-test-evaluation",
    "make-your-own-class",
  ],
  "final-lap": [
    "confidence-booster-course",
    "refresher-driving-course",
    "advanced-driving-course",
    "road-test-prep-course",
    "lesson-road-test-prep-course",
    "mock-test-evaluation",
  ],
};

const packageTitleById: Record<string, string> = {
  "checkout-demo": "Checkout Demo",
  "fresh-start": "Fresh Start",
  "skill-builder": "Skill Builder",
  "final-lap": "Final Lap",
};

const fixedPackagePricingById: Record<string, Record<PricingTier, number>> = {
  "checkout-demo": {
    standard: 1,
    regional: 1,
    island: 1,
  },
};

const extraPricingById: Record<string, number> = {
  "car-rental": 250,
};

const extraTitleById: Record<string, string> = {
  "car-rental": "Car Rental",
};

const roundMoney = (value: number) => Number(value.toFixed(2));
const toCents = (value: number) => Math.round(value * 100);

const getPricingTier = (locationId: string): PricingTier => pricingTierByLocationId[locationId] ?? "standard";

const getCourseBasePrice = (
  pricing: {
    fixedPrice?: number;
    sixtyMinuteClasses?: number;
    ninetyMinuteClasses?: number;
  },
  tier: PricingTier,
  lessonDurationMinutes?: 60 | 90,
) => {
  if (typeof pricing.fixedPrice === "number") {
    return roundMoney(pricing.fixedPrice);
  }

  const sixtyMinuteRate = tier === "island" ? ISLAND_SIXTY_MINUTE_RATE : STANDARD_SIXTY_MINUTE_RATE;
  const ninetyMinuteRate = tier === "island" ? ISLAND_NINETY_MINUTE_RATE : STANDARD_NINETY_MINUTE_RATE;

  if (lessonDurationMinutes) {
    const lessonCount = (pricing.sixtyMinuteClasses ?? 0) + (pricing.ninetyMinuteClasses ?? 0);
    return roundMoney(lessonCount * (lessonDurationMinutes === 60 ? sixtyMinuteRate : ninetyMinuteRate));
  }

  return roundMoney(
    (pricing.sixtyMinuteClasses ?? 0) * sixtyMinuteRate +
      (pricing.ninetyMinuteClasses ?? 0) * ninetyMinuteRate,
  );
};

const getCourseUnitPrice = (courseId: string, tier: PricingTier, lessonDurationMinutes?: 60 | 90) => {
  const pricing = coursePricingById[courseId as keyof typeof coursePricingById];
  if (!pricing) {
    throw new Error("invalid_product_id");
  }

  return getCourseBasePrice(pricing, tier, lessonDurationMinutes);
};

const getPackageUnitPrice = (packageId: string, tier: PricingTier, lessonDurationMinutes?: 60 | 90) => {
  const fixedPricing = fixedPackagePricingById[packageId];
  if (fixedPricing) {
    return roundMoney(fixedPricing[tier]);
  }

  const courseIds = packageCourseIdsById[packageId];
  if (!courseIds) {
    throw new Error("invalid_product_id");
  }

  return roundMoney(
    courseIds.reduce(
      (total, courseId) => total + getCourseUnitPrice(courseId, tier, lessonDurationMinutes),
      0,
    ),
  );
};

const getProductName = (itemType: CheckoutPricingItem["itemType"], productId: string) => {
  if (itemType === "extra") {
    const extraTitle = extraTitleById[productId];
    if (!extraTitle) {
      throw new Error("invalid_product_id");
    }

    return extraTitle;
  }

  if (itemType === "course") {
    const courseTitle = courseTitleById[productId as keyof typeof courseTitleById];
    if (!courseTitle) {
      throw new Error("invalid_product_id");
    }

    return courseTitle;
  }

  const packageTitle = packageTitleById[productId];
  if (!packageTitle) {
    throw new Error("invalid_product_id");
  }

  return packageTitle;
};

const asItemType = (value: unknown): CheckoutPricingItem["itemType"] => {
  if (value === "package" || value === "course" || value === "extra") {
    return value;
  }

  throw new Error("invalid_item_type");
};

const asRequiredString = (value: unknown) => {
  if (typeof value !== "string") {
    throw new Error("invalid_string");
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("invalid_string");
  }

  return trimmed;
};

const asQuantity = (value: unknown) => {
  const quantity =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim().length > 0
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("invalid_quantity");
  }

  return Math.max(1, Math.floor(quantity));
};

const asLessonDurationMinutes = (value: unknown): 60 | 90 | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const duration = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  if (duration === 60 || duration === 90) {
    return duration;
  }

  throw new Error("invalid_lesson_duration");
};

const getExtraUnitPrice = (extraId: string) => {
  const price = extraPricingById[extraId];
  if (typeof price !== "number") {
    throw new Error("invalid_product_id");
  }

  return roundMoney(price);
};

export const normalizeCheckoutPricingItems = (value: unknown): CheckoutPricingItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("invalid_items");
  }

  return value.map((rawItem) => {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
      throw new Error("invalid_item");
    }

    const item = rawItem as Record<string, unknown>;

    return {
      itemType: asItemType(item.itemType ?? item.item_type),
      productId: asRequiredString(item.productId ?? item.product_id),
      locationId: asRequiredString(item.locationId ?? item.location_id),
      quantity: asQuantity(item.quantity),
      lessonDurationMinutes: asLessonDurationMinutes(item.lessonDurationMinutes ?? item.lesson_duration_minutes),
    };
  });
};

export const calculateCheckoutTotals = (items: CheckoutPricingItem[]) => {
  const normalizedItems = normalizeCheckoutPricingItems(items);
  const lineItems: CheckoutPricingLineItem[] = normalizedItems.map((item) => {
    const pricingTier = getPricingTier(item.locationId);
    const unitPrice =
      item.itemType === "package"
        ? getPackageUnitPrice(item.productId, pricingTier, item.lessonDurationMinutes)
        : item.itemType === "course"
          ? getCourseUnitPrice(item.productId, pricingTier, item.lessonDurationMinutes)
          : getExtraUnitPrice(item.productId);

    return {
      ...item,
      deliveryFormat:
        item.itemType === "course"
          ? courseDeliveryFormatById[item.productId as keyof typeof courseDeliveryFormatById]
          : undefined,
      lineTotal: roundMoney(unitPrice * item.quantity),
      pricingTier,
      productName: getProductName(item.itemType, item.productId),
      unitCostCents: toCents(unitPrice),
      unitPrice,
    };
  });

  const subtotalBeforeDiscount = roundMoney(lineItems.reduce((total, item) => total + item.lineTotal, 0));
  const bundleEligibleLineItems = lineItems.filter(
    (item) =>
      item.itemType === "course" &&
      item.productId !== CUSTOM_CLASS_COURSE_ID &&
      item.pricingTier !== "island",
  );
  const bundleDiscountEligibleInCarCourseCount = bundleEligibleLineItems.reduce((total, item) => {
    if (item.deliveryFormat === "In-class") {
      return total;
    }

    return total + item.quantity;
  }, 0);
  const bundleDiscountUnlocked =
    bundleEligibleLineItems.length > 0 &&
    bundleDiscountEligibleInCarCourseCount >= COURSE_BUNDLE_DISCOUNT_THRESHOLD;
  const bundleDiscountBase = roundMoney(
    bundleEligibleLineItems.reduce((total, item) => total + item.lineTotal, 0),
  );
  const bundleDiscountAmount = bundleDiscountUnlocked
    ? roundMoney(bundleDiscountBase * (COURSE_BUNDLE_DISCOUNT_PERCENT / 100))
    : 0;
  const subtotal = roundMoney(Math.max(subtotalBeforeDiscount - bundleDiscountAmount, 0));

  const estimatedTaxes = roundMoney(subtotal * ESTIMATED_GST_RATE);
  const total = roundMoney(subtotal + estimatedTaxes);

  return {
    items: normalizedItems,
    lineItems,
    bundleDiscountAmount,
    bundleDiscountEligibleInCarCourseCount,
    bundleDiscountPercent: bundleDiscountUnlocked ? COURSE_BUNDLE_DISCOUNT_PERCENT : 0,
    subtotal,
    subtotalBeforeDiscount,
    estimatedTaxes,
    total,
  };
};
