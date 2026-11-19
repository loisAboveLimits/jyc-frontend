import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";

/** One "Trips" node from Drupal: GET /api/trips?lang=xx */
export type DrupalTrip = {
  nid: number;
  langcode: string;
  title: string;
  /** field_content, as HTML (after its text format) */
  content: string;
  /** field_content as plain text */
  text: string;
  /** field_main_image */
  image: { url: string; alt: string; width: number; height: number } | null;
  /** field_more: the "Learn More" link ("" or "#" when not set) */
  more: string;
  /** field_ratings, 0–5 */
  rating: number;
};

/**
 * All published trips from Drupal, in the requested language, or [] if there
 * are none (or Drupal can't be reached). Never throws, so a missing Drupal
 * can't fail the build. Answers are cached for an hour; connection failures
 * only for about a minute.
 */
export async function getTrips(lang: Locale): Promise<DrupalTrip[]> {
  "use cache";
  cacheTag("drupal-trips");

  try {
    const trips = await drupalFetch<DrupalTrip[]>(`/api/trips?${new URLSearchParams({ lang })}`);
    cacheLife("hours");
    return Array.isArray(trips) ? trips : [];
  } catch (error) {
    console.warn(
      `[trips] Drupal trips (${lang}) unavailable, using the built-in trips:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return [];
  }
}
