"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { arrowButton } from "@/components/ui";

/** At most this many slides are shown (extra ones are ignored). */
const MAX_SLIDES = 3;
/** Time each slide stays on screen before the next one fades in. */
const SLIDE_MS = 8000;
/** Length of the cross-fade between slides. */
const FADE_MS = 1200;
/** Caption lines: how long each one takes to move, when the first starts, and the gap between lines. */
const CAPTION_MS = 800;
const CAPTION_IN_DELAY = 450;
const CAPTION_STAGGER = 150;

export type HeroSlide = {
  /** Background: a photo, or a video (with a photo shown while it loads). */
  media:
    | { type: "image"; src: string; /** CSS object-position, e.g. "30% center" */ position?: string }
    | { type: "video"; src: string; poster: string };
  eyebrow: string;
  title: string;
  subtitle: string;
  text: string;
  /** Describes the photo; empty for decorative backgrounds. */
  imageAlt: string;
};

/**
 * Home page banner: up to 3 slides (photos and/or videos) that cross-fade,
 * each with its own heading and text. Moves on by itself every 8 seconds;
 * the arrows, the dots and swiping change slide by hand. It pauses while the
 * pointer or keyboard focus is on it, and does not move by itself for
 * visitors who prefer reduced motion. Videos only play while their slide is
 * showing.
 *
 * Renders the background layer (absolute, behind the whole hero section)
 * and the text block; the section around it provides the positioning.
 */
export default function HeroSlider({
  slides: allSlides,
  labels,
}: {
  slides: HeroSlide[];
  labels: { label: string; slide: string; previous: string; next: string };
}) {
  const slides = allSlides.slice(0, MAX_SLIDES);
  const count = slides.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const swipeStart = useRef<number | null>(null);

  // Becomes true just after the page loads, so the first captions also animate in.
  const [ready, setReady] = useState(false);
  const go = (step: number) => setCurrent((index) => (index + step + count) % count);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const timer = window.setTimeout(() => setReady(true), 50);
    return () => window.clearTimeout(timer);
  }, []);

  // Move on by itself.
  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = window.setTimeout(() => go(1), SLIDE_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused, reducedMotion, count]);

  // Only the showing slide's video plays (saves battery and data).
  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === current && !reducedMotion) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current, reducedMotion]);

  /**
   * Caption animation: each line fades in while sliding into place from its
   * own side (eyebrow from the top, title from the right, subtitle from the
   * left, text from the bottom; sideways moves are mirrored in Arabic), one
   * after another. When the slide changes, the lines leave the same way they
   * came, so the movement plays in reverse.
   */
  const caption = (active: boolean, from: "top" | "right" | "left" | "bottom", order: number) => {
    const offsets = {
      top: "translateY(-40px)",
      right: "translateX(calc(80px * var(--hd)))",
      left: "translateX(calc(-80px * var(--hd)))",
      bottom: "translateY(40px)",
    };
    if (reducedMotion) return { opacity: active ? 1 : 0, transition: "none" };
    return {
      opacity: active ? 1 : 0,
      transform: active ? "none" : offsets[from],
      transition: `opacity ${CAPTION_MS}ms ease, transform ${CAPTION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      // Coming in: wait for the old captions to leave, then one line after another.
      // Going out: the last line leaves first (the reverse order).
      transitionDelay: active ? `${CAPTION_IN_DELAY + order * CAPTION_STAGGER}ms` : `${(3 - order) * 80}ms`,
    };
  };

  const fade = { transition: reducedMotion ? "none" : `opacity ${FADE_MS}ms ease-in-out` };
  const counter = (index: number) =>
    labels.slide.replace("{current}", String(index + 1)).replace("{total}", String(count));

  return (
    <>
      {/* Backgrounds, stacked; the showing one fades in over the others.
          Mirrored in Arabic so the subject stays on the side opposite the text. */}
      <div className="absolute inset-0 -z-10 rtl:-scale-x-100">
        {slides.map((slide, index) => {
          const active = index === current;
          return (
            <div
              key={index}
              aria-hidden={!active || slide.media.type === "video" || !slide.imageAlt}
              className="absolute inset-0"
              style={{ ...fade, opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
            >
              {slide.media.type === "video" ? (
                <>
                  <Image
                    src={slide.media.poster}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-[70%_center]"
                  />
                  <video
                    ref={(el) => {
                      videos.current[index] = el;
                    }}
                    className="absolute inset-0 size-full object-cover object-[70%_center] motion-reduce:hidden"
                    autoPlay={index === 0}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "metadata" : "none"}
                    poster={slide.media.poster}
                    tabIndex={-1}
                  >
                    <source src={slide.media.src} type="video/mp4" />
                  </video>
                </>
              ) : (
                <Image
                  src={slide.media.src}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: slide.media.position ?? "65% center" }}
                />
              )}
            </div>
          );
        })}
        {/* Darken the top (behind the menu), the text side, and the bottom edge */}
        <div className="absolute inset-0 z-[2] bg-linear-to-b from-navy via-navy/10 to-navy" />
        <div className="absolute inset-0 z-[2] bg-linear-to-r from-navy via-navy/70 to-transparent md:via-navy/50" />
      </div>

      {/* Slide texts, stacked in the same spot so the block keeps the height of the longest */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={labels.label}
        className="max-w-2xl touch-pan-y"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeStart.current === null || count < 2) return;
          const moved = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(moved) < 50) return;
          const rtl = document.documentElement.dir === "rtl";
          go((moved < 0) !== rtl ? 1 : -1);
        }}
      >
        {/* [--hd] flips the sideways movements in Arabic (right-to-left) */}
        <div className="grid [--hd:1] rtl:[--hd:-1]">
          {slides.map((slide, index) => {
            const active = index === current && ready;
            // The first slide's title is the page's main heading.
            const Title = index === 0 ? "h1" : "h2";
            return (
              <div
                key={index}
                aria-roledescription="slide"
                aria-label={counter(index)}
                aria-hidden={index !== current}
                inert={index !== current}
                className="[grid-area:1/1]"
              >
                <p className="text-xl sm:text-2xl" style={caption(active, "top", 0)}>
                  {slide.eyebrow}
                </p>
                <Title
                  className="mt-3 text-5xl font-bold leading-[1.15] sm:text-6xl lg:text-[76px] lg:leading-[1.18]"
                  style={caption(active, "right", 1)}
                >
                  {slide.title}
                </Title>
                <p className="mt-8 text-2xl font-semibold sm:text-4xl" style={caption(active, "left", 2)}>
                  {slide.subtitle}
                </p>
                <p className="mt-4 text-lg leading-none sm:text-2xl sm:leading-none" style={caption(active, "bottom", 3)}>
                  {slide.text}
                </p>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.previous}
              className={`${arrowButton} bg-white/20 hover:bg-white/30`}
            >
              <ChevronLeftIcon className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className={`${arrowButton} bg-gold/80 hover:bg-gold`}
            >
              <ChevronRightIcon className="rtl:rotate-180" />
            </button>

            {/* Which slide is showing; click a dot to jump to it */}
            <div className="ms-3 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={counter(index)}
                  aria-current={index === current}
                  className="grid h-6 place-items-center"
                >
                  <span
                    className="block h-1.5 rounded-full"
                    style={{
                      width: index === current ? "2rem" : "0.75rem",
                      backgroundColor: index === current ? "#a8935e" : "rgba(255,255,255,0.4)",
                      transition: reducedMotion ? "none" : "width 500ms ease, background-color 500ms ease",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
