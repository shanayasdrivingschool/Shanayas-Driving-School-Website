import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/components/cart/CartProvider";
import ProductDetailTemplate from "@/components/ProductDetailTemplate";
import {
  createCourseLocationPricing,
  formatCourseLessonDuration,
  formatCoursePrice,
  getDefaultCourseLessonDuration,
  isCourseLessonDurationSelectable,
} from "@/data/coursePricing";
import { courseModulesById } from "@/data/courseModules";
import { packageCatalog } from "@/data/packageCatalog";
import type { LessonDurationMinutes } from "@/data/productTypes";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { useToast } from "@/hooks/use-toast";
import { officeLocation, serviceLocations, serviceLocationsById } from "@/data/serviceLocations";
import { clearCheckoutPaymentSession } from "@/lib/checkoutPaymentSession";
import { sanitizeCartEntryCustomization } from "@/lib/cart";
import { buildCustomClassCustomization, writeCustomClassPlan } from "@/lib/customClassPlan";
import NotFound from "@/pages/NotFound";

const CUSTOM_CLASS_COURSE_ID = "make-your-own-class";
const MIN_CUSTOM_CLASS_COUNT = 1;
const MAX_CUSTOM_CLASS_COUNT = 12;

const CourseProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addCourse } = useCart();
  const { toast } = useToast();
  const coursesQuery = usePublicCourses();
  const courses = coursesQuery.data;
  const courseById = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])) as Record<string, (typeof courses)[number]>,
    [courses],
  );
  const course = slug ? courseById[slug] : undefined;
  const [selectedLocationId, setSelectedLocationId] = useState(officeLocation.id);
  const [selectedClassCount, setSelectedClassCount] = useState(1);
  const [selectedLessonDurationOverride, setSelectedLessonDurationOverride] =
    useState<LessonDurationMinutes | null>(null);
  const [learningObjective, setLearningObjective] = useState("");

  if (!course) {
    return <NotFound />;
  }

  const isCustomClassCourse = course.id === CUSTOM_CLASS_COURSE_ID;
  const canSelectLessonDuration = isCourseLessonDurationSelectable(course);
  const selectedLessonDuration = canSelectLessonDuration
    ? selectedLessonDurationOverride ?? getDefaultCourseLessonDuration(course)
    : undefined;
  const pricingMap = createCourseLocationPricing(course, selectedLessonDuration);
  const selectedLocation = serviceLocationsById[selectedLocationId] ?? officeLocation;
  const pricing = pricingMap[selectedLocation.pricingTier];
  const outlineSections = courseModulesById[course.id] ?? [];
  const totalCustomClassEstimate = pricing.amount * selectedClassCount;
  const customClassCustomization = isCustomClassCourse
    ? buildCustomClassCustomization(learningObjective, selectedLessonDuration)
    : undefined;
  const courseCustomization = sanitizeCartEntryCustomization({
    lessonDurationMinutes: selectedLessonDuration,
    ...(isCustomClassCourse ? { learningObjective } : {}),
  });
  const lessonDurationLabel = formatCourseLessonDuration(course, selectedLessonDuration);

  const updateSelectedClassCount = (nextCount: number) => {
    const normalizedCount = Math.min(
      MAX_CUSTOM_CLASS_COUNT,
      Math.max(MIN_CUSTOM_CLASS_COUNT, Number.isFinite(nextCount) ? Math.floor(nextCount) : MIN_CUSTOM_CLASS_COUNT),
    );

    setSelectedClassCount(normalizedCount);
  };

  const rememberCustomClassPlan = () => {
    if (!isCustomClassCourse) {
      return;
    }

    writeCustomClassPlan({
      courseId: course.id,
      locationId: selectedLocation.id,
      quantity: selectedClassCount,
      lessonDurationMinutes: selectedLessonDuration,
      learningObjective,
    });
  };

  const handleAddToCart = () => {
    clearCheckoutPaymentSession();
    rememberCustomClassPlan();
    addCourse({
      courseId: course.id,
      locationId: selectedLocation.id,
      quantity: isCustomClassCourse ? selectedClassCount : undefined,
      customization: isCustomClassCourse ? customClassCustomization : courseCustomization,
    });
    toast({
      title: "Course added to cart",
      description: isCustomClassCourse
        ? `${selectedClassCount} custom ${selectedClassCount === 1 ? "class was" : "classes were"} added for ${selectedLocation.name}.`
        : `${course.title} was added for ${selectedLocation.name}.`,
    });
  };
  const handleBuyNow = () => {
    clearCheckoutPaymentSession();
    rememberCustomClassPlan();
    const searchParams = new URLSearchParams({
      course: course.id,
      location: selectedLocation.id,
    });

    if (isCustomClassCourse) {
      searchParams.set("quantity", String(selectedClassCount));
    }

    if (selectedLessonDuration) {
      searchParams.set("duration", String(selectedLessonDuration));
    }

    navigate(`/checkout?${searchParams.toString()}`);
  };
  const relatedCourses = courses
    .filter((candidate) => candidate.id !== course.id)
    .map((candidate) => {
      const sharedTags = candidate.quizTags.filter((tag) => course.quizTags.includes(tag)).length;
      const sameLevelScore = candidate.level === course.level ? 2 : 0;
      return {
        course: candidate,
        score: sharedTags + sameLevelScore,
      };
    })
    .sort((left, right) => right.score - left.score || left.course.title.localeCompare(right.course.title))
    .slice(0, 3)
    .map(({ course: candidate }) => candidate);
  const pairedPackages = packageCatalog
    .filter((pkg) => pkg.includedCourseIds.includes(course.id))
    .slice(0, 3)
    .map((pkg) => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      href: `/packages/${pkg.id}`,
      meta: `${pkg.includedCourseIds.length} course items`,
    }));
  const browsePackages =
    pairedPackages.length > 0
      ? pairedPackages
      : packageCatalog.slice(0, 3).map((pkg) => ({
          id: pkg.id,
          title: pkg.title,
          description: pkg.description,
          href: `/packages/${pkg.id}`,
          meta: `${pkg.includedCourseIds.length} course items`,
        }));

  const outcomes = [
    `Build stronger ${course.highlights[0]?.toLowerCase() ?? "driving habits"} with guided repetition and instructor feedback.`,
    `Use ${course.title.toLowerCase()} to improve confidence in the exact situations that are slowing progress down.`,
    `Finish the course with a clearer next-step plan for practice, test preparation, or further skill-building.`,
  ];

  return (
    <ProductDetailTemplate
      eyebrow="Course detail"
      title={course.title}
      description={course.description}
      backgroundImage={course.image}
      heroImagePosition="center 38%"
      sectionLabel="Course"
      detailLabel={course.detail}
      levelLabel={course.level}
      formatLabel={course.deliveryFormat}
      highlights={course.highlights}
      outlineSections={outlineSections}
      outcomes={outcomes}
      stats={[
        { label: "Course level", value: course.level },
        { label: "Lesson duration", value: lessonDurationLabel },
      ]}
      locationOptions={serviceLocations}
      selectedLocationId={selectedLocation.id}
      onLocationChange={setSelectedLocationId}
      pricing={pricing}
      selectedLocation={selectedLocation}
      lessonDurationSelector={
        canSelectLessonDuration ? (
          <div>
            <p className="text-sm font-bold text-slate-700">Class duration</p>
            <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Class duration">
              {([60, 90] as const).map((duration) => {
                const isSelected = selectedLessonDuration === duration;

                return (
                  <button
                    key={duration}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedLessonDurationOverride(duration)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black transition-colors ${
                      isSelected
                        ? "border-[#1d52a1] bg-[#1d52a1]/10 text-[#1d52a1]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#1d52a1]/40 hover:text-[#1d52a1]"
                    }`}
                  >
                    {duration}-minute class
                  </button>
                );
              })}
            </div>
          </div>
        ) : undefined
      }
      purchaseConfigurator={
        isCustomClassCourse ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Choose classes and learning objective</h3>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900">Number of classes</p>
                </div>

                <div className="inline-flex items-center self-start rounded-full bg-white px-1 py-1 shadow-[inset_0_0_0_1px_rgba(226,232,240,1)] sm:self-auto">
                  <button
                    type="button"
                    onClick={() => updateSelectedClassCount(selectedClassCount - 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1d52a1]"
                    aria-label="Decrease custom class count"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-black text-slate-900">
                    {selectedClassCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateSelectedClassCount(selectedClassCount + 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1d52a1]"
                    aria-label="Increase custom class count"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-600">Estimated total before tax</span>
                <span className="text-xl font-black text-slate-900">
                  {formatCoursePrice(totalCustomClassEstimate)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-sm font-black text-slate-900">
                  Learning objective <span className="font-semibold text-slate-500">(optional)</span>
                </span>
                <textarea
                  value={learningObjective}
                  onChange={(event) => setLearningObjective(event.target.value)}
                  placeholder="Write what you want to learn or improve"
                  maxLength={500}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#1d52a1]"
                />
              </label>
            </div>
          </section>
        ) : null
      }
      itemsSectionEyebrow="Pair"
      itemsSectionTitle="Courses that pair well with this one"
      itemsSectionDescription="Use the same detail-page pattern to move between related course pages and build a cleaner lesson sequence."
      items={relatedCourses.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        meta: `${item.level} | ${item.detail}`,
        href: `/courses/${item.id}`,
      }))}
      browseSectionTitle="Packages that include this course"
      browseItems={browsePackages}
      primaryCta={{
        label: "Buy now",
        onClick: handleBuyNow,
      }}
      secondaryCta={{
        label: "Add to cart",
        onClick: handleAddToCart,
      }}
    />
  );
};

export default CourseProductPage;
