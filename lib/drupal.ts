/**
 * Drupal backend connection.
 * Set DRUPAL_BASE_URL in .env.local, e.g. http://localhost/jyc/new/backend
 */
export const DRUPAL_BASE_URL = (
  process.env.DRUPAL_BASE_URL ?? "http://localhost/jyc/new/backend"
).replace(/\/+$/, "");

/** How long to wait for Drupal before giving up (so a slow or missing backend can't stall the build). */
const TIMEOUT_MS = 5000;

/** GET a JSON endpoint from Drupal. Throws if Drupal can't be reached, is too slow or answers with an error. */
export async function drupalFetch<T>(path: string): Promise<T> {
  const url = `${DRUPAL_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Drupal request failed: ${res.status} ${res.statusText} (${url})`);
  }
  return (await res.json()) as T;
}
