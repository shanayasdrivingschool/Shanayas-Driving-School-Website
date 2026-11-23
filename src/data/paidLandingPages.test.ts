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
  it("preserves the 12 existing ad-group mappings and adds the separate support offer", () => {
    expect(paidLandingPages).toHaveLength(8);
    expect(Object.keys(AD_GROUP_TO_PAID_LANDING_PAGE)).toHaveLength(12);
    expect(new Set(Object.values(AD_GROUP_TO_PAID_LANDING_PAGE))).toEqual(
      new Set(paidLandingPages.filter((page) => page.adGroupNames.length).map((page) => page.id)),
    );
  });

  it("keeps routes, aliases, products and proof references resolvable", () => {
    const allPaths = paidLandingPages.flatMap((page) => [page.path, ...(page.aliases ?? [])]);
    expect(new Set(allPaths).size).toBe(allPaths.length);

    for (const page of paidLandingPages) {
      expect(paidLandingPagesByPath[page.path]?.id).toBe(page.id);
      expect(page.seo.canonicalPath).toBe(page.path);
      expect(page.products).toHaveLength(page.supportProgramme ? 0 : 3);
      expect(page.faqs.length).toBeGreaterThanOrEqual(3);

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

  it("keeps the new support offer conditional and separate from catalogue checkout", () => {
    const page = paidLandingPages.find((item) => item.id === "road-test-confidence")!;
    const offer = page.supportProgramme!;
    expect(page.adGroupNames).toEqual([]);
    expect(page.products).toEqual([]);
    expect(offer.packages.map((item) => item.price)).toEqual([1999, 2599]);
    expect(offer.stages.map((stage) => stage.lessons)).toEqual([10, 5, 3, 2]);
    expect(offer.stages.reduce((sum, stage) => sum + stage.hours, 0)).toBe(30);
    expect(offer.stages[0].hours).toBe(15);
    expect(offer.conditions).toContain("Conditional support ends when you pass");
    expect(offer.conditions).toContain("Class 5 and Class 7");
    expect(offer.conditions).toContain("no package expiry date");
    expect(offer.conditions).toContain("a failed ICBC road test");
    expect(courseCatalogById["lesson-road-test-prep-course"].duration).toBe("1 hour of preparation + test-day car rental");
    expect(page.seo.noindex).toBe(true);
  });

  it("prioritises road-test services for test traffic and individual lessons before larger commitments", () => {
    const roadTest = paidLandingPages.find((page) => page.id === "road-test")!;
    expect(roadTest.products.map((product) => product.id)).toEqual([
      "road-test-prep-course", "mock-test-evaluation", "lesson-road-test-prep-course",
    ]);
    expect(paidLandingPages.find((page) => page.id === "beginner")!.products[0].id).toBe("make-your-own-class");
    expect(paidLandingPages.find((page) => page.id === "confidence")!.products[0].id).toBe("make-your-own-class");
  });
});
