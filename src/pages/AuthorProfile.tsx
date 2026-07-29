import { Link, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthorBioCard from "@/components/AuthorBioCard";
import SiteCtaSection, {
  siteCtaPrimaryClassName,
  siteCtaSecondaryClassName,
} from "@/components/SiteCtaSection";
import { resolveAuthor } from "@/data/authors";
import { blogPosts } from "@/data/blogPosts";

/* An author's profile page: the page Google's author-profile guidance expects a
   Person entity to resolve to, and the page a reader lands on from a byline to
   check who wrote what they just read.

   An unpublished or unknown id renders the not-found state rather than a page
   about a person who has not been signed off. */
const AuthorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const author = resolveAuthor(slug);

  if (!author) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-3xl font-black text-slate-900">Author not found</h1>
        <p className="mt-3 max-w-md text-slate-600">
          This author page is not available. Browse our driving tips and road test resources instead.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex rounded-lg bg-[#1d52a1] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
        >
          Read the blog
        </Link>
      </main>
    );
  }

  const written = blogPosts.filter((post) => post.authorId === author.id);
  const reviewed = blogPosts.filter(
    (post) => post.reviewedById === author.id && post.authorId !== author.id,
  );

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-[#0b2545] pb-14 pt-28 text-white sm:pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-white/80 transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/55">{author.name}</span>
          </nav>

          <h1 className="mt-6 text-[clamp(1.9rem,4.6vw,3rem)] font-black leading-[1.08]">{author.name}</h1>
          <p className="mt-3 text-lg font-semibold text-white/85">{author.jobTitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">{author.summary}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5 text-base leading-relaxed text-slate-700">
            {author.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {written.length ? (
              <section className="pt-4">
                <h2 className="text-xl font-black text-slate-900">Articles by {author.name}</h2>
                <ul className="mt-4 space-y-3">
                  {written.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-semibold text-[#1d52a1] underline underline-offset-2"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">
                        {post.category} · Updated {post.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {reviewed.length ? (
              <section className="pt-4">
                <h2 className="text-xl font-black text-slate-900">Articles reviewed by {author.name}</h2>
                <ul className="mt-4 space-y-3">
                  {reviewed.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-semibold text-[#1d52a1] underline underline-offset-2"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="pt-4 text-sm leading-relaxed text-slate-500">
              Shanaya&apos;s Driving School is an independent driving school, not ICBC. Confirm current licensing
              requirements with ICBC. To report a factual error in this author&apos;s articles, email{" "}
              <a href="mailto:book@drivingschoolbc.ca" className="underline underline-offset-2">
                book@drivingschoolbc.ca
              </a>
              .
            </p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <AuthorBioCard author={author} label="Credentials and focus" linkToProfile={false} />
          </aside>
        </div>
      </div>

      <SiteCtaSection
        eyebrow="Ready to begin?"
        title={
          <>
            Book a lesson with <span className="text-[#F5B13A]">our team</span>
          </>
        }
        description="Choose a package that fits your stage and get clear, calm instruction from a licensed driving school in Langford."
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
      <SiteFooter />
    </div>
  );
};

export default AuthorProfile;
