import Image from "next/image";
import Link from "next/link";
import { YachtIcon } from "@/components/icons";
import { button, container, eyebrow } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

const photos = ["offer-dining", "offer-berths", "offer-boardwalk", "offer-lifestyle"];

/** "What We Offer": intro text, the Yacht Club card and four photos. */
export default function Offer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.offer;

  return (
    <section className="bg-navy-deep pb-20 lg:pb-36">
      <div className={container}>
        <p className={eyebrow}>{t.eyebrow}</p>
        <h2 className="mt-4 text-3xl font-bold sm:text-[42px] sm:leading-tight">{t.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-[22px] sm:leading-[1.7]">
          {t.text}
        </p>

        <div className="mt-14 grid grid-cols-2 items-end gap-3 lg:grid-cols-[1.33fr_1fr_1fr_1fr_1fr]">
          {/* Yacht Club card */}
          <div className="relative isolate col-span-2 flex min-h-[427px] flex-col items-center justify-center overflow-hidden rounded-3xl px-5 py-10 text-center shadow-xl shadow-black/30 lg:col-span-1">
            <Image
              src="/images/home/offer-yacht-club.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-teal/90 via-navy/60 to-navy/80" />
            <YachtIcon className="h-[58px] w-auto" />
            <h3 className="mt-3 text-2xl font-bold text-gold">{t.cardTitle}</h3>
            <p className="mt-4 max-w-72 text-lg leading-snug">{t.cardText}</p>
            <Link href={localizedHref(lang, "/yacht-club")} className={`${button.glass} mt-12`}>
              {t.cardButton}
            </Link>
          </div>

          {photos.map((photo, index) => (
            <div
              key={photo}
              className="relative h-56 overflow-hidden rounded-3xl sm:h-[325px]"
            >
              <Image
                src={`/images/home/${photo}.jpg`}
                alt={t.imageAlts[index]}
                fill
                sizes="(min-width: 1024px) 18vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
