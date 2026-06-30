# Website Optimization Report

Status: Completed
Date: 2026-03-19

## Baseline

Baseline recorded from the current repository state at the start of this pass:

- Production builds already succeeded and the app was already route-split, but several media-heavy and runtime-heavy areas still remained.
- Large public assets still in active use included:
  - `public/Misc/Installmenticon.png` at `1,552,262` bytes
  - `public/Misc/HeroSectionVid.webm` at `1,474,648` bytes
  - `public/logos/hero-main.png` at `1,275,311` bytes
  - `public/logos/contact-hero.png` at `1,196,398` bytes
- The homepage process section used the original PNG illustration set, and those images remain visually closer to the intended design than the SVG alternatives.
- Some shared and below-the-fold image surfaces were still missing `loading="lazy"`, `decoding="async"`, or useful `sizes` hints.
- The homepage safety ticker continued animating with `requestAnimationFrame` even when offscreen or when the document was hidden.
- The homepage hero poster still came from a remote YouTube thumbnail URL.

## Implemented Changes

Confirmed changes from this run only:

- Homepage process media:
  - Kept the original PNG illustration set in `src/pages/Index.tsx` because the SVG alternatives were not visually equivalent.
  - Added `loading="lazy"` and `decoding="async"` to the process section images.

- Homepage runtime behavior:
  - Updated the safety ticker in `src/pages/Index.tsx` to stop animating when the section is offscreen or when the tab is hidden, then resume when visible again.
  - Added `loading="lazy"` and `decoding="async"` to homepage blog card images.
  - Added `decoding="async"` to the homepage mascot images without changing layout or placement.

- Shared scroll/runtime cleanup:
  - Updated `src/components/ScrollToTopButton.tsx` to throttle scroll visibility checks with `requestAnimationFrame` and avoid redundant state updates.
  - Kept `src/components/ScrollToTop.tsx` on a simple route-reset/manual scroll-restoration flow.
  - Kept `src/components/SiteHeader.tsx` on `requestAnimationFrame`-throttled scroll updates and decode-hinted logo images.
  - Updated `src/components/WhyChooseCarousel.tsx` to keep autoplay paused when offscreen or when the document is hidden, while preserving visible behavior.

- Shared image-delivery improvements:
  - Added safe loading/decoding improvements in:
    - `src/components/SiteFooter.tsx`
    - `src/components/SiteCtaSection.tsx`
    - `src/components/HeroSection.tsx`
    - `src/components/PortfolioSection.tsx`
    - `src/pages/Blog.tsx`
    - `src/pages/BlogPost.tsx`
    - `src/pages/Careers.tsx`
    - `src/pages/Courses.tsx`
    - `src/pages/NewcomersGuide.tsx`
  - Added responsive `sizes` hints where card and grid image widths are predictable.

- Shared page heroes:
  - Kept `src/components/PageNameSection.tsx` visually unchanged while using eager/high-priority loading with async decoding for page-header background images.

## Validation

Confirmed validation results:

- `npm run build` completed successfully after the combined local and delegated changes.
- The latest successful build emitted split route chunks including:
  - `assets/admin-x1zH_NiW.js` at `214.22 kB` (`47.96 kB` gzip)
  - `assets/data-hi0AoRJK.js` at `205.08 kB` (`55.25 kB` gzip)
  - `assets/vendor-Mi96xGGu.js` at `195.02 kB` (`62.06 kB` gzip)
  - `assets/react-vendor-BgRJP7CU.js` at `145.44 kB` (`46.89 kB` gzip)
  - `assets/motion-BtGYHWNT.js` at `109.95 kB` (`36.26 kB` gzip)
  - `assets/index-CQIyNe7k.js` at `54.80 kB` (`16.80 kB` gzip)
- No build-time TypeScript or bundling errors were observed in the final build run.
- The change set was limited to asset-source swaps, loading hints, and runtime throttling/pausing. No intentional visual redesigns or layout changes were introduced.

Manual note:

- No screenshot diff automation was available in this run. Final browser review is still recommended on home, courses, and representative inner pages.

## Residual Risks

Known issues that still remain:

- The homepage hero poster is still a remote YouTube thumbnail source in `src/pages/Index.tsx`.
- Several oversized local PNG assets remain good candidates for careful WebP, AVIF, or smaller PNG re-encoding:
  - `public/Misc/Installmenticon.png`
  - `public/logos/hero-main.png`
  - `public/logos/contact-hero.png`
- The course images in `src/data/courseCatalog.ts` still use signed remote URLs, so they continue to depend on external availability and can expire.
- `src/components/PageNameSection.tsx` still uses a single source image without `srcSet`.
- Some decorative animations remain by design, including the floating installment offer idle animation. They were left unchanged to avoid visual drift.

## Next Steps

Recommended follow-up work:

- Replace the remote hero poster with a local poster asset under `public/Misc`.
- Convert the largest remaining PNG assets to optimized WebP, AVIF, or smaller PNG derivatives at the same display sizes.
- Replace the signed remote course images in `src/data/courseCatalog.ts` with local optimized copies.
- Extend `src/components/PageNameSection.tsx` with responsive `srcSet` support for large hero backgrounds.
- Review the floating installment animation and any remaining always-on motion for optional idle-state reductions after visual QA.

