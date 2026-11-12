"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/icons";
import { arrowButton } from "@/components/ui";

export type Review = { name: string; title: string; rating: number; text: string };

/** The slider shows at most this many reviews (the first ones in the list). */
const MAX_REVIEWS = 5;

/**
 * "Visitors' Experience": a slider of up to 5 reviews (yachtClub.reviews.items
 * in the dictionaries). Previous / Next buttons slide one review at a time and
 * loop around; on touch screens the reviews can also be swiped. The buttons
 * are greyed out while there is only one review. The movement uses inline
 * styles so it works the same in development and production.
 */
export default function Reviews({
  title,
  text,
  items,
  labels,
}: {
  title: string;
  text: string;
  items: Review[];
  labels: { previous: string; next: string; rating: string; counter: string };
}) {
  const reviews = items.slice(0, MAX_REVIEWS);
  const count = reviews.length;
  const [current, setCurrent] = useState(0);
  const swipeStart = useRef<number | null>(null);
  // No sliding for visitors who asked their device to reduce motion.
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const ease = (value: string) => (still ? "none" : value);

  if (count === 0) return null;

  const single = count < 2;
  const go = (step: number) => setCurrent((index) => (index + step + count) % count);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gold sm:text-[40px]">{title}</h2>
          <p className="mt-3 max-w-xl leading-relaxed sm:text-[17px]">{text}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={single}
            aria-label={labels.previous}
            className={`${arrowButton} bg-white/15 enabled:hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={single}
            aria-label={labels.next}
            className={`${arrowButton} bg-gold enabled:hover:bg-teal disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Slides sit side by side; the track moves one full width per review */}
      <div
        className="mt-10 touch-pan-y overflow-hidden"
        aria-roledescription="carousel"
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeStart.current === null || single) return;
          const moved = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(moved) < 50) return;
          // Swiping towards the reading start shows the next review.
          const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
          go((moved < 0) !== rtl ? 1 : -1);
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        <div
          className="flex items-start gap-6 [--yc-dir:1] rtl:[--yc-dir:-1]"
          style={{
            transform: `translateX(calc(${current} * (-100% - 1.5rem) * var(--yc-dir, 1)))`,
            transition: ease("transform 900ms cubic-bezier(0.65, 0, 0.35, 1)"),
          }}
        >
          {reviews.map((review, index) => {
            const active = index === current;
            return (
              <figure
                key={`${review.name}-${index}`}
                aria-roledescription="slide"
                aria-label={labels.counter
                  .replace("{current}", String(index + 1))
                  .replace("{total}", String(count))}
                aria-hidden={!active}
                inert={!active}
                className="w-full shrink-0 rounded-xl border border-white/80 px-6 py-7 sm:px-10"
                // The review moving out fades and shrinks a little, the new one fades in.
                style={{
                  opacity: active ? 1 : 0.25,
                  transform: active ? "scale(1)" : "scale(0.96)",
                  transition: ease("opacity 900ms ease, transform 900ms cubic-bezier(0.65, 0, 0.35, 1)"),
                }}
              >
                <figcaption>
                  <p className="text-3xl font-bold text-teal sm:text-[40px]">{review.name}</p>
                  <p className="mt-2 text-xl font-bold sm:text-2xl">{review.title}</p>
                  <p
                    className="mt-3 flex gap-0.5"
                    role="img"
                    aria-label={labels.rating.replace("{rating}", String(review.rating))}
                  >
                    {Array.from({ length: 5 }, (_, star) => (
                      <StarIcon
                        key={star}
                        className={`size-3.5 ${star < review.rating ? "text-[#e2c27d]" : "text-white/40"}`}
                      />
                    ))}
                  </p>
                </figcaption>
                <blockquote className="mt-4 leading-relaxed sm:text-[17px]">{review.text}</blockquote>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Dots: which review is showing; click one to jump to it */}
      {!single && (
        <div className="mt-5 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={`${review.name}-${index}`}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={labels.counter
                .replace("{current}", String(index + 1))
                .replace("{total}", String(count))}
              aria-current={index === current}
              className="h-2 rounded-full bg-white/30 hover:bg-white/60"
              style={{
                width: index === current ? "2rem" : "0.5rem",
                backgroundColor: index === current ? "#a8935e" : undefined,
                transition: ease("width 500ms ease, background-color 500ms ease"),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
