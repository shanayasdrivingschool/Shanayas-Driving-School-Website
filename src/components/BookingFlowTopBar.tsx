import { ArrowLeft, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";

type BookingFlowTopBarProps = {
  backTo: string;
  backLabel?: string;
  helpTo?: string;
  helpLabel?: string;
  hideLogo?: boolean;
};

const logoUrl = "/logos/Driving School Logo Horizontal.png";

const BookingFlowTopBar = ({
  backTo,
  backLabel = "Back",
  helpTo = "/contact",
  helpLabel = "Need help?",
  hideLogo = false,
}: BookingFlowTopBarProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        {hideLogo ? null : (
          <Link to="/" className="inline-flex w-[180px] sm:w-[220px]" aria-label="Shanaya's Driving School home">
            <img src={logoUrl} alt="Shanaya's Driving School" decoding="async" className="w-full" />
          </Link>
        )}

        <Link
          to={backTo}
          className="inline-flex items-center gap-2 self-start rounded-full px-2 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-[#1d52a1]"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      <Link
        to={helpTo}
        className="inline-flex items-center gap-2 self-start rounded-full px-2 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-[#1d52a1] sm:self-auto"
      >
        <CircleHelp className="h-4 w-4" />
        {helpLabel}
      </Link>
    </div>
  );
};

export default BookingFlowTopBar;
