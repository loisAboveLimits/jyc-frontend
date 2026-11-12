"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Lightbox, { type LightboxLabels, type LightboxPhoto } from "@/components/Lightbox";

export type GalleryTile = LightboxPhoto & {
  /** Where the tile sits in the collage grid. */
  className: string;
};

/**
 * Photo collage whose photos open in a full-screen lightbox (see Lightbox.tsx).
 * Focus returns to the photo that was opened when the lightbox closes.
 */
export default function LightboxGallery({
  tiles,
  labels,
  gridClassName,
}: {
  tiles: GalleryTile[];
  labels: LightboxLabels & { open: string };
  gridClassName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpened = useRef(0);

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

      <Lightbox
        photos={tiles}
        index={index}
        onChange={(next) => {
          setIndex(next);
          if (next === null) triggers.current[lastOpened.current]?.focus();
        }}
        labels={labels}
      />
    </>
  );
}
