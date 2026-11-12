import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionTicker from "@/components/academy/ActionTicker";
import Beacon from "@/components/academy/Beacon";
import Courses from "@/components/academy/Courses";
import { ACADEMY_EMAIL, ACADEMY_PHONE } from "@/components/academy/links";
import Sanctuary from "@/components/academy/Sanctuary";
import ContactPanel from "@/components/ContactPanel";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import PageHero from "@/components/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "academy");

/**
 * "See The Academy In Action" photos, in the same order as
 * academy.gallery.imageAlts. `width`/`height` are the files' pixel sizes.
 */
const galleryPhotos = [
  { src: "/images/academy/gallery-1.jpg", width: 214, height: 215 },
  { src: "/images/academy/gallery-2.jpg", width: 215, height: 215 },
  { src: "/images/academy/gallery-3.jpg", width: 214, height: 215 },
  { src: "/images/academy/gallery-4.jpg", width: 215, height: 215 },
  { src: "/images/academy/gallery-5.jpg", width: 214, height: 215 },
  { src: "/images/academy/gallery-6.jpg", width: 214, height: 214 },
  { src: "/images/academy/gallery-7.jpg", width: 215, height: 214 },
  { src: "/images/academy/gallery-8.jpg", width: 214, height: 214 },
  { src: "/images/academy/gallery-9.jpg", width: 215, height: 214 },
];

/** Which photos each ticker row shows (row 1 runs left, row 2 runs right). */
const galleryRows = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8],
];

export default async function AcademyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.academy;

  return (
    <main className="flex-1">
      <PageHero
        lang={lang}
        breadcrumb={{ home: dict.common.breadcrumbHome, label: dict.common.breadcrumbLabel }}
        crumb={dict.nav.academy}
        title={t.hero.title}
        text={t.hero.text}
        wideText
        image="/images/academy/hero.jpg"
        intro={{ text: t.hero.intro }}
      />
      <Beacon dict={dict} />
      <Courses dict={dict} />
      <Sanctuary dict={dict} />
      <ActionTicker
        title={t.gallery.title}
        photos={galleryPhotos.map((photo, index) => ({ ...photo, alt: t.gallery.imageAlts[index] }))}
        rows={galleryRows}
        labels={{
          open: dict.common.openImage,
          close: dict.common.close,
          previous: dict.common.previous,
          next: dict.common.next,
          counter: dict.common.imageCounter,
        }}
      />
      <ContactPanel
        id="academy-contact"
        title={t.contact.title}
        text={t.contact.text}
        labels={{ ...dict.common.contactForm, subject: t.contact.subject }}
        image="/images/academy/contact.jpg"
        imageAlt={t.contact.imageAlt}
        email={ACADEMY_EMAIL}
        phone={ACADEMY_PHONE}
      />
    </main>
  );
}
