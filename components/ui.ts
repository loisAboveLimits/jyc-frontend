/** Shared Tailwind class strings so buttons and widths look the same everywhere. */

/** Page-width wrapper (matches the 1300px content width of the design). */
export const container = "mx-auto w-full max-w-[1340px] px-5 sm:px-8";

/**
 * Optical centring for English text. El Messiri's letters sit a little above
 * the middle of their line, so labels looked too high inside buttons. This
 * nudges the text down by 0.12em and keeps any icon exactly in the middle.
 * (Arabic letters are already centred, so it only applies left-to-right.)
 * Add `centerText` to any new button-like element that has no vertical padding.
 */
export const centerText = "ltr:pt-[0.24em] ltr:[&>svg]:-translate-y-[0.12em]";

const pill =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-7 py-2 text-center font-semibold shadow-lg shadow-black/20 transition-colors ltr:pt-[calc(0.5rem+0.24em)] ltr:[&>svg]:-translate-y-[0.12em]";

export const button = {
  gold: `${pill} bg-gold text-white hover:bg-teal`,
  glass: `${pill} bg-white/20 text-white backdrop-blur-sm hover:bg-gold`,
  light: `${pill} bg-white/50 text-navy hover:bg-white`,
  outline: `${pill} border border-white text-white hover:bg-white hover:text-navy`,
};

/** Small teal label above section headings. */
export const eyebrow = "text-xl font-semibold text-teal";

/** Round arrow button used by sliders. */
export const arrowButton =
  "grid size-12 place-items-center rounded-full text-white shadow-lg shadow-black/20 transition-colors";
