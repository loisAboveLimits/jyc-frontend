"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

declare global {
  interface Window {
    /** The running Lenis instance, if smooth scrolling is on. */
    jycLenis?: Lenis;
  }
}

/**
 * Smooth, eased page scrolling for the mouse wheel (Lenis).
 * Touch scrolling stays native, and it is switched off for visitors who
 * asked their device to reduce motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, duration: 1.1, anchors: true });
    // Shared so other components (e.g. BackToTop) can scroll with the same easing.
    window.jycLenis = lenis;
    return () => {
      lenis.destroy();
      if (window.jycLenis === lenis) window.jycLenis = undefined;
    };
  }, []);

  return null;
}
