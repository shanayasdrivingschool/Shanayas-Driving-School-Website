import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { ADMIN_NAV_LINKS } from "@/lib/adminPanel";
import { prefetchAdminRoute } from "@/lib/adminQueries";
import { preloadAdminRouteModule, preloadAdminRouteModules } from "@/lib/adminRouteModules";
import { signOutAdmin } from "@/lib/affiliateApi";
import { cn } from "@/lib/utils";

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
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {/* One slim bar carries identity and the account actions, replacing the hero. */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-[#1d52a1]" aria-hidden="true" />
            <span className="text-sm font-black tracking-tight text-slate-900">Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-[16rem] truncate text-xs text-slate-500 sm:block">
              {user?.email ?? "Authenticated admin"}
            </span>
            <Link
              to="/"
              className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]"
            >
              Website
            </Link>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#E6242A] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6242A]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:items-start">
          {/* The navigation no longer sits inside a card. A list of links does not need a
              bordered, shadowed container to be understood as a list of links. */}
          <aside className="lg:sticky lg:top-[4.25rem]">
            <div>
              {/* Every item used to carry a filled grey background, so twelve solid blocks
                  competed with the one that mattered and the current page barely stood out.
                  Resting state is now plain; the fill is reserved for where you actually
                  are, which is the only item that needs to be found at a glance. */}
              <nav aria-label="Admin sections" className="mt-6 space-y-1">
                {ADMIN_NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onMouseEnter={() => warmRoute(link.to)}
                    onFocus={() => warmRoute(link.to)}
                    onPointerDown={() => warmRoute(link.to)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2",
                        isActive
                          ? "bg-[#1d52a1] text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* A bar rather than a colour change alone: position and shape read
                            instantly, and the state survives for anyone who cannot rely on
                            the colour difference. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-1 shrink-0 rounded-full transition-colors",
                            isActive ? "bg-[#F5B13A]" : "bg-transparent",
                          )}
                        />
                        {link.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {/* A heading and a line of context. This was a bordered, shadowed card carrying
                an "Operations center" eyebrow above the same words -- a label for the panel
                you are already looking at. */}
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{pageTitle}</h1>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">{pageDescription}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalShell;
