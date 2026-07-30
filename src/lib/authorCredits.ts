/* Every piece of content that carries a byline, in one list.
 *
 * Blog posts are not the only credited content — the knowledge-test guide is a
 * bespoke Article page whose author and reviewer live in its own data module. A
 * profile page that only scanned blogPosts would credit an author on the guide
 * and then omit the guide from that author's own page, so both the React profile
 * and the static generator read this list instead.
 */
import { blogPosts } from "@/data/blogPosts";
import {
  KNOWLEDGE_TEST_GUIDE_AUTHOR_ID,
  KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL,
  KNOWLEDGE_TEST_GUIDE_REVIEWER_ID,
} from "@/data/knowledgeTestGuide";

export type CreditedArticle = {
  /* Route without a trailing slash, matching how Link and the router use it. */
  path: string;
  title: string;
  /* Category and review date, shown under the link on a profile page. */
  meta: string;
  authorId?: string;
  reviewedById?: string;
};

export const creditedArticles: CreditedArticle[] = [
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    meta: `${post.category} · Updated ${post.date}`,
    authorId: post.authorId,
    reviewedById: post.reviewedById,
  })),
  {
    path: "/knowledge-test-guide",
    title: "B.C. Class 7 Knowledge Test: Online and In-Person Guide",
    meta: `Learner Licensing · Updated ${KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL}`,
    authorId: KNOWLEDGE_TEST_GUIDE_AUTHOR_ID,
    reviewedById: KNOWLEDGE_TEST_GUIDE_REVIEWER_ID,
  },
];

export const articlesWrittenBy = (authorId: string) =>
  creditedArticles.filter((article) => article.authorId === authorId);

/* Excludes anything the person also wrote, so a self-review never shows up as a
   separate credit. */
export const articlesReviewedBy = (authorId: string) =>
  creditedArticles.filter(
    (article) => article.reviewedById === authorId && article.authorId !== authorId,
  );
