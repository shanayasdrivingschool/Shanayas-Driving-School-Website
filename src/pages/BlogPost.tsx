import { Link, useParams } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import AnimatedSection from "@/components/AnimatedSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Blog post template component
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-black text-slate-900">Post not found</h1>
        <Link to="/" className="mt-6 text-[#1d52a1] underline">
          Go back home
        </Link>
      </main>
    );
  }

  const relatedPosts = post.relatedSlugs
    ? blogPosts.filter((p) => post.relatedSlugs!.includes(p.slug))
    : [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <PageNameSection
        eyebrow={post.category}
        title={post.title}
        description={post.description}
        backgroundImage={post.heroImage}
        titleClassName="text-[#F5C518]"
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/" className="hover:text-[#1d52a1] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/blog" className="hover:text-[#1d52a1] transition-colors">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 font-medium truncate">{post.title}</span>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-6 px-4 py-4 text-sm text-slate-500 sm:px-6">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
          <span className="rounded-full bg-[#1d52a1]/10 px-3 py-0.5 text-xs font-semibold text-[#1d52a1]">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article body */}
      <AnimatedSection>
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div
            className="
              prose prose-lg max-w-none
              prose-headings:font-black prose-headings:text-slate-900
              prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl sm:prose-h2:text-3xl
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-li:text-slate-600
              prose-ul:my-4 prose-ul:pl-6
              prose-blockquote:border-l-4 prose-blockquote:border-[#1d52a1]
              prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6
              prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-blockquote:text-slate-700 prose-blockquote:font-semibold
              prose-strong:text-slate-800
              prose-a:text-[#1d52a1] prose-a:underline
            "
          >
            {post.content}
          </div>

          {/* Back link */}
          <div className="mt-12 border-t border-slate-200 pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#174291]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </article>
      </AnimatedSection>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <AnimatedSection>
          <section className="border-t border-slate-200 bg-gray-50 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-center text-3xl font-black text-slate-900 sm:text-4xl">
                Related Articles
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/blog/${rp.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={rp.heroImage}
                        alt={rp.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1d52a1]">
                        {rp.category}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-[#1d52a1] transition-colors">
                        {rp.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-slate-600">{rp.description}</p>
                      <span className="mt-4 text-sm font-bold text-[#1d52a1]">
                        Read more -&gt;
                      </span>
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
