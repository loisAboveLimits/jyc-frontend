"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

export type LightboxPhoto = {
  src: string;
  alt: string;
  /** Pixel size of the image file (used to size it in the lightbox). */
  width: number;
  height: number;
};

export type LightboxLabels = {
  close: string;
  previous: string;
  next: string;
  /** e.g. "{current} of {total}" */
  counter: string;
};

/**
 * Full-screen photo viewer, used by the galleries.
 * It is a native <dialog>: Escape closes it and focus stays inside while it
 * is open. Arrow keys and swiping move between photos (reversed in Arabic).
 * The parent decides which photo is open (`index`, null = closed) and is
 * told about changes through `onChange`.
 */
export default function Lightbox({
  photos,
  index,
  onChange,
  labels,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onChange: (index: number | null) => void;
  labels: LightboxLabels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const total = photos.length;
  const go = (step: number) => {
    if (index !== null) onChange((index + step + total) % total);
  };

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
  });

  // Tidy up after the lightbox closes: the page scrolls again.
  // Safe to run twice (close button + the dialog's "close" event).
  const onClosed = () => {
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
    }
    onChange(null);
  };

  // Our own close controls tidy up straight away instead of waiting for the
  // dialog's "close" event (that event still handles the Escape key).
  const close = () => {
    dialog.current?.close();
    onClosed();
  };

  const tile = index === null ? null : photos[index];

  return (
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
  );
}
