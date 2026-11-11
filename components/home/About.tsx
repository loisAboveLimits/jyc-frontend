import Image from "next/image";
import Link from "next/link";
import { DownloadIcon, LinkIcon } from "@/components/icons";
import { button, container, eyebrow } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/** "A Home For The Adventurous" intro with the two call-to-action buttons. */
export default function About({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.home.about;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      {/* Faded photo behind the section */}
      <Image
        src="/images/home/about.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-15"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy via-transparent to-navy-deep" />

      <div className={`${container} grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-14 lg:py-36`}>
        <div>
          <p className={eyebrow}>{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold leading-snug sm:text-[40px] sm:leading-[1.4]">
            {t.title}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed sm:text-[22px] sm:leading-[1.7]">
            {t.text}
          </p>
          <div className="mt-12 flex flex-wrap gap-4 sm:gap-9">
            <Link href={localizedHref(lang, "/yacht-club")} className={button.gold}>
              {t.member}
              <LinkIcon className="size-4" />
            </Link>
            {/* TODO: point this at the real brochure file when it is available. */}
            <Link href={localizedHref(lang, "/contact")} className={`${button.glass} font-normal`}>
              {t.brochure}
              <DownloadIcon className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[648/437] overflow-hidden rounded-3xl shadow-2xl shadow-black/30">
          <Image
            src="/images/home/about.jpg"
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
