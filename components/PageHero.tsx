import Image from "next/image";
import Link from "next/link";
import { container } from "@/components/ui";
import { localizedHref, type Locale } from "@/lib/i18n";

export type PageHeroProps = {
  lang: Locale;
  /** Breadcrumb texts: the "Home" link and the label read by screen readers. */
  breadcrumb: { home: string; label: string };
  /** Shown in the breadcrumb; defaults to the title. */
  crumb?: string;
  title: string;
  text: string;
  /** Let the text run the full page width (otherwise it wraps at ~760px). */
  wideText?: boolean;
  /** Background photo (in /public). */
  image: string;
  /** Frosted card at the bottom with a short intro and (optionally) a link. */
  intro?: { text: string; link?: string; href?: string };
};

/**
 * Top of an inner page (Yacht Club, Marina…): photo background with
 * breadcrumb, title and text, and an optional frosted intro card.
 */
export default function PageHero({
  lang,
  breadcrumb,
  crumb,
  title,
  text,
  wideText = false,
  image,
  intro,
}: PageHeroProps) {

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] sm:h-[720px] lg:h-[860px]">
        <Image
          src={image}
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
        <nav aria-label={breadcrumb.label} className="text-lg text-teal sm:text-xl">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={localizedHref(lang, "/")} className="underline underline-offset-4 hover:text-white">
                {breadcrumb.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{crumb ?? title}</li>
          </ol>
        </nav>
        <h1 className="mt-4 text-5xl font-bold sm:text-6xl lg:text-[64px]">{title}</h1>
        <p className={`mt-8 text-xl ${wideText ? "max-w-6xl" : "max-w-3xl"} leading-relaxed sm:text-[23px] sm:leading-[1.9]`}>{text}</p>

        {intro && (
          <div className="mt-24 rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-7 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:mt-36 sm:px-10 lg:mt-[200px]">
            <p className="mx-auto max-w-6xl text-lg leading-relaxed text-white/80 sm:text-[23px] sm:leading-[1.5]">
              {intro.text}
            </p>
            {intro.link && intro.href && (
              <a
                href={intro.href}
                className="mt-4 inline-block text-xl font-semibold text-teal transition-colors hover:text-gold"
              >
                {intro.link}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
