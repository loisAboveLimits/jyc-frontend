"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Lightbox, { type LightboxLabels, type LightboxPhoto } from "@/components/Lightbox";
import { container } from "@/components/ui";

/*
 * Keyframes for the endless rows. Each row holds its photos twice over
 * (two identical halves), so moving it by exactly half its width brings it
 * back to where it started and the loop has no visible jump.
 */
const keyframes = `
@keyframes academy-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

/** Seconds each photo takes to travel its own width (higher = slower). */
const SECONDS_PER_PHOTO = 6;
/** Each half of a row is at least this many photos long, so wide screens never see a gap. */
const MIN_PHOTOS_PER_HALF = 10;

/**
 * "See The Academy In Action": rows of photos that scroll endlessly like a
 * news ticker, each row in the opposite direction to the one above.
 * Hovering a row (or focusing a photo with the keyboard) pauses it, and
 * clicking a photo opens it in the lightbox. Visitors who prefer reduced
 * motion get still rows they can scroll sideways instead.
 *
 * `rows` lists, for each row, the indexes of the photos it shows.
 */
export default function ActionTicker({
  title,
  photos,
  rows,
  labels,
}: {
  title: string;
  photos: LightboxPhoto[];
  rows: number[][];
  labels: LightboxLabels & { open: string };
}) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="py-16 lg:py-24">
      <style href="academy-ticker" precedence="default">
        {keyframes}
      </style>

      <div className={container}>
        <h2 className="text-3xl font-bold text-teal sm:text-[40px]">{title}</h2>
      </div>

      <div className="mt-10 space-y-4 sm:space-y-5 lg:mt-12">
        {rows.map((row, rowIndex) => {
          const copies = Math.ceil(MIN_PHOTOS_PER_HALF / row.length);
          const half = Array.from({ length: copies }, () => row).flat();
          const track = [...half, ...half];
          return (
            <div
              key={rowIndex}
              // Photos only, so the rows always run left-to-right in the DOM
              // (the movement looks the same in Arabic).
              dir="ltr"
              className="group/row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:overflow-x-auto"
            >
              <ul
                className="flex w-max group-focus-within/row:[animation-play-state:paused] group-hover/row:[animation-play-state:paused] motion-reduce:[animation-name:none]!"
                style={{
                  animationName: "academy-ticker",
                  animationDuration: `${half.length * SECONDS_PER_PHOTO}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  // Every other row runs the opposite way.
                  animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
                }}
              >
                {track.map((photoIndex, position) => {
                  const photo = photos[photoIndex];
                  // Only the first copy of each photo is reachable by keyboard
                  // and screen readers; the repeats are just for the loop.
                  const repeat = position >= row.length;
                  return (
                    <li key={position} className="shrink-0 pr-3 sm:pr-4" aria-hidden={repeat || undefined}>
                      <button
                        type="button"
                        tabIndex={repeat ? -1 : undefined}
                        onClick={(event) => {
                          lastTrigger.current = event.currentTarget;
                          setOpen(photoIndex);
                        }}
                        aria-label={`${labels.open}: ${photo.alt}`}
                        className="group/photo relative block size-44 cursor-zoom-in overflow-hidden rounded-md shadow-lg shadow-black/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold sm:size-60 lg:size-[288px]"
                      >
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 288px, (min-width: 640px) 240px, 176px"
                          className="object-cover transition-transform duration-500 group-hover/photo:scale-110 motion-reduce:transition-none"
                        />
                        <span className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover/photo:bg-navy/20" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <Lightbox
        photos={photos}
        index={open}
        onChange={(next) => {
          setOpen(next);
          if (next === null) lastTrigger.current?.focus();
        }}
        labels={labels}
      />
    </section>
  );
}
