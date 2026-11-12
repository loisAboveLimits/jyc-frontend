import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArticle from "@/components/blog/PostArticle";
import { blogPostPath, getPost, getPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedHref, locales } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

/** Every post, in both languages, is built ahead of time. */
export function generateStaticParams() {
  return locales.flatMap((lang) => getPosts().map((post) => ({ lang, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!isLocale(lang) || !post) return {};
  const text = post[lang];
  const path = blogPostPath(slug);
  return {
    title: text.title,
    description: text.excerpt,
    openGraph: { type: "article", publishedTime: post.date, images: [post.image] },
    alternates: {
      canonical: localizedHref(lang, path),
      languages: { en: localizedHref("en", path), ar: localizedHref("ar", path) },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!isLocale(lang) || !post) notFound();
  return <PostArticle post={post} lang={lang} dict={await getDictionary(lang)} />;
}
