import { Fragment } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { parseFaqAnswer } from "@/lib/faqAnswer";
import { highlightTerms } from "@/lib/highlightTerms";

type FaqAnswerProps = {
  answer: string;
  highlight?: RegExp;
};

const linkClassName =
  "font-medium text-[#1d52a1] underline decoration-[#1d52a1]/30 underline-offset-[3px] transition-colors duration-200 hover:decoration-[#1d52a1]";

const FaqAnswer = ({ answer, highlight }: FaqAnswerProps) => (
  <p className="text-[0.975rem] leading-[1.75] text-slate-600">
    {parseFaqAnswer(answer).map((segment, index) => {
      if (segment.type === "text") {
        return <Fragment key={index}>{highlightTerms(segment.value, highlight)}</Fragment>;
      }

      if (segment.kind === "external") {
        return (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClassName} inline items-baseline`}
          >
            {segment.label}
            <ExternalLink className="ml-1 inline h-3.5 w-3.5 -translate-y-px" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      }

      return (
        <Link
          key={index}
          to={segment.kind === "anchor" ? `/faq${segment.href}` : segment.href}
          className={linkClassName}
        >
          {segment.label}
        </Link>
      );
    })}
  </p>
);

export default FaqAnswer;
