import { useQuery } from "@tanstack/react-query";
import { useAffiliateAuth } from "@/components/affiliate/AffiliateAuthProvider";
import { getAdminSession } from "@/lib/affiliateApi";

export const useAffiliateAdminSession = () => {
  const { user } = useAffiliateAuth();

  return useQuery({
    queryKey: ["affiliate-admin-session", user?.id],
    queryFn: getAdminSession,
    enabled: Boolean(user),
    staleTime: 60_000,
  });
};
