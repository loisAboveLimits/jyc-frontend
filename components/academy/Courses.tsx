import Image from "next/image";
import { ACADEMY_BOOKING_URL } from "@/components/academy/links";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

// Photos in the same order as academy.courses.items in the dictionaries.
const photos = ["youth", "adult", "powerboats", "shore-based", "lifeguard", "corporate"];

/** "Find a course": six course cards; the second one is highlighted in teal. */
export default function Courses({ dict }: { dict: Dictionary }) {
  const t = dict.academy.courses;

  return (
    <section className="pb-16 pt-4 lg:pb-28">
      <div className={container}>
        <h2 className="text-3xl font-bold text-teal sm:text-[36px] lg:ps-5">{t.title}</h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
          {t.items.map((course, index) => {
            const highlight = index === 1;
            return (
              <li
                key={course.title}
                className={`group @container flex flex-col rounded-[14px] px-5 pt-5 shadow-xl shadow-black/25 ${
                  highlight ? "bg-teal" : "bg-linear-to-b from-[#173a54] to-[#122f47]"
                }`}
              >
                {/* Title and button side by side on wide cards, stacked on narrow ones */}
                <div className="flex flex-col items-start gap-3 ps-1 @[21rem]:flex-row @[21rem]:items-center @[21rem]:justify-between">
                  <h3 className="text-xl font-semibold sm:text-[21px]">{course.title}</h3>
                  <a
                    href={ACADEMY_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.button}: ${course.title}`}
                    className={`${highlight ? button.outline : button.glass} min-h-10 shrink-0 px-6 text-[15px]`}
                  >
                    {t.button}
                  </a>
                </div>
                <p className="mt-4 flex-1 ps-1 text-sm leading-relaxed text-white/90">{course.text}</p>
                <div className="relative mt-6 aspect-[371/248] overflow-hidden rounded-t-xl">
                  <Image
                    src={`/images/academy/course-${photos[index]}.jpg`}
                    alt={course.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
