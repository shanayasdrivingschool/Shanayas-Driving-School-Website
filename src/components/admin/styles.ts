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
  "inline-flex items-center justify-center rounded-full font-bold transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/* Row-level actions sit inside dense tables, so they stay small -- but not below the
   height where they become awkward to hit on touch. */
const small = "gap-1 px-3 py-2 text-xs min-h-[2.25rem]";
const medium = "gap-2 px-4 py-2 text-sm min-h-[2.5rem]";

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
  `${base} ${medium} ${blueRing} border border-[#1d52a1] text-[#1d52a1] hover:bg-[#1d52a1] hover:text-white`;

/* Small neutral action inside a table row -- Edit, View, Hide. */
export const adminRowButtonClassName =
  `${base} ${small} ${blueRing} border border-slate-300 text-slate-700 hover:bg-slate-100`;

/* Destructive and irreversible. Filled, so it never reads as just another row action. */
export const adminDangerButtonClassName =
  `${base} ${small} ${redRing} bg-[#E6242A] text-white hover:bg-[#C41E23]`;

/* Destructive but a step removed -- reverse, reject, block. Outlined so the filled red
   stays reserved for deletion. */
export const adminDangerOutlineButtonClassName =
  `${base} ${small} ${redRing} border border-[#E6242A] text-[#E6242A] hover:bg-[#E6242A] hover:text-white`;

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
