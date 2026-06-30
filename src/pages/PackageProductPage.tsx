import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailTemplate from "@/components/ProductDetailTemplate";
import { createPackageLocationPricing, isCourseLessonDurationSelectable } from "@/data/coursePricing";
import { packageCatalog, packageCatalogById } from "@/data/packageCatalog";
import type { LessonDurationMinutes } from "@/data/productTypes";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { officeLocation, serviceLocations, serviceLocationsById } from "@/data/serviceLocations";
import NotFound from "@/pages/NotFound";

const PackageProductPage = () => {
  const { slug } = useParams();
  const product = slug ? packageCatalogById[slug] : undefined;
  const coursesQuery = usePublicCourses();
  const courses = coursesQuery.data;
  const courseById = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])) as Record<string, (typeof courses)[number]>,
    [courses],
  );
  const [selectedLocationId, setSelectedLocationId] = useState(officeLocation.id);
  const [selectedLessonDuration, setSelectedLessonDuration] = useState<LessonDurationMinutes>(90);

  if (!product) {
    return <NotFound />;
  }

  const selectedLocation = serviceLocationsById[selectedLocationId] ?? officeLocation;
  const includedCourses = product.includedCourseIds
    .map((courseId) => courseById[courseId])
    .filter((course) => Boolean(course));
  const canSelectLessonDuration = includedCourses.some((course) => isCourseLessonDurationSelectable(course));
  const pricing = canSelectLessonDuration
    ? createPackageLocationPricing(product.title, includedCourses, selectedLessonDuration)[selectedLocation.pricingTier]
    : product.pricing[selectedLocation.pricingTier];
  const checkoutParams = new URLSearchParams({
    package: product.id,
    location: selectedLocation.id,
  });

  if (canSelectLessonDuration) {
    checkoutParams.set("duration", String(selectedLessonDuration));
  }
  const otherPackages = packageCatalog
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: `/packages/${item.id}`,
      meta: `${item.includedCourseIds.length} course items`,
    }));

  return (
    <ProductDetailTemplate
      eyebrow="Package path"
      title={product.title}
      description={product.heroDescription}
      backgroundImage={product.image}
      sectionLabel="Package"
      detailLabel={`${product.includedCourseIds.length} course items`}
      levelLabel="Structured package"
      highlights={product.overview}
      outlineSections={product.outlineSections}
      outcomes={product.outcomes}
      stats={[]}
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
                    onClick={() => setSelectedLessonDuration(duration)}
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
      itemsSectionEyebrow="What's Included"
      itemsSectionTitle="Courses in this package"
      itemsSectionDescription="Every package page keeps the included courses visible so students can see exactly what is bundled into the plan before booking."
      items={includedCourses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        meta: `${course.level} | ${course.detail}`,
        href: `/courses/${course.id}`,
      }))}
      browseSectionTitle="Compare other package options"
      browseItems={otherPackages}
      primaryCta={{
        label: "Proceed to checkout",
        href: `/checkout?${checkoutParams.toString()}`,
      }}
      secondaryCta={{
        label: "Contact us",
        href: "/contact",
      }}
    />
  );
};

export default PackageProductPage;
