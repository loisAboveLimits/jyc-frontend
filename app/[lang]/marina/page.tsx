import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPanel from "@/components/ContactPanel";
import Faq from "@/components/Faq";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import MarinaCards from "@/components/marina/MarinaCards";
import PortStrip from "@/components/marina/PortStrip";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "marina");

const CONTACT_ID = "marina-contact";

export default async function MarinaPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.marina;

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        crumb={dict.nav.marina}
        title={t.hero.title}
        text={t.hero.text}
        wideText
        image="/images/marina/hero.jpg"
        intro={{ text: t.hero.intro, link: t.hero.apply, href: `#${CONTACT_ID}` }}
      />
      <MarinaCards dict={dict} contactHref={`#${CONTACT_ID}`} />
      <PortStrip dict={dict} />
      <Faq title={t.faq.title} items={t.faq.items} group="marina-faq" />
      <ContactPanel
        id={CONTACT_ID}
        title={t.contact.title}
        text={t.contact.text}
        labels={{ ...dict.common.contactForm, subject: t.contact.subject }}
        image="/images/marina/contact.jpg"
        imageAlt={t.contact.imageAlt}
      />
    </main>
  );
}
