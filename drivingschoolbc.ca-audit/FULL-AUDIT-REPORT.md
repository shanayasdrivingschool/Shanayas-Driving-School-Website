# Full SEO Audit — drivingschoolbc.ca

**Site:** https://www.drivingschoolbc.ca/ · **Brand:** Shanaya's Driving School
**Business type:** Local Service — Driving School (Service Area Business / hybrid; Langford + Greater Victoria, BC)
**Pages analyzed:** 38 (all pre-rendered routes) · **Audit date:** 2026-07-02

> **Method & limitations.** This audit used the deployed static build (`public_html/`), the React source, and live HTTP checks — an unusually high-fidelity dataset because the source repo was available. No Google (PageSpeed/CrUX/GSC/GA4), Moz, Bing, or DataForSEO credentials were configured, so **performance is lab/asset-based (not field data)** and **local/GBP findings are inferred from on-site signals + public fetches, not API-verified**. Items needing owner-side confirmation are flagged.

---

## Executive Summary

### SEO Health Score: **61 / 100** — *Fair; strong fundamentals capped by three structural issues*

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 58 |
| Content Quality & E-E-A-T | 23% | 52 |
| On-Page SEO | 20% | **88** |
| Schema / Structured Data | 10% | 58 |
| Performance (CWV, lab) | 10% | 58 |
| AI Search Readiness (GEO) | 10% | 40 |
| Images | 5% | 55 |
| *Local SEO (conditional)* | *outside core score* | *38* |

The site has an **excellent on-page and metadata layer** and genuinely good AI-crawler hygiene (robots.txt + a comprehensive llms.txt). Its ceiling is set by one architectural decision — **client-side rendering with a thin, duplicated static fallback** — plus a **soft-404 configuration** and a **local NAP conflict**. Fixing those three would lift multiple categories at once.

### Top 5 Critical Issues
1. **Soft-404 → everything returns HTTP 200.** A made-up URL returns the homepage with a 200 status (verified). Broken/removed/mistyped URLs are indexable duplicates, and missing files (`indexnow.txt`, `rsl.xml`) get faux-200s.
2. **Client-rendered content invisible to non-JS crawlers.** Raw HTML is ~205 words vs ~1,213 rendered (~17%). All AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) and Google's pre-render pass see only a stub.
3. **~90% duplicate crawl-time content.** The static `#seo-fallback` repeats the same 6 homepage sections on all 38 pages — only H1 + one sentence differ.
4. **NAP conflict (local).** The Google Maps embed on the homepage and Contact page points to **"Victoria, BC V9B 4G2"** while schema/footer/llms.txt say **"Langford, BC V9B 4G1."**
5. **Competitor image hotlinked.** `/road-test-prep/` uses `easydriversed.com` as its og:image, twitter:image, and course thumbnail.

