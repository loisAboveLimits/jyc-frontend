import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DineIcon,
  ShopIcon,
  StayIcon,
} from "@/components/icons";
import { arrowButton, button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

const featureIcons = [DineIcon, ShopIcon, StayIcon];

/** Top of the home page: background video, headline and the Dine / Shop / Stay cards. */
export default function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.hero;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      {/* Background: still image, with the video on top when motion is allowed.
          Mirrored in Arabic so the boat stays on the side opposite the text. */}
      <div className="absolute inset-0 -z-10 rtl:-scale-x-100">
        <Image
          src="/images/home/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <video
          className="absolute inset-0 size-full object-cover object-[70%_center] motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/home/hero.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Darken the top (behind the menu), the text side, and the bottom edge */}
        <div className="absolute inset-0 bg-linear-to-b from-navy via-navy/10 to-navy/90" />
        <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/70 to-transparent md:via-navy/50" />
      </div>

      <div className={`${container} pb-12 pt-44 sm:pt-52 lg:pb-16 lg:pt-64`}>
        <div className="max-w-2xl">
          <p className="text-xl sm:text-2xl">{t.eyebrow}</p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.15] sm:text-6xl lg:text-[76px] lg:leading-[1.18]">
            {t.title}
          </h1>
          <p className="mt-8 text-2xl font-semibold sm:text-4xl">{t.subtitle}</p>
          <p className="mt-4 text-lg leading-relaxed sm:text-2xl sm:leading-[1.9]">{t.text}</p>

          {/* Slider arrows (one slide for now; they become active when more slides are added) */}
          <div className="mt-12 flex gap-3">
            <button type="button" aria-label={dict.common.previous} className={`${arrowButton} bg-white/20 hover:bg-white/30`}>
              <ChevronLeftIcon className="rtl:rotate-180" />
            </button>
            <button type="button" aria-label={dict.common.next} className={`${arrowButton} bg-gold/80 hover:bg-gold`}>
              <ChevronRightIcon className="rtl:rotate-180" />
            </button>
          </div>
        </div>

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
