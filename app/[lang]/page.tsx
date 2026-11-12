import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import About from "@/components/home/About";
import Blog from "@/components/home/Blog";
import Contact from "@/components/home/Contact";
import Events from "@/components/home/Events";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Offer from "@/components/home/Offer";
import Trips from "@/components/home/Trips";
import { TripsFallback, type TripsProps } from "@/components/home/TripsParts";
import { mainPageMetadata } from "@/components/MainPage";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedHref } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

// This page needs the language from the URL before it can render anything,
// so it is allowed to block instead of using a shared instant-navigation shell.
// https://nextjs.org/docs/messages/instant-shell-url-data
export const instant = false;

// Page title and links to the other language version.
export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  mainPageMetadata(params, "home");

// Photo and star rating for each trip, in the same order as home.trips.items
// in the dictionaries. (Later this can come from Drupal.)
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
      <Hero lang={lang} dict={dict} />
      <About lang={lang} dict={dict} />
      <Offer lang={lang} dict={dict} />
      {/*
        The Swiper slider can only run in the browser, so it must stay inside
        this Suspense boundary or `next build` fails. The fallback is the same
        section rendered on the server with the cards in a plain row.
      */}
      <Suspense fallback={<TripsFallback {...tripsProps} />}>
        <Trips {...tripsProps} />
      </Suspense>
      <Gallery lang={lang} dict={dict} />
      <Events dict={dict} />
      <Blog lang={lang} dict={dict} />
      <Contact dict={dict} />
    </main>
  );
}
