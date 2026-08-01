import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAffiliateReferralCookie } from "@/lib/affiliateCookies";
import { buildAffiliateFingerprint } from "@/lib/affiliateFingerprint";

const ReferralTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const latestSearchRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (!ref) return;

    const marker = `${location.pathname}?${location.search}`;
    if (latestSearchRef.current === marker) return;
    latestSearchRef.current = marker;

    let active = true;

    const track = async () => {
      try {
        /* This component mounts on every page, but only a visit carrying ?ref=
           reaches this point. Importing affiliateApi dynamically keeps its Supabase
           dependency (~188 kB) out of the bundle every other visitor downloads. */
        const { trackAffiliateReferral } = await import("@/lib/affiliateApi");
        const fingerprintHash = await buildAffiliateFingerprint();
        const result = await trackAffiliateReferral({
          referralCode: ref,
          landingPath: `${location.pathname}${location.hash || ""}`,
          fingerprintHash,
        });

        if (active && result.valid) {
          setAffiliateReferralCookie(result.affiliateCode, result.expiresInDays);
        }
      } catch (error) {
        console.error("Referral tracking failed:", error);
      } finally {
        if (!active) return;
        params.delete("ref");
        const nextSearch = params.toString();
        navigate(
          {
            pathname: location.pathname,
            search: nextSearch ? `?${nextSearch}` : "",
            hash: location.hash,
          },
          { replace: true },
        );
      }
    };

    void track();

    return () => {
      active = false;
    };
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

export default ReferralTracker;
