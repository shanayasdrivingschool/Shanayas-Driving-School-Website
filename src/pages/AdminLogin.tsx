import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AffiliatePortalLayout from "@/components/affiliate/AffiliatePortalLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  affiliateInputClassName,
  affiliatePrimaryButtonClassName,
  affiliateSecondaryButtonClassName,
  affiliateSurfaceClassName,
} from "@/components/affiliate/styles";
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
      toast.success("Admin access granted.");
      navigate(redirectTarget, { replace: true });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to sign in as admin.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AffiliatePortalLayout
      eyebrow="Admin Access"
      title={
        <>
          Enter the <span className="text-[#F5B13A]">admin control panel</span>
        </>
      }
      description="Use a dedicated administrator account to manage the driving school database, referrals, payouts, and risk monitoring from one secure workspace."
    >
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[28px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
            <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-3xl font-black text-slate-900">Dedicated admin workspace</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              <li>Review all form submissions and stored payloads.</li>
              <li>Manage affiliates, orders, commissions, payouts, and suspicious traffic.</li>
              <li>Keep admin access fully separate from affiliate sign-in and affiliate portal accounts.</li>
            </ul>
          </article>

          <article className={affiliateSurfaceClassName}>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Admin login</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Sign in securely</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                required
                placeholder="Admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={affiliateInputClassName}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={affiliateInputClassName}
              />
              {error ? <p className="text-sm font-semibold text-[#E6242A]">{error}</p> : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className={affiliatePrimaryButtonClassName}>
                  {isSubmitting ? "Signing in..." : "Enter admin panel"}
                </button>
                <Link to="/affiliate/login" className={affiliateSecondaryButtonClassName}>
                  Affiliate login
                </Link>
              </div>
            </form>
          </article>
        </div>
      </section>
    </AffiliatePortalLayout>
  );
};

export default AdminLogin;
