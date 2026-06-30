import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { searchSite } from "@/data/siteSearch";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [searchValue, setSearchValue] = useState(query);
  const results = searchSite(query, 24);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchValue.trim();

    if (!nextQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: nextQuery });
  };

  return (
    <main className="min-h-screen bg-white">
      <PageNameSection
        eyebrow="Search"
        title="Find what you need"
        description="Search packages, courses, resources, and blog posts from one place."
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
        titleClassName="text-[#F5C518]"
      />

      <AnimatedSection>
        <section className="border-b border-slate-200 bg-gray-50 py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search packages, courses, resources, or blog posts..."
                className="w-full rounded-full border border-slate-300 bg-white py-4 pl-12 pr-36 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20 sm:text-base"
                aria-label="Search the website"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-[#1d52a1] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#174291]"
              >
                Search
              </button>
            </form>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {!query ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-900">Start with a keyword.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try terms like "knowledge test", "parking", "fresh start", or "road test".
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-900">No results found for "{query}".</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a broader term or search by package, course, or resource name.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-500">
                  {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
                </p>
                <div className="mt-6 space-y-4">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.href}`}
                      to={result.href}
                      className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1d52a1]/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-flex rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#1d52a1]">
                            {result.type}
                          </span>
                          <h2 className="mt-3 text-xl font-black text-slate-900 transition-colors group-hover:text-[#1d52a1]">
                            {result.title}
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.description}</p>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {result.href}
                          </p>
                        </div>
                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1d52a1]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </AnimatedSection>

      <SiteFooter />
    </main>
  );
};

export default SearchPage;
