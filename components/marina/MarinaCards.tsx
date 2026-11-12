import Image from "next/image";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * Restaurants on the Boardwalk. Points to the dining page of the current
 * live site until the new site has its own.
 */
const RESTAURANTS_URL = "https://jycmarina.sa/dine/";

/** The two cards under the hero: berthing (outlined) and dining (teal). */
export default function MarinaCards({ dict, contactHref }: { dict: Dictionary; contactHref: string }) {
  const { berth, dining } = dict.marina.cards;

  return (
    <section className="pb-16 lg:pb-28">
      <div className={`${container} grid gap-8 lg:grid-cols-2 lg:gap-16`}>
        <article className="flex flex-col overflow-hidden rounded-[20px] border border-teal/70 bg-linear-to-b from-navy-soft to-navy shadow-2xl shadow-black/30">
          <div className="relative aspect-[620/330]">
            <Image
              src="/images/marina/berth.jpg"
              alt={berth.imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col items-start p-6 sm:px-6 sm:py-8">
            <h2 className="text-2xl font-bold leading-snug sm:text-[32px]">{berth.title}</h2>
            <p className="mt-5 flex-1 leading-relaxed sm:text-[17px]">{berth.text}</p>
            <a href={contactHref} className={`${button.glass} mt-6 text-sm`}>
              {berth.button}
            </a>
          </div>
        </article>

        <article className="flex flex-col overflow-hidden rounded-[20px] bg-teal shadow-2xl shadow-black/30">
          <div className="relative aspect-[620/330]">
            <Image
              src="/images/marina/dining.jpg"
              alt={dining.imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col items-start p-6 sm:px-9 sm:py-6">
            <h2 className="text-2xl font-bold leading-snug sm:text-[32px]">{dining.title}</h2>
            <p className="mt-3 flex-1 leading-relaxed sm:text-[17px]">{dining.text}</p>
            <a
              href={RESTAURANTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.outline} mt-6 text-sm`}
            >
              {dining.button}
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
