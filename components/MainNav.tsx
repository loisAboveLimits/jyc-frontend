"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { stripLocale } from "@/lib/i18n";

export type NavItem = { key: string; label: string; href: string; path: string };

type Props = {
  items: NavItem[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
  /** Search + language controls, rendered at the end of the bar. */
  children: React.ReactNode;
};

/**
 * Main navigation used on every page.
 * - Desktop (xl and up): rounded bar with all links; the current page is gold.
 * - Smaller screens: menu button that opens the links as a panel.
 */
export default function MainNav({
  items,
  navLabel,
  openLabel,
  closeLabel,
  children,
}: Props) {
  const current = stripLocale(usePathname() ?? "/");
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? current === "/" : current === path || current.startsWith(`${path}/`);

  // Close the mobile panel with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav aria-label={navLabel} className="relative xl:flex-1">
      <div className="flex items-center justify-end gap-2 rounded-full bg-white/15 p-1.5 shadow-lg shadow-black/10 backdrop-blur-md xl:justify-between xl:gap-4 xl:p-2">
        {/* Desktop links */}
        <ul className="hidden items-center xl:flex">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full px-4 py-2.5 text-[17px] transition-colors ltr:pt-[calc(0.625rem+0.24em)] 2xl:px-5 ${
                    active
                      ? "bg-gold font-bold text-white shadow"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 pe-1 xl:pe-3">{children}</div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? closeLabel : openLabel}
          className="grid size-11 place-items-center rounded-full bg-gold text-white xl:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile panel */}
      <ul
        id="mobile-menu"
        hidden={!open}
        className="absolute end-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-3xl bg-navy/95 p-3 shadow-2xl ring-1 ring-white/10 backdrop-blur-md xl:hidden"
      >
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-full px-5 py-3 text-lg transition-colors ltr:pt-[calc(0.75rem+0.24em)] ${
                  active ? "bg-gold font-bold text-white" : "text-white/90 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
