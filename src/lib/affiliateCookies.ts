import { AFFILIATE_COOKIE_DURATION_DAYS, AFFILIATE_COOKIE_NAME } from "@/lib/affiliateProgram";

const buildCookieString = (name: string, value: string, days: number) => {
  const maxAge = days * 24 * 60 * 60;
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const setAffiliateReferralCookie = (
  affiliateCode: string,
  cookieDurationDays = AFFILIATE_COOKIE_DURATION_DAYS,
) => {
  if (typeof document === "undefined") return;
  document.cookie = buildCookieString(AFFILIATE_COOKIE_NAME, affiliateCode, cookieDurationDays);
};

export const getAffiliateReferralCookie = () => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    const [name, ...value] = cookie.split("=");
    if (name === AFFILIATE_COOKIE_NAME) {
      return decodeURIComponent(value.join("="));
    }
  }

  return null;
};

export const clearAffiliateReferralCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AFFILIATE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};
