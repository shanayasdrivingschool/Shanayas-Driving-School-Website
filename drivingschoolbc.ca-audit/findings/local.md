# Local SEO — Findings

**Business:** Shanaya's Driving School — ICBC-aligned driving school
**Business type detected:** Hybrid (Service Area Business with a staffed office address; instruction is delivered in-vehicle across the service area, not primarily at the office)
**Industry vertical detected:** Home/Local Services — Driving School (closest schema.org fit: `DrivingSchool`, a subtype of `LocalBusiness`/`EducationalOrganization`)
**Category score: 38/100**

## Score breakdown

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| GBP Signals | 25% | 40/100 | 10.0 |
| Reviews & Reputation | 20% | 20/100 | 4.0 |
| Local On-Page SEO | 20% | 55/100 | 11.0 |
| NAP Consistency & Citations | 15% | 25/100 | 3.75 |
| Local Schema Markup | 10% | 55/100 | 5.5 |
| Local Link & Authority Signals | 10% | 25/100 | 2.5 |
| **Total** | | | **~37/100 → 38** |

## What works

- **`LocalBusiness` + `DrivingSchool` JSON-LD is present on every page**, both client-injected (`src/components/SeoManager.tsx`) and baked into the static pre-rendered HTML by `scripts/generate-static-seo-pages.mjs` — so non-JS crawlers still see the schema (confirmed by inspecting `public_html/index.html`, `public_html/contact/index.html`, `public_html/about/index.html`, etc.).
- Schema includes `name`, `address` (full `PostalAddress`), `telephone`, `email`, `url`, `image`, `logo`, `description`, `priceRange`, `areaServed` (8 named communities), `sameAs`, and `makesOffer` — a solid baseline of required + several recommended properties.
- **Topical service pages exist and are locally flavored**: `/driving-lessons/`, `/defensive-driving/`, `/road-test-prep/`, `/road-test-vehicle/`, `/intensive-driving-course/`, `/pricing/`, `/faq/` each mention Victoria/Langford/Westshore in the body copy — this is directionally aligned with the "dedicated service pages" ranking factor.
- `llms.txt` (`public/llms.txt` → `public_html/llms.txt`) publishes a clean, internally-consistent NAP block (Langford address, correct phone/email) for AI answer engines — good AI-visibility hygiene, and it does NOT repeat the Victoria/Langford conflict described below.
- Contact page has clickable `tel:+12505423673` and `mailto:` links, and a "By appointment – Free parking available" note (React-rendered).
- A live, indexable **Yelp citation was found and verified by direct fetch** (see NAP audit) — the business is discoverable in at least one Tier 1-adjacent directory.

## NAP consistency audit (source comparison)

| Source | Name | Address | Phone | Verified how |
|---|---|---|---|---|
| **On-site JSON-LD (canonical)** | Shanaya's Driving School | Unit 124, 2770 Leigh Rd, **Langford**, BC **V9B 4G1** | +1-250-542-3673 | Read `src/components/SeoManager.tsx`, confirmed baked into `public_html/index.html`, `/contact/index.html` |
| On-site footer (`SiteFooter.tsx`, all pages) | Shanaya's Driving School | Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1 | Shown only as vanity text "250-LICENSE" (decodes correctly to 5423673 on a phone keypad, but is **not a `tel:` link**) | Read source |
| On-site Contact page body text | Shanaya's Driving School | Unit 124, 2770 Leigh Rd, Langford, British Columbia V9B 4G1 | +1 (250) 542-3673 (clickable `tel:`) | Read source |
| **Google Maps embed** (identical iframe on Homepage `Index.tsx` and `/contact/`) | — (map pin only) | 2770 Leigh Rd **#124, Victoria, BC V9B 4G2** | — | Read source; embed URL contains a fixed Google Place ID/CID `0x548f0d12a28feb31:0x7844eb9adc8db1de` and the literal string `"2770 Leigh Rd #124, Victoria, BC V9B 4G2, Canada"` |
| `llms.txt` | Shanaya's Driving School | Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1 | +1 250-542-3673 | Read `public_html/llms.txt` |
| **Yelp.ca** (fetched directly at a guessed/resolved URL) | Shanaya's Driving School | 2770 Leigh Road, Unit 124, **Victoria, BC** V9B 4G1 | (250) 542-3673 | `WebFetch` of `yelp.ca/biz/shanayas-driving-school-victoria` — page resolved and returned business details, "New on Yelp," zero reviews, and hours (Mon–Fri 7am–9pm, Sat–Sun closed) not published anywhere on the actual site |
| Facebook (`facebook.com/drivingschoolvictoria`) | Page title returned as **"Driving School BC \| Victoria BC"** | Not retrievable (login-walled) | Not retrievable | `WebFetch` — limited by Facebook's auth wall |
| Instagram (`instagram.com/drivingschoolvictoria`) | Page title returned as **"Driving School BC"** (@drivingschoolvictoria) | Not retrievable | Not retrievable | `WebFetch` — limited by Instagram's auth wall |

