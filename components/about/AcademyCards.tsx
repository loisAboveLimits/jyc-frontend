import Link from "next/link";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

/** "Start Your Journey With The Academy": three cards linking to the Academy. */
export default function AcademyCards({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.about.academy;
  const href = localizedHref(lang, "/academy");

  return (
    <section className="relative isolate overflow-hidden pt-20 lg:pt-28">
      {/* Soft teal glow on the left, as in the design */}
      <div className="absolute -start-40 top-10 -z-10 size-[420px] rounded-full bg-teal/20 blur-[120px]" />

      <div className={container}>
        <h2 className="text-3xl font-bold text-gold sm:text-[40px]">{t.title}</h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-7">
          {t.cards.map((card) => (
            <li
              key={card.title}
              className="group flex flex-col rounded-[22px] border border-teal/70 bg-linear-to-b from-teal/35 to-navy-soft/60 p-6 shadow-xl shadow-black/25 transition-colors hover:bg-teal sm:p-7"
            >
              <h3 className="max-w-60 text-2xl font-semibold leading-tight">{card.title}</h3>
              <p className="mb-8 mt-5 text-lg leading-snug text-white/90">{card.text}</p>
              <Link
                href={href}
                className={`${button.glass} mt-auto w-full bg-white/15 text-[15px] font-bold group-hover:bg-white/25 group-hover:outline group-hover:outline-1 group-hover:outline-white`}
              >
                {dict.common.learnMore}
                <span className="sr-only">: {card.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
