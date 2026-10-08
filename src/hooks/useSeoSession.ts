import { useQuery } from "@tanstack/react-query";
import { useSeoAuth } from "@/components/seo/seoAuthContext";
import { getSeoSession } from "@/lib/seoApi";

export const useSeoSession = () => {
  const { user } = useSeoAuth();
  return useQuery({
    queryKey: ["seo-session", user?.id],
    queryFn: getSeoSession,
    enabled: Boolean(user),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
};
