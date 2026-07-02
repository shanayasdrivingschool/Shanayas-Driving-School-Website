import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, BadgeCheck, CreditCard, LayoutDashboard, Send, ShieldCheck, UserPlus, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AffiliatePortalLayout from "@/components/affiliate/AffiliatePortalLayout";
import {
  affiliateInputClassName,
  affiliatePrimaryButtonClassName,
  affiliateSecondaryButtonClassName,
  affiliateSurfaceClassName,
} from "@/components/affiliate/styles";
import { Checkbox } from "@/components/ui/checkbox";
import { REFERRAL_TERMS_PATH, REFERRAL_TERMS_VERSION } from "@/data/referralTerms";
import { registerAffiliate } from "@/lib/affiliateApi";
import { AFFILIATE_COMMISSION_RATE, AFFILIATE_COOKIE_DURATION_DAYS, AFFILIATE_MIN_PAYOUT, payoutMethodLabels } from "@/lib/affiliateProgram";
import type { PreferredPayoutMethod } from "@/lib/affiliateTypes";

type ReferralStep = {
  title: string;
  text: string;
  icon: ReactNode;
};

const referralSteps: ReferralStep[] = [
  {
    title: "Sign Up",
    text: "Create your Ruley Rewards Program account for free and receive your unique referral link.",
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    title: "Share It",
    text: "Share your unique Ruley Rewards Program referral link with people you know are looking to learn driving.",
    icon: <Send className="h-5 w-5" />,
  },
  {
    title: "Enrollment",
    text: "Your referral qualifies once a package is booked and fully paid through your link.",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Get Paid",
    text: "Receive a percentage from each fully completed package.",
    icon: <Wallet className="h-5 w-5" />,
  },
];

