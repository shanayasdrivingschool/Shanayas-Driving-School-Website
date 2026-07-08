# Shanaya's Driving School — Design Rules

Design language for **drivingschoolbc.ca**. This document is the source of truth for
anyone designing new pages, sections, or components. It describes *how the brand should
look and feel* — colours, type, shape, motion, tone. It is not a code spec.

> **Read this first — palette authority.** The live site is built on a **blue + red + gold**
> palette (below). Ignore any green/emerald values you may find in `tailwind.config.ts` or
> `src/index.css` design tokens — those are leftover scaffolding from the original template
> and are **not** the brand. Always design to the colours in this document.

---

## 1. Brand personality

Shanaya's is a local BC driving school. The design should feel:

- **Trustworthy & official** — this is a licensed, ICBC-aligned, government-approved school.
  Blue carries the authority. Nothing looks cheap, gimmicky, or scammy.
- **Warm & encouraging** — students are often nervous new drivers. Calm, supportive, human.
  Rounded shapes, a friendly mascot ("Ruley"), soft blobs, generous spacing.
- **Confident & action-ready** — bold black headlines, one loud red button that always means
  "book / act now."
- **Clean & modern** — lots of white space, crisp cards, no clutter.

Voice in three words: **Professional, patient, confident.**

---

## 2. Colour system

### Core brand colours

| Role | Hex | Use it for |
|------|-----|-----------|
| **Brand Blue** (primary) | `#1d52a1` | The brand. Headings, eyebrows, links, active nav, wave dividers, brand-tone headers, icons. The most-used colour on the site. |
| **Brand Blue — deep** | `#17488d` | Hover/pressed state of brand blue; darker end of blue gradients. |
| **Action Red** (CTA) | `#e6242a` | The single "do it" colour. Booking buttons, cart badges, primary conversion actions. Use sparingly so it always reads as *action*. |
| **Action Red — deep** | `#c41e23` | Hover/pressed state of Action Red. |
| **Accent Gold** | `#f5b13a` | Warmth & delight: highlight buttons, rewards/affiliate, star ratings, phone number in footer, "sparkle" moments, in-copy emphasis. Secondary CTA fill. |
| **Accent Gold — deep** | `#df9f2f` | Hover of Accent Gold. `#9a6400` / `#b77900` for gold **text** on light gold tints (contrast-safe). |

### Neutrals

| Role | Hex | Use it for |
|------|-----|-----------|
| **Ink** | `#202121` | Primary body & heading text on light backgrounds. |
| **Deep Navy** | `#0f172a` | Dark headers, mobile menu drawer, dark section backgrounds. |
| **Slate Navy** | `#274556` | Alternate heading colour and secondary-button ink (softer than pure navy). |
| **White** | `#ffffff` | Default page background, cards. |
| **Soft Grey** | `#f2f2f2` | Alternating section backgrounds. |
| **Off-white** | `#f8fafc` | Card/surface tint, subtle panels. |
| **Blob Grey** | `#e4e8eb` | Decorative background blobs behind CTAs. |
| Body muted | `slate-600` / `slate-500` | Supporting paragraph text, captions. |
| Borders / hairlines | `slate-200` | Card borders, dividers, dropdown edges. |

### Semantic / status

| Role | Hex |
|------|-----|
| Success | `#16a34a` (fill), `#dcfce7` (tint), `#14804a` / `#2fb36f` (variants) |
| Danger / destructive | `#dc2626`, hover `#b91c1c` |
| Info | `#2563eb` / `#1d4ed8` |

### Colour rules