**Critical discrepancy:** the site's own Google Maps embed — used on both the homepage and the Contact page — points to a Google Place record that says **Victoria, BC V9B 4G2**, not the Langford, BC V9B 4G1 address used everywhere else on the site (schema, footer, contact copy, llms.txt). The Yelp listing independently repeats "Victoria" as the city (though it uses the V9B 4G1 postal code, matching the site). This is not a cosmetic issue — a Google Place ID/CID is a specific, persistent Google record, so this strongly suggests the **actual Google Business Profile pin (and possibly the live listing itself) disagrees with the address the business is trying to rank as** its canonical NAP. Address-locality mismatches between a site's own Maps embed/citations and its schema are a direct, verifiable NAP inconsistency and a known ranking/trust risk.

**Secondary discrepancy:** Facebook and Instagram surface the business as **"Driving School BC"**, not "Shanaya's Driving School." Handle URLs (`drivingschoolvictoria`) and brand name mismatch social citations from the canonical brand name used everywhere on-site and in schema.

## GBP optimization checklist (detected vs. missing)

| Signal | Status |
|---|---|
| Maps embed on-site | ✅ Present (homepage + Contact page) — but points to a conflicting address (see above) |
| Direct links to a Google Business Profile / "View on Google" CTA | ❌ Not found anywhere in `src/` |
| GBP review widget / embedded reviews | ❌ Not found |
| GBP posts indicator / "recent updates from Google" | ❌ Not found |
| Photo evidence tying site imagery to a GBP (e.g., same photos referenced) | ❌ Cannot confirm; site imagery is largely stock (Unsplash/third-party), not evidently sourced from a GBP photo set |
| Primary category alignment (verifiable) | ⚠️ Could not verify live GBP category with available tools; schema uses `DrivingSchool`, which is the correct on-site signal to align a GBP "Driving school" primary category with — see Limitations |
| Confirmed live/claimed GBP listing | ⚠️ Not independently confirmable with available tools (see Limitations). Given the conflicting Maps embed address, this needs owner-side verification in the GBP dashboard as the top priority. |

## Review health snapshot

- **On-site testimonials:** `src/components/TestimonialsSection.tsx` renders 8 hardcoded quotes (marquee carousel) — no source platform cited, no dates, no verification. One testimonial is attributed to "Student - Nanaimo," a location **not** in the official `areaServed`/`serviceLocations` list (Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan, Salt Spring Island) — an internal content inconsistency.
- **`aggregateRating` in schema:** ❌ Absent (`grep -r "aggregateRating"` across `public_html` returns zero matches).
- **Star rating display:** Testimonial cards render 5 static "*****" — decorative only, not tied to any rating source, and could read as misleading if a regulator/Google were to compare it against real review data (there is none).
- **External reviews found:** **Yelp — 0 reviews, "New on Yelp"** (confirmed by direct fetch). No confirmed review count could be established for Google (see Limitations).
- **Review velocity:** Effectively **zero** on the one platform we could verify. Whitespark/Sterling Sky's "18-day rule" flags ranking risk after ~3 weeks without a new review; a brand-new, review-less profile is a much larger gap than a stale one.
- **Response rate/pattern:** Not assessable — no reviews exist to respond to on the one verified platform.

## Local schema validation

- **Subtype:** `["LocalBusiness","DrivingSchool"]` — appropriate; `DrivingSchool` is a real, specific schema.org type (better than plain `LocalBusiness`).
- **Required properties:** `name` ✅, `address` ✅ (full `PostalAddress`) — present and complete.
- **Recommended properties:**
  - `telephone` ✅
  - `url` ✅
  - `geo` (lat/long, 5-decimal precision) ❌ **Missing entirely** — confirmed via `grep` across the built site.
  - `openingHoursSpecification` ❌ **Missing entirely** — matches the COMPANY_KNOWLEDGE.md data-quality note ("No public business hours were found in the codebase"). Also nothing in visible HTML on any page.
  - `aggregateRating` ❌ Missing (no reviews to support it yet — see Reviews section).
  - `hasMap` ❌ Missing (a `hasMap` property pointing to the correct Google Maps place would help reinforce/repair the address conflict once resolved).
