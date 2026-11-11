"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Smooth, eased page scrolling for the mouse wheel (Lenis).
 * Touch scrolling stays native, and it is switched off for visitors who
 * asked their device to reduce motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, duration: 1.1, anchors: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
