import { cacheLife, cacheTag } from "next/cache";
import { drupalFetch } from "./drupal";
import type { Locale } from "./i18n";

/**
 * Drupal content blocks (Block layout > Content blocks) used by the footer,
 * one per column. Set a column to null to always use its built-in version.
 */
export const FOOTER_BLOCK_IDS = {
  about: 1, // Footer Col1: logo, intro text, social links
  quickLinks: 2, // Footer Col2: Quick Links
  contact: 3, // Footer Col3: Contact Us
  newsletter: 4, // Footer Col4: Newsletter
} satisfies Record<string, number | string | null>;

/** A content block from Drupal: GET /api/block/{id}?lang=xx */
export type DrupalBlockData = {
  id: number;
  uuid: string;
  type: string;
  langcode: string;
  /** Block description, e.g. "Footer Col2 - EN" */
  info: string;
  /** body, as HTML (after its text format) */
  body: string;
};

/**
 * The content block with this id (or UUID), in the requested language, or
 * null if there is none (or Drupal can't be reached). Never throws, so a
 * missing Drupal can't fail the build. Answers are cached for an hour;
 * connection failures only for about a minute.
 */
export async function getBlock(id: number | string, lang: Locale): Promise<DrupalBlockData | null> {
  "use cache";
  cacheTag("drupal-block", `drupal-block-${id}`);

  try {
    const block = await drupalFetch<DrupalBlockData>(
      `/api/block/${encodeURIComponent(String(id))}?${new URLSearchParams({ lang })}`,
    );
    cacheLife("hours");
    return block;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes(": 404 ")) {
      // Drupal answered: no such (published) block. A real answer, keep it.
      cacheLife("hours");
      return null;
    }
    console.warn(
      `[block] Drupal block ${id} (${lang}) unavailable, using the built-in content:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    cacheLife("minutes");
    return null;
  }
}
