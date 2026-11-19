import type { Metadata } from "next";
import { notFound } from "next/navigation";
import About from "@/components/home/About";
import Blog from "@/components/home/Blog";
import Contact from "@/components/home/Contact";
import DrupalEvents from "@/components/DrupalEvents";
import Gallery from "@/components/home/Gallery";
import DrupalHero from "@/components/DrupalHero";
import Hero, { HomeFeatures } from "@/components/home/Hero";
import Offer from "@/components/home/Offer";
import type { TripsProps } from "@/components/home/TripsParts";
import DrupalTrips from "@/components/DrupalTrips";
import { mainPageMetadata } from "@/components/MainPage";
import { PAGE_NODE_IDS } from "@/lib/banners";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedHref } from "@/lib/i18n";

import DrupalSection from "@/components/DrupalSection";

type Props = { params: Promise<{ lang: string }> };

// This page needs the language from the URL before it can render anything,
// so it is allowed to block instead of using a shared instant-navigation shell.
// https://nextjs.org/docs/messages/instant-shell-url-data
export const instant = false;

// Page title and links to the other language version.
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "home");

// Photo and star rating for each trip, in the same order as home.trips.items
// in the dictionaries. Only used when Drupal has no trips (see <DrupalTrips>).
const tripDetails = [
  { image: "/images/home/trip-riva.jpg", rating: 4 },
  { image: "/images/home/trip-yacht-club.jpg", rating: 3 },
  { image: "/images/home/trip-fire-boat.jpg", rating: 5 },
];

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const trips = dict.home.trips;
  const tripsProps: TripsProps = {
    eyebrowText: trips.eyebrow,
    title: trips.title,
    text: trips.text,
    trips: trips.items.map((item, index) => ({
      ...item,
      ...tripDetails[index],
      href: localizedHref(lang, "/yacht-club"),
    })),
    labels: {
      previous: dict.common.previous,
      next: dict.common.next,
      learnMore: dict.common.learnMore,
      rating: dict.common.ratingLabel,
    },
  };

  return (
    <main className="flex-1">
      {/* Drupal home page (node 1): its banners in the slider, with its field_content
          under them. Without banners: the original built-in hero, as before Drupal. */}
      <DrupalHero
        nodeId={PAGE_NODE_IDS.home}
        lang={lang}
        dict={dict}
        blendInto="navy"
        fallback={<Hero lang={lang} dict={dict} />}
      >
        <HomeFeatures lang={lang} dict={dict} />
      </DrupalHero>

      <DrupalSection nodeId={19} lang={lang} fallback={<About lang={lang} dict={dict} />} />      

      <DrupalSection nodeId={20} lang={lang} fallback={<Offer lang={lang} dict={dict} />} /> 
      
      {/* Trips slider: the cards come from Drupal (content type "Trips");
          the built-in trips below are used when there are none. */}
      <DrupalTrips lang={lang} fallback={tripsProps} />

      <DrupalSection nodeId={24} lang={lang} fallback={<Gallery lang={lang} dict={dict} />} /> 

      {/* The next 4 upcoming events from Drupal (content type "Events"),
          earliest first; the built-in events when there are none. */}
      <DrupalEvents lang={lang} dict={dict} limit={4} />
      
      <DrupalSection nodeId={25} lang={lang} fallback={<Blog lang={lang} dict={dict} />} /> 
      
      <Contact lang={lang} dict={dict} />
    </main>
  );
}