- **Consistency with `areaServed`:** the noscript/no-JS fallback content baked into every static page (`scripts/generate-static-seo-pages.mjs` template) says lessons are available in "**Victoria, Langford, Saanich, Oak Bay**, Colwood, Sidney, Metchosin, Sooke, Duncan, Salt Spring Island" — Saanich and Oak Bay are **not** in `areaServed`, `serviceLocations.ts`, or COMPANY_KNOWLEDGE.md. Minor but real content/schema mismatch that could confuse both users and machine parsers about the actual service radius.

## Location page quality (multi-location assessment)

This is a single-office hybrid SAB, not a true multi-location chain, so classic doorway-page duplication checks don't directly apply. However, for a business claiming 8 distinct service communities, the current approach is thin:

- The **only place all 8 communities get individual treatment** is the Contact page's "Our Locations" card grid (`src/pages/Contact.tsx`) — each gets one boilerplate sentence (e.g., "Calm rural roads ideal for building early driving confidence and fundamentals" for Metchosin) and no dedicated URL, so none of it is indexable as a standalone landing page or eligible to rank for "[service] + [suburb]" queries.
- The 7 topical landing pages generated by `scripts/generate-static-seo-pages.mjs` are **service-based, not location-based** — none target "driving lessons Sidney," "road test prep Sooke," "driving lessons Salt Spring Island," etc.
- For a driving school, geo + service pages (e.g., `/driving-lessons/sidney/`, `/road-test-prep/sooke/`) are a realistic, high-leverage local SEO investment given Whitespark's "dedicated service pages" being the #1 local organic and #2 AI-visibility factor — right now that leverage only exists for generic service intent, not for the 6 secondary communities beyond Langford/Victoria.
- Pricing tiers (`standard`/`regional`/`island` in `serviceLocations.ts`) already segment these communities operationally, so the underlying data model could support real location pages without much new content architecture.

## Citations — priority recommendations for a BC driving school

Verified: **Yelp.ca has a live, unclaimed-looking listing** (zero reviews, "New on Yelp") with a **city mismatch** vs. the canonical NAP (see audit table above) — this should be claimed and corrected first.
Checked, not found: **BBB** — a direct BBB search for "Shanaya's Driving School" in Langford, BC returned no results.

Recommended priority citation targets (general guidance; not independently verified for this specific business beyond Yelp/BBB above):
1. **Google Business Profile** — highest priority; reconcile the address conflict described above before/while doing any GBP work.
2. **Yelp.ca** — claim the existing listing, correct the city to Langford (or the correct verified GBP city) and add real photos/hours.
3. **Bing Places** — low effort, feeds Bing/Copilot local results.
4. **ICBC-adjacent/driver-training directories** — e.g., provincial/industry driving-instructor association listings if the school or its instructors hold ICBC-recognized certification bodies' directory pages (verify actual eligibility/membership before listing).
5. **BBB (Better Business Bureau of Vancouver Island / Mainland BC)** — currently absent; consider for trust signal, optional for a driving school but low-cost.
6. **Local Victoria/Westshore directories**: Westshore Chamber of Commerce, Greater Victoria Chamber of Commerce, DiscoverVictoriaBC-style tourism/community directories.
7. **YellowPages.ca** — still indexed and crawled, low effort.
8. **Facebook Business Page info tab** — align the displayed name to "Shanaya's Driving School" instead of "Driving School BC" and fill in address/hours fields directly in Meta's business tools (not just the website).

## Top 10 prioritized actions

