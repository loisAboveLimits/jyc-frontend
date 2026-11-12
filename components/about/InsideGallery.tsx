import LightboxGallery from "@/components/about/LightboxGallery";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * The six photos of the collage, in the same order as about.inside.imageAlts.
 * `width`/`height` are the image files' pixel sizes.
 * `className` places each one in the grid:
 * - phones/tablets: two columns, the tall photos span two rows;
 * - large screens: the four-column collage from the design.
 */
const tiles = [
  { src: "/images/about/inside-harbour.jpg", width: 305, height: 519, className: "row-span-2 lg:col-start-1 lg:row-start-1" },
  { src: "/images/about/inside-cove.jpg", width: 188, height: 230, className: "lg:col-start-2 lg:row-start-1" },
  { src: "/images/about/inside-cruiser.jpg", width: 188, height: 290, className: "lg:col-start-2 lg:row-start-2" },
  { src: "/images/about/inside-sailing-yacht.jpg", width: 386, height: 211, className: "col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1" },
  { src: "/images/about/inside-superyacht-night.jpg", width: 386, height: 309, className: "row-span-2 lg:row-span-1 lg:col-start-3 lg:row-start-2" },
  { src: "/images/about/inside-aerial.jpg", width: 221, height: 519, className: "row-span-2 lg:col-start-4 lg:row-start-1" },
];

/** "Take a look inside": heading and the photo collage (photos open in a lightbox). */
export default function InsideGallery({ dict }: { dict: Dictionary }) {
  const t = dict.about.inside;

  return (
    <section className="py-20 lg:py-28">
      <div className={container}>
        <h2 className="text-3xl font-bold text-gold sm:text-[40px]">{t.title}</h2>

        <LightboxGallery
          tiles={tiles.map((tile, index) => ({ ...tile, alt: t.imageAlts[index] }))}
          labels={{
            open: dict.common.openImage,
            close: dict.common.close,
            previous: dict.common.previous,
            next: dict.common.next,
            counter: dict.common.imageCounter,
          }}
          gridClassName="mt-10 grid auto-rows-[150px] grid-cols-2 gap-1 overflow-hidden rounded-[20px] shadow-2xl shadow-black/30 sm:auto-rows-[210px] lg:aspect-[1315/626] lg:auto-rows-auto lg:grid-cols-[365fr_218fr_451fr_268fr] lg:grid-rows-2"
        />
      </div>
    </section>
  );
}
