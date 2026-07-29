/* Named content authors, for the person-level E-E-A-T signals the organization
 * byline cannot carry: who wrote this, what they actually do, and where a reader
 * can check that they exist.
 *
 * RULES FOR ADDING AN ENTRY — read before editing:
 *  1. Real people only. An invented author with a job title and a Person entity
 *     is a fabricated trust signal: it is what search quality raters check, what
 *     Google's spam policies treat as deceptive, and what a reader relies on when
 *     deciding whether to trust licensing advice. Never seed this file to "have
 *     authors".
 *  2. Publish only what the school can evidence from current records. Per
 *     COMPANY_KNOWLEDGE.md, individual instructor claims must be verified before
 *     they ship, and nothing here may call the school, its instructors or its
 *     lessons ICBC-approved, government-approved or endorsed.
 *  3. `published` gates everything. While it is false the author has no profile
 *     page, no Person schema and no byline — the article keeps the organization
 *     byline it has today. Flip it only once 1 and 2 hold.
 *  4. Publishing an author adds /authors/<id>/ to the pre-rendered routes, so the
 *     build will fail until that URL is added to public/sitemap.xml. That failure
 *     is the sitemap guard working; add the entry rather than bypassing it.
 */

export type AuthorCredential = {
  /* As it would read to a reader, e.g. "B.C. driving instructor licence".
     Only include it if current evidence is on file. */
  name: string;
  /* The body that issued it, when naming them is accurate. */
  issuedBy?: string;
};

export type Author = {
  /* Slug — the profile page is /authors/<id>/. */
  id: string;
  name: string;
  /* Maps to Person.jobTitle, e.g. "Driving instructor". */
  jobTitle: string;
  /* Short summary used for the profile page meta description and the byline
     card. One sentence, no superlatives. */
  summary: string;
  /* Profile body, one string per paragraph. */
  bio: string[];
  /* Year they started instructing, e.g. "2019". Renders as "Instructing since
     2019" — the first-hand Experience signal, so only use a year you can back. */
  instructingSince?: string;
  credentials?: AuthorCredential[];
  /* Teaching focus, e.g. "Nervous drivers". Feeds Person.knowsAbout. */
  specialties?: string[];
  languages?: string[];
  /* Public profiles that prove the person exists — LinkedIn, a Google Business
     Profile contributor page, a staff page elsewhere. Feeds Person.sameAs, which
     is how Google reconciles an author identity across the web. */
  sameAs?: string[];
  /* Path under public/, e.g. "/team/first-last.webp". A real photo of the person
     only: a stock portrait presented as staff is the same fabrication as an
     invented name. */
  image?: string;
  email?: string;
  published: boolean;
};

/* Intentionally empty. See rule 1 above: this file gets its first entry when a
   real instructor's details are signed off, not before. */
export const authors: Author[] = [];

export const publishedAuthors = authors.filter((author) => author.published);

export const authorsById = Object.fromEntries(
  authors.map((author) => [author.id, author]),
) as Record<string, Author>;

export const authorProfilePath = (author: Pick<Author, "id">) => `/authors/${author.id}`;

/* Unpublished and unknown ids both resolve to undefined, so every consumer falls
   back to the organization byline instead of rendering a half-filled profile. */
export const resolveAuthor = (id?: string): Author | undefined => {
  if (!id) {
    return undefined;
  }

  const author = authorsById[id];

  return author?.published ? author : undefined;
};
