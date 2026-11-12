import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AboutHero from "@/components/about/AboutHero";
import AcademyCards from "@/components/about/AcademyCards";
import Experience from "@/components/about/Experience";
import Heritage from "@/components/about/Heritage";
import InsideGallery from "@/components/about/InsideGallery";
import Team from "@/components/about/Team";
import { TeamFallback, type TeamProps } from "@/components/about/TeamParts";
import Faq from "@/components/Faq";
import { mainPageMetadata, type LangParams } from "@/components/MainPage";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type Props = { params: LangParams };

// Needs the language from the URL before rendering (see app/[lang]/page.tsx).
export const instant = false;

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "about");

// Team photos, in the same order as about.team.members in the dictionaries.
// (Later the team can come from Drupal.)
const teamPhotos = [
  "/images/about/team-1.jpg",
  "/images/about/team-2.jpg",
  "/images/about/team-3.jpg",
  "/images/about/team-4.jpg",
];

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const team: TeamProps = {
    title: dict.about.team.title,
    text: dict.about.team.text,
    members: dict.about.team.members.map((member, index) => ({
      ...member,
      image: teamPhotos[index],
    })),
    labels: { previous: dict.common.previous, next: dict.common.next },
  };

  return (
    <main className="flex-1">
      <AboutHero dict={dict} />
      <Heritage lang={lang} dict={dict} />
      <AcademyCards lang={lang} dict={dict} />
      <InsideGallery dict={dict} />
      {/*
        The Swiper slider can only run in the browser, so it must stay inside
        this Suspense boundary or `next build` fails. The fallback is the same
        section rendered on the server with the cards in a plain row.
      */}
      <Suspense fallback={<TeamFallback {...team} />}>
        <Team {...team} />
      </Suspense>
      <Experience lang={lang} dict={dict} />
      <Faq title={dict.about.faq.title} items={dict.about.faq.items} group="about-faq" />
    </main>
  );
}
