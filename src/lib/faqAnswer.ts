/* FAQ answers carry their citations inline as `[label](href)`. This turns one
   stored string into whichever form the caller needs:

   - parseFaqAnswer  → segments React and the static generator both render
   - faqAnswerToPlainText → the schema.org Answer text, with markup stripped

   Three link kinds exist. Internal ("/pricing") becomes a router Link, external
   ("https://icbc.com/...") opens in a new tab, and anchor ("#some-faq-id")
   jumps to another answer on the same page. */

export type FaqLinkKind = "internal" | "external" | "anchor";

export type FaqAnswerSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string; kind: FaqLinkKind };

const linkPattern = () => /\[([^\]]+)\]\(([^)\s]+)\)/g;

export const faqLinkKind = (href: string): FaqLinkKind => {
  if (href.startsWith("#")) {
    return "anchor";
  }

  return href.startsWith("/") ? "internal" : "external";
};

export const parseFaqAnswer = (answer: string): FaqAnswerSegment[] => {
  const segments: FaqAnswerSegment[] = [];
  const pattern = linkPattern();
  let lastIndex = 0;
  let match = pattern.exec(answer);

  while (match) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: answer.slice(lastIndex, match.index) });
    }

    segments.push({
      type: "link",
      label: match[1],
      href: match[2],
      kind: faqLinkKind(match[2]),
    });

    lastIndex = match.index + match[0].length;
    match = pattern.exec(answer);
  }

  if (lastIndex < answer.length) {
    segments.push({ type: "text", value: answer.slice(lastIndex) });
  }

  return segments;
};

/* Used for FAQPage schema and for search matching, where the href would
   otherwise pollute the text with domain names. */
export const faqAnswerToPlainText = (answer: string): string =>
  answer.replace(linkPattern(), "$1");
