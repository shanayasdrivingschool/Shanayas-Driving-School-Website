import { Fragment, type ReactNode } from "react";

/* Wraps FAQ search matches in <mark>. The regex must carry a capture group and
   the g flag, so String.split leaves the matched terms at the odd indices. */
export const highlightTerms = (value: string, highlight?: RegExp): ReactNode => {
  if (!highlight) {
    return value;
  }

  const parts = value.split(highlight);

  if (parts.length === 1) {
    return value;
  }

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="bg-[#1d52a1]/[0.12] px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );
};
