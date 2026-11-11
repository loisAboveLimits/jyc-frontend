import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n";

/**
 * Language routing.
 *   /            -> English (served internally from app/[lang] with lang = "en")
 *   /about       -> English
 *   /ar, /ar/... -> Arabic
 *   /en, /en/... -> redirected to the same URL without "/en"
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // English never shows its prefix: /en/about -> /about
  if (
    pathname === `/${defaultLocale}` ||
    pathname.startsWith(`/${defaultLocale}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Other languages (/ar) already carry their prefix.
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  // No prefix: show English without changing the URL in the browser.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (images, favicon…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
