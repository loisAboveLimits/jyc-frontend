import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedHref } from "@/lib/i18n";
import { getMainPage, type MainPageKey } from "@/lib/pages";

export type LangParams = Promise<{ lang: string }>;

/** <title> and language alternates for one of the main pages. */
export async function mainPageMetadata(
  params: LangParams,
  key: MainPageKey,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { path } = getMainPage(key);
  return {
    // Inner pages get "About Us | JYC" (the layout adds "| JYC").
    // The home page shows only the site name: "JYC".
    title: key === "home" ? { absolute: dict.meta.title } : dict.nav[key],
    alternates: {
      canonical: localizedHref(lang, path),
      languages: {
        en: localizedHref("en", path),
        ar: localizedHref("ar", path),
        "x-default": localizedHref("en", path),
      },
    },
  };
}

/** Placeholder body for a main page: shows the translated title. */
export default async function MainPage({
  params,
  page,
  children,
}: {
  params: LangParams;
  page: MainPageKey;
  children?: React.ReactNode;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    // Top padding leaves room for the site header, which sits on top of the page.
    <main className="mx-auto w-full max-w-[1340px] flex-1 px-5 pb-16 pt-44 sm:px-8 sm:pt-52">
      <h1 className="text-4xl font-bold sm:text-5xl">{dict.nav[page]}</h1>
      {children}
    </main>
  );
}
