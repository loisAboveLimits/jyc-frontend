import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/icons";
import { arrowButton, button, container, eyebrow } from "@/components/ui";

/**
 * Pieces of the "Book your Experience" section that work on the server and in
 * the browser. The slider (Trips.tsx) and its build-time stand-in
 * (TripsFallback below) are both built from them, so they look identical.
 */

export type Trip = {
  title: string;
  text: string;
  image: string;
  rating: number;
  href: string;
};

export type TripLabels = {
  previous: string;
  next: string;
  learnMore: string;
  rating: string;
};

export type TripsProps = {
  eyebrowText: string;
  title: string;
  text: string;
  trips: Trip[];
  labels: TripLabels;
};

/** One trip: photo, title, star rating, text and "Learn More". */
export function TripCard({ trip, labels }: { trip: Trip; labels: TripLabels }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-teal/60 bg-teal/25 transition-colors hover:bg-teal">
      <div className="relative aspect-[284/205] overflow-hidden rounded-b-3xl">
        <Image
          src={trip.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 82vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <h3 className="text-2xl font-bold">{trip.title}</h3>
        <div
          role="img"
          aria-label={labels.rating.replace("{rating}", String(trip.rating))}
          className="mt-4 flex gap-0.5"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-3 w-auto ${star <= trip.rating ? "text-gold" : "text-white/55"}`}
            />
          ))}
        </div>
        <p className="mb-6 mt-2 leading-snug text-white/90">{trip.text}</p>
        <Link
          href={trip.href}
          className={`${button.glass} ms-auto mt-auto text-sm group-hover:border group-hover:border-white`}
        >
          {labels.learnMore}
          <span className="sr-only">: {trip.title}</span>
        </Link>
      </div>
    </article>
  );
}

/** The section layout: arrows and intro on one side, the cards on the other. */
export function TripsFrame({
  eyebrowText,
  title,
  text,
  labels,
  onPrevious,
  onNext,
  children,
}: Omit<TripsProps, "trips"> & {
  onPrevious?: () => void;
  onNext?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="bg-navy-soft py-10 lg:py-12">
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-14`}>
        <div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onPrevious}
              aria-label={labels.previous}
              className={`${arrowButton} bg-white/20 hover:bg-white/30`}
            >
              <ChevronLeftIcon className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={labels.next}
              className={`${arrowButton} bg-gold/80 hover:bg-gold`}
            >
              <ChevronRightIcon className="rtl:rotate-180" />
            </button>
          </div>
          <p className={`${eyebrow} mt-8`}>{eyebrowText}</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-[44px] sm:leading-[1.2]">
            {title}
          </h2>
          <p className="mt-10 text-lg leading-relaxed sm:text-2xl sm:leading-[1.6]">{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * Stand-in for the slider while it loads: the same section with the cards in
 * a plain row. This is what goes into the page's HTML when the slider's code
 * isn't ready during the build, so search engines still see the trips and the
 * page doesn't jump when Swiper takes over.
 */
export function TripsFallback({ trips, labels, ...frame }: TripsProps) {
  return (
    <TripsFrame labels={labels} {...frame}>
      <div className="flex min-w-0 gap-5 overflow-hidden">
        {trips.map((trip) => (
          <div
            key={trip.title}
            className="w-[87%] shrink-0 sm:w-[calc((100%-20px)/2)] xl:w-[calc((100%-40px)/3)]"
          >
            <TripCard trip={trip} labels={labels} />
          </div>
        ))}
      </div>
    </TripsFrame>
  );
}
