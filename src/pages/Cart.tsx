import { ArrowRight, ChevronDown, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/use-toast";
import { courseCatalog, courseCatalogById } from "@/data/courseCatalog";
import "./booking-flow.css";
import { getCoursePriceForTier } from "@/data/coursePricing";
import { optionalExtras, type OptionalExtra } from "@/data/optionalExtras";
import { getPackageIncludedCourses } from "@/data/packageCatalog";
import { officeLocation } from "@/data/serviceLocations";
import { ESTIMATED_GST_RATE } from "@/lib/cart";
import { clearCheckoutPaymentSession } from "@/lib/checkoutPaymentSession";

const formatCoursePrice = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format;

type ExtraRecommendation = Omit<OptionalExtra, "price"> & {
  cartItemType: "course" | "extra" | null;
  cartProductId: string | null;
  price: number | null;
  mappedCourseTitle: string | null;
  viewHref: string;
  isAlreadyInCart: boolean;
};

const quantityButtonClass =
  "inline-flex h-[44px] w-[44px] items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/80 hover:text-[#1d52a1]";

const Cart = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { items, pricingSummary, estimatedTaxes, total, addCourse, addExtra, removeItem, updateQuantity } = useCart();
  const hasItems = items.length > 0;
  const gstLabel = `Estimated GST (${Math.round(ESTIMATED_GST_RATE * 100)}%)`;
  const defaultLocationId = items[0]?.locationId ?? officeLocation.id;
  const defaultPricingTier = items[0]?.pricingTier ?? "standard";
  const focusCourseIds = Array.from(
    new Set(
      items.flatMap((item) =>
        item.itemType === "course" ? [item.productId] : getPackageIncludedCourses(item.productId).map((course) => course.id),
      ),
    ),
  );
  const focusCourses = focusCourseIds.map((courseId) => courseCatalogById[courseId]).filter(Boolean);
  const excludedCourseIds = new Set(focusCourseIds);
  const relatedCourses = courseCatalog
    .filter((course) => !excludedCourseIds.has(course.id))
    .map((course) => {
      const sharedTagScore = focusCourses.reduce(
        (score, focusCourse) => score + focusCourse.quizTags.filter((tag) => course.quizTags.includes(tag)).length,
        0,
      );
      const sameLevelScore = focusCourses.reduce((score, focusCourse) => score + (focusCourse.level === course.level ? 2 : 0), 0);

      return {
        course,
        score: sharedTagScore + sameLevelScore,
      };
    })
    .sort((left, right) => right.score - left.score || left.course.title.localeCompare(right.course.title))
    .slice(0, 3)
    .map(({ course }) => course);
  const optionalExtraRecommendations = optionalExtras.flatMap<ExtraRecommendation>((extra) => {
    if (extra.courseId) {
      const mappedCourse = courseCatalogById[extra.courseId];
      if (!mappedCourse) {
        return [];
      }

      return [
        {
          ...extra,
          cartItemType: "course" as const,
          cartProductId: mappedCourse.id,
          price: getCoursePriceForTier(mappedCourse, defaultPricingTier),
          mappedCourseTitle: mappedCourse.title,
          viewHref: `/courses/${mappedCourse.id}`,
          isAlreadyInCart: items.some((item) => item.itemType === "course" && item.productId === mappedCourse.id),
        },
      ];
    }

    if (typeof extra.price === "number") {
      return [
        {
          ...extra,
          cartItemType: "extra" as const,
          cartProductId: extra.id,
          price: extra.price,
          mappedCourseTitle: null,
          viewHref: `/extras/${extra.id}`,
          isAlreadyInCart: items.some((item) => item.itemType === "extra" && item.productId === extra.id),
        },
      ];
    }

    return [
      {
        ...extra,
        cartItemType: null,
        cartProductId: null,
        price: null,
        mappedCourseTitle: null,
        viewHref: extra.href ?? "/contact",
        isAlreadyInCart: false,
      },
    ];
  });

  const handleRemoveItem = (itemKey: string) => {
    clearCheckoutPaymentSession();
    removeItem(itemKey);
  };

  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    clearCheckoutPaymentSession();
    updateQuantity(itemKey, quantity);
  };

  const handleAddRelatedCourse = (courseId: string, courseTitle: string) => {
    clearCheckoutPaymentSession();
    addCourse({ courseId, locationId: defaultLocationId });
    toast({
      title: "Course added to cart",
      description: `${courseTitle} was added to your cart.`,
    });
  };

  const handleAddOptionalExtra = (
    itemType: "course" | "extra",
    productId: string,
    extraTitle: string,
    mappedTitle: string | null,
  ) => {
    clearCheckoutPaymentSession();
    if (itemType === "course") {
      addCourse({ courseId: productId, locationId: defaultLocationId });
    } else {
      addExtra({ extraId: productId, locationId: defaultLocationId });
    }

    toast({
      title: "Extra added to cart",
      description:
        !mappedTitle || extraTitle === mappedTitle
          ? `${extraTitle} was added to your cart.`
          : `${extraTitle} was added as ${mappedTitle}.`,
    });
  };

  const toggleItemDetails = (itemKey: string) => {
    setExpandedItems((current) => ({
      ...current,
      [itemKey]: !current[itemKey],
    }));
  };

  return (
    <main className="bg-white text-[#202121]">
      <SiteHeader tone="brand" />

      <section className="booking-flow cart-flow bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div>
          {!hasItems ? (
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#1d52a1]/15 text-[#1d52a1]">
                <ShoppingCart className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-2xl font-semibold text-slate-900">Your cart is empty</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Add a course, package, or optional extra first so you can review the booking details here and continue to checkout.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center rounded-lg bg-[#1d52a1] px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#17488d]"
                >
                  Browse packages
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-7 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 border-b border-slate-200 pb-5">
                <div className="flex items-center gap-2 text-[13px] text-slate-500">
                  <Link to="/" className="transition-colors hover:text-[#1d52a1]">
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-slate-700">Cart</span>
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-[32px] font-semibold leading-none text-slate-900 sm:text-[40px]">
                      Your cart
                    </h1>
                  </div>

                  <Link
                    to="/packages"
                    className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:text-[#1d52a1] sm:self-auto"
                  >
                    Continue shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="cart-columns grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(300px,0.72fr)] xl:items-start">
                <section className="min-w-0 bg-white">
                  <div className="divide-y divide-slate-200">
                    {items.map((item) => {
                      const lineTotal = item.price * item.quantity;
                      const isExpanded = expandedItems[item.key] ?? false;
                      const learningObjective = item.customization?.learningObjective ?? "";
                      const classObjectives = item.customization?.classObjectives ?? [];

                      return (
                        <article key={item.key} className="py-5 first:pt-0 last:pb-0">
                          <div className="cart-line rounded-2xl bg-[#fafafa] p-4">
                            <div className="cart-line-row flex items-start gap-3">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white sm:h-20 sm:w-20">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="cart-line-content min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <Link
                                      to={item.editHref}
                                      className="block break-words text-[15px] font-medium leading-tight text-slate-900 transition-colors hover:text-[#1d52a1] sm:text-base"
                                    >
                                      {item.title}
                                    </Link>
                                    <p className="mt-1 text-xs leading-tight text-slate-500">{item.locationName}</p>
                                    <p className="mt-0.5 text-xs leading-tight text-slate-500">
                                      {item.secondaryMetricLabel}: {item.secondaryMetricValue}
                                    </p>
                                    <p className="mt-2 text-xl font-semibold leading-none text-slate-900">
                                      {formatCoursePrice(lineTotal)}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.key)}
                                    className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[#E6242A]/5 hover:text-[#C41E23]"
                                    aria-label={`Remove ${item.title}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="cart-line-actions mt-3 flex flex-wrap items-center justify-between gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleItemDetails(item.key)}
                                    className="inline-flex items-center min-h-[44px] gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#1d52a1]"
                                    aria-expanded={isExpanded}
                                    aria-controls={`cart-item-details-${item.key}`}
                                  >
                                    More details
                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                    />
                                  </button>

                                  <div className="inline-flex items-center rounded-lg bg-white px-1 py-1 shadow-[inset_0_0_0_1px_rgba(226,232,240,1)]">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateQuantity(item.key, item.quantity - 1)}
                                      className={quantityButtonClass}
                                      aria-label={`Decrease quantity for ${item.title}`}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="min-w-[2.75rem] text-center text-[14px] font-medium tabular-nums text-slate-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateQuantity(item.key, item.quantity + 1)}
                                      className={quantityButtonClass}
                                      aria-label={`Increase quantity for ${item.title}`}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded ? (
                              <div
                                id={`cart-item-details-${item.key}`}
                                className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-xs text-slate-600 sm:grid-cols-2"
                              >
                                <p>
                                  <span className="font-semibold text-slate-900">Level:</span> {item.levelLabel}
                                </p>
                                <p>
                                  <span className="font-semibold text-slate-900">Included:</span>{" "}
                                  {item.secondaryMetricDetail}
                                </p>
                                <p className="sm:col-span-2">
                                  <span className="font-semibold text-slate-900">Details:</span> {item.sessionDetail}
                                </p>
                                {learningObjective ? (
                                  <div className="sm:col-span-2">
                                    <p className="font-semibold text-slate-900">Learning objective:</p>
                                    <p className="mt-2">{learningObjective}</p>
                                  </div>
                                ) : classObjectives.length > 0 ? (
                                  <div className="sm:col-span-2">
                                    <p className="font-semibold text-slate-900">Class plan:</p>
                                    <ul className="mt-2 space-y-1">
                                      {classObjectives.map((objective) => (
                                        <li key={objective.classNumber}>
                                          Class {objective.classNumber}:{" "}
                                          {objective.objective || "Focus can be decided later"}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <aside className="min-w-0">
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <h2 className="text-2xl font-semibold leading-none text-slate-900">Order summary</h2>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900">
                          {formatCoursePrice(pricingSummary.subtotalBeforeDiscount)}
                        </span>
                      </div>
                      {pricingSummary.bundleDiscountAmount > 0 ? (
                        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                          <span>{pricingSummary.bundleDiscountPercent}% lesson savings</span>
                          <span className="font-semibold text-[#1d52a1]">
                            -{formatCoursePrice(pricingSummary.bundleDiscountAmount)}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                        <span>{gstLabel}</span>
                        <span className="font-semibold text-slate-900">{formatCoursePrice(estimatedTaxes)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xl font-semibold leading-none text-slate-900">Total (CAD)</span>
                          <span className="text-3xl font-semibold leading-none text-slate-900">{formatCoursePrice(total)}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/checkout"
                      className="booking-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
                    >
                      Go to checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </section>
                </aside>
              </div>

              {optionalExtraRecommendations.length > 0 || relatedCourses.length > 0 ? (
                <section className="cart-recommendations mt-12 space-y-8">
                  <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Optional extras</h2>
                  </div>

                  {optionalExtraRecommendations.length > 0 ? (
                    <div>
                      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {optionalExtraRecommendations.map((extra) => (
                          <article
                            key={extra.id}
                            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5"
                          >
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold leading-tight text-slate-900">{extra.title}</h3>
                              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{extra.description}</p>
                            </div>

                            <div className="mt-auto pt-5">
                              <span className="block text-lg font-semibold text-slate-900">
                                {extra.price === null ? "Request pricing" : formatCoursePrice(extra.price)}
                              </span>
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                {extra.cartItemType && extra.cartProductId ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddOptionalExtra(
                                        extra.cartItemType,
                                        extra.cartProductId,
                                        extra.title,
                                        extra.mappedCourseTitle,
                                      )
                                    }
                                    className="inline-flex items-center justify-center booking-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                  >
                                    {extra.isAlreadyInCart ? "Add another" : "Add to cart"}
                                  </button>
                                ) : (
                                  <Link
                                    to={extra.viewHref}
                                    className="inline-flex items-center justify-center booking-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                  >
                                    {extra.actionLabel ?? "Contact us"}
                                  </Link>
                                )}
                                {extra.viewHref ? (
                                  <Link
                                    to={extra.viewHref}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-700 transition-colors hover:text-[#1d52a1]"
                                  >
                                    View details
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {relatedCourses.length > 0 ? (
                    <div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">Related courses</h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Add another lesson block if you want to keep building around the same focus areas.
                          </p>
                        </div>

                        <Link
                          to="/courses"
                          className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:text-[#1d52a1] sm:self-auto"
                        >
                          View all courses
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {relatedCourses.map((course) => (
                          <article key={course.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="h-48 overflow-hidden bg-slate-100">
                              <img
                                src={course.image}
                                alt={course.title}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover "
                              />
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                              <p className="text-xs font-semibold text-[#1d52a1]">{course.level}</p>
                              <h3 className="mt-2 text-lg font-semibold leading-tight text-slate-900">{course.title}</h3>
                              <p className="mt-2 text-[13px] text-slate-600">{course.detail}</p>
                              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{course.description}</p>

                              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                                <span className="shrink-0 text-lg font-semibold text-slate-900">
                                  {formatCoursePrice(getCoursePriceForTier(course, defaultPricingTier))}
                                </span>
                                <div className="flex flex-wrap items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleAddRelatedCourse(course.id, course.title)}
                                    className="inline-flex items-center justify-center booking-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                  >
                                    Add to cart
                                  </button>
                                  <Link
                                    to={`/courses/${course.id}`}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-700 transition-colors hover:text-[#1d52a1]"
                                  >
                                    View course
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </>
          )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Cart;
