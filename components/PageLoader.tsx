"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen loader shown while the page first loads (a rotating ring).
 * It fades out once everything has loaded, or after 4 seconds at the latest.
 * Moving between pages afterwards does not show it again.
 */
export default function PageLoader({ label }: { label: string }) {
  const [state, setState] = useState<"visible" | "hiding" | "gone">("visible");

  useEffect(() => {
    const hide = () => setState((value) => (value === "visible" ? "hiding" : value));
    // Keep it on screen briefly so it does not just flash.
    const finish = () => window.setTimeout(hide, 400);

    let delay: number | undefined;
    const onLoad = () => {
      delay = finish();
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const fallback = window.setTimeout(hide, 4000);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
      window.clearTimeout(delay);
    };
  }, []);

  // Remove it completely after the fade (also when transitions are disabled).
  useEffect(() => {
    if (state !== "hiding") return;
    const timer = window.setTimeout(() => setState("gone"), 600);
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
