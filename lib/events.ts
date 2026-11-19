import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";

/** One "Events" node from Drupal: GET /api/events?lang=xx */
export type DrupalEvent = {
  nid: number;
  langcode: string;
  title: string;
  /** field_content, as HTML (after its text format) */
  content: string;
  /** field_content as plain text */
  text: string;
  /** field_date start / end, in UTC ("2026-12-10T06:30:32Z") */
  start: string;
  end: string;
  /** field_address */
  address: string;
  /** field_booking_link ("" or "#" when not set) */
  bookingLink: string;
  /** field_map_link ("" or "#" when not set) */
  mapLink: string;
  /** field_main_image */
  image: { url: string; alt: string; width: number; height: number } | null;
};

/**
 * Upcoming events from Drupal (not ended yet), earliest first, in the
 * requested language; [] if there are none or Drupal can't be reached.
 * `limit` = at most that many (0 = all). Never throws, so a missing Drupal
 * can't fail the build. Cached for about a minute when unreachable,
 * otherwise until an event ends (at most an hour).
 */
export async function getUpcomingEvents(lang: Locale, limit = 0): Promise<DrupalEvent[]> {
  "use cache";
  cacheTag("drupal-events");

  const query = new URLSearchParams({ lang });
  if (limit > 0) query.set("limit", String(limit));

  try {
    const events = await drupalFetch<DrupalEvent[]>(`/api/events?${query}`);
    const list = Array.isArray(events) ? events : [];
    // Refresh soon after the first event ends, so it drops off the list.
    const firstEnd = Math.min(...list.map((event) => Date.parse(event.end)).filter(Number.isFinite));
    const untilEnd = Math.ceil((firstEnd - Date.now()) / 1000);
    if (Number.isFinite(untilEnd) && untilEnd < 3600) {
      cacheLife({ stale: 60, revalidate: Math.max(60, untilEnd), expire: 3600 });
    } else {
      cacheLife("hours");
    }
    return list;
  } catch (error) {
    console.warn(
      `[events] Drupal events (${lang}) unavailable, using the built-in events:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return [];
  }
}