1. **One red per view.** Action Red is reserved for the primary conversion action ("Book your
   driving lesson"). Never use it for decoration or for two competing buttons on the same screen.
2. **Blue is the brand, gold is the highlight.** Lead with blue; let gold add warmth and mark
   rewards/ratings. Don't let gold compete with red for "action."
3. **Text on tints:** on a 10–15 % gold or blue tint, use the *deep* text variant
   (`#9a6400`, `#17488d`) — never the bright fill colour as text (fails contrast).
4. **Dark surfaces** (`#0f172a`, `#1d52a1`, photographic heroes) use white text and
   white-alpha borders (`white/15`–`white/45`).
5. Maintain **WCAG AA** (4.5:1 body, 3:1 large text). White on `#1d52a1` and white on
   `#e6242a` both pass; blue/red on white both pass.

---

## 3. Typography

**Font families**
- **Inter** — the workhorse. Body, UI, and most display headings. Weights 400–900.
- **Space Grotesk** — available as a display/heading alternate for special headings; use
  selectively for personality.

> In practice the site's big headlines are **Inter Black (900)**, not Space Grotesk. Keep
> headings on heavy Inter unless a design deliberately wants Space Grotesk's character.

**Type roles**

| Role | Font / weight | Size (fluid) | Notes |
|------|---------------|--------------|-------|
| Hero / page title (H1) | Inter **Black 900** | `clamp(2rem, 8vw, 4rem)` | Tight leading (~0.98). Colour: brand blue or white on photos. Balance wrapping. |
| Section title (H2) | Inter **Black 900** | `clamp(2rem, 6vw, 3.6rem)` | Leading ~1.02. Ink or Slate Navy. |
| Big display label | Inter Black | `clamp(3rem, 11vw, 5rem)` | Oversized decorative section labels, leading 0.88. |
| Eyebrow / kicker | Inter **Semibold 600** | ~14 px | UPPERCASE, letter-spacing ~0.08–0.18em, brand blue. Sits above a title. |
| Body | Inter 400–500 | `clamp(1rem, 1.9vw, 1.125rem)` | Line-height ~1.6, colour ink / slate-600. |
| Lead paragraph | Inter 400 | up to `clamp(1rem, 4vw, 1.6rem)` | Under hero titles; slate-100 on dark. |
| Button / label | Inter **Bold 700** | 13–15 px | Often UPPERCASE for micro-labels ("CALL NOW"). |
| Micro-label | Inter Bold | 10–11 px | UPPERCASE, wide tracking (0.12–0.18em). |

**Typography rules**
- Headings are **heavy and confident** (black/900). Body stays regular/medium — the contrast
  in weight is a core part of the look.
- Use **fluid `clamp()` sizing** so type scales smoothly from mobile to desktop; avoid fixed
  jumps.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Reserve UPPERCASE for eyebrows, micro-labels, and button micro-text — never for long copy.
- Root font size runs slightly reduced (~88 %) and the page is gently zoomed; design at
  comfortable, airy sizes.

---

## 4. Layout & spacing

- **Content max-widths:** header/full sections `1440px`; hero/page content `1280px`; text
  columns `1152px` (`max-w-6xl`) and narrower for reading (`max-w-2xl`/`max-w-4xl`).
- **Gutters:** `px-4` mobile → `sm:px-6` → `lg:px-8`. Content is always centred.
- **Vertical section rhythm:** `clamp(4rem, 7vw, 7rem)` top/bottom for standard sections;
  heroes taller (`min-h` 440 → 600px). Give sections room to breathe.
- **Alternating backgrounds:** white and Soft Grey (`#f2f2f2`) to separate sections; dark navy
  or brand blue for high-emphasis bands.
- **Grid:** two-column split for CTA/feature bands (`~1fr / 0.95fr`), collapsing to a single
  stacked column on mobile. Cards flow in responsive multi-column grids.
- **Mobile-first & no horizontal scroll — ever.** Wide content (tables, carousels) scrolls
  inside its own container. Minimum supported width 320px.

---

## 5. Shape, radius & decoration

- **Buttons & nav pills → fully rounded** (`rounded-full`). This is the signature button shape
  across the whole site — pill buttons, pill nav highlight, circular icon buttons.
- **Cards, dropdowns, inputs, panels → `rounded-xl`** (~12–20px). Friendly but not bubbly.
- **Icon buttons** are perfect circles (40–44px).
- **Organic blobs:** soft, irregular `border-radius` blobs (e.g. `58% 42% 52% 48% / …`) in
  Blob Grey sit *behind* CTA imagery for warmth. Decorative only, `pointer-events: none`.
- **Wave dividers:** curved SVG waves (brand blue over white) close the bottom of hero/photo
  sections — a recurring brand motif. Keep the double-arc shape.
- **Glass surfaces:** headers and floating panels use `backdrop-blur` with a translucent fill
  (dark `#0f172a/95` or brand `#1d52a1/95` when solid; transparent at top of page).

---

## 6. Elevation (shadows)

Shadows are **soft and low-contrast** — lift, not drama.

- Cards: `0 16px 36px rgba(15,23,42,0.06)` — very subtle.
- Sticky header (solid): `0 8px 24px rgba(0,0,0,0.3)` on dark; `…/0.12` on white.
- Dropdowns / popovers: `shadow-xl` with a `slate-200` border.
- Pill action shells on dark: `0 10px 24px rgba(15,23,42,0.18)`.
- Never use hard black drop shadows or heavy borders. One hairline border + one soft shadow.

---

## 7. Components

### Buttons

| Variant | Fill | Text | Shape | When |
|---------|------|------|-------|------|
| **Primary / Book** | Action Red `#e6242a` → hover `#c41e23` | White | Pill | The one main conversion action. |
| **Highlight** | Accent Gold `#f5b13a` → hover `#df9f2f` | Ink `#202121` | Pill | Rewards, warm secondary CTAs, "get the offer." |
| **Secondary / outline** | Transparent (`white/70`) with 2px Slate Navy border → hover fills Slate Navy | Slate Navy → white | Pill | Lower-priority action beside a primary. |
| **On-dark ghost** | `white/10` + `white/15` border, blurred → hover `white/20` | White | Pill / circle | Icon & utility buttons on dark headers. |

Rules: bold text, comfortable padding (`px-6/8 py-3`), full-width on mobile and auto width
from `sm:` up. Always a visible hover state and a focus ring. Include a leading/trailing icon
where it clarifies action (arrow, cart, play).

### Header / navigation

- Fixed, hides on scroll-down and reappears on scroll-up; transparent over heroes, becomes a
  solid blurred bar once scrolled.
- Three tones: **light** (dark navy bar / white text), **brand** (blue bar), **dark** (white
  bar / dark text). Pick per page background.
- Desktop nav uses a **sliding white pill** that animates to the active item; active label
  turns Action Red. Dropdowns are white `rounded-xl` cards with soft shadow.
- Persistent right-side cluster: **Book** (red pill) + **Call now** phone block. Cart is a
  circular icon button with a red count badge.
- Mobile: right-hand drawer on Deep Navy, white text, red Book button, wide tap targets.

### Cards

White (or off-white) fill, `rounded-xl`, `slate-200` hairline border, soft shadow, generous
inner padding (~24–40px). Optional coloured tint header for status. Hover: gentle lift +
border darken.

### Eyebrows & badges

- **Eyebrow:** small uppercase brand-blue kicker above a heading.
- **Pill badge:** rounded-full, coloured **tint** background (`/15` opacity) with **deep**
  matching text — e.g. gold tint + `#9a6400` text for "pending / rewards," blue tint for info.
- **Rating / sparkle:** gold star / sparkle icons.

### Forms & inputs

`rounded-full` search fields, `rounded-xl` text inputs; `slate-200` borders; blue focus ring
(`ring-2`). On dark: `white/10` fill, `white/15` border, white-alpha placeholder, white focus
ring. Minimum comfortable height ~44px.

### Footer

Dark (Deep Navy) band, white text, brand-blue and gold accents, phone number called out in
gold. Organised link columns + policy row.

---

## 8. Imagery & iconography

- **Icons:** [lucide](https://lucide.dev) line icons, ~16–20px, `1.5–2` stroke. Consistent,
  friendly, never filled-heavy.
- **Mascot "Ruley":** the brand character. Appears in CTA sections and rewards. Keep it
  charming and on-brand; don't overuse.
- **Photography:** real driving / student / instructor scenes, warm and local. In heroes,
  always sit photos under a **dark overlay** (`rgba(0,0,0,0.5)`) so white/blue text stays
  legible; fade in on load with a shimmer placeholder.
- **Logo:** vertical white logo on dark/brand backgrounds. Give it clear space; never place
  the white logo on a light background without a dark container.
- All images: `object-cover`/`object-contain` as fits, lazy-loaded below the fold, never
  allowed to break layout width.

---

## 9. Motion

Motion is **gentle, purposeful, and quick** — it guides, it doesn't perform.

- **Scroll reveal:** content fades up ~18px with a slight blur-in over ~0.45s,
  `cubic-bezier(0.22, 1, 0.36, 1)`. The house easing.
- **Standard transitions:** colour/opacity/transform 150–300ms ease.
- **Ambient loops:** slow `float` (6s) and `pulse-glow` (3s) on decorative orbs; marquee
  `scroll` (20s linear) for logo/trust strips. Subtle only.
- **Micro-interactions:** buttons nudge their icon on hover, press-scale ~0.97 on tap,
  animated nav pill, dropdown scale-in.
- **Delight:** payment-success confetti + drawn check ring — reserved for genuine "win"
  moments, not routine UI.
- **Reduced motion:** if the user prefers reduced motion, **all** of the above collapses to
  no animation / full opacity. Every animated element must have a reduced-motion fallback.
  This is a hard rule, not optional.

---

## 10. Accessibility (non-negotiable)

- WCAG **AA** contrast minimum. Verify any new colour pairing.
- Visible **focus ring** on every interactive element (2px, brand blue or white-on-dark,
  `offset-2`). Never remove outlines without replacing them.
- Tap targets **≥ 40px**.
- Honour `prefers-reduced-motion` (see §9).
- Meaningful `alt` text; decorative images get empty `alt`. Icons that carry meaning need
  labels.
- Full keyboard operability: dropdowns, drawers, and dialogs close on `Escape` and trap /
  restore focus correctly.
- Provide non-colour cues — never rely on colour alone to convey state.

---

## 11. Voice & content tone

- **Reassuring and plain-spoken.** Speak to a nervous learner, not a marketer. Short sentences.
- **Local & specific:** name the BC service areas (Langford, Victoria, Colwood, Sidney, Sooke,
  Duncan, Salt Spring…), reference ICBC, road tests, knowledge tests.
- **Confident, not boastful:** "ICBC-aligned," "licensed instructors," "dual-control vehicles,"
  "build confidence."
- CTAs are **direct and action-led:** "Book your driving lesson," "Call now," "View cart."
- Prices always in **CAD**.

---

## 12. Quick do / don't

**Do**
- Lead with brand blue; reserve one red button per view for the main action.
- Use heavy black Inter headings against airy white space.
- Round buttons fully; round cards softly; add wave dividers and soft blobs for warmth.
- Keep motion subtle and always offer a reduced-motion fallback.
- Design mobile-first with zero horizontal scroll.

**Don't**
- Don't use the green/emerald token values from the config — they aren't the brand.
- Don't stack two red CTAs or use red as decoration.
- Don't put white logo/text on light backgrounds, or bright fill colours as small text on tints.
- Don't use hard shadows, sharp corners on buttons, or busy clutter.
- Don't animate without a `prefers-reduced-motion` off-switch.

---

### Palette cheat-sheet

```
Brand Blue      #1d52a1   deep #17488d
Action Red      #e6242a   deep #c41e23
Accent Gold     #f5b13a   deep #df9f2f   text-on-tint #9a6400
Ink             #202121
Deep Navy       #0f172a   Slate Navy #274556
Surfaces        #ffffff / #f8fafc / #f2f2f2   blob #e4e8eb   border slate-200
Success #16a34a   Danger #dc2626   Info #2563eb
Type: Inter (400–900, headings 900) + Space Grotesk (display alt)
Radius: buttons/nav = pill (full) · cards/inputs = ~12–20px
Motion easing: cubic-bezier(0.22, 1, 0.36, 1) · reveal 0.45s
```
