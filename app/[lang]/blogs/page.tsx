import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "blogs");

/** First page of the blog list (later pages: blogs/page/[page]). */
export default async function BlogsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <BlogList lang={lang} dict={await getDictionary(lang)} page={1} />;
}
