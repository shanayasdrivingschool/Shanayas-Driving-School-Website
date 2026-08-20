import { useQuery } from "@tanstack/react-query";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { getAdminSession } from "@/lib/affiliateApi";

export const useAdminSession = () => {
  const { user } = useAdminAuth();

  return useQuery({
    queryKey: ["admin-session", user?.id],
    queryFn: getAdminSession,
    enabled: Boolean(user),
    /* Held long enough that route changes do not re-run the check, but not indefinitely:
       an admin whose access is withdrawn mid-session should be returned to the login screen
       on its own. The interval re-asks even while the tab sits idle, and the route guard
       redirects as soon as the answer comes back false. Data was never exposed either way --
       the database enforces this independently on every query. */
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
};
