/* Person / ProfilePage JSON-LD for content authors.
 *
 * Deliberately framework-free and origin-agnostic: SeoManager.tsx injects these
 * at runtime and scripts/generate-static-seo-pages.mjs writes the same objects
 * into the crawler HTML, so both read this one implementation instead of keeping
 * a third hand-maintained copy in sync.
 */
import type { Author } from "@/data/authors";
import { authorProfilePath } from "@/data/authors";

export type JsonLdObject = Record<string, unknown>;

const trimOrigin = (origin: string) => origin.replace(/\/$/, "");

export const authorProfileUrl = (origin: string, author: Pick<Author, "id">) =>
  `${trimOrigin(origin)}${authorProfilePath(author)}/`;

export const authorPersonId = (origin: string, author: Pick<Author, "id">) =>
  `${authorProfileUrl(origin, author)}#person`;

/* Full Person node. Every optional field is omitted rather than emitted empty:
   an author with no verified credentials should produce no hasCredential, not an
   empty array that reads like a missing value. */
export const buildPersonJsonLd = (
  origin: string,
  author: Author,
  publisherId: string,
): JsonLdObject => {
  const person: JsonLdObject = {
    "@type": "Person",
    "@id": authorPersonId(origin, author),
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.summary,
    url: authorProfileUrl(origin, author),
    worksFor: { "@id": publisherId },
  };

  if (author.image) {
    person.image = `${trimOrigin(origin)}${author.image}`;
  }

  if (author.email) {
    person.email = author.email;
  }

  if (author.sameAs?.length) {
    person.sameAs = author.sameAs;
  }

  if (author.specialties?.length) {
    person.knowsAbout = author.specialties;
  }

  if (author.languages?.length) {
    person.knowsLanguage = author.languages;
  }

  if (author.credentials?.length) {
    person.hasCredential = author.credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential.name,
      ...(credential.issuedBy
        ? { recognizedBy: { "@type": "Organization", name: credential.issuedBy } }
        : {}),
    }));
  }

  return person;
};

/* Article.author / Article.reviewedBy. Carries the name alongside the @id so the
   reference still reads on its own if a consumer does not resolve the graph. */
export const buildAuthorReference = (origin: string, author: Author): JsonLdObject => ({
  "@type": "Person",
  "@id": authorPersonId(origin, author),
  name: author.name,
  url: authorProfileUrl(origin, author),
});

/* Google's author-profile guidance: the page about a person is a ProfilePage
   whose mainEntity is that Person. */
export const buildProfilePageJsonLd = (
  origin: string,
  author: Author,
  publisherId: string,
): JsonLdObject => {
  const url = authorProfileUrl(origin, author);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    mainEntity: buildPersonJsonLd(origin, author, publisherId),
    publisher: { "@id": publisherId },
    inLanguage: "en-CA",
  };
};
