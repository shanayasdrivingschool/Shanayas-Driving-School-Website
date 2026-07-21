import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { blogPosts, type BlogPostData } from "@/data/blogPosts";
import { seoLandingPages } from "@/data/seoLandingPages";

const cleanTitle = (title: string) => title.split(" | ")[0];

/* Featured block mirrors the reference layout: one lead story plus three
   stacked headlines. "Recent articles" below lists every post, featured
   included, so nothing is reachable only by scrolling past the featured block. */
const FEATURED_COUNT = 4;
const POSTS_PER_PAGE = 4;

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  "a-z": "Title A-Z",
  "z-a": "Title Z-A",
};

const byNewest = (a: BlogPostData, b: BlogPostData) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

const PostMeta = ({ post }: { post: BlogPostData }) => (
  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
    <span className="font-semibold text-slate-600 underline underline-offset-2">{post.author}</span>
    <span aria-hidden="true">·</span>
    <span>{post.date}</span>
    <span aria-hidden="true">·</span>
    <span>{post.readTime}</span>
  </p>
);

const Blog = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  const isFiltering = search.trim() !== "" || selectedCategory !== "All";

  /* Featured is the newest few, and only shown when the reader hasn't narrowed
     the list — otherwise it would push their actual results below the fold. */
  const featured = useMemo(
    () => (isFiltering ? [] : [...blogPosts].sort(byNewest).slice(0, FEATURED_COUNT)),
    [isFiltering],
  );

  const filteredPosts = useMemo(() => {
    let posts = [...blogPosts];

    if (selectedCategory !== "All") {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "newest":
        posts.sort(byNewest);
        break;
      case "oldest":
        posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "a-z":
        posts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        posts.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return posts;
  }, [search, sort, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [search, sort, selectedCategory]);

  const pagePosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const [lead, ...secondary] = featured;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero: brand band with headline, intro and inline subscribe */}
      <section className="relative bg-[#1d52a1] text-white">
        <SiteHeader tone="brand" />
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Link to="/" className="text-white/80 transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/55">Blog</span>
          </nav>

          <h1
            className="mx-auto mt-6 max-w-3xl text-center text-[clamp(2rem,4.6vw,3.25rem)] font-black leading-[1.1]"
            style={{ textWrap: "balance" }}
          >
            Driving tips and road test resources for BC drivers
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/80">
            Tips, guides, and resources to help you become a confident driver, from ICBC road test
            preparation to licensing updates across Greater Victoria.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#recent-articles"
              className="inline-flex rounded-full bg-[#E6242A] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
            >
              Browse all articles
            </a>
          </div>
        </div>
      </section>

      {/* Featured: one lead story beside three stacked headlines */}
      {lead ? (
        <AnimatedSection>
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <Link to={`/blog/${lead.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    <img
                      src={lead.heroImage}
                      alt={lead.title}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="mt-5 text-2xl font-black leading-snug text-slate-900 transition-colors group-hover:text-[#1d52a1]">
                    {lead.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{lead.description}</p>
                  <PostMeta post={lead} />
                </Link>

                <div className="flex flex-col divide-y divide-slate-200">
                  {secondary.map((post, index) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className={`group block ${index === 0 ? "pb-6" : "py-6"} last:pb-0`}
                    >
                      <h3 className="text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-[#1d52a1]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {post.description}
                      </p>
                      <PostMeta post={post} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      ) : null}

      {/* Recent articles: list rows beside a sticky sidebar */}
      <AnimatedSection>
        <section id="recent-articles" className="scroll-mt-24 pb-16 sm:pb-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
              {/* Article list */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-black text-slate-900">
                    {isFiltering ? "Results" : "Recent articles"}
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="sr-only sm:not-sr-only">Sort</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortOption)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                    >
                      {Object.entries(sortLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {pagePosts.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-lg font-semibold text-slate-500">No articles found.</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Try a different search term or category.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col divide-y divide-slate-200">
                    {pagePosts.map((post) => (
                      <article key={post.slug} className="py-6 first:pt-0">
                        <Link to={`/blog/${post.slug}`} className="group grid gap-5 sm:grid-cols-[13rem_minmax(0,1fr)]">
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                            <img
                              src={post.heroImage}
                              alt={post.title}
                              loading="lazy"
                              decoding="async"
                              sizes="(min-width: 640px) 13rem, 100vw"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {post.category}
                            </span>
                            <h3 className="mt-2 text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-[#1d52a1]">
                              {post.title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                              {post.description}
                            </p>
                            <PostMeta post={post} />
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                )}

                {totalPages > 1 ? (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex items-center justify-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        aria-current={page === n ? "page" : undefined}
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
                          page === n
                            ? "border border-[#1d52a1] bg-[#1d52a1] text-white"
                            : "border border-slate-300 text-slate-600 hover:border-[#1d52a1] hover:text-[#1d52a1]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                ) : null}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                  <h2 className="text-lg font-black leading-snug text-slate-900">Verify current requirements</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Licensing rules and fees can change. Use ICBC as the final source before booking or making a
                    decision about your licence.
                  </p>
                  <a
                    href="https://www.icbc.com/driver-licensing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-lg bg-[#1d52a1] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                  >
                    Visit ICBC driver licensing
                  </a>
                </div>

                <div>
                  <label htmlFor="blog-search" className="text-lg font-black text-slate-900">
                    Search articles
                  </label>
                  <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="blog-search"
                      type="text"
                      placeholder="Search articles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-black leading-snug text-slate-900">
                    Discover more of what matters to you
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        aria-pressed={selectedCategory === cat}
                        className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                          selectedCategory === cat
                            ? "bg-[#1d52a1] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-[#1d52a1]/10 hover:text-[#1d52a1]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact link list rather than a full card grid — keeps these
                    pages linked from /blog without adding a screen of height. */}
                <div>
                  <h2 className="text-lg font-black leading-snug text-slate-900">
                    Driving guides &amp; service areas
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {seoLandingPages.map((page) => (
                      <li key={page.path}>
                        <Link
                          to={page.path}
                          className="text-sm font-semibold text-slate-600 underline-offset-2 transition-colors hover:text-[#1d52a1] hover:underline"
                        >
                          {cleanTitle(page.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Closing official-source band */}
      <AnimatedSection>
        <section className="border-t border-slate-200 bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Check the official source</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
              Our articles explain licensing and road-safety topics in plain language. ICBC and B.C. law remain the
              controlling sources for current requirements.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://www.icbc.com/driver-licensing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-full bg-[#1d52a1] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
              >
                ICBC driver licensing
              </a>
              <a
                href="https://www.bclaws.gov.bc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
              >
                B.C. Laws
              </a>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection>
        <SiteCtaSection
          eyebrow="Ready to begin?"
          title={
            <>
              Start your first <span className="text-[#F5B13A]">driving lesson</span>
            </>
          }
          description="Book a package that fits your stage and get clear, calm instruction designed to build confidence on the road."
          actions={
            <>
              <Link to="/packages" className={siteCtaPrimaryClassName}>
                Book a Lesson
              </Link>
              <a href="tel:+12505423673" className={siteCtaSecondaryClassName}>
                Call Now
              </a>
            </>
          }
        />
      </AnimatedSection>

      <SiteFooter />
    </main>
  );
};

export default Blog;
