import type { Metadata } from "next";
import { El_Messiri } from "next/font/google";
import { notFound } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
import { getDictionary } from "@/lib/dictionaries";
import { getDirection, isLocale, locales } from "@/lib/i18n";

// One font for the whole site. El Messiri covers both English and Arabic.
const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin", "arabic"],
  display: "swap",
});

// The layout sets <html lang/dir> from the URL, so it must read the language first.
export const instant = false;

// Build both languages as static pages.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    // Pages set their own title; it is shown as "About Us | JYC".
    title: { default: dict.meta.title, template: `%s | ${dict.meta.title}` },
    description: dict.meta.description,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      className={`${elMessiri.variable} h-full antialiased`}
    >
      {/* Header and footer are here so every page of the site gets them. */}
      <body className="relative flex min-h-full flex-col overflow-x-clip">
        <PageLoader label={dict.common.loading} />
        {/* Without JavaScript the loader could never hide itself, so skip it. */}
        <noscript>
          <style>{"#page-loader{display:none}"}</style>
        </noscript>
        <SmoothScroll />
        <SiteHeader lang={lang} dict={dict} />
        {children}
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  );
}
