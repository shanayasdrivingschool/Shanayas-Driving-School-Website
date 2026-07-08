# Action Plan — drivingschoolbc.ca

Prioritized by impact ÷ effort. Because the source repo is available, most fixes are concrete code/config changes — file paths are noted.

---

## 🔴 Phase 1 — Critical Fixes (Week 1)

1. **Kill the soft-404.** Unknown URLs currently return HTTP 200 with the homepage.
   - Add to `public_html/.htaccess`: `ErrorDocument 404 /404.html` and a real `404.html`; ensure the SPA renders a 404 view + `<meta name="robots" content="noindex">` for unmatched routes.
   - Side benefit: stops `/indexnow.txt`, `/rsl.xml` etc. from returning faux-200s.

2. **Resolve the NAP conflict.** The Maps embed says *Victoria, BC V9B 4G2*; everything else says *Langford, BC V9B 4G1*.
   - Confirm the correct address in the **Google Business Profile dashboard** first.
   - Update the embed URLs in [Index.tsx:725](src/pages/Index.tsx#L725) and [Contact.tsx:328](src/pages/Contact.tsx#L328) to the correct Place; then align Yelp, GBP, and social profiles to match the site exactly.

3. **Remove the competitor image hotlink.** `/road-test-prep/` uses `easydriversed.com` as its og:image/twitter:image/course thumbnail.
   - Replace the URLs in [courseCatalog.ts:90](src/data/courseCatalog.ts#L90) and [seoLandingPages.ts:156](src/data/seoLandingPages.ts#L156) with an owned, optimized image; rebuild.

4. **Add security headers** to `public_html/.htaccess` (`mod_headers`): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

---

## 🟠 Phase 2 — High-Impact Improvements (Weeks 2–3)

5. **Prerender unique per-route content (highest structural leverage).** The static `#seo-fallback` repeats the same 6 homepage sections on all 38 pages; real content is JS-only.
   - Update `scripts/generate-static-seo-pages.mjs` to emit each route's *real* copy into the initial HTML (not shared homepage sections). This single change lifts Technical, Content, and GEO simultaneously and would likely move GEO from ~40 into the 70s.

6. **Expand structured data** (data already exists; add emitters in the postbuild script + `SeoManager.tsx`). Templates are in `findings/schema.md`:
   - `Course` on all 14 `/courses/*`, `Service` on service pages, `BlogPosting` (3 posts, ISO dates), `BreadcrumbList` sitewide, `Organization`+`WebSite`/`SearchAction`, and `hasOfferCatalog` on LocalBusiness. Sync the drifted client vs build-time LocalBusiness objects.

7. **Image overhaul.**
   - Convert photos to WebP/AVIF + compress (hero `logos/hero-main.png` 1.19 MB → <150 KB; replace `Misc/Installmenticon.png` 1.5 MB with an SVG).
   - Add `width`/`height` (or `aspect-ratio`) to all `<img>`; add `alt` to the 24 images missing it.
   - Delete the unused `public_html/course-pictures/` folder (~10 MB) and the inert `public_html/_redirects`.

8. **Sitemap + linking hygiene.** Add `/courses/lesson-road-test-prep-course/` and `/courses/make-your-own-class/` to `sitemap.xml` and link them from the courses index; regenerate `lastmod` from real build dates; make the footer phone in [SiteFooter.tsx:186](src/components/SiteFooter.tsx#L186) a real `tel:+12505423673` link.

---

## 🟡 Phase 3 — Content & Authority (Month 2)

9. **E-E-A-T:** add real, named, credentialed instructor bios + photos on About and blog author bylines; delete the leftover template `TeamSection.tsx` before it ships fake bios.
10. **Content depth:** expand the 3 blog posts into in-depth BC-specific guides; render visible FAQ Q&A prose (not just JSON-LD); publish concrete price ranges as plain text on `/pricing/`.
11. **Reviews:** claim GBP + the existing Yelp listing (fix its city), launch a post-lesson SMS/email review request, and add `aggregateRating` only once real reviews exist. Fix the out-of-area 'Nanaimo' testimonial.
12. **Local reach:** build dedicated `[service] + [community]` landing pages for the 6 secondary areas (Sidney, Sooke, Metchosin, Duncan, Colwood, Salt Spring Island) — pricing tiers in `serviceLocations.ts` already segment them.

---

## 🟢 Phase 4 — Monitoring & Iteration (Ongoing)

13. Add a **Google API key** + verify **Search Console** to get real CrUX/CWV, indexation, and query data (and re-run this audit with field data).
14. Implement **IndexNow** properly; publish a **YouTube** video; align FB/IG display names to "Shanaya's Driving School" and add GBP/Yelp/YouTube to `sameAs`.
15. **Re-audit after prerender** to confirm raw-HTML content parity and re-score GEO/Technical.

---

### Effort vs. Impact snapshot

| Fix | Impact | Effort |
|---|---|---|
| Soft-404 (Phase 1) | High | Low |
| NAP embed correction (Phase 1) | High (local) | Low |
| Competitor image swap (Phase 1) | Medium | Very low |
| Security headers (Phase 1) | Medium | Low |
| Prerender real content (Phase 2) | **Very high** | High |
| Schema expansion (Phase 2) | High | Medium |
| Image optimization (Phase 2) | High | Medium |
| Reviews/GBP (Phase 3) | **Very high (local)** | Medium (ongoing) |
| Location pages (Phase 3) | High | High |
