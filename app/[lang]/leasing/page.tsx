import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPanel from "@/components/ContactPanel";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "leasing");

/** The leasing team's own email and phone (from the design). */
const LEASING_EMAIL = "DestinationsLeasing@sela.sa";
const LEASING_PHONE = "+966 92 00 1634";

export default async function LeasingPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.leasing;

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        crumb={dict.nav.leasing}
        title={t.title}
        image="/images/leasing/hero.jpg"
        compact
      />
      <ContactPanel
        id="leasing-contact"
        title={t.contact.title}
        text={t.contact.text}
        labels={{ ...dict.common.contactForm, subject: t.contact.subject }}
        image="/images/leasing/contact.jpg"
        imageAlt={t.contact.imageAlt}
        email={LEASING_EMAIL}
        phone={LEASING_PHONE}
      />
    </main>
  );
}
