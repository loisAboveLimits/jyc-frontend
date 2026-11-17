"use client";

import { ChevronLeftIcon } from "@/components/icons";

/**
 * Round "back to top" button in the footer. Scrolls with Lenis (the site's
 * smooth scrolling) when it's running, otherwise with the browser's own
 * smooth scroll, or jumps straight up for visitors who reduce motion.
 */
export default function BackToTop({ label, className = "" }: { label: string; className?: string }) {
  const goToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.jycLenis && !reduceMotion) {
      window.jycLenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
    // Keyboard and screen-reader users land at the start of the page too:
    // focus the first visible link or button in the header.
    const first = [...document.querySelectorAll<HTMLElement>("header a, header button")].find(
      (element) => element.getClientRects().length > 0 && !element.closest("[hidden]"),
    );
    first?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goToTop}
      aria-label={label}
      title={label}
      className={`grid size-12 place-items-center rounded-full bg-teal text-white shadow-lg shadow-black/25 transition-[background-color,translate] duration-300 hover:-translate-y-1 hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal motion-reduce:hover:translate-y-0 ${className}`}
    >
      {/* The left chevron turned to point up */}
      <ChevronLeftIcon className="h-[17px] w-auto rotate-90" />
    </button>
  );
}
