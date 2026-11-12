import Image from "next/image";
import Link from "next/link";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/**
 * Top of the Yacht Club page: marina photo with breadcrumb, title and intro,
 * and a frosted card with the "Apply Now" link (jumps to the contact form).
 */
export default function YachtHero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.yachtClub.hero;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] sm:h-[720px] lg:h-[860px]">
        <Image
          src="/images/yacht-club/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        {/* Darker under the menu and text, fully navy where the photo ends */}
        <div className="absolute inset-x-0 -bottom-px top-0 bg-linear-to-b from-navy/80 via-navy/25 to-navy to-[97%]" />
        <div className="absolute inset-0 bg-linear-to-r from-navy/60 via-navy/10 to-transparent rtl:bg-linear-to-l" />
      </div>

      <div className={`${container} pb-16 pt-44 sm:pt-56 lg:pb-24 lg:pt-[340px]`}>
        <nav aria-label={t.breadcrumbLabel} className="text-lg text-teal sm:text-xl">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={localizedHref(lang, "/")} className="underline underline-offset-4 hover:text-white">
                {t.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.title}</li>
          </ol>
        </nav>
        <h1 className="mt-4 text-5xl font-bold sm:text-6xl lg:text-[64px]">{t.title}</h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed sm:text-[23px] sm:leading-[1.9]">{t.text}</p>

        <div className="mt-24 rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-7 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:mt-36 sm:px-10 lg:mt-[200px]">
          <p className="mx-auto max-w-6xl text-lg leading-relaxed text-white/80 sm:text-[23px] sm:leading-[1.5]">
            {t.intro}
          </p>
          <a
            href="#yacht-club-contact"
            className="mt-4 inline-block text-xl font-semibold text-teal transition-colors hover:text-gold"
          >
            {t.apply}
          </a>
        </div>
      </div>
    </section>
  );
}
