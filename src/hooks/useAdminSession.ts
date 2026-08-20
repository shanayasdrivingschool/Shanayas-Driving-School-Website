import { useQuery } from "@tanstack/react-query";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { getAdminSession } from "@/lib/affiliateApi";

export const useAdminSession = () => {
  const { user } = useAdminAuth();

  return useQuery({
    queryKey: ["admin-session", user?.id],
    queryFn: getAdminSession,
    enabled: Boolean(user),
    /* Whether an account is an admin does not change within a sitting, and the key is
       scoped to the user id, so signing in as someone else refetches. Holding it for the
       session stops every route change from re-running the check. Revoked access still
       takes effect immediately at the database level via RLS. */
    staleTime: Infinity,
  });
};
