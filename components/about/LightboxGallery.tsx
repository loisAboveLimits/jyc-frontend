"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

export type GalleryTile = {
  src: string;
  alt: string;
  /** Pixel size of the image file (used to size it in the lightbox). */
  width: number;
  height: number;
  /** Where the tile sits in the collage grid. */
  className: string;
};

type Labels = {
  open: string;
  close: string;
  previous: string;
  next: string;
  /** e.g. "{current} of {total}" */
  counter: string;
};

/**
 * Photo collage whose photos open in a full-screen lightbox.
 * The lightbox is a native <dialog>: Escape closes it, focus stays inside
 * while it is open and returns to the photo afterwards. Arrow keys and
 * swiping move between photos (reversed in Arabic).
 */
export default function LightboxGallery({
  tiles,
  labels,
  gridClassName,
}: {
  tiles: GalleryTile[];
  labels: Labels;
  gridClassName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpened = useRef(0);
  const touchStart = useRef<number | null>(null);

  const total = tiles.length;
  const go = (step: number) =>
    setIndex((current) => (current === null ? current : (current + step + total) % total));

  // Open / close the dialog, and stop the page behind it from scrolling.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (index === null && el.open) {
      el.close();
    }
  }, [index]);

  // Arrow keys: in right-to-left pages the left arrow means "next".
  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      const rtl = document.documentElement.dir === "rtl";
      if (event.key === "ArrowRight") go(rtl ? -1 : 1);
      if (event.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null]);

  // Tidy up after the lightbox closes: page scrolls again, focus goes back to
  // the photo that opened it. Safe to run twice (button + "close" event).
  const onClosed = () => {
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
      triggers.current[lastOpened.current]?.focus();
    }
    setIndex(null);
  };

  // Our own close controls tidy up straight away instead of waiting for the
  // dialog's "close" event (that event still handles the Escape key).
  const close = () => {
    dialog.current?.close();
    onClosed();
  };

  const tile = index === null ? null : tiles[index];

  return (
    <>
      <div className={gridClassName}>
        {tiles.map((item, i) => (
          <button
            key={item.src}
            type="button"
            ref={(el) => {
              triggers.current[i] = el;
            }}
            onClick={() => {
              lastOpened.current = i;
              setIndex(i);
            }}
            aria-label={`${labels.open}: ${item.alt}`}
            className={`group relative cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold ${item.className}`}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={onClosed}
        // A click on the dark area around the photo closes the lightbox.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const dx = event.changedTouches[0].clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(dx) < 50) return;
          const rtl = document.documentElement.dir === "rtl";
          go((dx < 0) !== rtl ? 1 : -1);
        }}
        aria-label={tile?.alt}
        // Lenis (smooth scrolling) leaves the lightbox alone.
        data-lenis-prevent
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col items-center justify-center gap-4 bg-navy-deep/95 p-4 text-white opacity-0 backdrop-blur-sm transition-[opacity,display,overlay] duration-300 transition-discrete backdrop:bg-transparent open:flex open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none sm:p-10"
      >
        <button
          type="button"
          onClick={close}
          aria-label={labels.close}
          className="absolute end-4 top-4 grid size-12 place-items-center rounded-full bg-white/15 transition-colors hover:bg-gold sm:end-8 sm:top-8"
        >
          <CloseIcon />
        </button>

        {tile ? (
          <figure className="flex flex-col items-center gap-4">
            <Image
              key={tile.src}
              src={tile.src}
              alt={tile.alt}
              width={tile.width}
              height={tile.height}
              // Always the original file: these photos are small, so a resized
              // copy would only make them softer.
              unoptimized
              loading="eager"
              // Up to twice the file's size, but never larger than the screen.
              style={{
                width: `min(90vw, ${tile.width * 2}px, calc(75dvh * ${tile.width / tile.height}))`,
              }}
              className="h-auto rounded-2xl shadow-2xl shadow-black/50 motion-safe:animate-[lightbox-in_.35s_ease-out]"
            />
            <figcaption className="max-w-[90vw] text-center text-white/85">
              {tile.alt}
              <span className="ms-3 text-sm text-white/60" dir="ltr">
                {labels.counter
                  .replace("{current}", String((index ?? 0) + 1))
                  .replace("{total}", String(total))}
              </span>
            </figcaption>
          </figure>
        ) : null}

        <div className="flex gap-3 sm:contents">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="grid size-12 place-items-center rounded-full bg-white/15 transition-colors hover:bg-gold sm:absolute sm:start-8 sm:top-1/2 sm:-translate-y-1/2"
          >
            <ChevronLeftIcon className="rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="grid size-12 place-items-center rounded-full bg-gold/80 transition-colors hover:bg-gold sm:absolute sm:end-8 sm:top-1/2 sm:-translate-y-1/2"
          >
            <ChevronRightIcon className="rtl:rotate-180" />
          </button>
        </div>
      </dialog>
    </>
  );
}
