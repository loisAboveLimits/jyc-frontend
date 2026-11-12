"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/icons";
import { arrowButton, button, container, eyebrow } from "@/components/ui";

export type Trip = {
  title: string;
  text: string;
  image: string;
  rating: number;
  href: string;
};

type Props = {
  eyebrowText: string;
  title: string;
  text: string;
  trips: Trip[];
  labels: { previous: string; next: string; learnMore: string; rating: string };
};

type Labels = Props["labels"];

/** One trip: photo, title, star rating, text and "Learn More". */
function TripCard({ trip, labels }: { trip: Trip; labels: Labels }) {
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

/** "Book your Experience": intro on one side, a Swiper slider of trip cards on the other. */
export default function Trips({ eyebrowText, title, text, trips, labels }: Props) {
  const swiper = useRef<SwiperInstance | null>(null);

  // The slider loops forever. Swiper needs more slides than fit on screen to
  // loop smoothly (3 are visible on large screens), so a short list is repeated.
  const slides = trips.length > 0 && trips.length < 6 ? [...trips, ...trips] : trips;

  return (
    <section className="bg-navy-soft py-10 lg:py-12">
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-14`}>
        <div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => swiper.current?.slidePrev()}
              aria-label={labels.previous}
              className={`${arrowButton} bg-white/20 hover:bg-white/30`}
            >
              <ChevronLeftIcon className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => swiper.current?.slideNext()}
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

        {/*
          Swiper can only start in the browser, so the build cannot render it.
          The fallback is what goes into the page's HTML: the same cards in a
          plain row (good for search engines and no layout jump). Swiper takes
          over as soon as the page loads.
        */}
        <Suspense
          fallback={
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
          }
        >
        <Swiper
          modules={[A11y]}
          onSwiper={(instance) => {
            swiper.current = instance;
          }}
          loop
          speed={650}
          grabCursor
          spaceBetween={20}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="w-full min-w-0"
        >
          {slides.map((trip, index) => (
            <SwiperSlide key={`${trip.title}-${index}`} className="!h-auto">
              <TripCard trip={trip} labels={labels} />
            </SwiperSlide>
          ))}
        </Swiper>
        </Suspense>
      </div>
    </section>
  );
}