| # | Priority | Action |
|---|---|---|
| 1 | **Critical** | Reconcile the Google Maps embed / Google Place address ("Victoria, BC V9B 4G2") against the canonical NAP used in schema/footer ("Langford, BC V9B 4G1"). Confirm which is correct in the actual GBP dashboard, then make every source (site, embed, Yelp, GBP, socials) match exactly. |
| 2 | **Critical** | Confirm/claim the Google Business Profile, verify the primary category is "Driving school" (the #1 local ranking factor per Whitespark), and begin actively generating reviews — current verified external review count is zero (Yelp). |
| 3 | **Critical** | Claim the Yelp listing and fix the city field (currently "Victoria," conflicting with the site's Langford address); add real hours (Yelp currently shows unverified/possibly placeholder hours that don't appear anywhere on the actual site). |
| 4 | **High** | Add `geo` (latitude/longitude, 5-decimal precision) and `openingHoursSpecification` to the `LocalBusiness` schema in `src/components/SeoManager.tsx` and `scripts/generate-static-seo-pages.mjs`. Publish real hours on the Contact page too — currently no hours exist anywhere on-site. |
| 5 | **High** | Launch a review-acquisition flow (post-lesson/post-package SMS or email request pointing to the GBP short link) to establish review velocity — the current zero-review baseline is the single biggest reputation gap and directly threatens the "18-day rule" ranking risk once any competitor is actively collecting reviews. |
| 6 | **High** | Replace/augment the hardcoded marquee testimonials (`TestimonialsSection.tsx`) with real, sourced reviews (ideally pulled or manually synced from Google/Yelp) and add `aggregateRating` schema once real review data exists. Fix the "Student - Nanaimo" testimonial, which cites a location outside the official service area. |
| 7 | **High** | Build dedicated location pages for the 6 secondary service communities (Sidney, Metchosin, Sooke, Duncan, Colwood, Salt Spring Island) with unique local content, not just a one-sentence card on the Contact page — this is the #1 local organic / #2 AI-visibility factor per the brief and currently only exists for Langford/Victoria in a generic sense. |
| 8 | **Medium** | Make the footer phone number a real `tel:` link (currently "250-LICENSE" is styled text with no `href`), and ensure NAP text is present in the pre-rendered/no-JS HTML body (not just JSON-LD) so non-JS crawlers and AI answer engines that don't execute JS can see the address/phone as plain text, not only in `<script type="application/ld+json">`. |
| 9 | **Medium** | Correct the no-JS fallback service-area copy (baked into every static page) that lists "Saanich, Oak Bay" — not present in `areaServed`/`serviceLocations.ts` — to match the official 8-community list, or deliberately expand the official service area and update schema/pricing tiers consistently. |
| 10 | **Low** | Align Facebook/Instagram display names to "Shanaya's Driving School" (both currently surface as "Driving School BC" in page titles) to strengthen `sameAs` NAP-name consistency, and add a direct "View us on Google" / "Leave a review" link somewhere on the Contact page once the GBP address conflict is resolved. |

## Quick wins

- Add `tel:` href to the footer phone element.
- Fix the Nanaimo testimonial location.
- Add the two missing communities (Saanich, Oak Bay) to `areaServed`/`serviceLocations.ts` **or** remove them from the static fallback copy — pick one and make it consistent.
- Correct the Yelp listing's city field to match the site.

## Limitations disclaimer

- **No DataForSEO or other paid local-data MCP tools were available** in this session, so live Google local pack position, verified GBP category, verified GBP review count/rating, GBP photo count, and GBP post activity could **not** be directly queried — all GBP conclusions above are inferred from on-site signals (the Maps embed/Place ID) plus general web fetches, not a GBP API.
- **Google Search/Maps results are heavily JS-rendered and often blocked for automated fetching**; several direct Google Search/Maps queries in this session returned no usable content (empty/irrelevant results), so a definitive "GBP exists and is verified/claimed" or "GBP does not exist" statement cannot be made with certainty — this should be checked directly in the Google Business Profile dashboard by the site owner.
- **Facebook and Instagram are login-walled**, so only page titles could be retrieved via `WebFetch`; bio text, follower counts, and posted address/phone fields on those platforms could not be confirmed.
- The **Yelp listing details (address, phone, hours, review count) were retrieved via `WebFetch`**, which summarizes fetched page content through an intermediate model rather than returning raw HTML — this is treated as strong but not 100%-certain evidence, and should be spot-checked manually by the business owner logging into (or searching directly for) the Yelp listing.
- **Backlink/authority data** (referring domains, local link equity) could not be assessed — no backlink-index tool was available in this session.
- **Proximity** (55.2% of ranking variance per the Search Atlas ML study cited in the brief) is outside the website's control and is not reflected in this score; it depends on the searcher's physical location relative to the verified GBP pin — which is one more reason the Maps/GBP address conflict (Finding #1) needs to be resolved first, since an incorrect pin location directly corrupts proximity-based ranking for this business.
