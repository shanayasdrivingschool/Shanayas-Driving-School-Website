import { describe, expect, it } from "vitest";
import { paidLandingPagesById } from "./paidLandingPages";
import { applyPaidLandingVariant, getPaidLandingVariant, getPaidLandingVariantUrl, getVariantReviews, paidLandingVariants } from "./paidLandingVariants";
import { featuredGoogleReviews } from "./googleReviews";

describe("playbook landing variants", () => {
  it("maps eleven audiences to seven existing families without changing control configs", () => {
    expect(paidLandingVariants).toHaveLength(11);
    expect(new Set(paidLandingVariants.map((v) => v.pageId)).size).toBe(7);
    expect(new Set(paidLandingVariants.map((v) => v.id)).size).toBe(11);
    expect(paidLandingVariants.filter((v) => v.provisional)).toHaveLength(2);
    for (const variant of paidLandingVariants) {
      const base = paidLandingPagesById[variant.pageId];
      const original = JSON.stringify(base);
      const search = getPaidLandingVariantUrl(variant).split("?")[1];
      expect(getPaidLandingVariant(base.id, search)).toBe(variant);
      const config = applyPaidLandingVariant(base, variant);
      expect(config.path).toBe(base.path);
      expect(config.seo.canonicalPath).toBe(base.seo.canonicalPath);
      expect(config.seo.noindex).toBe(true);
      expect(config.seo.title).toBe(config.hero.h1);
      expect(JSON.stringify(base)).toBe(original);
      expect(getVariantReviews(variant)).toHaveLength(featuredGoogleReviews.length);
      expect(new Set(getVariantReviews(variant).map((r) => r.id)).size).toBe(featuredGoogleReviews.length);
      expect(getVariantReviews(variant)[0].name).toBe(variant.reviewNames[0]);
      expect(variant.choices).toHaveLength(3);
    }
  });
  it("rejects unknown and mismatched variants and never selects one from adgroup alone", () => {
    expect(getPaidLandingVariant("victoria", "?variant=first-lesson")).toBeUndefined();
    expect(getPaidLandingVariant("beginner", "?variant=unknown")).toBeUndefined();
    expect(getPaidLandingVariant("beginner", "?adgroup=Beginner")).toBeUndefined();
    expect(getPaidLandingVariant("road-test-confidence", "?variant=road-test-plan")).toBeUndefined();
    const base = paidLandingPagesById.victoria;
    expect(applyPaidLandingVariant(base)).toBe(base);
  });
});
