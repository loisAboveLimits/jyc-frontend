import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import Benefits from "@/components/yacht-club/Benefits";
import FeatureRows from "@/components/yacht-club/FeatureRows";
import Testimonials from "@/components/yacht-club/Testimonials";
import YachtContact from "@/components/yacht-club/YachtContact";
import YachtHero from "@/components/yacht-club/YachtHero";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "yachtClub");

/**
 * The brochure PDF. Put the file at public/files/yacht-club-brochure.pdf and
 * the "Download the Brochure" button appears (it stays hidden until then,
 * so visitors never get a broken link).
 */
const BROCHURE = "/files/yacht-club-brochure.pdf";
const brochureHref = existsSync(path.join(process.cwd(), "public", BROCHURE)) ? BROCHURE : null;

export default async function YachtClubPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const benefits = dict.yachtClub.benefits;

  return (
    <main className="flex-1">
      <YachtHero lang={lang} dict={dict} />
      <FeatureRows dict={dict} brochureHref={brochureHref} />
      <Benefits title={benefits.title} items={benefits.items} imageAlt={benefits.imageAlt} />
      <Testimonials dict={dict} />
      <YachtContact dict={dict} />
    </main>
  );
}
