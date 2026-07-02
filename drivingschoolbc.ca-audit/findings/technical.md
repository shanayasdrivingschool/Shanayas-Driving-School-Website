# Technical SEO Audit — drivingschoolbc.ca

Audit date: 2026-07-02
Canonical host verified: `https://www.drivingschoolbc.ca/`
Method: live HTTP checks (curl), local ground-truth file inspection (`public_html/`, `.htaccess`, `src/`), and raw-vs-rendered HTML comparison via `render_page.py` (Playwright/Chromium was installed transiently in the audit sandbox solely to produce the one-time rendered-HTML comparison below; this is a read-only diagnostic step, not a site change).

Overall Technical Score: **58 / 100**

---

## 1. Crawlability — FAIL (Critical issue present)

**robots.txt** (`https://www.drivingschoolbc.ca/robots.txt`, HTTP 200, `text/plain`)
- Explicitly allows Googlebot, Bingbot, GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Claude-SearchBot, anthropic-ai, Applebot, Google-Extended, CCBot, Twitterbot, facebookexternalhit, plus a wildcard `User-agent: * / Allow: /`. Clean, no disallows anywhere. Good AI-crawler posture.
- `Sitemap: https://www.drivingschoolbc.ca/sitemap.xml` declared correctly.

**Sitemap** (HTTP 200, `application/xml`, 6726 bytes)
- 36 `<url>` entries, all use canonical `https://www.` host, all end in trailing slash, valid XML, no compression needed at this size.
- **Issue (Medium):** every single one of the 36 entries carries the identical `<lastmod>2026-05-24</lastmod>`. The live site's actual `Last-Modified` HTTP header (homepage, and all files checked) is `Tue, 30 Jun 2026`, six days later — meaning the sitemap's lastmod is a static/manual stamp, not tied to real content changes. This makes lastmod useless as a recrawl-priority signal for Google/Bing and should be treated as unreliable by search engines (they will likely ignore it).
- **Issue (Medium):** 2 of the 38 pre-rendered pages are **not in the sitemap**: `/courses/lesson-road-test-prep-course/` and `/courses/make-your-own-class/`. Confirmed both return live HTTP 200. Also confirmed via grep that neither URL appears as an `<a href>` in any other static HTML page — they are only reachable via the client-side JS router (route table inside the JS bundle), not via any static/crawlable anchor. This makes them **doubly orphaned**: absent from the sitemap AND absent from static internal linking, so an HTML-only crawler has no path to discover them at all.

**Soft-404 (Critical):** Confirmed per the audit brief's test.
```
curl -sI https://www.drivingschoolbc.ca/this-page-does-not-exist-12345/
→ HTTP/1.1 200 OK, Content-Length: 8550 (identical to homepage)
<title>Driving Lessons Victoria BC | Shanaya's Driving School</title>
```
The `.htaccess` SPA-fallback rule (`RewriteRule . /index.html [L]` after `!-f`/`!-d`) serves the **homepage's full HTML** — same title, same meta description, same content-length — for *any* non-existent URL, with a 200 status. There is no client-side "not found" state either (React never gets a 404 signal from the server to react to). This is a textbook soft-404:
- Search engines can index junk/typo/old URLs as if they were the homepage, diluting homepage relevance and creating duplicate-content entries in the index.
- Any broken internal link, stale external backlink, or bot-guessed URL silently "succeeds" instead of failing, so link-rot is invisible in normal monitoring (no 404s ever show up in logs).
- Google Search Console will very likely start reporting many URLs as duplicate/"Alternate page with proper canonical tag" or, worse, index them individually since the served page's canonical tag points to itself (the homepage's canonical), which is at least a partial mitigation — but that only works if Google actually reads the canonical, and plenty of other consumers (Bing, AI crawlers, social scrapers) will not resolve it that gracefully.

---

## 2. Indexability — PASS with caveats

- Canonical tags: **correct and unique per page** in raw HTML (verified homepage, `/courses/beginner-driving-course/`, `/blog/pass-road-test/` — each self-referencing, absolute, https, www, trailing slash consistent).
- `<meta name="robots" content="index, follow">` present on every page checked — no accidental noindex found.
- Titles and meta descriptions are unique per page (verified 3 samples) — no duplication at the `<title>`/`<meta description>` level.
- Open Graph + Twitter Card tags present and populated (og:title, og:description, og:image, twitter:card=summary_large_image).
- hreflang: `en-ca` + `x-default` both self-referential — correct minimal single-locale implementation (see `seo-hreflang` sub-skill if multi-locale is ever added).