const joinBenefits = [
  {
    title: "Earn from completed packages",
    text: "Get rewarded when a referred driving package is booked and fully paid through your link.",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: "Support learners locally",
    text: "Share a trusted driving school with friends, family, and your community to start earning today.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Keep payouts\nsimple",
    text: "Track activity in one place and choose the payout method that suits you best.",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

const trustPoints = [
  "Every account goes through approval before rewards begin.",
  "Only real, fully completed package purchases are credited.",
  "Fraud checks and self-referral protection run automatically.",
  "Under-18 participants can join with required guardian consent.",
];

const postSignupSteps = [
  {
    title: "Application review",
    text: "We review your signup details and confirm your Ruley Rewards Program account is ready to use.",
  },
  {
    title: "Dashboard access",
    text: "Once approved, you can sign in, copy your referral link, and monitor credited activity.",
  },
  {
    title: "Start sharing",
    text: "Send your link to people interested in lessons and track qualifying purchases as they come in.",
  },
];

const dashboardPreviewMetrics = [
  { label: "Referral link", value: "Ready to copy" },
  { label: "Qualified purchases", value: "Tracked automatically" },
  { label: "Payout status", value: "Updated monthly" },
];

const dashboardPreviewItems = [
  "View visits, referred bookings, and credited purchases in one place.",
  "Check payout history and current status without contacting support.",
  "Access your referral ID and sharing link whenever you need it.",
];

const affiliateSignupPayoutOptions: PreferredPayoutMethod[] = ["bank_transfer", "interac"];

const affiliateInverseButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10";

type AffiliateSignupFormState = {
  name: string;
  email: string;
  phone: string;
  age: string;
  password: string;
  socialMediaLink: string;
  preferredPayoutMethod: PreferredPayoutMethod;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianConsent: boolean;
};

const AffiliateSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AffiliateSignupFormState>({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    socialMediaLink: "",
    preferredPayoutMethod: "bank_transfer" as PreferredPayoutMethod,
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasAcceptedReferralTerms, setHasAcceptedReferralTerms] = useState(false);
  const [hasAcceptedPrivacyConsent, setHasAcceptedPrivacyConsent] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [guardianError, setGuardianError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [privacyConsentError, setPrivacyConsentError] = useState("");
  const parsedAge = form.age.trim().length > 0 ? Number(form.age) : Number.NaN;
  const hasValidAge = Number.isInteger(parsedAge) && parsedAge >= 13 && parsedAge <= 100;
  const isMinorParticipant = hasValidAge && parsedAge < 18;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const acceptedAt = new Date().toISOString();
    let hasValidationError = false;

    setError("");
    setAgeError("");
    setGuardianError("");

    if (!hasValidAge) {
      setAgeError("Age must be provided and be between 13 and 100.");
      hasValidationError = true;
    }

    if (
      hasValidAge &&
      parsedAge < 18 &&
      (
        form.guardianName.trim().length === 0 ||
        form.guardianEmail.trim().length === 0 ||
        form.guardianPhone.trim().length === 0 ||
        !form.guardianConsent
      )
    ) {
      setGuardianError("Guardian consent is required for participants under 18.");
      hasValidationError = true;
    }

    if (!hasAcceptedReferralTerms) {
      setTermsError("Please agree to the Ruley Rewards Program Terms and Conditions.");
      hasValidationError = true;
    } else {
      setTermsError("");
    }

    if (!hasAcceptedPrivacyConsent) {
      setPrivacyConsentError("Please consent to the use of your information for your Ruley Rewards Program account.");
      hasValidationError = true;
    } else {
      setPrivacyConsentError("");
    }

    if (hasValidationError) {
      return;
    }

    setError("");
    setAgeError("");
    setGuardianError("");
    setTermsError("");
    setPrivacyConsentError("");
    setIsSubmitting(true);

    try {
      const result = await registerAffiliate({
        ...form,
        age: parsedAge,
        guardianName: isMinorParticipant ? form.guardianName : undefined,
        guardianEmail: isMinorParticipant ? form.guardianEmail : undefined,
        guardianPhone: isMinorParticipant ? form.guardianPhone : undefined,
        guardianConsent: isMinorParticipant ? form.guardianConsent : false,
        guardianConsentTimestamp: isMinorParticipant && form.guardianConsent ? acceptedAt : undefined,
        acceptedReferralTermsAt: acceptedAt,
        acceptedReferralTermsVersion: REFERRAL_TERMS_VERSION,
        acceptedPrivacyConsentAt: acceptedAt,
      });

      if (result.requiresEmailConfirmation) {
        const message = `Ruley Rewards Program account created for ${result.email}. Check your email to confirm the account, then sign in.`;
        toast.success("Check your email to confirm your Ruley Rewards Program account.");
        navigate("/affiliate/login", { state: { affiliateSignupMessage: message } });
        return;
      }

      toast.success("Ruley Rewards Program account created.");
      navigate("/affiliate/dashboard");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to create your Ruley Rewards Program account.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AffiliatePortalLayout
      eyebrow="Program signup"
      title={
        <>
          <span className="text-white">Ruley Rewards</span> <span className="text-[#F5B13A]">Program</span>
        </>
      }
      description="Join the Ruley Rewards Program, share your referral link, and earn when fully paid driving packages come through your recommendation."
    >
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Value</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Why Join the Ruley Rewards Program</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          Turn your recommendations into rewards while helping more learners find the right driving package.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {joinBenefits.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">{item.icon}</div>
              <h3 className="mt-5 min-h-[4.5rem] whitespace-pre-line text-2xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[32px] bg-[#F8FAFC] p-6 sm:p-8">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Flow</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            A simple referral process from signup to payout, built around completed package purchases.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {referralSteps.map((item, index) => (
            <article key={item.title} className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex w-fit rounded-full bg-[#E6242A] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                Step {index + 1}
              </span>
              <div className="mt-5 inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">{item.icon}</div>
              <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`${affiliateSurfaceClassName} order-2`}>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Signup form</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Create your Ruley Rewards Program account</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Your account starts in pending review. Once approved, you can share your referral link and start earning.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="text"
                required
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={affiliateInputClassName}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className={affiliateInputClassName}
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className={affiliateInputClassName}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className={affiliateInputClassName}
                />
                <select
                  required
                  value={form.preferredPayoutMethod}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      preferredPayoutMethod: event.target.value as PreferredPayoutMethod,
                    }))
                  }
                  className={affiliateInputClassName}
                >
                  {affiliateSignupPayoutOptions.map((value) => (
                    <option key={value} value={value}>
                      {payoutMethodLabels[value]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="affiliate-age" className="text-sm font-bold text-slate-900">
                  Your Age
                </label>
                <p className="text-xs leading-relaxed text-slate-500">
                  We require age verification for participation in the Ruley Rewards Program.
                </p>
                <input
                  id="affiliate-age"
                  type="number"
                  min={13}
                  max={100}
                  required
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={(event) => {
                    const nextAge = event.target.value;
                    setAgeError("");
                    setGuardianError("");
                    setForm((current) => {
                      const nextParsedAge = nextAge.trim().length > 0 ? Number(nextAge) : Number.NaN;
                      if (Number.isInteger(nextParsedAge) && nextParsedAge < 18) {
                        return { ...current, age: nextAge };
                      }

                      return {
                        ...current,
                        age: nextAge,
                        guardianName: "",
                        guardianEmail: "",
                        guardianPhone: "",
                        guardianConsent: false,
                      };
                    });
                  }}
                  className={affiliateInputClassName}
                />
              </div>
              <input
                type="url"
                placeholder="Website or social profile (optional)"
                value={form.socialMediaLink}
                onChange={(event) => setForm((current) => ({ ...current, socialMediaLink: event.target.value }))}
                className={affiliateInputClassName}
              />

              {ageError ? <p className="text-sm font-semibold text-[#E6242A]">{ageError}</p> : null}

              {isMinorParticipant ? (
                <div className="rounded-[26px] border border-[#1d52a1]/20 bg-[#1d52a1]/5 px-4 py-4 sm:px-5">
                  <h3 className="text-lg font-black text-slate-900">
                    Guardian Consent (Required for Participants Under 18)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Participants under 18 must provide guardian approval before the Ruley Rewards Program account can be created.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="guardian-name" className="text-sm font-bold text-slate-900">
                        Guardian Full Name
                      </label>
                      <input
                        id="guardian-name"
                        type="text"
                        required={isMinorParticipant}
                        placeholder="Guardian full name"
                        value={form.guardianName}
                        onChange={(event) => {
                          setGuardianError("");
                          setForm((current) => ({ ...current, guardianName: event.target.value }));
                        }}
                        className={affiliateInputClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="guardian-email" className="text-sm font-bold text-slate-900">
                        Guardian Email
                      </label>
                      <input
                        id="guardian-email"
                        type="email"
                        required={isMinorParticipant}
                        placeholder="guardian@example.com"
                        value={form.guardianEmail}
                        onChange={(event) => {
                          setGuardianError("");
                          setForm((current) => ({ ...current, guardianEmail: event.target.value }));
                        }}
                        className={affiliateInputClassName}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="guardian-phone" className="text-sm font-bold text-slate-900">
                        Guardian Phone Number
                      </label>
                      <input
                        id="guardian-phone"
                        type="tel"
                        required={isMinorParticipant}
                        placeholder="Guardian phone number"
                        value={form.guardianPhone}
                        onChange={(event) => {
                          setGuardianError("");
                          setForm((current) => ({ ...current, guardianPhone: event.target.value }));
                        }}
                        className={affiliateInputClassName}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <Checkbox
                      id="guardian-consent"
                      checked={form.guardianConsent}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setGuardianError("");
                        setForm((current) => ({ ...current, guardianConsent: isChecked }));
                      }}
                      className="mt-1 h-5 w-5 rounded-[6px] border-slate-300 data-[state=checked]:border-[#1d52a1] data-[state=checked]:bg-[#1d52a1]"
                    />
                    <label htmlFor="guardian-consent" className="text-sm leading-relaxed text-slate-700">
                      I confirm that I am the legal guardian of this participant and I grant permission for them to participate in the Ruley Rewards Program.
                    </label>
                  </div>
                  {guardianError ? <p className="mt-4 text-sm font-semibold text-[#E6242A]">{guardianError}</p> : null}
                </div>
              ) : null}

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="referral-terms-consent"
                      checked={hasAcceptedReferralTerms}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setHasAcceptedReferralTerms(isChecked);
                        if (isChecked) {
                          setTermsError("");
                        }
                      }}
                      className="mt-1 h-5 w-5 rounded-[6px] border-slate-300 data-[state=checked]:border-[#1d52a1] data-[state=checked]:bg-[#1d52a1]"
                    />
                    <div>
                      <label htmlFor="referral-terms-consent" className="text-sm leading-relaxed text-slate-700">
                        I agree to the{" "}
                        <Link
                          to={REFERRAL_TERMS_PATH}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1d52a1] underline underline-offset-4"
                        >
                          Ruley Rewards Program Terms and Conditions
                        </Link>
                        .
                      </label>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        Approval and ongoing participation remain subject to these terms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="referral-privacy-consent"
                      checked={hasAcceptedPrivacyConsent}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setHasAcceptedPrivacyConsent(isChecked);
                        if (isChecked) {
                          setPrivacyConsentError("");
                        }
                      }}
                      className="mt-1 h-5 w-5 rounded-[6px] border-slate-300 data-[state=checked]:border-[#1d52a1] data-[state=checked]:bg-[#1d52a1]"
                    />
                    <div>
                      <label htmlFor="referral-privacy-consent" className="text-sm leading-relaxed text-slate-700">
                        I consent to the collection and use of my information for Ruley Rewards Program account setup and communication, as described in the{" "}
                        <Link
                          to="/policies/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1d52a1] underline underline-offset-4"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {termsError ? <p className="text-sm font-semibold text-[#E6242A]">{termsError}</p> : null}
              {privacyConsentError ? <p className="text-sm font-semibold text-[#E6242A]">{privacyConsentError}</p> : null}
              {error ? <p className="text-sm font-semibold text-[#E6242A]">{error}</p> : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className={affiliatePrimaryButtonClassName}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
                <Link to="/affiliate/login" className={affiliateSecondaryButtonClassName}>
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>

          <div className="order-1 space-y-6">
            <article className="rounded-[28px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">Trust reassurance</p>
              <h3 className="mt-3 text-3xl font-black">Built for clear, trackable referrals</h3>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                The program is structured so approved affiliates can share with confidence, understand how rewards are earned, and review activity without guesswork.
              </p>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Trust points</p>
              <div className="mt-5 space-y-3">
                {trustPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-slate-700">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Next</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">What Happens Next</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {postSignupSteps.map((item, index) => (
              <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <span className="inline-flex w-fit rounded-full bg-[#1d52a1] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Preview</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Dashboard Preview</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Approved affiliates get a dashboard designed to make tracking referral activity straightforward.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">Sample view</p>
                  <h3 className="mt-2 text-3xl font-black">Your program dashboard</h3>
                </div>
                <span className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
                  <LayoutDashboard className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {dashboardPreviewMetrics.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{item.label}</p>
                    <p className="mt-3 text-lg font-black">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-bold text-white/80">Referral ID</p>
                <p className="mt-2 text-2xl font-black">RULEY-REF-001</p>
                <p className="mt-3 text-sm text-white/70">www.drivingschoolbc.ca/ref/your-code</p>
              </div>
            </article>

            <div className="space-y-4">
              {dashboardPreviewItems.map((item) => (
                <article key={item} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Rules</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Referral Rules</h2>

          <article className="mx-auto mt-10 max-w-4xl rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
            <ul className="space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              <li>Reward rate: {(AFFILIATE_COMMISSION_RATE * 100).toFixed(0)}% of each successful referred purchase.</li>
              <li>Cookie duration: {AFFILIATE_COOKIE_DURATION_DAYS} days, with last referral override.</li>
              <li>Minimum payout threshold: ${AFFILIATE_MIN_PAYOUT.toFixed(0)} on a monthly cycle.</li>
              <li>Cancelled and refunded orders remove or reverse associated rewards.</li>
              <li>Self-referrals and suspicious activity are blocked automatically.</li>
            </ul>
          </article>
        </div>

        <div className="mt-16">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Terms</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Terms</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Program terms</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">Review the full program terms</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Participation, approval, credited purchases, and payouts remain subject to the Ruley Rewards Program Terms and Conditions.
              </p>
              <Link to={REFERRAL_TERMS_PATH} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] hover:underline">
                Read the full terms
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Privacy</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">Consent and privacy</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Signup information is collected for account setup, review, communication, and payout processing in line with the privacy policy.
              </p>
              <Link to="/policies/privacy-policy" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] hover:underline">
                Read the privacy policy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Help</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Help</h2>

          <article className="mx-auto mt-10 max-w-4xl rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">Need help?</p>
                <h3 className="mt-3 text-3xl font-black">Questions before you join?</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                  Contact our team if you want help understanding eligibility, approval, or how referral rewards are credited.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+12505423673" className={affiliatePrimaryButtonClassName}>
                Call 250-542-3673
              </a>
              <Link to="/contact" className={affiliateInverseButtonClassName}>
                Contact Page
              </Link>
            </div>
          </article>
        </div>
      </section>
    </AffiliatePortalLayout>
  );
};

export default AffiliateSignup;
