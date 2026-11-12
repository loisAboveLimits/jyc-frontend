import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import { blogPagePath, getPageCount } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedHref, locales } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; page: string }> };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

/** Every page of the blog list, in both languages, is built ahead of time. */
export function generateStaticParams() {
  const pages = Array.from({ length: getPageCount() }, (_, index) => String(index + 1));
  return locales.flatMap((lang) => pages.map((page) => ({ lang, page })));
}

/** "2" → 2; anything that is not a page that exists → null. */
function parsePage(value: string): number | null {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= getPageCount() && String(page) === value ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, page: value } = await params;
  const page = parsePage(value);
  if (!isLocale(lang) || page === null) return {};
  const dict = await getDictionary(lang);
  const path = blogPagePath(page);
  return {
    title: `${dict.nav.blogs} – ${dict.blogs.pagination.page.replace("{page}", String(page))}`,
    alternates: {
      canonical: localizedHref(lang, path),
      languages: { en: localizedHref("en", path), ar: localizedHref("ar", path) },
    },
  };
}

/** Page 2, 3… of the blog list. /blogs/page/1 sends visitors to /blogs. */
export default async function BlogsListPage({ params }: Props) {
  const { lang, page: value } = await params;
  const page = parsePage(value);
  if (!isLocale(lang) || page === null) notFound();
  if (page === 1) permanentRedirect(localizedHref(lang, blogPagePath(1)));
  return <BlogList lang={lang} dict={await getDictionary(lang)} page={page} />;
}
