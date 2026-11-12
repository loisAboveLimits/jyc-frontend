"use client";

import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { MemberCard, TeamFrame, type TeamProps } from "@/components/about/TeamParts";

/**
 * "Meet The Team" with a Swiper slider of team cards.
 *
 * Swiper only runs in the browser. On the page this component must be wrapped
 * in <Suspense fallback={<TeamFallback … />}> (see app/[lang]/about/page.tsx),
 * otherwise `next build` can fail with "client rendering was requested
 * outside a Suspense boundary".
 */
export default function Team({ members, ...frame }: TeamProps) {
  const swiper = useRef<SwiperInstance | null>(null);

  // Loop needs more slides than are visible at once, so a short list is repeated.
  const slides = members.length > 0 && members.length < 8 ? [...members, ...members] : members;

  return (
    <TeamFrame
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
        spaceBetween={16}
        slidesPerView={1.33}
        breakpoints={{
          640: { slidesPerView: 2.25 },
          1024: { slidesPerView: 3.25 },
        }}
        className="w-full min-w-0"
      >
        {slides.map((member, index) => (
          <SwiperSlide key={index}>
            <MemberCard member={member} />
          </SwiperSlide>
        ))}
      </Swiper>
    </TeamFrame>
  );
}
