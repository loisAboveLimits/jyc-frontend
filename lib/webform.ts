"use server";

import { DRUPAL_BASE_URL } from "./drupal";
import { isLocale } from "./i18n";

/**
 * Server action: sends a form to a Drupal webform
 * (POST {DRUPAL_BASE_URL}/api/webform/{id}). Runs on the Next.js server, so
 * the visitor's browser never talks to Drupal directly.
 */

/** Webforms the website may submit to. Add new ones here. */
const ALLOWED_WEBFORMS = ["contact_jyc_marina", "contact_academy", "newsletter", "contact_page"];

/** Hidden "leave empty" field of <WebformForm>: bots fill it in, people don't. */
const HONEYPOT_FIELD = "website";

export type WebformResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: Record<string, string> }
  | { ok: false; reason: "unavailable" };

export async function submitWebform(
  webformId: string,
  lang: string,
  data: Record<string, string>,
): Promise<WebformResult> {
  if (!ALLOWED_WEBFORMS.includes(webformId)) return { ok: false, reason: "unavailable" };

  // Bot filled in the hidden field: pretend it worked, save nothing.
  if (data[HONEYPOT_FIELD]) return { ok: true };

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== HONEYPOT_FIELD && typeof value === "string") fields[key] = value.slice(0, 5000);
  }

  try {
    const res = await fetch(`${DRUPAL_BASE_URL}/api/webform/${webformId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ lang: isLocale(lang) ? lang : "en", data: fields }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as
      | { ok: boolean; errors?: Record<string, string> }
      | null;

    if (res.ok && json?.ok) return { ok: true };
    if (res.status === 422 && json?.errors) return { ok: false, reason: "invalid", errors: json.errors };

    console.warn(`[webform] ${webformId}: Drupal answered ${res.status}`, json?.errors ?? "");
    return { ok: false, reason: "unavailable" };
  } catch (error) {
    console.warn(
      `[webform] ${webformId}: Drupal unreachable:`,
      error instanceof Error ? (error.cause ?? error.message) : error,
    );
    return { ok: false, reason: "unavailable" };
  }
}
