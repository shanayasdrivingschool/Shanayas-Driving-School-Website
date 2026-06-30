import { describe, expect, it } from "vitest";
import { buildAffiliateReferralLink, calculateAffiliateCommission, normalizeAffiliateCode } from "@/lib/affiliateProgram";

describe("affiliateProgram", () => {
  it("calculates 5 percent commission with cents preserved", () => {
    expect(calculateAffiliateCommission(801)).toBe(40.05);
    expect(calculateAffiliateCommission(1201)).toBe(60.05);
    expect(calculateAffiliateCommission(1602)).toBe(80.1);
  });

  it("builds a referral link with the ref query parameter", () => {
    expect(buildAffiliateReferralLink("https://shanaya.test", "AFF1023")).toBe("https://shanaya.test/apply?ref=AFF1023");
  });

  it("normalizes affiliate codes to uppercase without padding extra spaces", () => {
    expect(normalizeAffiliateCode(" aff1023 ")).toBe("AFF1023");
  });
});
