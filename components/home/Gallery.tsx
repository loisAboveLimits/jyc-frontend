import Image from "next/image";
import Link from "next/link";
import { button, container, eyebrow } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-56 lg:min-h-57.5">
      <Image
        src={`/images/home/${src}.jpg`}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

function Tile({
  tone,
  text,
  title,
  note,
  children,
}: {
  tone: "navy" | "teal";
  text: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-h-56 flex-col justify-center p-5 lg:min-h-57.5 ${
        tone === "teal" ? "bg-teal" : "bg-navy-soft"
      }`}
    >
      <p className="leading-snug">{text}</p>
      <h3 className="mt-3 text-2xl font-bold sm:text-[26px]">{title}</h3>
      {note ? <p className="mt-1 text-white/90">{note}</p> : null}
      <div className="mt-5 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/** "Our Gallery": heading and the photo/text mosaic. */
export default function Gallery({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.gallery;
  const small = "min-h-10 px-5 text-[15px]";

  return (
    <section className="bg-navy-deep py-20 lg:py-36">
      <div className={container}>
        <p className={eyebrow}>{t.eyebrow}</p>
        <h2 className="mt-4 text-3xl font-bold leading-snug sm:text-[42px] sm:leading-tight">
          {t.title}
        </h2>

        <div className="mt-12 grid overflow-hidden rounded-[28px] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.52fr]">
          <Photo src="gallery-yacht-club" alt={t.yachtClub.imageAlt} />
          <Tile tone="navy" text={t.yachtClub.text} title={t.yachtClub.title}>
            <Link href={localizedHref(lang, "/yacht-club")} className={`${button.light} ${small} bg-white/40 text-white`}>
              {t.yachtClub.button}
            </Link>
          </Tile>
          <Photo src="gallery-lounge" alt={t.marina.imageAlt} />
          <Tile tone="teal" text={t.marina.text} title={t.marina.title}>
            <Link href={localizedHref(lang, "/marina")} className={`${button.light} ${small}`}>
              {t.marina.button}
            </Link>
            <Link href={localizedHref(lang, "/marina")} className={`${button.outline} ${small}`}>
              {t.marina.button2}
            </Link>
          </Tile>

          <Tile tone="teal" text={t.hotel.text} title={t.hotel.title} note={t.hotel.note}>
            <Link href={localizedHref(lang, "/contact")} className={`${button.light} ${small}`}>
              {t.hotel.button}
            </Link>
          </Tile>
          <Photo src="gallery-hotel" alt={t.hotel.imageAlt} />
          <Tile tone="navy" text={t.academy.text} title={t.academy.title}>
            <Link href={localizedHref(lang, "/academy")} className={`${button.light} ${small} bg-white/40 text-white`}>
              {t.academy.button}
            </Link>
          </Tile>
          <Photo src="gallery-academy" alt={t.academy.imageAlt} />
        </div>
      </div>
    </section>
  );
}
