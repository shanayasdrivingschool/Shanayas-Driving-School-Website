import type { CourseCatalogItem } from "@/data/courseCatalog";
import { courseCatalog } from "@/data/courseCatalog";
import { getCourseImage } from "@/data/courseImages";
import { getCourseBasePriceForTier, getCoursePriceForTier } from "@/data/coursePricing";
import type { AdminCourseRecord } from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export const COURSE_SELECT = "id, slug, title, level, delivery_format, duration, detail, description, highlights, tone, image, quiz_tags, fixed_price, sixty_minute_classes, ninety_minute_classes, discount_percent, is_visible, display_order, created_at, updated_at";

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.map((entry) => String(entry)) : [];

const toOptionalNumber = (value: unknown) => {
  if (value === null || typeof value === "undefined") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getFallbackPublicCourses = () => courseCatalog;

export const mapCourseRowToCourseCatalogItem = (row: Record<string, unknown>): CourseCatalogItem => ({
  id: String(row.slug),
  title: String(row.title),
  level: String(row.level) as CourseCatalogItem["level"],
  deliveryFormat: String(row.delivery_format) as CourseCatalogItem["deliveryFormat"],
  duration: String(row.duration),
  detail: String(row.detail),
  description: String(row.description),
  highlights: toStringArray(row.highlights),
  tone: String(row.tone),
  image: getCourseImage(String(row.slug), String(row.image)),
  quizTags: toStringArray(row.quiz_tags),
  pricing: {
    fixedPrice: toOptionalNumber(row.fixed_price),
    sixtyMinuteClasses: Number(row.sixty_minute_classes ?? 0),
    ninetyMinuteClasses: Number(row.ninety_minute_classes ?? 0),
    discountPercent: Number(row.discount_percent ?? 0),
  },
});

export const mapCourseRowToAdminCourse = (row: Record<string, unknown>): AdminCourseRecord => {
  const course = mapCourseRowToCourseCatalogItem(row);

  return {
    ...course,
    recordId: String(row.id),
    slug: String(row.slug),
    fixedPrice: course.pricing.fixedPrice ?? null,
    sixtyMinuteClasses: course.pricing.sixtyMinuteClasses ?? 0,
    ninetyMinuteClasses: course.pricing.ninetyMinuteClasses ?? 0,
    discountPercent: course.pricing.discountPercent ?? 0,
    isVisible: Boolean(row.is_visible),
    displayOrder: Number(row.display_order ?? 0),
    basePrice: getCourseBasePriceForTier(course, "standard"),
    discountedPrice: getCoursePriceForTier(course, "standard"),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
};

export const getPublicCourses = async (): Promise<CourseCatalogItem[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return getFallbackPublicCourses();
  }

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(COURSE_SELECT)
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    if (rows.length === 0) {
      return getFallbackPublicCourses();
    }

    return rows.map(mapCourseRowToCourseCatalogItem);
  } catch {
    return getFallbackPublicCourses();
  }
};
