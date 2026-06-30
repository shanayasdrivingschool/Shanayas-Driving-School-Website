import { ArrowRight, Check, MapPin, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { courseCatalogById } from "@/data/courseCatalog";
import { formatCoursePrice } from "@/data/coursePricing";
import { optionalExtrasById } from "@/data/optionalExtras";
import { officeLocation, serviceLocations, serviceLocationsById } from "@/data/serviceLocations";
import { clearCheckoutPaymentSession } from "@/lib/checkoutPaymentSession";
import NotFound from "@/pages/NotFound";

const relatedCourseIdsByExtraId: Record<string, string[]> = {
  "car-rental": [
    "road-test-prep-course",
    "lesson-road-test-prep-course",
    "mock-test-evaluation",
  ],
};

const ExtraProductPage = () => {
  const { slug } = useParams();
  const { addExtra } = useCart();
  const { toast } = useToast();
  const extra = slug ? optionalExtrasById[slug] : undefined;
  const [selectedLocationId, setSelectedLocationId] = useState(officeLocation.id);

  const selectedLocation = serviceLocationsById[selectedLocationId] ?? officeLocation;
  const relatedCourses = useMemo(
    () =>
      (relatedCourseIdsByExtraId[extra?.id ?? ""] ?? [])
        .map((courseId) => courseCatalogById[courseId])
        .filter(Boolean),
    [extra],
  );

  if (!extra || typeof extra.price !== "number") {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    clearCheckoutPaymentSession();
    addExtra({ extraId: extra.id, locationId: selectedLocation.id });
    toast({
      title: "Extra added to cart",
      description: `${extra.title} was added for ${selectedLocation.name}.`,
    });
  };

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Optional extra"
        title={<span className="text-white">{extra.title}</span>}
        description={extra.description}
        backgroundImage={extra.image ?? ""}
        backgroundImagePosition="center"
        minHeightClassName="min-h-[420px] sm:min-h-[500px] md:min-h-[560px]"
        contentLayout="center"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Road test support</p>
            <h1 className="mt-3 text-4xl font-black text-[#1d52a1] sm:text-5xl">{extra.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{extra.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#1d52a1]/10 px-4 py-2 text-sm font-bold text-[#1d52a1]">
                Optional extra
              </span>
              {extra.formatLabel ? (
                <span className="rounded-full bg-[#F3B233]/15 px-4 py-2 text-sm font-bold text-[#B77900]">
                  {extra.formatLabel}
                </span>
              ) : null}
              {extra.detail ? (
                <span className="rounded-full bg-[#E6242A]/10 px-4 py-2 text-sm font-bold text-[#E6242A]">
                  {extra.detail}
                </span>
              ) : null}
            </div>

            {extra.highlights?.length ? (
              <div className="mt-10">
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">What this includes</h2>
                <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
                  {extra.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-4">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#1d52a1]">
                        <Check className="h-4 w-4" />
                      </span>
                      <p className="text-base leading-relaxed text-slate-600">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {extra.outlineSections?.length ? (
              <div className="mt-10">
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Booking details</h2>
                <div className="mt-6 space-y-4">
                  {extra.outlineSections.map((section) => (
                    <article key={section.title} className="rounded-3xl border border-slate-200 bg-[#F2F2F2] p-5 sm:p-6">
                      <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                      <ul className="mt-4 space-y-3">
                        {section.objectives.map((objective) => (
                          <li key={objective} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {extra.outcomes?.length ? (
              <div className="mt-10">
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Expected outcome</h2>
                <div className="mt-6 space-y-4">
                  {extra.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:pt-12 xl:pt-24">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Fixed add-on price</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">Book this extra</h2>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-3xl font-black text-slate-900">{formatCoursePrice(extra.price)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Flat pricing for the selected service area. Add it to cart and continue through the same checkout flow.
                  </p>

                  <label htmlFor="extra-location" className="mt-5 block text-sm font-bold text-slate-700">
                    Select your location
                  </label>
                  <select
                    id="extra-location"
                    value={selectedLocation.id}
                    onChange={(event) => setSelectedLocationId(event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                  >
                    {serviceLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                      <div>
                        <p className="text-sm font-black text-slate-900">{selectedLocation.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          Your selected area will be attached to this extra when it is added to the cart.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-black"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </button>
                  <Link
                    to="/cart"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-300 px-7 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                  >
                    View cart
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-5 text-xs leading-relaxed text-slate-500">
                  Availability still depends on road test timing and vehicle scheduling, but the charge flows through the same secure checkout.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedCourses.length > 0 ? (
        <section className="bg-[#F2F2F2] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Pair it with</p>
            <h2 className="mt-3 text-3xl font-black text-[#1d52a1] sm:text-4xl">Road test prep that fits this extra</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedCourses.map((course) => (
                <article key={course.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]">{course.level}</p>
                  <h3 className="mt-3 text-2xl font-black text-slate-900">{course.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>
                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
};

export default ExtraProductPage;
