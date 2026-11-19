import { cacheLife, cacheTag } from "next/cache";
import type { HeroSlide } from "@/components/home/HeroSlider";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";
import type { MainPageKey } from "./pages";

/**
 * Drupal node ("Pages" content type) behind each main page. Banners in Drupal
 * point to these nodes with field_reference. Set an id once the page exists
 * in Drupal; null means "no Drupal page yet" (the page keeps its own hero).
 */
export const PAGE_NODE_IDS: Record<MainPageKey, number | null> = {
  home: 1,
  about: 5,
  yachtClub: 7,
  marina: 9,
  academy: 10,
  blogs: 11,
  leasing: 12,
  contact: 13,
};

/** One banner as returned by Drupal: GET /api/banners/{nid}?lang=xx */
type DrupalBanner = {
  id: number;
  subTitleTop: string;
  mainTitle: string;
  subTitleBottom: string;
  caption: string;
  media:
    | { type: "image"; url: string; alt?: string; width?: number; height?: number }
    | { type: "video"; url: string; mime?: string }
    | { type: "remote_video"; url: string; thumbnail?: string; alt?: string }
    | null;
};

type DrupalBannersResponse = { nid: number; langcode: string; items: DrupalBanner[] };

/** Turns a Drupal banner into a slide for <HeroSlider>; null if it has no usable background. */
function toSlide(banner: DrupalBanner): HeroSlide | null {
  const { media } = banner;
  let background: HeroSlide["media"] | null = null;
  let imageAlt = "";

  if (media?.type === "image") {
    background = { type: "image", src: media.url, remote: true };
    imageAlt = media.alt ?? "";
  } else if (media?.type === "video") {
    background = { type: "video", src: media.url, mime: media.mime };
  } else if (media?.type === "remote_video" && media.thumbnail) {
    // YouTube/Vimeo can't run as a silent background loop: show its thumbnail.
    background = { type: "image", src: media.thumbnail, remote: true };
  }
  if (!background) return null;

  return {
    media: background,
    eyebrow: banner.subTitleTop, // field_sub_title_top
    title: banner.mainTitle, // field_main_title
    subtitle: banner.subTitleBottom, // field_sub_title_bottom
    text: banner.caption, // field_caption
    imageAlt,
  };
}

/**
 * Hero slides for a Drupal page node: its published banners (content type
 * "banners" whose field_reference is `nodeId`), in the requested language.
 *
 * Never throws (an error inside "use cache" would fail the page build): if
 * Drupal can't be reached it returns [] and the page shows its own hero.
 * Good answers are cached for an hour, failures only for about a minute.
 */
export async function getBanners(nodeId: number, lang: Locale): Promise<HeroSlide[]> {
  "use cache";
  cacheTag("drupal-banners", `drupal-banners-${nodeId}`);

  try {
    const data = await drupalFetch<DrupalBannersResponse>(
      `/api/banners/${nodeId}?${new URLSearchParams({ lang })}`,
    );
    cacheLife("hours");
    return data.items.map(toSlide).filter((slide): slide is HeroSlide => slide !== null);
  } catch (error) {
    console.warn(
      `[banners] Drupal banners for node ${nodeId} (${lang}) unavailable, using the page's own hero:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return [];
  }
}
