/* Button styles for the admin panel.

   These five variants were previously written out inline and copied 45 times across the
   pages. Copies drift: none of them carried a keyboard focus ring, and only one of the 45
   styled its disabled state, so tabbing through the panel gave no indication of where you
   were and a disabled button looked identical to a live one. Naming them fixes every
   instance at once and makes the next one correct by default.

   Shared by all variants:
   - focus-visible ring, so keyboard users can see the focused control (this is the part
     that was missing everywhere)
   - a disabled treatment that reads as unavailable rather than merely styled
   - min-height, so the row actions stay comfortably tappable on a phone */

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/* Row-level actions sit inside dense tables, so they stay small -- but not below the
   height where they become awkward to hit on touch. */
const small = "gap-2 px-3 py-2 text-xs min-h-11 sm:min-h-9";
const medium = "gap-2 px-4 py-2 text-sm min-h-11 sm:min-h-10";

const blueRing = "focus-visible:ring-[#1d52a1]";
const redRing = "focus-visible:ring-[#E6242A]";

/* The single most prominent action on a page. */
export const adminPrimaryButtonClassName =
  `${base} ${medium} ${blueRing} bg-[#1d52a1] text-white hover:bg-[#17488d]`;

/* Neutral supporting actions -- export, filter, cancel. */
export const adminSecondaryButtonClassName =
  `${base} ${medium} ${blueRing} border border-slate-300 text-slate-700 hover:bg-slate-100`;

/* Outlined blue: an action that is important but not the page's primary one. */
export const adminAccentButtonClassName =
  `${base} ${medium} ${blueRing} border border-slate-300 text-[#1d52a1] hover:bg-slate-100`;

/* Small neutral action inside a table row -- Edit, View, Hide. */
export const adminRowButtonClassName =
  `${base} ${small} ${blueRing} border border-slate-300 text-slate-700 hover:bg-slate-100`;

/* Destructive and irreversible. Filled, so it never reads as just another row action. */
export const adminDangerButtonClassName =
  `${base} ${small} ${redRing} bg-[#B91C1C] text-white hover:bg-[#991B1B]`;

/* Destructive but a step removed -- reverse, reject, block. Outlined so the filled red
   stays reserved for deletion. */
export const adminDangerOutlineButtonClassName =
  `${base} ${small} ${redRing} border border-red-200 text-[#B91C1C] hover:bg-red-50`;

/* Panels in the admin panel.

   The pages previously reused the marketing site's surface -- a 30px radius, generous
   padding and a drop shadow. That treatment exists to make a promotional card feel like a
   distinct object on a landing page. In a data tool it just pushes rows apart and stacks
   rounded boxes inside rounded boxes. A hairline border and a small radius separate a panel
   from the page perfectly well, and give the space back to the data. */
export const adminSurfaceClassName =
  "rounded-xl border border-slate-200 bg-white p-4 sm:p-5";

/* For a panel that only needs separating from what is above it, not boxing in. */
export const adminPanelClassName = "rounded-xl border border-slate-200 bg-white";

export const adminInputClassName =
  "h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 transition-colors " +
  "placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-[#1d52a1] " +
  "focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2";
