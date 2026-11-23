import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { ADMIN_NAV_LINKS } from "@/lib/adminPanel";
import { prefetchAdminRoute } from "@/lib/adminQueries";
import { preloadAdminRouteModule, preloadAdminRouteModules } from "@/lib/adminRouteModules";
import { signOutAdmin } from "@/lib/affiliateApi";
import { cn } from "@/lib/utils";
import AdminBrand from "./AdminBrand";
import "./admin.css";

type AdminPortalShellProps = {
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
  /* Still accepted so the twelve pages need no edit, but no longer rendered. These fed a
     500px marketing hero -- stock photograph, eyebrow, oversized headline -- that sat above
     every table in the panel. On a tool people open to read records, that is half a screen
     of decoration before the first row, plus a remote image fetched on each visit. */
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  backgroundImage?: string;
};

const AdminPortalShell = ({ pageTitle, pageDescription, children }: AdminPortalShellProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAdminAuth();

  /* Pull every admin route chunk in the background as soon as the panel is open, so a nav
     click never waits on a module download. See adminRouteModules for why this covers the
     chunks only and leaves each page's data to the hover prefetch below. */
  useEffect(() => {
    preloadAdminRouteModules();
  }, []);

  /* Hover and focus are the early signals; pointerdown is the backstop for a click that
     arrives without either -- touch, or a pointer moving fast enough that hover and click
     land together. Warming twice is free: the module preload is idempotent and
     prefetchQuery honours staleTime, so the second call is a no-op. */
  const warmRoute = (path: string) => {
    preloadAdminRouteModule(path);
    prefetchAdminRoute(queryClient, path);
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-workspace min-h-dvh bg-slate-50 font-body text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-[100rem] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <AdminBrand />
          <div className="flex items-center gap-2">
            <span className="mr-2 hidden max-w-64 truncate text-xs text-slate-500 md:block">
              {user?.email ?? "Administrator"}
            </span>
            <Link to="/" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] sm:min-h-9">
              Website
            </Link>
            <button type="button" onClick={() => void handleSignOut()} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] sm:min-h-9">
              <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="min-w-0 lg:sticky lg:top-24">
            <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto pb-2 lg:max-h-[calc(100dvh-8rem)] lg:flex-col lg:overflow-y-auto lg:p-1">
              {ADMIN_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onMouseEnter={() => warmRoute(link.to)}
                  onFocus={() => warmRoute(link.to)}
                  onPointerDown={() => warmRoute(link.to)}
                  className={({ isActive }) => cn(
                    "flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-lg border px-3 py-2 text-sm transition-colors lg:min-h-9 lg:py-1",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1d52a1]",
                    isActive ? "border-slate-200 bg-white font-medium text-slate-900" : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <span aria-hidden="true" className={cn("h-4 w-1 shrink-0 rounded-sm", isActive ? "bg-[#1d52a1]" : "bg-transparent")} />
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 space-y-6">
            <div>
              <h1 className="text-3xl font-medium leading-tight text-slate-900">{pageTitle}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{pageDescription}</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalShell;
