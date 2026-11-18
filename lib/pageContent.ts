import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";

/** A "Pages" node from Drupal: GET /api/page/{nid}?lang=xx */
export type PageContent = {
  nid: number;
  langcode: string;
  title: string;
  /** field_main_title */
  mainTitle: string;
  /** field_content, as HTML (after its text format) */
  content: string;
  summary: string;
};

/**
 * The Drupal "Pages" node with this id, in the requested language, or null if
 * there is none (or Drupal can't be reached). Never throws, so a missing
 * Drupal can't fail the build. Answers are cached for an hour; connection
 * failures only for about a minute.
 */
export async function getPageContent(nodeId: number, lang: Locale): Promise<PageContent | null> {
  "use cache";
  cacheTag("drupal-page", `drupal-page-${nodeId}`);

  try {
    const page = await drupalFetch<PageContent>(`/api/page/${nodeId}?${new URLSearchParams({ lang })}`);
    cacheLife("hours");
    return page;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes(": 404 ")) {
      // Drupal answered: there is no such page. That is a real answer, keep it.
      cacheLife("hours");
      return null;
    }
    console.warn(
      `[page] Drupal page ${nodeId} (${lang}) unavailable, using the built-in content:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return null;
  }
}
