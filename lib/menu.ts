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
 * Raw menu tree from Drupal, cached for an hour.
 * Errors are thrown (and not cached) so the caller can fall back.
 */
export async function getDrupalMenu(
  menu: string,
  lang: Locale,
  depth?: number,
): Promise<DrupalMenuItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("drupal-menu", `drupal-menu-${menu}`);

  const params = new URLSearchParams({ lang });
  if (depth) params.set("depth", String(depth));
  const data = await drupalFetch<DrupalMenuResponse>(`/api/menu/${menu}?${params}`);
  return data.items;
}

/**
 * Links for the main navigation, from the Drupal "main" menu.
 * If Drupal can't be reached, the built-in page list is used instead.
 */
export async function getMainNav(lang: Locale, dict: Dictionary): Promise<MenuLink[]> {
  try {
    const items = await getDrupalMenu("main", lang, 1);
    return items
      .filter((item) => item.url !== null)
      .map((item) => {
        const url = item.url as string;
        return {
          key: item.id,
          label: item.title,
          href: item.external ? url : localizedHref(lang, url),
          path: item.external ? url : url.split(/[?#]/)[0] || "/",
        };
      });
  } catch (error) {
    console.error("[menu] Could not load the main menu from Drupal:", error);
    return mainPages.map((page) => ({
      key: page.key,
      label: dict.nav[page.key],
      href: localizedHref(lang, page.path),
      path: page.path,
    }));
  }
}
