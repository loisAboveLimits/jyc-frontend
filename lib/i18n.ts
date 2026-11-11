export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

/** English is the default language and has no URL prefix. */
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getDirection = (locale: Locale): "ltr" | "rtl" =>
  locale === "ar" ? "rtl" : "ltr";

/**
 * Build an internal link for a language.
 *   localizedHref("en", "/about") -> "/about"
 *   localizedHref("ar", "/about") -> "/ar/about"
 *   localizedHref("ar", "/")      -> "/ar"
 */
export function localizedHref(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Remove a leading "/en" or "/ar" from a pathname. "/ar/about" -> "/about" */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname || "/";
}
