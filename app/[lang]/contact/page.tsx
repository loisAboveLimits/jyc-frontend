import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Newsletter from "@/components/contact/Newsletter";
import Faq from "@/components/Faq";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "contact");

/**
 * "Download Our Latest News" file. Put it at public/files/latest-news.pdf and
 * the link appears in the newsletter band (hidden until then, so there is
 * never a broken link).
 */
const LATEST_NEWS = "/files/latest-news.pdf";
const latestNewsHref = existsSync(path.join(process.cwd(), "public", LATEST_NEWS)) ? LATEST_NEWS : null;

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.contact;

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        crumb={dict.nav.contact}
        title={t.hero.title}
        text={t.hero.text}
        wideText
        image="/images/contact/hero.jpg"
        compact
      />
      <ContactInfo dict={dict} />
      <ContactForm dict={dict} />
      <Newsletter dict={dict} newsHref={latestNewsHref} />
      <Faq title={t.faq.title} items={t.faq.items} group="contact-faq" />
    </main>
  );
}
