import type { QueryClient } from "@tanstack/react-query";
import {
  getAdminAffiliates,
  getAdminCommissions,
  getAdminCoupons,
  getAdminCourses,
  getAdminDashboard,
  getAdminInvoices,
  getAdminKnowledgeTestQuestions,
  getAdminLeads,
  getAdminOrders,
  getAdminPayouts,
  getAdminRateLimits,
  getAdminReferrals,
} from "@/lib/affiliateApi";

/* Shared defaults for every admin list query.

   Admin tables are read far more often than they are written, and several query keys back
   more than one page -- "admin-affiliates" alone is fetched by five of them. With the
   React Query default of staleTime 0, opening each page re-ran a full paged scan of rows
   that had been fetched seconds earlier on the page before it. Holding them briefly makes
   navigation between admin pages instant.

   Correctness does not rest on the window: every mutation invalidates the keys it touches
   explicitly, so your own edits still show immediately. The window only affects how long
   another admin's concurrent edit can go unseen, which a page refresh resolves. */
export const adminQueryOptions = {
  staleTime: 120_000,
  gcTime: 900_000,
} as const;

/* invalidateQueries resolves only once the refetch it triggered has finished. Awaiting a
   chain of them therefore held the dialog open and the save button disabled for one full
   table scan per key -- six of them in a row on an affiliate delete. Firing them together
   without awaiting lets the UI settle straight away while the tables refresh underneath;
   React Query keeps serving the cached rows until the new ones arrive, so nothing blanks.

   Errors are swallowed deliberately: the write itself already succeeded and reported, and
   a failed background refresh should not surface as a second, contradictory toast. */
export const refreshAdminQueries = (client: QueryClient, keys: readonly string[]) => {
  void Promise.all(
    keys.map((key) => client.invalidateQueries({ queryKey: [key] })),
  ).catch(() => undefined);
};

/* Every admin route paired with the queries its page mounts. Several pages need more than
   their own table -- Commissions renders affiliate and order names alongside commissions --
   and those were exactly the slowest arrivals, because they only began fetching once the
   page had already rendered. */
const ADMIN_ROUTE_QUERIES: Record<string, readonly (readonly [string, () => Promise<unknown>])[]> = {
  "/admin/dashboard": [["admin-dashboard", getAdminDashboard]],
  "/admin/invoices": [["admin-invoices", getAdminInvoices]],
  "/admin/courses": [["admin-courses", getAdminCourses]],
  "/admin/knowledge-test": [["admin-knowledge-test-questions", getAdminKnowledgeTestQuestions]],
  "/admin/leads": [["admin-leads", getAdminLeads]],
  "/admin/coupons": [["admin-coupons", getAdminCoupons]],
  "/admin/affiliates": [["admin-affiliates", getAdminAffiliates]],
  "/admin/referrals": [
    ["admin-referrals", getAdminReferrals],
    ["admin-affiliates", getAdminAffiliates],
  ],
  "/admin/orders": [
    ["admin-orders", getAdminOrders],
    ["admin-affiliates", getAdminAffiliates],
  ],
  "/admin/commissions": [
    ["admin-commissions", getAdminCommissions],
    ["admin-affiliates", getAdminAffiliates],
    ["admin-orders", getAdminOrders],
  ],
  "/admin/payouts": [
    ["admin-payouts", getAdminPayouts],
    ["admin-affiliates", getAdminAffiliates],
  ],
  "/admin/rate-limits": [["admin-rate-limits", getAdminRateLimits]],
};

/* Warm a route's data while the pointer is still travelling to the link, so the table is
   already in cache by the time the page mounts. prefetchQuery honours the staleTime above,
   so hovering a link repeatedly costs nothing, and a page whose data is still fresh from an
   earlier visit is skipped entirely. Failures are ignored on purpose: this is speculative
   work, and the page's own query will surface any real error when it actually mounts. */
export const prefetchAdminRoute = (client: QueryClient, path: string) => {
  for (const [key, queryFn] of ADMIN_ROUTE_QUERIES[path] ?? []) {
    void client.prefetchQuery({ queryKey: [key], queryFn, ...adminQueryOptions }).catch(() => undefined);
  }
};

/* Writes a change into the cached rows immediately and returns a rollback to call if the
   server rejects it. Status toggles are the panel's highest-frequency action, and without
   this the row kept showing its old value until the background refetch of the whole table
   landed -- long enough to look like the click had not registered.

   Only the row is updated, never the totals beside it: recomputing those by hand would
   duplicate server logic that can drift, and the refetch triggered alongside this corrects
   them a moment later. A briefly stale count is a fair trade for a row that responds now.

   Returns a no-op when the query is not cached, which is the correct outcome -- there are
   no rendered rows to correct, and nothing to roll back. */
export const optimisticAdminUpdate = <TData>(
  client: QueryClient,
  key: string,
  update: (current: TData) => TData,
) => {
  const queryKey = [key];
  const previous = client.getQueryData<TData>(queryKey);

  if (previous === undefined) {
    return () => undefined;
  }

  client.setQueryData<TData>(queryKey, update(previous));

  return () => {
    client.setQueryData<TData>(queryKey, previous);
  };
};
