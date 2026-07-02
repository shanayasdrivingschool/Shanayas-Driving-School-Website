# Performance (Core Web Vitals — lab/asset analysis) — Findings

**Note:** No field data available (no PageSpeed Insights / CrUX API key, no GSC). This is a **lab/asset-based** assessment from the deployed build; real-user CWV should be confirmed via PageSpeed Insights or Search Console once available.
**Category score: 58/100** — architecture and asset weight are the main risks.

## What works
- **HTTP/2 + HTTP/3 (QUIC) advertised** (`alt-svc` header) on LiteSpeed.
- **gzip enabled** on HTML/JS/CSS.
- **Long-cache immutable headers** for images (1yr) and hashed JS/CSS (30d) via `.htaccess` — good repeat-visit performance.
- **Code-splitting is in place** — 104 route/vendor chunks, so non-home routes lazy-load their own code.

## Findings

| # | Title | Severity | Evidence | Fix |
|---|-------|----------|----------|-----|
| 1 | Content is client-rendered — JS blocks first paint | **High** | Every one of the 38 pages loads a single **850 KB (263 KB gzipped) entry chunk** (`assets/index-qsDPKRHF.js`) that must download, parse, and execute before the real content appears. The initial HTML shows only a hidden ~220-word fallback stub. On mid/low-end mobile this hurts LCP, TBT and INP. | Move to true prerendering/SSR that ships the real content in HTML (so LCP text/image is in the initial response), and/or split the entry chunk and defer non-critical JS. |
| 2 | Very heavy, unoptimized images | **High** | 28.9 MB of raster images in the build. Hero `logos/hero-main.png` = 1.19 MB PNG (likely the LCP element); `Misc/Installmenticon.png` = **1.5 MB for an icon**; course photos ~0.5–0.7 MB JPG each; only 1 WebP, 0 AVIF. | Convert photos to WebP/AVIF, compress, and size to display dimensions. Target hero < 150 KB. Serve responsive `srcset`. (See images.md.) |
| 3 | ~10 MB of unused images deployed | Medium | The `course-pictures/` folder (17 files, **10.4 MB**) has **0 references** in `src/`; the app uses `Course-pictures-updated/`. Dead weight in the deploy. | Delete the unused folder from the build/deploy (verify first). |
| 4 | Render-blocking CSS, not critical-inlined | Medium | Single 130 KB `assets/index-*.css` loaded via `<link rel="stylesheet">` in `<head>` — render-blocking. No critical-CSS inlining. | Inline critical CSS and/or defer the rest; ensure unused Tailwind is purged (130 KB suggests room to trim). |
| 5 | No image dimensions → layout shift (CLS) risk | Medium | 0 of 28 `<img>` in source set `width`/`height` (or aspect-ratio). Images reflow as they load. | Add explicit `width`/`height` or CSS `aspect-ratio` to all images. |
| 6 | Large entry chunk likely bundles admin/affiliate/checkout code | Low–Med | Chunks like `AdminDashboard`, `AffiliateSignup`, `Checkout`, `adminCrudApi` exist; confirm they are lazy-loaded and not pulled into the public entry graph. | Verify route-level code-splitting keeps admin/portal/checkout code out of the public entry chunk. |

## Quick wins
- Compress/convert the hero + the 1.5 MB icon (biggest single wins for LCP + bandwidth).
- Delete the unused `course-pictures/` folder (~10 MB).
- Add `width`/`height` to images to kill CLS.

## Recommended verification
Run PageSpeed Insights (mobile) on the homepage + one course page and capture LCP/INP/CLS; add a Google API key so future audits pull CrUX field data.