### Top 5 Quick Wins
1. Add `ErrorDocument 404` + a real 404 route (kills soft-404 + faux-200 files).
2. Correct the Maps embed to the Langford V9B 4G1 address (reconcile in GBP first).
3. Swap the competitor-hotlinked image for an owned asset (`courseCatalog.ts` / `seoLandingPages.ts`).
4. Add a security-headers block to `.htaccess` (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
5. Add the 2 orphan pages to the sitemap + regenerate `lastmod`; add `alt` text to 24 images; make the footer phone a `tel:` link.

---

## 1. Technical SEO — 58/100

**Strengths:** clean robots.txt (all major search + AI bots allowed, sitemap declared); correct canonical/titles/meta/`index,follow` in raw HTML; HTTPS + non-www→www redirects; clean URL structure; LocalBusiness JSON-LD in raw HTML; HTTP/2+HTTP/3 and gzip enabled.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | Soft-404 serves homepage as 200 for any URL | **Critical** | `curl` to a made-up URL → 200, Content-Length 8550, identical `<title>`/`<h1>` to homepage | `ErrorDocument 404` + real 404 template; SPA emits true 404/noindex for unknown routes |
| 2 | Near-duplicate boilerplate raw HTML across 38 pages | **Critical** | 6 `<h2>` fallback sections byte-identical on home/course/blog; only H1+intro differ | Prerender unique per-route content |
| 3 | CSR — critical facts absent from raw HTML | **Critical** | ~205 raw vs ~1,213 rendered words; 850–871 KB JS entry on all pages | True SSR/SSG or full-fidelity prerender |
| 4 | Missing security headers | **High** | Only `CSP: upgrade-insecure-requests`; HSTS/X-CTO/X-Frame/Referrer/Permissions absent (live) | Add `mod_headers` block in `.htaccess` |
| 5 | Structural LCP/INP risk | **High** | No visible content in raw HTML; 850 KB JS must download/parse before hydration; no preload | Preload entry JS + hero; split/reduce entry bundle |
| 6 | Stale/uniform sitemap `lastmod` | Medium | All 36 URLs = `2026-05-24`; live `Last-Modified` = 2026-06-30 | Generate `lastmod` from real build dates |
| 7 | 2 orphan pages | Medium | `/courses/lesson-road-test-prep-course/`, `/courses/make-your-own-class/` — 200 but not in sitemap or static links | Add to sitemap + link from courses index |
| 8 | http+non-www = 2 redirect hops | Medium | hop1→https non-www (platform), hop2→www (.htaccess) | Set Hostinger forwarding straight to https+www |
| 9 | IndexNow faux-present; stray `_redirects` | Low | `/indexnow.txt` 200 only via soft-404; inert Netlify `_redirects` in build | Real IndexNow key; delete `_redirects` |

## 2. Content Quality & E-E-A-T — 52/100

**Strengths:** clear entity definition + FAQPage schema; plain, readable prose; real contact/policy infrastructure; accurate ICBC guidance; llms.txt.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | ~90% duplicate crawl-time content | **Critical** | Same 6 sections on every static page (~220 words) | Prerender unique per-route content |
| 2 | Thin blog posts | High | ~230–330 words (`blogPosts.tsx`) vs ~1,500 floor | Expand into BC-specific, sourced guides |
| 3 | No credentialed instructors | High | About has no team; only dead `TeamSection.tsx` with template roles | Add real bios/credentials/photos + blog bylines; delete template |
| 4 | Unverifiable testimonials & trust claims | Medium | 8 hardcoded 5-star quotes (one 'Nanaimo', out of area); bare 'Licensed/Insured' chips | Source real reviews; substantiate claims |
| 5 | Freshness not machine-readable | Medium | Plain-text dates; no BlogPosting schema | Emit BlogPosting w/ ISO dates + author |

## 3. On-Page SEO — 88/100  *(strongest area)*

**Strengths:** unique intent+location titles on all 38 pages; unique meta descriptions (76–154 chars); exactly one H1/page; self-referencing canonicals; `index,follow`; full hreflang + OG/Twitter.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | 2 pages orphaned from sitemap/links | Medium | See technical #7 | Add to sitemap + internal links (or noindex) |
| 2 | Internal linking depends on JS | Medium | Static fallback exposes ~7 links; full mesh client-rendered | Prerender nav + footer links |
| 3 | Seniors title/keyword mismatch; 4 short descriptions | Low | `seniors-driving-course` title = 'Enhanced Road Assessment'; 4 descs <90 chars | Align title to query; expand descriptions |

## 4. Schema / Structured Data — 58/100

**Strengths:** valid LocalBusiness+DrivingSchool on all pages (consistent `@id`, in raw HTML); FAQPage on 7 pages; no deprecated types; no fabricated ratings. Full generated JSON-LD is in `findings/schema.md`.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | No Course schema on 14 course pages | High | Only LocalBusiness present; pricing/duration data unused | Generate Course per page (§6.1) |
| 2 | No Service schema on service pages | High | 6 service pages have no Service markup | Generate Service (§6.2) |
| 3 | No BreadcrumbList; no Organization/WebSite+SearchAction | Medium | Working `/search?q=` never exposed | Add Breadcrumb + Org/WebSite (§6.3–6.4) |
| 4 | No BlogPosting on 3 posts | Medium | Real author/date unused; non-ISO dates | Add BlogPosting (§6.5) |
| 5 | LocalBusiness missing geo/hours/hasOfferCatalog; source drift | Medium | Confirmed absent; SeoManager vs postbuild differ | Add hasOfferCatalog now; geo/hours when real; sync sources |

## 5. Performance (Core Web Vitals — lab/asset) — 58/100

> No field data (no PSI/CrUX key). Confirm real LCP/INP/CLS via PageSpeed Insights once a key is added.

**Strengths:** HTTP/2+HTTP/3; gzip; long immutable caching; route-level code-splitting (104 chunks).

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | JS blocks first paint | High | 850 KB (263 KB gzip) entry on all 38 pages before content | SSR/SSG; split/defer; preload |
| 2 | Very heavy images | High | 28.9 MB raster; 1.19 MB hero PNG; 1.5 MB icon; ~1 WebP/0 AVIF | WebP/AVIF, compress, srcset |
| 3 | Render-blocking CSS; no dims; 10 MB dead images | Medium | 130 KB CSS; 0/28 img with w/h; unused `course-pictures/` | Critical-CSS + purge; add dims; delete folder |

## 6. AI Search Readiness (GEO) — 40/100

**Strengths:** all major AI crawlers allowed; llms.txt live, linked, and comprehensive; per-page metadata + JSON-LD in raw HTML.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | Raw HTML ~80% thinner than rendered | **Critical** | ~205 vs ~1,213 words; 5/6 stub sections identical across pages | Prerender/SSG all routes |
| 2 | Competitor image as og:image | High | `/road-test-prep/` → `easydriversed.com` (og/twitter/course), from `courseCatalog.ts:90` & `seoLandingPages.ts:156` | Replace with owned image |
| 3 | FAQ only in JSON-LD; prices not crawlable text | High | Q&As not in visible `<p>`; prices exist in data model but not surfaced reliably | Render visible Q&A + concrete price ranges |
| 4 | Thin brand/sameAs | Medium | sameAs = FB+IG only (branded 'Driving School BC'); Yelp unclaimed; no GBP/YouTube | Add GBP/Yelp, align names, publish video |

*Platform estimates (inferred, not live-tested): Google AI Overviews ~60 (renders JS), ChatGPT ~32, Perplexity ~32, Bing Copilot ~47.*

## 7. Images — 55/100

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | Most images missing alt | High | 4/28 `<img>` in `src/` have alt (~86% missing) | Add descriptive alt; `alt=""` for decorative |
| 2 | Huge legacy formats + 1.5 MB icon | High | 34 JPG/14 PNG/1 WebP/0 AVIF; `Installmenticon.png` 1.5 MB | WebP/AVIF, compress, SVG icon |
| 3 | No dims; bad filenames; dead folder | Medium | 0/28 w/h; spaces/caps/'Beiginners' typo; unused 10.4 MB folder | Add dims; rename slugs; delete folder |

## 8. Local SEO — 38/100  *(conditional; critical for a driving school)*

**Strengths:** LocalBusiness/DrivingSchool schema everywhere (NAP, 8 service areas, sameAs, makesOffer); locally-flavored service pages; clickable Contact tel:/mailto:; a live (unclaimed) Yelp listing; clean llms.txt NAP.

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | NAP conflict: Maps embed vs canonical | **Critical** | Embed on `Index.tsx:725` & `Contact.tsx:328` = 'Victoria, BC V9B 4G2'; rest of site = 'Langford, BC V9B 4G1'; Yelp shows 'Victoria' | Confirm in GBP; make all sources match exactly |
| 2 | Zero reviews; no aggregateRating | High | Yelp 'New on Yelp' (0 reviews); testimonials hardcoded | Claim GBP; review-request flow; add rating when real |
| 3 | No hours/geo anywhere | High | No openingHoursSpecification/geo; no visible hours | Publish hours; add geo + hours to schema |
| 4 | No dedicated location pages | Medium | 6 secondary communities get 1 sentence each on Contact | Build [service]+[community] pages |
| 5 | Footer phone not tel:; social name mismatch; area copy off | Medium | '250-LICENSE' text; FB/IG = 'Driving School BC'; fallback lists Saanich/Oak Bay (not in areaServed) | Add tel:; align names; reconcile area list |

---

## Appendix — Artifacts
- `findings/technical.md`, `content.md`, `on-page.md`, `schema.md` (incl. ready-to-paste JSON-LD), `performance.md`, `geo.md`, `images.md`, `local.md`
- `audit-data.json` — structured envelope for report generation
- `ACTION-PLAN.md` — prioritized roadmap
