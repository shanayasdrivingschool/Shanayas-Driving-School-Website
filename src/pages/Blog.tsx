import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { blogPosts } from "@/data/blogPosts";

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  "a-z": "Title A-Z",
  "z-a": "Title Z-A",
};

const Blog = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  // Filter + sort posts
  const filteredPosts = useMemo(() => {
    let posts = [...blogPosts];

    // Category filter
    if (selectedCategory !== "All") {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (sort) {
      case "newest":
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  return (
    <main className="min-h-screen bg-white">
      <PageNameSection
        eyebrow="Resources"
        title="Blog"
        description="Tips, guides, and resources to help you become a confident driver"
        backgroundImage="https://images.unsplash.com/photo-1449965408869-ebd13bc9e8b6?auto=format&fit=crop&w=1400&q=80"
        titleClassName="text-[#F5C518]"
      />

      {/* Search, Sort & Filter bar */}
      <AnimatedSection>
        <section className="border-b border-slate-200 bg-gray-50 py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-700 focus:border-[#1d52a1] focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                  >
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#1d52a1] text-white"
                      : "bg-white border border-slate-300 text-slate-600 hover:border-[#1d52a1] hover:text-[#1d52a1]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Blog grid */}
      <AnimatedSection>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {filteredPosts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-semibold text-slate-500">No articles found.</p>
                <p className="mt-2 text-sm text-slate-400">Try a different search term or category.</p>
              </div>
            ) : (
              <>
                <p className="mb-8 text-sm font-medium text-slate-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[#1d52a1] px-3 py-1 text-xs font-bold text-white shadow">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#1d52a1]">
                          {post.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm text-slate-600">{post.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-slate-400">{post.date}</span>
                          <span className="text-xs text-slate-400">{post.readTime}</span>
                        </div>
                        <div className="mt-4">
                          <span className="inline-block rounded-full bg-[#1d52a1] px-6 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#174291]">
                            Read more
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
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