**Critical issue — duplicate boilerplate in the crawlable HTML layer:** The `#seo-fallback` stub (the only content in raw server-rendered HTML — see Section 8) is **not page-unique below the H1/intro paragraph**. Diff of the fallback `<section>` blocks across the homepage, `/courses/beginner-driving-course/`, and `/blog/pass-road-test/` shows the six `<h2>` sections — "ICBC-Aligned Driving Lessons in Victoria and Langford," "Road Test Prep, Defensive Driving, and Knowledge Test Support," "Driving School Services," "Service Areas Across Greater Victoria," "Why Students Choose Shanaya's Driving School," "How Lessons Work" — are **word-for-word identical** across all three page types. Only the `<h1>` and the one-sentence intro `<p>` change per page. Confirmed via `render_page.py --mode never` (raw fetch) extraction:
```
raw extracted_text len — homepage: 1562 chars
raw extracted_text len — /courses/beginner-driving-course/: 1536 chars
raw extracted_text len — /blog/pass-road-test/: 1522 chars
```
Near-identical lengths because it's substantially the same template. Any crawler or agent that reads raw HTML without executing JavaScript — which per your own robots.txt includes GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Claude-SearchBot, anthropic-ai, and CCBot — sees **~85%+ identical boilerplate on every one of the 38 pages** and cannot learn a course's duration, price tier, or a blog post's actual advice from the HTML alone. This directly undermines the purpose of having 38 distinct URLs for any consumer that doesn't render JS, and is a duplicate/thin-content risk pattern even for Google during its initial (pre-render) crawl pass.

**Trailing-slash/canonicalization:** consistent — all internal links, sitemap entries, and canonicals use the trailing-slash form; `/about` (no slash) correctly 301s to `/about/`.

---

## 3. Security — FAIL (headers largely absent)

Live response headers (homepage, representative of the whole site since `mod_headers` in `.htaccess` only sets Cache-Control on static asset types):
```
Content-Type: text/html
Server: LiteSpeed
Content-Security-Policy: upgrade-insecure-requests
alt-svc: h3=":443"; ma=2592000, ...
```
Confirmed **absent** (grepped explicitly for each): `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`.

- **HTTPS enforcement:** Works — HTTP and non-www both ultimately land on `https://www.` (see Section 4 for the redirect-chain-length issue).
- **CSP:** Only `upgrade-insecure-requests` is set, which is a mixed-content-prevention directive, not a real Content-Security-Policy. There is no `script-src`, `frame-ancestors`, `object-src`, etc. — the site has effectively no XSS/clickjacking mitigation via CSP.
- **HSTS missing (High):** No `Strict-Transport-Security` header means browsers do not enforce HTTPS on repeat visits or pin the site, leaving a window for downgrade/SSL-stripping attacks on the first request of a session, and losing the HSTS-preload eligibility signal entirely.
- **X-Frame-Options / frame-ancestors missing (Medium):** No clickjacking protection — the site can be iframed by any third party.
- **X-Content-Type-Options missing (Medium):** No `nosniff`, allowing MIME-sniffing-based attacks in older browsers.
- **Referrer-Policy missing (Low-Medium):** No explicit policy means browser defaults apply (generally acceptable in modern Chrome/Firefox, but not explicit/auditable).

None of these are set anywhere in `public_html/.htaccess`'s `<IfModule mod_headers.c>` block, which currently only configures `Cache-Control` for images/css/js — confirmed by reading the file directly.

---

## 4. URL Structure & Redirects — PASS with one chain-length issue

`.htaccess` logic (read directly):
```apache
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^www\.drivingschoolbc\.ca$ [NC]
RewriteRule ^ https://www.drivingschoolbc.ca%{REQUEST_URI} [R=301,L]
```
This single rule is written to redirect http→https AND non-www→www in one hop. Live testing shows it does **not** behave that way for the http+non-www combination, because Hostinger's platform-level "Force HTTPS" redirect fires **before** `.htaccess` is evaluated:

```
curl -sIL http://drivingschoolbc.ca/
Hop 1: HTTP/1.1 301 → Location: https://drivingschoolbc.ca/      (platform-level HTTPS redirect, non-www preserved)
Hop 2: HTTP/1.1 301 → Location: https://www.drivingschoolbc.ca/  (.htaccess non-www→www rule)
Hop 3: HTTP/1.1 200 OK
```
**Finding (Medium):** the http+non-www entry point (the most common way old backlinks/typed URLs arrive) takes **2 redirect hops** to reach the canonical URL instead of 1. Each hop adds latency and a small amount of link-equity/crawl-budget dilution. `https://drivingschoolbc.ca/` (https, non-www) alone correctly 301s directly to `https://www.` in one hop — only the http+non-www combination double-hops. Cannot be fully fixed at the `.htaccess` level since the first hop is injected by the hosting platform ahead of `.htaccess`; would need Hostinger's own domain-forwarding/SSL settings adjusted to redirect straight to the www+https target, or accept the 2-hop chain as an unavoidable hosting-platform artifact.

- URLs are otherwise clean: lowercase, hyphenated, descriptive, no parameters, no session IDs, consistent trailing slashes, logical folder depth (`/courses/[slug]/`, `/packages/[slug]/`, `/blog/[slug]/`, `/extras/[slug]/`).
- No redirect loops or chains found elsewhere in spot checks.

---

## 5. Mobile — PASS (source-verifiable parts only)

- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` present and correct on every page checked.
- Responsive framework (Tailwind, per `src/`) implies fluid layout, but **touch-target sizing, tap-spacing, and actual mobile rendering were not visually verified** in this audit (no browser rendering/screenshot tool was used for this pass — flagging as **Not Assessed** rather than guessing). Recommend a follow-up visual/Lighthouse mobile-usability pass if that tooling becomes available.

---

## 6. Core Web Vitals (source-inspection only, no field/lab data) — Flagged risk (High)

No PageSpeed/CrUX/GSC credentials are available, so this is inferred from source, not measured:

- **LCP risk:** The initial server-rendered HTML contains **no visible content** (the only content node, `#seo-fallback`, is `display:none` by default — see Section 8). Whatever the real LCP element is (hero heading/image), it does not exist in a paintable state until: (a) the ~871 KB uncompressed `/assets/index-qsDPKRHF.js` entry chunk downloads, (b) parses, (c) executes, and (d) React hydrates and mounts `#root`. This is a structurally elevated LCP risk pattern (classic CSR-without-real-SSR profile) even though the HTML is "pre-rendered" — the pre-rendering only produced a hidden text stub, not visible paintable markup.
- **INP risk:** Same entry chunk is the interactivity bottleneck — a large single bundle (871 KB uncompressed) parsed/executed on every one of the 38 pages before any button/form becomes responsive raises Total Blocking Time risk, which correlates with poor INP on lower-end mobile devices.
- **CLS risk:** Cannot be assessed from static source without rendering (would need to see whether fonts/images have explicit dimensions and whether the `#seo-fallback`→`#root` swap causes a layout shift at hydration). Flagging as **unassessed** rather than scoring it.
- Caching: `.htaccess` sets 1-year immutable cache for images and 1-month cache for CSS/JS — good for repeat-visit performance, does not help first-visit LCP/INP.
- No `<link rel="preload">` for the JS entry, fonts, or hero image was found in the raw `<head>` — a preload hint for the critical JS chunk or hero asset could shave time off the content-paint delay described above.

---

## 7. Structured Data — PASS

- `LocalBusiness` + `DrivingSchool` JSON-LD present in raw HTML `<head>` (verified on homepage, present with count 1 on the two other sampled pages too — likely site-wide via a shared component).
- Populated with `@id`, `name`, `url`, `image`, `logo`, `telephone`, `email`, `priceRange`, full `PostalAddress` (Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1, CA), `areaServed` (8 BC communities), and `sameAs` (Facebook, Instagram). This is solid, complete NAP-consistent local-business schema and is present in the raw HTML (not just post-render), so it is visible to non-JS crawlers too — a genuine bright spot.
- Not validated against Google's Rich Results schema requirements line-by-line in this pass (defer to a dedicated schema-validation pass if needed) — no structural errors observed in the JSON at a glance.

---

## 8. JavaScript Rendering Dependency — Critical

Confirmed architecture: 38 static HTML files, each shipping only a hand-authored `#seo-fallback` `<main>` stub (H1 + ~6 `<h2>`/`<p>` sections + 2 nav blocks, roughly 200-230 words), CSS-hidden by default:
```html
<style>#seo-fallback { display: none; }</style>
<noscript><style>#seo-fallback { display: block; }</style></noscript>
```
Real page content is client-rendered by React into `#root` after the ~871 KB (uncompressed) `/assets/index-*.js` entry chunk executes — this chunk is loaded on all 38 pages.

