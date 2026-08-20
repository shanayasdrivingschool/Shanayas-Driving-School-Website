import type { ComponentType } from "react";

type AdminRouteModule = () => Promise<{ default: ComponentType }>;

/* One registry for the admin route chunks, used both by App's lazy() definitions and by
   the preloader below. A single map is what stops a route being added to the router while
   silently missing from the preload set -- the two would drift apart the first time
   someone adds a page. The specifiers stay literal so Vite can still split each page into
   its own chunk. */
export const ADMIN_ROUTE_MODULES = {
  "/admin/dashboard": () => import("@/pages/AdminDashboard"),
  "/admin/invoices": () => import("@/pages/AdminInvoices"),
  "/admin/courses": () => import("@/pages/AdminCourses"),
  "/admin/knowledge-test": () => import("@/pages/AdminKnowledgeTestQuestions"),
  "/admin/leads": () => import("@/pages/AdminLeads"),
  "/admin/coupons": () => import("@/pages/AdminCoupons"),
  "/admin/affiliates": () => import("@/pages/AdminAffiliates"),
  "/admin/referrals": () => import("@/pages/AdminReferrals"),
  "/admin/orders": () => import("@/pages/AdminOrders"),
  "/admin/commissions": () => import("@/pages/AdminCommissions"),
  "/admin/payouts": () => import("@/pages/AdminPayouts"),
  "/admin/rate-limits": () => import("@/pages/AdminRateLimits"),
} satisfies Record<string, AdminRouteModule>;

/* Opening an admin page used to wait on two things in series: its route chunk, then its
   data. This removes the first of the two for good. Each admin chunk is 12-16 kB and there
   are twelve, so the whole set costs less than a single table fetch, and by the time
   anyone clicks a nav link the module is already parsed.

   Deliberately modules only, never their data: warming twelve tables on entry would mean
   downloading the whole database to open one page. Data stays keyed to intent, prefetched
   from the nav link the pointer is actually heading for.

   Runs on idle so it never competes with the fetch for the page the admin is looking at
   right now, and only once per session. */
let preloadStarted = false;

export const preloadAdminRouteModules = () => {
  if (preloadStarted || typeof window === "undefined") {
    return;
  }

  preloadStarted = true;

  const loadAll = () => {
    for (const load of Object.values(ADMIN_ROUTE_MODULES)) {
      void load().catch(() => undefined);
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(loadAll, { timeout: 2_000 });
  } else {
    window.setTimeout(loadAll, 300);
  }
};

/* Warms a single route's chunk ahead of the click, for the case the idle preload has not
   finished yet -- a hover is a strong signal and jumps that route to the front. */
export const preloadAdminRouteModule = (path: string) => {
  const load = (ADMIN_ROUTE_MODULES as Record<string, AdminRouteModule | undefined>)[path];
  if (load) {
    void load().catch(() => undefined);
  }
};
