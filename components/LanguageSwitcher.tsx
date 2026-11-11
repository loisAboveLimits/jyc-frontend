"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedHref, stripLocale, type Locale } from "@/lib/i18n";

type Props = {
  /** Language of the current page. */
  lang: Locale;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
};

/** Links to the current page in the other language. */
export default function LanguageSwitcher({
  lang,
  ariaLabel,
  className,
  children,
}: Props) {
  const pathname = usePathname() ?? "/";
  const target: Locale = lang === "ar" ? "en" : "ar";
  const href = localizedHref(target, stripLocale(pathname));

  return (
    <Link href={href} hrefLang={target} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
}