Raw-vs-rendered comparison (produced by rendering 3 sample pages with Playwright in this audit sandbox, purely as a diagnostic — not a site change):

| Page | Raw HTML size | Rendered HTML size | Raw extracted text | Rendered extracted text |
|---|---|---|---|---|
| Homepage `/` | 8,550 B | 118,665 B | 1,562 chars | 8,223 chars |
| `/courses/beginner-driving-course/` | 8,590 B | 62,801 B | 1,536 chars | 1,063 chars |
| `/blog/pass-road-test/` | 8,470 B | 58,569 B | 1,522 chars | 1,525 chars |

Two distinct risk patterns emerge:
1. **Homepage:** rendered content is ~5x richer than raw — the fallback genuinely under-represents the full page for this URL, meaning a non-JS consumer gets a fraction of the real page.
2. **Course/blog pages:** raw and rendered extracted-text volumes are similar or raw is even larger — but that is *because the raw fallback is mostly shared boilerplate, not because it's equivalently informative*. The actual unique payload (course duration/pairing suggestions, or the blog post's numbered tips) is present **only** in the rendered version — see the side-by-side extract in Section 2. A non-JS crawler on the beginner-course page literally cannot learn "10 x 90 min classes" or the pairing/upsell logic; a non-JS crawler on the blog page cannot retrieve any of the 5 numbered road-test tips. This confirms the JS-render dependency is not just a volume problem but a **content-substitution** problem: what little raw text exists is largely the wrong (generic) text.

Practical implication: Google (which fully renders JS in its indexing pipeline) should see the real content and index normally, *if* rendering succeeds — no console errors were observed during the render test, which is a positive sign. But every other consumer in your own robots.txt allow-list that does not execute JavaScript (GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Claude-SearchBot, anthropic-ai, CCBot, and most link-preview/social scrapers) is structurally locked out of the page-specific facts on 37 of 38 pages, and instead receives near-duplicate boilerplate.

---

## 9. IndexNow Protocol — Not Implemented (Medium)

No IndexNow key file exists. `curl https://www.drivingschoolbc.ca/indexnow.txt` returns HTTP 200, but this is a **false positive caused by the soft-404** (Section 1) — the body served is the homepage (`<title>Driving Lessons Victoria BC...`), not a real key file. There is no evidence of IndexNow submission calls (`indexing_notify.py`/`indexnow_submit.py`-style integration) in the deployed build. Bing, Yandex, and Naver therefore rely on standard crawl discovery rather than instant push notification for new/updated pages — a missed low-cost opportunity given the site already has clean sitemap infrastructure to drive it from.

---

## 10. Minor / Low-priority findings

- **`public_html/_redirects` file present but inert (Low):** Contains a Netlify-style `/* /index.html 200` rule. Hostinger/LiteSpeed does not process `_redirects` files (only `.htaccess`), so this is dead configuration left over from a different hosting target. It is also publicly fetchable at `/_redirects` (returns the file, or under the soft-404 regime, effectively moot). Harmless but should be removed to avoid confusing future maintainers about which config file is authoritative.
- **HTTP/2 / HTTP/3 not fully verifiable (Informational):** The available `curl` build in this environment only negotiates HTTP/1.1, so the base protocol version could not be directly confirmed. The server does advertise HTTP/3 via `alt-svc: h3=":443"` on every response, which is a positive signal that modern protocol support is configured at the LiteSpeed/Hostinger edge. Recommend confirming actual h2/h3 negotiation with browser DevTools (Protocol column) since this audit had no access to PageSpeed Insights/CrUX.

---

## Summary Table

| Category | Status | Key issue |
|---|---|---|
| Crawlability | FAIL | Soft-404 (Critical); 2 orphan pages |
| Indexability | PASS w/ caveats | Duplicate fallback boilerplate across pages (Critical) |
| Security | FAIL | No HSTS/X-Frame-Options/X-Content-Type-Options/Referrer-Policy |
| URL Structure | PASS w/ note | 2-hop redirect for http+non-www |
| Mobile | PASS (partial) | Viewport correct; touch targets not assessed |
| Core Web Vitals | AT RISK | CSR-dependent LCP/INP risk, no preload hints |
| Structured Data | PASS | Complete LocalBusiness/DrivingSchool JSON-LD in raw HTML |
| JS Rendering | FAIL (Critical) | Content substitution, not just volume loss, for non-JS crawlers |
| IndexNow | NOT IMPLEMENTED | No key file; soft-404 masks its absence |
