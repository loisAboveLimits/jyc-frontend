import Image from "next/image";
import Link from "next/link";
import { YachtIcon } from "@/components/icons";
import { button } from "@/components/ui";

type Props = {
  card: { image: string; title: string; text: string; button: string; href: string };
  photos: { src: string; alt: string }[];
  className?: string;
};

/**
 * The Yacht Club card followed by four photos (home "What We Offer" and the
 * About page "How will you experience…"). Two columns on phones and tablets,
 * one row on large screens.
 */
export default function OfferGrid({ card, photos, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-2 items-end gap-3 lg:grid-cols-[1.33fr_1fr_1fr_1fr_1fr] ${className}`}
    >
      <div className="relative isolate col-span-2 flex min-h-[427px] flex-col items-center justify-center overflow-hidden rounded-3xl px-5 py-10 text-center shadow-xl shadow-black/30 lg:col-span-1">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-teal/90 via-navy/60 to-navy/80" />
        <YachtIcon className="h-[58px] w-auto" />
        <h3 className="mt-3 text-2xl font-bold text-gold">{card.title}</h3>
        <p className="mt-4 max-w-72 text-lg leading-snug">{card.text}</p>
        <Link href={card.href} className={`${button.glass} mt-12`}>
          {card.button}
        </Link>
      </div>

      {photos.map((photo) => (
        <div key={photo.src} className="relative h-56 overflow-hidden rounded-3xl sm:h-[325px]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 18vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
