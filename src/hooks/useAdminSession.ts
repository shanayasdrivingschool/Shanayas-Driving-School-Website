import { useQuery } from "@tanstack/react-query";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { getAdminSession } from "@/lib/affiliateApi";

export const useAdminSession = () => {
  const { user } = useAdminAuth();

  return useQuery({
    queryKey: ["admin-session", user?.id],
    queryFn: getAdminSession,
    enabled: Boolean(user),
    staleTime: 60_000,
  });
};
