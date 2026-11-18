import Image from "next/image";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/** "The Red Sea's most prestigious port": key facts over a full-width speedboat photo. */
export default function PortStrip({ dict }: { dict: Dictionary }) {
  const t = dict.marina.port;

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/marina/port.jpg"
        alt={t.imageAlt}
        fill
        sizes="100vw"
        // Mirrored in Arabic so the boat stays on the side away from the text.
        className="-z-10 object-cover object-[70%_center] rtl:-scale-x-100"
      />
      {/* Darker behind the text so it stays readable */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy/90 via-navy/65 to-navy/30 rtl:bg-linear-to-l lg:via-navy/35 lg:to-transparent" />

      <div className={`${container} py-10 sm:py-12`}>
        <h2 className="text-3xl font-bold leading-tight sm:text-[42px]">{t.title}</h2>
        <ul className="mt-5 max-w-xl list-disc space-y-1 ps-6 marker:text-white/70 sm:text-[17px]">
          {t.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
