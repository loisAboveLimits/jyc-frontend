import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Dictionary } from "./dictionaries";
import { localizedHref, type Locale } from "./i18n";
import { mainPages } from "./pages";

/** One link as returned by Drupal: GET /api/menu/{menu}?lang=xx */
export type DrupalMenuItem = {
  id: string;
  title: string;
  description: string;
  /** Path without language prefix ("/about"), a full URL if external, or null for <nolink>. */
  url: string | null;
  external: boolean;
  weight: number;
  expanded: boolean;
  children: DrupalMenuItem[];
};

type DrupalMenuResponse = { menu: string; langcode: string; items: DrupalMenuItem[] };

/** Shape used by <MainNav>. */
export type MenuLink = { key: string; label: string; href: string; path: string };

/**
 * Raw menu tree from Drupal, or null if Drupal can't be reached.
 *
 * Never throws: an error thrown inside "use cache" fails the page build even
 * when the caller catches it (e.g. on Vercel, where the local Drupal doesn't
 * exist). A good answer is cached for an hour; a failure only for about a
 * minute, so Drupal is tried again soon.
 */
export async function getDrupalMenu(
  menu: string,
  lang: Locale,
  depth?: number,
): Promise<DrupalMenuItem[] | null> {
  "use cache";
  cacheTag("drupal-menu", `drupal-menu-${menu}`);

  const params = new URLSearchParams({ lang });
  if (depth) params.set("depth", String(depth));
  try {
    const data = await drupalFetch<DrupalMenuResponse>(`/api/menu/${menu}?${params}`);
    cacheLife("hours");
    return data.items;
  } catch (error) {
    console.warn(
      `[menu] Drupal menu "${menu}" (${lang}) unavailable, using the built-in menu:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return null;
  }
}

/**
 * Links for the main navigation, from the Drupal "main" menu.
 * If Drupal can't be reached (or the menu is empty), the built-in page list is used instead.
 */
export async function getMainNav(lang: Locale, dict: Dictionary): Promise<MenuLink[]> {
  const items = (await getDrupalMenu("main", lang, 1))?.filter((item) => item.url !== null);

  if (!items?.length) {
    return mainPages.map((page) => ({
      key: page.key,
      label: dict.nav[page.key],
      href: localizedHref(lang, page.path),
      path: page.path,
    }));
  }

  return items.map((item) => {
    const url = item.url as string;
    return {
      key: item.id,
      label: item.title,
      href: item.external ? url : localizedHref(lang, url),
      path: item.external ? url : url.split(/[?#]/)[0] || "/",
    };
  });
}
