import Image from "next/image";
import Link from "next/link";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/** Full-width yacht banner: heritage text, a button and four counters. */
export default function Heritage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.about.heritage;

  return (
    <section className="relative isolate overflow-hidden py-16 lg:py-24">
      <Image
        src="/images/about/banner-yacht.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy/55" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy/60 to-transparent rtl:bg-linear-to-l" />

      <div className={`${container} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
        <div className="lg:ps-4">
          <h2 className="text-3xl font-bold leading-tight sm:text-[34px]">{t.title}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/90 sm:text-[17px]">{t.text}</p>
          <Link
            href={localizedHref(lang, "/contact")}
            className={`${button.gold} mt-10 min-w-[220px] sm:min-w-[345px]`}
          >
            {t.button}
          </Link>
        </div>

        <dl className="grid grid-cols-2">
          {t.counters.map((counter, index) => (
            <div
              key={counter.label}
              className={`flex flex-col py-5 ${
                index % 2 === 0 ? "border-e border-white/80 pe-5 sm:pe-8" : "ps-5 sm:ps-8"
              } ${index < 2 ? "border-b border-white/80" : ""}`}
            >
              <dt className="order-2 mt-1 text-base sm:text-[17px]">{counter.label}</dt>
              <dd className="order-1 text-5xl font-semibold leading-tight">{counter.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
