import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { blogPagePath } from "@/lib/blog";
import { localizedHref, type Locale } from "@/lib/i18n";

export type PaginationLabels = {
  /** Name of the navigation, read by screen readers. */
  nav: string;
  previous: string;
  next: string;
  /** e.g. "Page {page}" */
  page: string;
};

const item =
  "grid size-11 place-items-center rounded-full text-base font-semibold transition-colors ltr:pt-[0.2em]";

/**
 * Page numbers for the blog list, with previous / next arrows.
 * Long lists show the first and last pages, the pages around the current
 * one, and "…" for the gaps.
 */
export default function Pagination({
  lang,
  current,
  total,
  labels,
}: {
  lang: Locale;
  current: number;
  total: number;
  labels: PaginationLabels;
}) {
  const href = (page: number) => localizedHref(lang, blogPagePath(page));

  // 1 … 4 5 6 … 12
  const pages: (number | "gap")[] = [];
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) pages.push(page);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  const arrow = (page: number, label: string, icon: React.ReactNode) =>
    page >= 1 && page <= total ? (
      <Link href={href(page)} aria-label={label} className={`${item} bg-white/15 hover:bg-gold`}>
        {icon}
      </Link>
    ) : (
      <span aria-hidden="true" className={`${item} bg-white/5 text-white/30`}>
        {icon}
      </span>
    );

  return (
    <nav aria-label={labels.nav} className="mt-16 flex justify-center lg:mt-20">
      <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <li>{arrow(current - 1, labels.previous, <ChevronLeftIcon className="size-4 rtl:rotate-180" />)}</li>
        {pages.map((page, index) =>
          page === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-white/60">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={href(page)}
                aria-label={labels.page.replace("{page}", String(page))}
                aria-current={page === current ? "page" : undefined}
                className={`${item} ${page === current ? "bg-gold text-white" : "border border-white/30 hover:border-gold hover:text-gold"}`}
              >
                {page}
              </Link>
            </li>
          ),
        )}
        <li>{arrow(current + 1, labels.next, <ChevronRightIcon className="size-4 rtl:rotate-180" />)}</li>
      </ul>
    </nav>
  );
}
