"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LoaderState = "visible" | "hiding" | "gone";

/**
 * Full-screen loader (a rotating ring), shown:
 * - on the first visit, until the page has finished loading;
 * - every time a link to another page of the site is clicked, until that
 *   page has opened.
 * It never stays up for more than 6 seconds, even if something goes wrong.
 */
export default function PageLoader({ label }: { label: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<LoaderState>("visible");

  // Fade out after a short pause, so the loader does not just flash.
  const hideTimer = useRef<number | undefined>(undefined);
  const hideSoon = (delay: number) => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(
      () => setState((value) => (value === "visible" ? "hiding" : value)),
      delay,
    );
  };

  // First visit: hide once the whole page (images, fonts…) has loaded.
  useEffect(() => {
    const onLoad = () => hideSoon(400);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // Moving to another page: show when an internal link is clicked.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Let new-tab / download clicks through without the loader.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      // Other websites, mailto: links, and links to the page already open
      // (including #section links) do not show the loader.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      window.clearTimeout(hideTimer.current);
      setState("visible");
    };
    // Capture phase, so it runs before Next.js handles the click.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // The new page has opened: hide again.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    hideSoon(300);
  }, [pathname]);

  // Safety net: never leave the loader up for long.
  useEffect(() => {
    if (state !== "visible") return;
    const timer = window.setTimeout(() => setState("hiding"), 6000);
    return () => window.clearTimeout(timer);
  }, [state]);

  // Remove it completely after the fade (also when transitions are disabled).
  useEffect(() => {
    if (state !== "hiding") return;
    const timer = window.setTimeout(() => setState("gone"), 500);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "gone") return null;

  return (
    <div
      id="page-loader"
      role="status"
      aria-label={label}
      className={`fixed inset-0 z-[100] grid place-items-center bg-navy-deep transition-opacity duration-500 ${
        state === "hiding" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="size-16 animate-spin rounded-full border-[3px] border-white/20 border-t-gold motion-reduce:animate-none" />
    </div>
  );
}
