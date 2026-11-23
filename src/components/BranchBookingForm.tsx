import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BRANCH_PHONE, type BranchLocation } from "@/data/branchLocations";
import { getCaptchaVerification } from "@/lib/captcha";

const inputClass = "mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/30";

export default function BranchBookingForm({ branch }: { branch: BranchLocation }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lock.current) return;
    const values = new FormData(event.currentTarget);
    const phone = String(values.get("phone") ?? "").trim();
    if (phone.replace(/\D/g, "").length < 10) { setError("Please enter a phone number with at least 10 digits."); return; }
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const captcha = await getCaptchaVerification("branch_lesson_request");
      const { submitFreeTrialLead } = await import("@/lib/leadService");
      await submitFreeTrialLead({
        fullName: String(values.get("name")).trim(), phone,
        email: String(values.get("email")).trim(),
        intent: "lesson_booking",
        sourcePage: branch.path,
        serviceArea: branch.city,
        goal: String(values.get("goal")),
        note: `Branch: ${branch.label}. Pickup area: ${String(values.get("pickup"))}. Preferred times: ${String(values.get("times"))}.`,
        marketingConsent: false,
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });
      setSent(true);
    } catch {
      setError(`Your request could not be sent. Please try again or call ${BRANCH_PHONE}.`);
      lock.current = false;
    } finally { setBusy(false); }
  };
  if (sent) return <p role="status" className="rounded-xl bg-blue-50 p-6 text-lg text-slate-900">Your request for {branch.label} has been received. We will contact you to confirm availability, lesson details and price. Your lesson is not booked until confirmed.</p>;
  return (
    <form onSubmit={submit} aria-label={`Booking request for ${branch.label}`} className="grid gap-5 sm:grid-cols-2">
      <p className="sm:col-span-2 font-semibold">Requesting: {branch.label}</p>
      <label className="text-sm font-semibold">Full name<input name="name" required maxLength={120} autoComplete="name" className={inputClass} /></label>
      <label className="text-sm font-semibold">Phone<input name="phone" type="tel" required maxLength={30} autoComplete="tel" className={inputClass} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Email<input name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} /></label>
      <label className="text-sm font-semibold">Pickup neighbourhood<input name="pickup" maxLength={160} className={inputClass} /></label>
      <label className="text-sm font-semibold">Preferred days and times<input name="times" maxLength={200} className={inputClass} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Licence stage and lesson goals<textarea name="goal" rows={3} maxLength={1000} className={inputClass} placeholder="Tell us your experience and what you would like help with." /></label>
      <p className="sm:col-span-2 text-sm leading-relaxed text-slate-600">By sending this request, you ask us to contact you about lessons at this branch. <Link to="/policies/privacy-policy" className="underline">Privacy policy</Link>.</p>
      {error ? <p role="alert" className="sm:col-span-2 text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="rounded-full bg-[#1d52a1] px-6 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2">{busy ? "Sending request…" : "Send booking request"}</button>
    </form>
  );
}
