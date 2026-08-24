import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import FaqAnswer from "@/components/FaqAnswer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  FAQ_EXPANDED_REVIEWED,
  FAQ_LAST_REVIEWED,
  faqCategories,
  faqPageSeo,
  faqRelatedLinks,
  siteFaqs,
  type FaqCategoryId,
  type SiteFaq,
} from "@/data/siteFaqs";
import { faqAnswerToPlainText } from "@/lib/faqAnswer";
import { highlightTerms } from "@/lib/highlightTerms";

type FilterId = FaqCategoryId | "all";

/* Lowercase, strip accents, and reduce punctuation to spaces so "ICBC's $89"
   is reachable by typing "icbc 89". */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Single letters only match as whole words. Otherwise typing "N restrictions"
   would match the letter n inside every other answer. */
const termMatches = (haystack: string, term: string) =>
  term.length === 1
    ? new RegExp(`\\b${escapeForRegExp(term)}\\b`).test(haystack)
    : haystack.includes(term);

const searchIndex = new Map(
  siteFaqs.map((faq) => [
    faq.id,
    normalize(
      [
        faq.question,
        faqAnswerToPlainText(faq.answer),
        ...(faq.keywords ?? []),
        faqCategories.find((category) => category.id === faq.category)?.label ?? "",
      ].join(" "),
    ),
  ]),
);

const questionIndex = new Map(siteFaqs.map((faq) => [faq.id, normalize(faq.question)]));

