import OfferGrid from "@/components/OfferGrid";
import { container, eyebrow } from "@/components/ui";
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

        <OfferGrid
          className="mt-14"
          card={{
            image: "/images/home/offer-yacht-club.jpg",
            title: t.cardTitle,
            text: t.cardText,
            button: t.cardButton,
            href: localizedHref(lang, "/yacht-club"),
          }}
          photos={photos.map((photo, index) => ({
            src: `/images/home/${photo}.jpg`,
            alt: t.imageAlts[index],
          }))}
        />
      </div>
    </section>
  );
}
