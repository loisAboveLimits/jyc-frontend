import Image from "next/image";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/** "A Beacon For Maritime Education": text next to a photo, over a faded copy of it. */
export default function Beacon({ dict }: { dict: Dictionary }) {
  const t = dict.academy.beacon;

  return (
    <section className="relative isolate overflow-hidden pb-16 pt-6 lg:pb-28 lg:pt-10">
      {/* The same photo, blurred and faded, behind the whole section */}
      <Image
        src="/images/academy/beacon.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 scale-110 object-cover opacity-20 blur-[2px]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy via-navy/60 to-navy" />

      <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <h2 className="text-3xl font-bold leading-tight text-gold sm:text-[40px] sm:leading-[1.4]">{t.title}</h2>
          <p className="mt-5 text-lg leading-relaxed sm:text-[21px] sm:leading-[1.6]">{t.text}</p>
        </div>
        <div className="relative aspect-[648/437] overflow-hidden rounded-xl shadow-2xl shadow-black/30">
          <Image
            src="/images/academy/beacon.jpg"
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