const Faq = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [openId, setOpenId] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const terms = useMemo(() => normalize(query).split(" ").filter(Boolean), [query]);

  const highlight = useMemo(() => {
    if (!terms.length) {
      return undefined;
    }

    const parts = terms.map((term) =>
      term.length === 1 ? `\\b${escapeForRegExp(term)}\\b` : escapeForRegExp(term),
    );

    return new RegExp(`(${parts.join("|")})`, "gi");
  }, [terms]);

  /* Matched across every category, so the topic list can show how many results
     each topic holds for the current search. */
  const matched = useMemo(() => {
    if (!terms.length) {
      return siteFaqs;
    }

    const hits = siteFaqs.filter((faq) =>
      terms.every((term) => termMatches(searchIndex.get(faq.id) ?? "", term)),
    );

    /* Question hits first, because a word buried in an answer is a weaker match than
       the same word in the question being asked. */
    return [...hits].sort((a, b) => {
      const score = (faq: SiteFaq) =>
        terms.every((term) => termMatches(questionIndex.get(faq.id) ?? "", term)) ? 0 : 1;

      return score(a) - score(b);
    });
  }, [terms]);

  const counts = useMemo(() => {
    const totals = new Map<FaqCategoryId, number>();

    matched.forEach((faq) => {
      totals.set(faq.category, (totals.get(faq.category) ?? 0) + 1);
    });

    return totals;
  }, [matched]);

  const visible = useMemo(
    () => (filter === "all" ? matched : matched.filter((faq) => faq.category === filter)),
    [matched, filter],
  );

  /* Group headings only make sense on the unfiltered, unsearched list. Once the
     user narrows things down, a flat ranked list is easier to scan. */
  const isBrowsing = filter === "all" && !terms.length;

  const groups = useMemo(
    () =>
      faqCategories
        .map((category) => ({
          category,
          faqs: visible.filter((faq) => faq.category === category.id),
        }))
        .filter((group) => group.faqs.length > 0),
    [visible],
  );

  const activeCategory = faqCategories.find((category) => category.id === filter);

  /* Supports /faq#some-id, and the [label](#some-id) links inside answers.
     location.key is in the deps so clicking the same anchor twice re-opens it. */
  useEffect(() => {
    const id = location.hash.replace("#", "");

    if (!id || !siteFaqs.some((faq) => faq.id === id)) {
      return;
    }

    setQuery("");
    setFilter("all");
    setOpenId(id);

    const frame = requestAnimationFrame(() => {
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  const resetFilters = () => {
    setQuery("");
    setFilter("all");
    searchInputRef.current?.focus();
  };

  const topics: { id: FilterId; label: string; count: number }[] = [
    { id: "all", label: "All questions", count: matched.length },
    ...faqCategories.map((category) => ({
      id: category.id as FilterId,
      label: category.label,
      count: counts.get(category.id) ?? 0,
    })),
  ];

  const renderItem = (faq: SiteFaq) => {
    const category = faqCategories.find((item) => item.id === faq.category);

    return (
      <AccordionItem
        key={faq.id}
        id={`faq-${faq.id}`}
        value={faq.id}
        className="scroll-mt-28 border-slate-200"
      >
        <AccordionTrigger className="group items-start gap-8 py-5 text-left hover:no-underline [&>svg]:mt-1.5 [&>svg]:text-slate-400">
          <span className="text-[1.0625rem] font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-[#1d52a1] sm:text-lg">
            {highlightTerms(faq.question, highlight)}
          </span>
        </AccordionTrigger>
        {/* forceMount keeps every answer in the DOM. Without it Radix unmounts
            closed content, so a JS-rendering crawler indexes 38 questions and no
            answers, and the page looks thin despite the content being there.
            Closed items still get Radix's `hidden` attribute, so nothing shows. */}
        <AccordionContent forceMount className="max-w-[68ch] pb-8 pt-0">
          {!isBrowsing && category ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              {category.label}
            </p>
          ) : null}
          <FaqAnswer answer={faq.answer} highlight={highlight} />
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <main className="faq-page bg-white">
      {/* ─── 1. Hero + search ─── */}
      <section>
        <SiteHeader tone="dark" />

        <div className="mx-auto w-full max-w-[1120px] px-6 pb-14 pt-28 sm:pb-20 sm:pt-32">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="transition-colors duration-200 hover:text-slate-900">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-500">FAQ</span>
          </nav>

          <h1
            className="mt-10 max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] font-black leading-[0.98] tracking-[-0.035em] text-slate-900"
            style={{ textWrap: "balance" }}
          >
            {faqPageSeo.h1}
          </h1>

          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-slate-500 sm:text-lg">
            {faqPageSeo.heroDescription}
          </p>

          <div className="relative mt-12 max-w-xl">
            <label htmlFor="faq-search" className="sr-only">
              Search the driving FAQ
            </label>
            <Search
              className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              id="faq-search"
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search all ${siteFaqs.length} answers`}
              autoComplete="off"
              className="w-full border-0 border-b-2 border-slate-300 bg-transparent py-3 pl-8 pr-9 text-lg text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-[#1d52a1] [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button
                type="button"
                onClick={resetFilters}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center text-slate-400 transition-colors duration-200 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─── 2. Topics + 3. Answers ─── */}
      <section className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-20">
            {/* min-w-0: a grid item defaults to min-width:auto, which lets the
                scrolling topic row below stretch the column past the viewport
                on phones instead of scrolling inside it. */}
            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Topics</h2>

              {/* Desktop: stacked list. Mobile: one scrollable row. */}
              <nav className="-mx-6 mt-5 flex gap-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {topics.map((topic) => {
                  const isActive = filter === topic.id;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setFilter(topic.id)}
                      disabled={topic.count === 0}
                      aria-pressed={isActive}
                      className={`shrink-0 cursor-pointer whitespace-nowrap border-b-2 pb-2 text-left text-sm transition-colors duration-200 lg:flex lg:w-full lg:items-baseline lg:justify-between lg:gap-4 lg:whitespace-normal lg:border-b-0 lg:border-l-2 lg:py-1.5 lg:pb-1.5 lg:pl-3 ${
                        isActive
                          ? "border-[#1d52a1] font-semibold text-slate-900"
                          : topic.count === 0
                            ? "cursor-not-allowed border-transparent text-slate-300"
                            : "border-transparent text-slate-500 hover:text-slate-900 lg:hover:border-slate-300"
                      }`}
                    >
                      <span>{topic.label}</span>
                      <span className="ml-2 tabular-nums text-xs text-slate-400 lg:ml-0">{topic.count}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* min-w-0: a grid item defaults to min-width:auto, which lets the
                topic row above stretch the whole column past the viewport on
                phones instead of scrolling inside it. */}
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-900 pb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  {activeCategory ? activeCategory.label : terms.length ? "Results" : "All questions"}
                </h2>
                <p className="text-sm text-slate-400">
                  {visible.length} {visible.length === 1 ? "answer" : "answers"}
                </p>
              </div>

              {visible.length === 0 ? (
                <div className="py-20">
                  <p className="text-xl font-semibold text-slate-900">
                    Nothing matches &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="mt-3 max-w-[52ch] leading-relaxed text-slate-500">
                    Try something shorter, like &ldquo;fees&rdquo;, &ldquo;vehicle&rdquo; or
                    &ldquo;packages&rdquo;. Or just ask us, and we&apos;ll answer for your situation.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-6">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="cursor-pointer border-b-2 border-slate-900 pb-1 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:border-[#1d52a1] hover:text-[#1d52a1]"
                    >
                      Show all questions
                    </button>
                    <Link
                      to="/contact"
                      className="border-b-2 border-transparent pb-1 text-sm font-semibold text-[#1d52a1] transition-colors duration-200 hover:border-[#1d52a1]"
                    >
                      Ask a question
                    </Link>
                  </div>
                </div>
              ) : isBrowsing ? (
                <div>
                  {/* Category heading is an h2, not an h3: Radix renders each
                      question trigger inside an h3, so the category has to sit
                      one level above them. */}
                  {groups.map(({ category, faqs }) => (
                    <div key={category.id} className="pt-10 first:pt-6">
                      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {category.label}
                      </h2>
                      <Accordion
                        type="single"
                        collapsible
                        value={openId}
                        onValueChange={setOpenId}
                        className="mt-1"
                      >
                        {faqs.map(renderItem)}
                      </Accordion>
                    </div>
                  ))}
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  value={openId}
                  onValueChange={setOpenId}
                  className="mt-2"
                >
                  {visible.map(renderItem)}
                </Accordion>
              )}

              {/* The citations live inside the answers now, so only the review
                  basis needs stating here. */}
              <p className="mt-12 max-w-[68ch] text-sm leading-relaxed text-slate-400">
                We&apos;re an independent driving school licensed under the Motor Vehicle Act. We&apos;re not
                ICBC, and we can&apos;t issue licences or decide who&apos;s eligible. ICBC&apos;s licensing
                rules here were checked against the official pages they link to on {FAQ_LAST_REVIEWED}. The
                answers added since, covering booking, waits, instructors, insurance, medical fitness and other
                licence classes, were checked on {FAQ_EXPANDED_REVIEWED}, along with every fee amount, which we
                confirmed against B.C.&apos;s Motor Vehicle Fees Regulation rather than somebody&apos;s summary.
                Prices, service areas, vehicles and pickup come from our current catalogue. Think
                we&apos;ve got something wrong?{" "}
                <a
                  href="mailto:book@drivingschoolbc.ca"
                  className="text-slate-500 underline underline-offset-2 transition-colors duration-200 hover:text-[#1d52a1]"
                >
                  Tell us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Deeper guides ─── */}
      <section className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:py-20">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">More detail</h2>
          <ul className="mt-8">
            {faqRelatedLinks.map((link) => (
              <li key={link.href} className="border-b border-slate-200 first:border-t">
                <Link
                  to={link.href}
                  className="group flex items-baseline gap-6 py-5 transition-colors duration-200"
                >
                  <span className="flex-1 text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-[#1d52a1] sm:text-xl">
                    {link.label}
                  </span>
                  <span className="hidden max-w-[34ch] text-sm leading-relaxed text-slate-500 md:block">
                    {link.description}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 self-center text-slate-300 transition-colors duration-200 group-hover:text-[#1d52a1]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 4. Contact / support CTA ─── */}
      <section className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-6 py-16 sm:flex-row sm:items-end sm:justify-between sm:py-20">
          <div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.05] tracking-[-0.025em] text-slate-900">
              Still need an answer?
            </h2>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-slate-500">
              Tell us your licence stage, where you are, or what you&apos;re trying to book, and we&apos;ll
              give you a straight answer.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#1d52a1] px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#17488d]"
            >
              Contact us
            </Link>
            <Link
              to="/apply"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 px-7 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:border-slate-900"
            >
              Book a lesson
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Faq;
