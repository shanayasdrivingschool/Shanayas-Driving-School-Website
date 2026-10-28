import { describe, expect, it } from "vitest";
import { courseCatalogById } from "@/data/courseCatalog";
import { packageCatalogById } from "@/data/packageCatalog";
import {
  AD_GROUP_TO_PAID_LANDING_PAGE,
  paidLandingPages,
  paidLandingPagesByPath,
  paidLandingTestimonialsById,
} from "@/data/paidLandingPages";

describe("paid landing-page configuration", () => {
  it("maps all 12 ad groups to seven distinct experiences", () => {
    expect(paidLandingPages).toHaveLength(7);
    expect(Object.keys(AD_GROUP_TO_PAID_LANDING_PAGE)).toHaveLength(12);
    expect(new Set(Object.values(AD_GROUP_TO_PAID_LANDING_PAGE))).toEqual(
      new Set(paidLandingPages.map((page) => page.id)),
    );
  });

  it("keeps routes, aliases, products and proof references resolvable", () => {
    const allPaths = paidLandingPages.flatMap((page) => [page.path, ...(page.aliases ?? [])]);
    expect(new Set(allPaths).size).toBe(allPaths.length);

    for (const page of paidLandingPages) {
      expect(paidLandingPagesByPath[page.path]?.id).toBe(page.id);
      expect(page.seo.canonicalPath).toBe(page.path);
      expect(page.products).toHaveLength(3);
      expect(page.faqs.length).toBeGreaterThanOrEqual(3);
      expect(page.faqs.length).toBeLessThanOrEqual(6);

      for (const alias of page.aliases ?? []) {
        expect(paidLandingPagesByPath[alias]?.id).toBe(page.id);
      }

      for (const product of page.products) {
        const exists = product.kind === "course"
          ? Boolean(courseCatalogById[product.id])
          : Boolean(packageCatalogById[product.id]);
        expect(exists, `${page.id} references missing ${product.kind} ${product.id}`).toBe(true);
      }

      for (const testimonialId of page.testimonialIds) {
        expect(
          paidLandingTestimonialsById[testimonialId],
          `${page.id} references missing testimonial ${testimonialId}`,
        ).toBeTruthy();
      }
    }
  });

  it("shows source-linked Google reviews with reviewer photos on every paid page", () => {
    for (const page of paidLandingPages) {
      for (const testimonialId of page.testimonialIds) {
        const testimonial = paidLandingTestimonialsById[testimonialId];

        expect(testimonial.source).toBe("Google review");
        expect(testimonial.stars).toBe(5);
        expect(testimonial.avatarUrl).toMatch(/^https:\/\/lh3\.googleusercontent\.com\//);
        expect(testimonial.reviewUrl).toMatch(/^https:\/\/www\.google\.com\/maps\/reviews\//);
      }
    }
  });

  it("shows only the three core lesson offers on every paid page", () => {
    const expectedProducts = [
      { kind: "course", id: "beginner-driving-course" },
      { kind: "course", id: "lesson-road-test-prep-course" },
      { kind: "course", id: "make-your-own-class" },
    ];

    for (const page of paidLandingPages) {
      expect(page.products).toEqual(expectedProducts);
    }
  });
});
