"use client";

import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { TripCard, TripsFrame, type TripsProps } from "@/components/home/TripsParts";

/**
 * "Book your Experience" with a Swiper slider of trip cards.
 *
 * Swiper only runs in the browser. On the page this component must be wrapped
 * in <Suspense fallback={<TripsFallback … />}> (see app/[lang]/page.tsx),
 * otherwise `next build` can fail with "client rendering was requested
 * outside a Suspense boundary".
 */
export default function Trips({ trips, labels, ...frame }: TripsProps) {
  const swiper = useRef<SwiperInstance | null>(null);

  // The slider loops forever. Swiper needs more slides than fit on screen to
  // loop smoothly (3 are visible on large screens), so a short list is repeated.
  const slides = trips.length > 0 && trips.length < 6 ? [...trips, ...trips] : trips;

  return (
    <TripsFrame
      labels={labels}
      {...frame}
      onPrevious={() => swiper.current?.slidePrev()}
      onNext={() => swiper.current?.slideNext()}
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
    </TripsFrame>
  );
}
