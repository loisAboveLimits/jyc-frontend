/**
 * Drupal backend connection.
 * Set DRUPAL_BASE_URL in .env.local, e.g. http://localhost/jyc/new/backend
 */
export const DRUPAL_BASE_URL = (
  process.env.DRUPAL_BASE_URL ?? "http://localhost/jyc/new/backend"
).replace(/\/+$/, "");

/** GET a JSON endpoint from Drupal. Throws if Drupal answers with an error. */
export async function drupalFetch<T>(path: string): Promise<T> {
  const url = `${DRUPAL_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Drupal request failed: ${res.status} ${res.statusText} (${url})`);
  }
  return (await res.json()) as T;
}
