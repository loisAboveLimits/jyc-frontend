import { Suspense } from "react";
import Trips from "@/components/home/Trips";
import { TripsFallback, type Trip, type TripsProps } from "@/components/home/TripsParts";
import { type Locale, localizedHref, stripLocale } from "@/lib/i18n";
import { getTrips } from "@/lib/trips";

/**
 * "Book your Experience" slider with the trips from Drupal (content type
 * "Trips": title, field_content, field_main_image, field_more, field_ratings).
 * The heading, intro text and labels stay as given in `fallback`.
 * Without trips in Drupal (or when Drupal can't be reached) it shows
 * `fallback.trips`, the built-in ones.
 *
 * `defaultHref` is used for "Learn More" when field_more is empty or "#".
 */
export default async function DrupalTrips({
  lang,
  fallback,
  defaultHref = "/yacht-club",
}: {
  lang: Locale;
  fallback: TripsProps;
  defaultHref?: string;
}) {
  const drupalTrips = await getTrips(lang);

  const trips: Trip[] = drupalTrips.length
    ? drupalTrips.map((trip, index) => ({
        title: trip.title,
        text: trip.text,
        // No photo in Drupal: borrow one of the built-in trip photos.
        image: trip.image?.url ?? fallback.trips[index % fallback.trips.length]?.image ?? "",
        remote: Boolean(trip.image),
        rating: trip.rating,
        href: tripHref(lang, trip.more, defaultHref),
      }))
    : fallback.trips;

  const props: TripsProps = { ...fallback, trips };

  // The Swiper slider can only run in the browser, so it must stay inside
  // this Suspense boundary or `next build` fails. The fallback is the same
  // section rendered on the server with the cards in a plain row.
  return (
    <Suspense fallback={<TripsFallback {...props} />}>
      <Trips {...props} />
    </Suspense>
  );
}

/** field_more as a link: site paths get the language prefix, other links stay as they are. */
function tripHref(lang: Locale, more: string, defaultHref: string): string {
  const link = more.trim();
  if (!link || link === "#") return localizedHref(lang, defaultHref);
  if (link.startsWith("/") && !link.startsWith("//")) return localizedHref(lang, stripLocale(link));
  return link;
}
