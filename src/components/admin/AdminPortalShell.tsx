import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import AffiliatePortalLayout from "@/components/affiliate/AffiliatePortalLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { affiliateSecondaryButtonClassName, affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { ADMIN_NAV_LINKS } from "@/lib/adminPanel";
import { signOutAdmin } from "@/lib/affiliateApi";
import { cn } from "@/lib/utils";

type AdminPortalShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
  backgroundImage?: string;
};

const AdminPortalShell = ({
  eyebrow,
  title,
  description,
  pageTitle,
  pageDescription,
  children,
  backgroundImage,
}: AdminPortalShellProps) => {
  const navigate = useNavigate();
  const { user } = useAdminAuth();

  const handleSignOut = async () => {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AffiliatePortalLayout
      eyebrow={eyebrow}
      title={title}
      description={description}
      backgroundImage={backgroundImage}
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <div className={affiliateSurfaceClassName}>
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Admin workspace</p>
                  <p className="mt-1 text-lg font-black text-slate-900">Driving school control panel</p>
                </div>
              </div>

              <nav className="mt-6 space-y-2">
                {ADMIN_NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-colors",
                        isActive
                          ? "bg-[#1d52a1] text-white"
                          : "bg-[#F2F2F2] text-slate-700 hover:bg-slate-200",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F2F2F2] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Admin session</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{user?.email ?? "Authenticated admin"}</p>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E6242A] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className={`${affiliateSurfaceClassName} flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between`}>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Operations center</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">{pageTitle}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{pageDescription}</p>
              </div>
              <Link to="/" className={affiliateSecondaryButtonClassName}>
                Back to website
              </Link>
            </div>

            {children}
          </div>
        </div>
      </section>
    </AffiliatePortalLayout>
  );
};

export default AdminPortalShell;
