import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";

/** A "Section" node from Drupal: GET /api/section/{nid}?lang=xx */
export type DrupalSectionData = {
  nid: number;
  langcode: string;
  title: string;
  /** field_main_title */
  mainTitle: string;
  /** field_content, as HTML (after its text format) */
  content: string;
  summary: string;
  /** field_main_image */
  image: { url: string; alt: string; width: number; height: number } | null;
};

/**
 * The Drupal "Section" node with this id, in the requested language, or null
 * if there is none (or Drupal can't be reached). Never throws, so a missing
 * Drupal can't fail the build. Answers are cached for an hour; connection
 * failures only for about a minute.
 */
export async function getSection(nodeId: number, lang: Locale): Promise<DrupalSectionData | null> {
  "use cache";
  cacheTag("drupal-section", `drupal-section-${nodeId}`);

  try {
    const section = await drupalFetch<DrupalSectionData>(
      `/api/section/${nodeId}?${new URLSearchParams({ lang })}`,
    );
    cacheLife("hours");
    return section;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes(": 404 ")) {
      // Drupal answered: no such (published) section. A real answer, keep it.
      cacheLife("hours");
      return null;
    }
    console.warn(
      `[section] Drupal section ${nodeId} (${lang}) unavailable, using the built-in content:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return null;
  }
}
