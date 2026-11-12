import { ACADEMY_BOOKING_URL } from "@/components/academy/links";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/** "A Sanctuary For Every Watersports Enthusiast": three cards, the last one in teal. */
export default function Sanctuary({ dict }: { dict: Dictionary }) {
  const t = dict.academy.sanctuary;

  return (
    <section className="py-16 lg:py-24">
      <div className={container}>
        <h2 className="text-3xl font-bold leading-tight text-gold sm:text-[40px]">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">{t.text}</p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {t.items.map((item, index) => {
            const highlight = index === t.items.length - 1;
            return (
              <li
                key={item.title}
                className={`flex flex-col rounded-[20px] p-4 pt-10 sm:last:col-span-2 lg:last:col-span-1 shadow-xl shadow-black/25 sm:px-4 ${
                  highlight
                    ? "bg-teal"
                    : "border border-teal/60 bg-linear-to-b from-[#1b4f63] to-[#123a50]"
                }`}
              >
                <h3 className="max-w-[18ch] px-3 text-xl font-semibold leading-snug sm:text-2xl">{item.title}</h3>
                <p className="mt-4 flex-1 px-3 text-lg leading-relaxed text-white/90 xl:text-xl">{item.text}</p>
                <a
                  href={ACADEMY_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.button}: ${item.title}`}
                  className={`${highlight ? button.outline : button.glass} mt-10 w-full`}
                >
                  {t.button}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
