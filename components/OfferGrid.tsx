import Image from "next/image";
import Link from "next/link";
import { CourseIcon, HotelIcon, MarinaIcon, YachtIcon } from "@/components/icons";
import { button } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

type CardKey = keyof Dictionary["experiences"];

/**
 * Which card goes on which photo (in order), where its button goes and its icon.
 * Texts are in dictionaries/*.json under "experiences". Reorder to change the order.
 */
const cards: { key: CardKey; href: string; external?: boolean; Icon: typeof YachtIcon }[] = [
  { key: "yachtClub", href: "/yacht-club", Icon: YachtIcon },
  { key: "hotel", href: "https://www.editionhotels.com/jeddah/", external: true, Icon: HotelIcon },
  { key: "academy", href: "/academy", Icon: CourseIcon },
  { key: "marina", href: "/marina", Icon: MarinaIcon },
];

type Props = {
  lang: Locale;
  dict: Dictionary;
  /** Four photos, one per card. */
  photos: { src: string; alt: string }[];
  className?: string;
};

/*
 * Large screens with a mouse: four photos in a row. The hovered (or keyboard-
 * focused) photo grows wider and taller and fades in its card.
 * Phones, tablets and touch screens: every card is shown open, in a grid.
 */
const easing = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** The "open" look: always below lg; on hover/focus at lg; always on touch screens. */
const reveal = `opacity-100 lg:opacity-0 lg:transition-[opacity,translate] lg:duration-500 ${easing} lg:group-hover:opacity-100 lg:group-hover:delay-150 lg:group-focus-within:opacity-100 lg:[@media(hover:none)]:opacity-100`;

/** Experience photos for home "What We Offer" and About "How will you experience…?". */
export default function OfferGrid({ lang, dict, photos, className = "" }: Props) {
  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 lg:flex lg:h-[427px] lg:items-end lg:gap-3 ${className}`}
    >
      {cards.map(({ key, href, external, Icon }, index) => {
        const card = dict.experiences[key];
        const photo = photos[index];

        return (
          <li
            key={key}
            className={`group relative isolate h-[400px] overflow-hidden rounded-3xl shadow-xl shadow-black/30 sm:h-[427px] lg:h-[325px] lg:min-w-0 lg:basis-0 lg:grow lg:transition-[flex-grow,height] lg:duration-700 ${easing} lg:hover:h-full lg:hover:grow-[1.45] lg:focus-within:h-full lg:focus-within:grow-[1.45] lg:[@media(hover:none)]:h-full motion-reduce:transition-none`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className={`-z-20 object-cover transition-transform duration-700 ${easing} lg:group-hover:scale-105 motion-reduce:transition-none`}
            />

            {/* Teal-to-navy tint behind the card text */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 -z-10 bg-linear-to-b from-teal/90 via-navy/60 to-navy/85 ${reveal}`}
            />

            <div
              className={`flex h-full flex-col items-center justify-center px-6 py-10 text-center lg:translate-y-4 lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0 lg:[@media(hover:none)]:translate-y-0 motion-reduce:translate-y-0 ${reveal}`}
            >
              <Icon className="h-[58px] w-auto" />
              <h3 className="mt-3 text-2xl font-bold text-gold">{card.title}</h3>
              <p className="mt-4 max-w-72 text-lg leading-snug">{card.text}</p>
              <Link
                href={external ? href : localizedHref(lang, href)}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${button.glass} mt-10 whitespace-nowrap lg:mt-12`}
              >
                {card.button}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
