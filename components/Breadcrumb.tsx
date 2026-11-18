import Link from "next/link";
import { Fragment } from "react";
import { localizedHref, type Locale } from "@/lib/i18n";

export type BreadcrumbProps = {
  lang: Locale;
  /** The "Home" link text and the label read by screen readers. */
  home: string;
  label: string;
  /** Pages between Home and this one (e.g. Blogs). */
  parents?: { label: string; href: string }[];
  /** This page. */
  current: string;
  className?: string;
};

/** "Home / Blogs / This page" trail shown at the top of inner pages. */
export default function Breadcrumb({ lang, home, label, parents = [], current, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={`text-lg text-teal sm:text-xl ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href={localizedHref(lang, "/")} className="underline underline-offset-4 hover:text-white">
            {home}
          </Link>
        </li>
        {parents.map((parent) => (
          <Fragment key={parent.href}>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={parent.href} className="underline underline-offset-4 hover:text-white">
                {parent.label}
              </Link>
            </li>
          </Fragment>
        ))}
        <li aria-hidden="true">/</li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
