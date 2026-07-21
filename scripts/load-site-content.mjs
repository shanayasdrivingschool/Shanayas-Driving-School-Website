/* Loads the real page data out of src/ at build time, through Vite's SSR
 * pipeline, so the static generator never needs a second copy of it.
 *
 * Two things depend on this:
 *  - Blog post bodies live in blogPosts.tsx as ReactNode, so they only exist
 *    once React runs. Crawlers that don't execute JS (most AI crawlers) would
 *    otherwise see the generic #seo-fallback boilerplate instead of the article.
 *  - The generator duplicates titles, descriptions and FAQs that already live
 *    in src/. Loading the originals lets it assert the two agree.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

export const loadSiteContent = async () => {
  /* configFile: false skips vite.config.ts on purpose — the app config pulls in
     the SWC React plugin and the dev tagger, neither of which this needs. The
     alias and JSX settings below are the only parts src/ depends on here. */
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
    resolve: { alias: { "@": path.join(projectRoot, "src") } },
    esbuild: { jsx: "automatic" },
  });

  try {
    const [
      { blogPosts },
      { seoLandingPages },
      { courseCatalog },
      { packageCatalog },
      { optionalExtras },
      { courseModulesById },
    ] = await Promise.all([
      server.ssrLoadModule("/src/data/blogPosts.tsx"),
      server.ssrLoadModule("/src/data/seoLandingPages.ts"),
      server.ssrLoadModule("/src/data/courseCatalog.ts"),
      server.ssrLoadModule("/src/data/packageCatalog.ts"),
      server.ssrLoadModule("/src/data/optionalExtras.ts"),
      server.ssrLoadModule("/src/data/courseModules.ts"),
    ]);

    return {
      blogPosts: new Map(
        blogPosts.map((post) => [
          post.slug,
          {
            html: renderToStaticMarkup(
              createElement(StaticRouter, { location: `/blog/${post.slug}` }, post.content),
            ),
            title: post.title,
            seoTitle: post.seoTitle,
            description: post.description,
            author: post.author,
            date: post.date,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            readTime: post.readTime,
            category: post.category,
          },
        ]),
      ),
      landingPages: new Map(
        seoLandingPages.map((page) => [
          `${page.path}/`,
          {
            title: page.title,
            description: page.metaDescription,
            faqs: page.faqs ?? [],
            h1: page.h1,
            heroDescription: page.heroDescription,
            intro: page.intro ?? [],
            sections: page.sections ?? [],
            serviceAreaTitle: page.serviceAreaTitle,
            serviceAreas: page.serviceAreas ?? [],
            testimonial: page.testimonial,
            relatedLinksTitle: page.relatedLinksTitle,
            relatedLinks: page.relatedLinks ?? [],
          },
        ]),
      ),
      products: new Map([
        ...courseCatalog.map((course) => [
          `/courses/${course.id}/`,
          {
            h1: course.title,
            description: course.description,
            meta: [course.level, course.deliveryFormat, course.duration].filter(Boolean),
            detail: course.detail,
            bulletsTitle: "What this course covers",
            bullets: course.highlights ?? [],
            outlineSections: courseModulesById[course.id] ?? [],
          },
        ]),
        ...packageCatalog.map((item) => [
          `/packages/${item.id}/`,
          {
            h1: item.title,
            description: item.heroDescription || item.description,
            meta: [],
            paragraphs: item.overview ?? [],
            bulletsTitle: "What you get",
            bullets: item.outcomes ?? [],
            outlineSections: item.outlineSections ?? [],
          },
        ]),
        ...optionalExtras.map((extra) => [
          `/extras/${extra.id}/`,
          {
            h1: extra.title,
            description: extra.description,
            meta: [],
            detail: extra.detail,
            bulletsTitle: "Details",
            bullets: extra.highlights ?? [],
            outlineSections: extra.outlineSections ?? [],
          },
        ]),
      ]),
    };
  } finally {
    await server.close();
  }
};
