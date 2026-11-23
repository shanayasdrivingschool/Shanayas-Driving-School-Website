import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminBrand from "@/components/admin/AdminBrand";
import "@/components/admin/admin.css";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { adminInputClassName, adminPrimaryButtonClassName } from "@/components/admin/styles";
import { useAdminSession } from "@/hooks/useAdminSession";
import { signInAdmin } from "@/lib/affiliateApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, user } = useAdminAuth();
  const adminSession = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/admin/dashboard";

  if (!loading && user && adminSession.data?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);
      toast.success("Signed in");
      navigate(redirectTarget, { replace: true });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to sign in as admin.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-workspace flex min-h-dvh flex-col bg-slate-50 font-body text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <AdminBrand />
          <Link to="/" className="shrink-0 rounded-lg px-3 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]">
            Website
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <section aria-labelledby="workspace-heading">
          <p className="mb-4 border-l-4 border-[#1d52a1] pl-3 text-sm font-medium text-slate-600">School administration</p>
          <h1 id="workspace-heading" className="max-w-md text-3xl font-medium leading-tight sm:text-4xl">The school’s day-to-day, in one place</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">Review enquiries and manage orders, affiliates, commissions, payouts, and suspicious activity</p>
          <p className="mt-8 max-w-md border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500">Use your administrator account. Affiliate accounts have a separate sign-in.</p>
        </section>

        <section aria-labelledby="signin-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 id="signin-heading" className="text-2xl font-medium">Admin sign-in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Enter your staff account details</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" aria-busy={isSubmitting}>
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-sm font-medium">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={adminInputClassName}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-medium">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={adminInputClassName}
              />
            </div>
            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className={`${adminPrimaryButtonClassName} min-h-12 w-full sm:min-h-12`}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
            <div className="border-t border-slate-200 pt-4 text-center">
              <Link to="/affiliate/login" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]">
                Affiliate sign-in
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
