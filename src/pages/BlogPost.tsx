import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { blogPosts } from "@/data/blogPosts";

const SITE_ORIGIN = "https://www.drivingschoolbc.ca";
type TocItem = { id: string; text: string };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
};

/* Pull the <h2> headings out of the post body to build a table of contents,
   and give each heading an id so the TOC links can scroll to it. */
const buildToc = (content: ReactNode): { toc: TocItem[]; rendered: ReactNode } => {
  if (!isValidElement(content)) return { toc: [], rendered: content };

  const children = Children.toArray((content.props as { children?: ReactNode }).children);
  const toc: TocItem[] = [];

  const rendered = children.map((child, index) => {
    if (isValidElement(child) && child.type === "h2") {
      const text = extractText((child.props as { children?: ReactNode }).children);
      const id = slugify(text) || `section-${index}`;
      toc.push({ id, text });
      return cloneElement(child as never, { id, key: `toc-${id}-${index}` });
    }
    return child;
  });

  return { toc, rendered: <>{rendered}</> };
};

const articleProseClasses = [
  "text-[17px] leading-relaxed text-slate-600",
  "[&_p]:mb-5",
  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl sm:[&_h2]:text-[1.75rem] [&_h2]:font-black [&_h2]:leading-tight [&_h2]:text-slate-900 [&_h2]:scroll-mt-28",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-slate-900",
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
  "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
  "[&_li]:text-slate-600",
  "[&_a]:font-semibold [&_a]:text-[#1d52a1] [&_a]:underline [&_a:hover]:text-[#17488d]",
  "[&_strong]:font-bold [&_strong]:text-slate-800",
  "[&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d52a1] [&_blockquote]:bg-[#1d52a1]/5 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:font-semibold [&_blockquote]:text-slate-700",
].join(" ");

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  const [activeId, setActiveId] = useState("");

  const { toc, rendered } = useMemo(() => buildToc(post?.content), [post]);

  useEffect(() => {
    if (!toc.length) return;
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-black text-slate-900">Post not found</h1>
        <Link to="/blog" className="mt-6 text-[#1d52a1] underline">
          Back to the blog
        </Link>
      </main>
    );
  }

  const relatedPosts = post.relatedSlugs
    ? blogPosts.filter((p) => post.relatedSlugs!.includes(p.slug))
    : [];

  const tags = Array.from(new Set([post.category, ...relatedPosts.map((related) => related.category)]));

  const shareUrl = `${SITE_ORIGIN}/blog/${post.slug}`;
  const shareLinks = [
    {
      label: `Share "${post.title}" on LinkedIn`,
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: `Share "${post.title}" on X`,
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
    },
    {
      label: `Share "${post.title}" on Facebook`,
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Masthead: solid brand-blue band with the article header */}
      <section className="relative bg-[#1d52a1] text-white">
        <SiteHeader tone="brand" />
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
            <Link to="/" className="text-white/80 transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link to="/blog" className="text-white/80 transition-colors hover:text-white">
              Blog
            </Link>
            <span className="text-white/40">/</span>
            <span className="truncate text-white/55">{post.category}</span>
          </nav>

          <h1 className="mt-6 max-w-3xl text-[clamp(1.9rem,4.6vw,3rem)] font-black leading-[1.08]" style={{ textWrap: "balance" }}>
            {post.title}
          </h1>

          <p className="mt-5 text-sm text-white/80">
            by{" "}
            <Link to="/about" className="font-semibold text-white underline underline-offset-2">
              {post.author}
            </Link>
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/65">
            Shanaya&apos;s is an independent driving school, not ICBC. Licensing facts are reviewed against the
            official sources linked in each article. Confirm current requirements with ICBC; report a factual error
            to{" "}
            <a href="mailto:book@drivingschoolbc.ca" className="underline underline-offset-2">
              book@drivingschoolbc.ca
            </a>
            .
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/70">
              {post.datePublished === post.dateModified ? "Published" : "Updated"}: {post.date}{" "}
              <span className="px-1">·</span> {post.readTime}
            </p>
            <div className="flex items-center gap-2">
              {shareLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Body: table of contents + article + sidebar */}
      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)_18rem] lg:gap-12">
          {/* Table of contents */}
          {toc.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Table of contents</p>
                <nav className="mt-4 border-l border-slate-200">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                        activeId === item.id
                          ? "border-[#1d52a1] font-semibold text-slate-900"
                          : "border-transparent text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          ) : (
            <div className="hidden lg:block" aria-hidden="true" />
          )}

          {/* Article */}
          <article className={articleProseClasses}>{rendered}</article>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-black leading-snug text-slate-900">Check official requirements</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Licensing rules can change. Confirm requirements directly with ICBC before booking a test or making a
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
              <h2 className="text-lg font-black leading-snug text-slate-900">Discover more of what matters to you</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <AnimatedSection>
          <section className="border-t border-slate-200 bg-gray-50 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-center text-3xl font-black text-slate-900 sm:text-4xl">Related Articles</h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={related.heroImage}
                        alt={related.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1d52a1]">
                        {related.category}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1d52a1]">
                        {related.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-slate-600">{related.description}</p>
                      <span className="mt-4 text-sm font-bold text-[#1d52a1]">Read more</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

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

export default BlogPost;
