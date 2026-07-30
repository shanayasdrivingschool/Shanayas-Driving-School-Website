import { describe, expect, it } from "vitest";
import { authors, publishedAuthors, resolveAuthor, type Author } from "./authors";
import { creditedArticles } from "@/lib/authorCredits";
import {
  authorPersonId,
  authorProfileUrl,
  buildAuthorReference,
  buildPersonJsonLd,
  buildProfilePageJsonLd,
} from "@/lib/authorSchema";

const ORIGIN = "https://www.shanayasdrivingschool.com";
const PUBLISHER_ID = `${ORIGIN}/#localbusiness`;

/* A fully populated entry, used to exercise the schema builders without adding a
   person to the live registry. Not a real instructor — never copy this into
   authors.ts. */
const sample: Author = {
  id: "test-instructor",
  name: "Test Instructor",
  jobTitle: "Driving instructor",
  summary: "Teaches Class 7 lessons in Langford.",
  bio: ["First paragraph.", "Second paragraph."],
  instructingSince: "2019",
  credentials: [{ name: "Driving instructor licence", issuedBy: "Test issuer" }],
  specialties: ["Nervous drivers"],
  languages: ["English"],
  sameAs: ["https://example.com/test-instructor"],
  image: "/team/test-instructor.webp",
  email: "test@example.com",
  published: true,
};

describe("author registry", () => {
  it("holds the staff named by the owner", () => {
    expect(authors.map((author) => author.id)).toEqual(["joyce", "azy", "alden"]);
    expect(publishedAuthors).toHaveLength(3);
  });

  it("claims no credential, experience date or profile that was not supplied", () => {
    /* Guards rule 2 in authors.ts. These fields carry the Experience and
       Expertise signals a quality rater checks, so an entry may only gain one
       once the school can evidence it — not because a page looked empty. */
    for (const author of publishedAuthors) {
      for (const field of ["instructingSince", "credentials", "specialties", "languages", "sameAs", "image"] as const) {
        expect(
          author[field],
          `${author.id}.${field} was set — confirm it is evidenced, then allow it here`,
        ).toBeUndefined();
      }
    }
  });

  it("uses unique ids and requires the fields a profile page renders", () => {
    expect(new Set(authors.map((author) => author.id)).size).toBe(authors.length);

    for (const author of publishedAuthors) {
      expect(author.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(author.name.trim()).not.toBe("");
      expect(author.jobTitle.trim()).not.toBe("");
      expect(author.summary.trim()).not.toBe("");
      expect(author.bio.length).toBeGreaterThan(0);
    }
  });

  it("resolves only published authors, so unknown ids fall back to the org byline", () => {
    expect(resolveAuthor(undefined)).toBeUndefined();
    expect(resolveAuthor("nobody")).toBeUndefined();

    for (const author of publishedAuthors) {
      expect(resolveAuthor(author.id)).toBe(author);
    }
  });

  it("keeps every author id referenced by credited content resolvable", () => {
    /* An article pointing at a missing or unpublished id silently loses its
       byline, so catch the typo here instead of in production. Covers the
       knowledge-test guide as well as the blog, since its ids live in their own
       data module. */
    for (const article of creditedArticles) {
      for (const id of [article.authorId, article.reviewedById].filter(Boolean)) {
        expect(
          authors.some((author) => author.id === id),
          `"${article.path}" references unknown author id "${id}"`,
        ).toBe(true);
      }
    }
  });

  it("credits every article to a named author", () => {
    const uncredited = creditedArticles.filter((article) => !article.authorId);
    expect(uncredited.map((article) => article.path)).toEqual([]);
  });
});

describe("author schema", () => {
  it("builds a Person node that resolves to the profile page", () => {
    const person = buildPersonJsonLd(ORIGIN, sample, PUBLISHER_ID);

    expect(person).toMatchObject({
      "@type": "Person",
      "@id": `${ORIGIN}/authors/test-instructor/#person`,
      name: "Test Instructor",
      jobTitle: "Driving instructor",
      url: `${ORIGIN}/authors/test-instructor/`,
      worksFor: { "@id": PUBLISHER_ID },
      image: `${ORIGIN}/team/test-instructor.webp`,
      knowsAbout: ["Nervous drivers"],
      knowsLanguage: ["English"],
      sameAs: ["https://example.com/test-instructor"],
    });
    expect(person.hasCredential).toEqual([
      {
        "@type": "EducationalOccupationalCredential",
        name: "Driving instructor licence",
        recognizedBy: { "@type": "Organization", name: "Test issuer" },
      },
    ]);
  });

  it("omits optional fields instead of emitting empty ones", () => {
    const person = buildPersonJsonLd(
      ORIGIN,
      { id: "minimal", name: "Minimal", jobTitle: "Instructor", summary: "s", bio: ["b"], published: true },
      PUBLISHER_ID,
    );

    for (const key of ["image", "email", "sameAs", "knowsAbout", "knowsLanguage", "hasCredential"]) {
      expect(person).not.toHaveProperty(key);
    }
  });

  it("wraps the Person in a ProfilePage, which is what Google expects", () => {
    const profile = buildProfilePageJsonLd(ORIGIN, sample, PUBLISHER_ID);

    expect(profile["@type"]).toBe("ProfilePage");
    expect(profile.url).toBe(`${ORIGIN}/authors/test-instructor/`);
    expect(profile.mainEntity).toMatchObject({ "@id": authorPersonId(ORIGIN, sample) });
    expect(profile.publisher).toEqual({ "@id": PUBLISHER_ID });
  });

  it("references the author by @id and name for Article.author", () => {
    expect(buildAuthorReference(ORIGIN, sample)).toEqual({
      "@type": "Person",
      "@id": `${ORIGIN}/authors/test-instructor/#person`,
      name: "Test Instructor",
      url: `${ORIGIN}/authors/test-instructor/`,
    });
  });

  it("builds trailing-slash profile URLs whether or not the origin has one", () => {
    expect(authorProfileUrl(`${ORIGIN}/`, sample)).toBe(`${ORIGIN}/authors/test-instructor/`);
    expect(authorProfileUrl(ORIGIN, sample)).toBe(`${ORIGIN}/authors/test-instructor/`);
  });
});
