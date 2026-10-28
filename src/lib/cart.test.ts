import { describe, expect, it } from "vitest";
import { calculateCheckoutTotals } from "../../supabase/functions/_shared/checkoutPricing";
import { buildCartItems, getCartPricingSummary } from "@/lib/cart";

describe("limited-time lesson offers", () => {
  it("applies 30% to the beginner course without changing the Fresh Start package price", () => {
    const [beginnerCourse] = buildCartItems([
      {
        itemType: "course",
        productId: "beginner-driving-course",
        locationId: "langford",
        quantity: 1,
      },
    ]);
    const [freshStart] = buildCartItems([
      {
        itemType: "package",
        productId: "fresh-start",
        locationId: "langford",
        quantity: 1,
      },
    ]);

    expect(beginnerCourse.price).toBe(934.5);
    expect(freshStart.price).toBe(2169);
  });

  it("unlocks 30% off custom classes at five lessons", () => {
    const fourClasses = getCartPricingSummary(
      buildCartItems([
        {
          itemType: "course",
          productId: "make-your-own-class",
          locationId: "langford",
          quantity: 4,
        },
      ]),
    );
    const fiveClasses = getCartPricingSummary(
      buildCartItems([
        {
          itemType: "course",
          productId: "make-your-own-class",
          locationId: "langford",
          quantity: 5,
        },
      ]),
    );

    expect(fourClasses.subtotal).toBe(534);
    expect(fourClasses.bundleDiscountAmount).toBe(0);
    expect(fiveClasses.subtotalBeforeDiscount).toBe(667.5);
    expect(fiveClasses.bundleDiscountAmount).toBe(200.25);
    expect(fiveClasses.bundleDiscountPercent).toBe(30);
    expect(fiveClasses.subtotal).toBe(467.25);
  });

  it("matches the server-authoritative checkout calculation", () => {
    const beginnerCourse = calculateCheckoutTotals([
      {
        itemType: "course",
        productId: "beginner-driving-course",
        locationId: "langford",
        quantity: 1,
      },
    ]);
    const customClasses = calculateCheckoutTotals([
      {
        itemType: "course",
        productId: "make-your-own-class",
        locationId: "langford",
        quantity: 5,
        lessonDurationMinutes: 90,
      },
    ]);

    expect(beginnerCourse.subtotal).toBe(934.5);
    expect(customClasses.bundleDiscountAmount).toBe(200.25);
    expect(customClasses.bundleDiscountPercent).toBe(30);
    expect(customClasses.subtotal).toBe(467.25);
  });
});
