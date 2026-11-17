import Link from "next/link";
import HeroSlider, { type HeroSlide } from "@/components/home/HeroSlider";
import { DineIcon, ShopIcon, StayIcon } from "@/components/icons";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

const featureIcons = [DineIcon, ShopIcon, StayIcon];

/**
 * Background of each banner slide, in the same order as home.hero.slides in
 * the dictionaries (max 3). Mix photos and videos as you like.
 */
const slideMedia: HeroSlide["media"][] = [
  { type: "video", src: "/videos/hero.mp4", poster: "/images/home/hero.jpg" },
  { type: "image", src: "/images/home/hero-clubhouse.jpg", position: "20% center" },
  { type: "image", src: "/images/home/hero-sunset.jpg" },
];

/** Top of the home page: banner slider (video + photos) and the Dine / Shop / Stay cards. */
export default function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.hero;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className={`${container} pb-12 pt-44 sm:pt-52 lg:pb-16 lg:pt-64`}>
        <HeroSlider
          slides={t.slides.map((slide, index) => ({ ...slide, media: slideMedia[index] }))}
          labels={{
            label: t.label,
            slide: t.slide,
            previous: dict.common.previous,
            next: dict.common.next,
          }}
        />

        {/* Dine / Shop / Stay */}
        <ul className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-24 lg:gap-7">
          {dict.home.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <li
                key={feature.title}
                className="group flex flex-col items-center rounded-[13px] border border-transparent bg-white/[0.09] px-6 pb-5 pt-6 text-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:border-teal"
              >
                <Icon className="h-10 w-auto" />
                <h2 className="mt-1 text-2xl font-bold leading-10 text-teal">{feature.title}</h2>
                <p className="max-w-[359px] text-sm leading-[22px]">{feature.text}</p>
                <Link
                  href={localizedHref(lang, "/yacht-club")}
                  className={`${button.glass} mt-4 min-h-10 min-w-[184px] bg-white/[0.14] text-[15px] font-bold group-hover:bg-gold/70`}
                >
                  {dict.common.viewDetails}
                  <span className="sr-only">: {feature.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
