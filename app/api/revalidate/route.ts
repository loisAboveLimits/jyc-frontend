import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh the content cached from Drupal (menus, banners, page content), so
 * changes made in Drupal show right away instead of within the hour.
 *
 *   GET /api/revalidate                      -> everything from Drupal
 *   GET /api/revalidate?tag=drupal-banners   -> one kind of content
 *   GET /api/revalidate?tag=drupal-page-5    -> one page (node 5)
 *
 * Set DRUPAL_REVALIDATE_SECRET (e.g. in .env.local / Vercel) and pass it as
 * ?secret=…; without that variable it only works in development (npm run dev).
 */
const ALL_TAGS = ["drupal-menu", "drupal-banners", "drupal-page"];

export async function GET(request: NextRequest) {
  const secret = process.env.DRUPAL_REVALIDATE_SECRET;
  const given = request.nextUrl.searchParams.get("secret");
  const allowed = secret ? given === secret : process.env.NODE_ENV === "development";
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag");
  if (tag && !/^drupal-[a-z]+(-\d+)?$/.test(tag)) {
    return NextResponse.json({ ok: false, error: `Unknown tag "${tag}"` }, { status: 400 });
  }

  const tags = tag ? [tag] : ALL_TAGS;
  // expire: 0 -> the next visit fetches fresh content from Drupal (no stale copy).
  for (const t of tags) revalidateTag(t, { expire: 0 });

  return NextResponse.json({ ok: true, revalidated: tags });
}
