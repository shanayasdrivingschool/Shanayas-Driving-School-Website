import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReferralRedirect = () => {
  const navigate = useNavigate();
  const { affiliateCode } = useParams<{ affiliateCode: string }>();

  useEffect(() => {
    if (!affiliateCode) {
      navigate("/apply", { replace: true });
      return;
    }

    navigate(`/apply?ref=${encodeURIComponent(affiliateCode)}`, { replace: true });
  }, [affiliateCode, navigate]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#F2F2F2] px-4 text-center text-[#202121]">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Referral link</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Redirecting to Shanaya&apos;s Driving School</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Your referral is being tracked now. If the page does not move automatically, continue to the student application form and try the link again.
        </p>
      </div>
    </main>
  );
};

export default ReferralRedirect;
