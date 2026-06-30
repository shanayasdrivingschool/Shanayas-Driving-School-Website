import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AffiliatePortalLayout from "@/components/affiliate/AffiliatePortalLayout";
import {
  affiliateInputClassName,
  affiliatePrimaryButtonClassName,
  affiliateSecondaryButtonClassName,
  affiliateSurfaceClassName,
} from "@/components/affiliate/styles";
import { signInAffiliate } from "@/lib/affiliateApi";

const AffiliateLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const signupMessage =
    typeof location.state === "object" &&
    location.state !== null &&
    "affiliateSignupMessage" in location.state &&
    typeof location.state.affiliateSignupMessage === "string"
      ? location.state.affiliateSignupMessage
      : "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signInAffiliate(email, password);
      toast.success("Welcome back.");
      navigate("/affiliate/dashboard");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to sign in.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AffiliatePortalLayout
      eyebrow="Program access"
      title={
        <>
          <span className="text-white">Ruley Rewards</span> <span className="text-[#F5B13A]">Program</span>
        </>
      }
      description="Use this login only for your Ruley Rewards Program account. It gives you access to your referral link, credited purchases, earnings, and payout tracking."
    >
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[28px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">What you can track</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">Inside your dashboard</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              <li>Copy your referral link in one click.</li>
              <li>See which bookings and purchases were credited to your referrals.</li>
              <li>Track pending payouts against the $100 threshold.</li>
              <li>Review earnings, payout history, and any reversed referral orders.</li>
            </ul>
          </article>

          <article className={affiliateSurfaceClassName}>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Program login</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Sign in</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                required
                placeholder="Email address"
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
              {signupMessage ? <p className="text-sm font-semibold text-emerald-700">{signupMessage}</p> : null}
              {error ? <p className="text-sm font-semibold text-[#E6242A]">{error}</p> : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className={affiliatePrimaryButtonClassName}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
                <Link to="/affiliate/signup" className={affiliateSecondaryButtonClassName}>
                  Create account
                </Link>
              </div>
            </form>
          </article>
        </div>
      </section>
    </AffiliatePortalLayout>
  );
};

export default AffiliateLogin;
