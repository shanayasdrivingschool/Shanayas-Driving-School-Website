import { useState, type FormEvent } from "react";
import { ArrowLeft, FilePenLine, SearchCheck, ShieldCheck } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSeoAuth } from "@/components/seo/seoAuthContext";
import { useSeoSession } from "@/hooks/useSeoSession";
import { signInSeo } from "@/lib/seoApi";

const SeoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, user } = useSeoAuth();
  const seoSession = useSeoSession();
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
      : "/seo/blogs";

  if (!loading && user && seoSession.data?.isSeoUser) {
    return <Navigate to={redirectTarget} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);
    try {
      await signInSeo(email, password);
      toast.success("SEO workspace access granted.");
      navigate(redirectTarget, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in to the SEO workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const denied =
    typeof location.state === "object" &&
    location.state !== null &&
    "denied" in location.state &&
    location.state.denied === true;

  return (
    <main className="min-h-dvh bg-[#f4f7fb] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1d52a1]">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-[#123c7a] p-7 text-white sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-100">
                <SearchCheck className="h-4 w-4" /> SEO Studio
              </span>
              <h1 className="mt-7 max-w-lg text-4xl font-black leading-tight sm:text-5xl">
                A focused workspace for blog content.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100">
                Draft articles, structure headings, manage FAQs and prepare SEO metadata without access to invoices, orders, affiliates or the business admin panel.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <FilePenLine className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B13A]" />
                  <div><p className="font-black">Content workspace</p><p className="mt-1 text-sm leading-relaxed text-blue-100">Write, preview and send structured drafts for review.</p></div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B13A]" />
                  <div><p className="font-black">Restricted access</p><p className="mt-1 text-sm leading-relaxed text-blue-100">SEO accounts receive blog and media permissions only.</p></div>
                </div>
              </div>
            </section>

            <section className="flex items-center p-7 sm:p-10 lg:p-12">
              <div className="w-full">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Team sign in</p>
                <h2 className="mt-3 text-3xl font-black">Open SEO Studio</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">Use the SEO account provided by the site administrator.</p>

                {denied ? (
                  <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                    This signed-in account does not have SEO Studio access.
                  </p>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold">Email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#1d52a1] focus:ring-4 focus:ring-blue-100"
                      placeholder="name@example.com"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold">Password</span>
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#1d52a1] focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your password"
                    />
                  </label>
                  {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1d52a1] px-5 text-sm font-black text-white transition hover:bg-[#153f7d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Signing in…" : "Enter SEO Studio"}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeoLogin;
