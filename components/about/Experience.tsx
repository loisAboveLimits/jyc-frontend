import OfferGrid from "@/components/OfferGrid";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

const photos = [
  "experience-dining",
  "experience-berths",
  "experience-boardwalk",
  "experience-lifestyle",
];

/** "How will you experience Jeddah Yacht Club & Marina?": text, Yacht Club card and photos. */
export default function Experience({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.about.experience;

  return (
    <section className="pt-20 lg:pt-36">
      <div className={container}>
        <h2 className="text-3xl font-bold leading-tight text-gold sm:text-[40px]">{t.title}</h2>
        <p className="mt-5 max-w-6xl leading-relaxed sm:text-[17px]">{t.text}</p>

        <OfferGrid
          className="mt-12"
          card={{
            image: "/images/about/experience-yacht-club.jpg",
            title: t.cardTitle,
            text: t.cardText,
            button: t.cardButton,
            href: localizedHref(lang, "/yacht-club"),
          }}
          photos={photos.map((photo, index) => ({
            src: `/images/about/${photo}.jpg`,
            alt: t.imageAlts[index],
          }))}
        />
      </div>
    </section>
  );
}
