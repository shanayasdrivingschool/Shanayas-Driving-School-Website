export type ProductPricingTier = "standard" | "regional" | "island";
export type LessonDurationMinutes = 60 | 90;

export type ProductOutlineSection = {
  title: string;
  objectives: string[];
};

export type ProductLocationPricing = {
  badge: string;
  amount: number;
  label: string;
  note: string;
  schedule: string;
  originalAmount?: number;
  originalLabel?: string;
  discountPercent?: number;
};

export type ProductLocationPricingMap = Record<ProductPricingTier, ProductLocationPricing>;
