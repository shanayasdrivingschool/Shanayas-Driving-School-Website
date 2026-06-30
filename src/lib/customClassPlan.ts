import type { CartEntryCustomization, CustomClassObjective } from "@/lib/cart";
import type { LessonDurationMinutes } from "@/data/productTypes";
import { sanitizeCartEntryCustomization } from "@/lib/cart";

export const CUSTOM_CLASS_PLAN_STORAGE_KEY = "driving-school-custom-class-plan.v1";

export type CustomClassPlan = {
  courseId: string;
  locationId: string;
  quantity: number;
  lessonDurationMinutes?: LessonDurationMinutes;
  learningObjective: string;
  objectives: CustomClassObjective[];
  updatedAt: string;
};

const normalizeQuantity = (value: unknown) => {
  const quantity = typeof value === "number" && Number.isFinite(value) ? value : 1;
  return Math.min(20, Math.max(1, Math.floor(quantity)));
};

export const buildCustomClassCustomization = (
  learningObjective: string,
  lessonDurationMinutes?: LessonDurationMinutes,
): CartEntryCustomization | undefined => {
  return sanitizeCartEntryCustomization({ learningObjective, lessonDurationMinutes });
};

export const writeCustomClassPlan = ({
  courseId,
  locationId,
  quantity,
  lessonDurationMinutes,
  learningObjective,
}: {
  courseId: string;
  locationId: string;
  quantity: number;
  lessonDurationMinutes?: LessonDurationMinutes;
  learningObjective: string;
}) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedQuantity = normalizeQuantity(quantity);
  const normalizedLearningObjective = learningObjective.trim();
  const classObjectives = normalizedLearningObjective
    ? [
        {
          classNumber: 1,
          objective: normalizedLearningObjective,
        },
      ]
    : [];
  const plan: CustomClassPlan = {
    courseId,
    locationId,
    quantity: normalizedQuantity,
    ...(lessonDurationMinutes ? { lessonDurationMinutes } : {}),
    learningObjective: normalizedLearningObjective,
    objectives: classObjectives,
    updatedAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(CUSTOM_CLASS_PLAN_STORAGE_KEY, JSON.stringify(plan));
};

export const readCustomClassPlan = (courseId: string, locationId: string): CustomClassPlan | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CUSTOM_CLASS_PLAN_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CustomClassPlan>;
    if (parsed.courseId !== courseId || parsed.locationId !== locationId) {
      return null;
    }

    const legacyCustomization = sanitizeCartEntryCustomization({ classObjectives: parsed.objectives });
    const legacyLearningObjective = legacyCustomization?.classObjectives?.find((item) => item.objective)?.objective ?? "";
    const learningObjective =
      typeof parsed.learningObjective === "string" ? parsed.learningObjective.trim() : legacyLearningObjective;
    const customization = sanitizeCartEntryCustomization({ classObjectives: parsed.objectives });

    return {
      courseId,
      locationId,
      quantity: normalizeQuantity(parsed.quantity),
      lessonDurationMinutes:
        parsed.lessonDurationMinutes === 60 || parsed.lessonDurationMinutes === 90
          ? parsed.lessonDurationMinutes
          : undefined,
      learningObjective,
      objectives: customization?.classObjectives ?? [],
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
};
