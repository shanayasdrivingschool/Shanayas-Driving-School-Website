# Images — Findings

**Scope:** image `<img>` usage in `src/` React components + image assets in `public_html/`.
**Category score: 55/100.**

## What works
- **`loading="lazy"` used on ~20 images** — good for below-the-fold deferral.
- **Long immutable cache headers** on all image types (1 year).
- Descriptive OG/social image present with `og:image:alt`.

## Findings

| # | Title | Severity | Evidence | Fix |
|---|-------|----------|----------|-----|
| 1 | Most images missing alt text | **High** | Only **4 of 28 `<img>` tags** in `src/` have an `alt` attribute (~86% missing). Hurts accessibility and image-search/eligibility, and weakens on-page context. | Add descriptive, keyword-aware `alt` to every content image (e.g. `alt="Dual-control car used for beginner driving lessons in Langford, BC"`). Decorative images get `alt=""`. |
| 2 | Images are huge and in legacy formats | **High** | 28.9 MB total; hero PNG 1.19 MB, a 1.5 MB PNG icon, course JPGs 0.5–0.7 MB each; 34 JPG / 14 PNG / **only 1 WebP / 0 AVIF**. | Convert photos to WebP/AVIF, compress, and export at real display sizes; provide `srcset`/`sizes` for responsive delivery. |
| 3 | No width/height on images (CLS) | Medium | 0 of 28 `<img>` set dimensions. | Add `width`/`height` or `aspect-ratio`. |
| 4 | ~10 MB unused image folder shipped | Medium | `course-pictures/` (17 files, 10.4 MB) has 0 `src/` references; `Course-pictures-updated/` is the live set. | Remove the unused folder from deploy. |
| 5 | Poor image filenames (spaces, caps, typos) | Low–Med | Files like `Course-pictures-updated/Beiginners...`, names with spaces (`Road Test...`, `Make...`) → `%20`-encoded URLs, a spelling typo ("Beiginners"), inconsistent casing. | Rename to lowercase, hyphenated, keyword-rich, no spaces (e.g. `beginner-driving-course.webp`). |
| 6 | 1.5 MB PNG used as an icon | Medium | `Misc/Installmenticon.png` = 1,516 KB for what should be a small UI icon. | Replace with an optimized SVG or a <10 KB PNG/WebP. |

## Quick wins
- Add `alt` to the 24 images that lack it.
- Convert + compress the hero and the installment icon.
- Rename image files to clean, lowercase, hyphenated slugs.
