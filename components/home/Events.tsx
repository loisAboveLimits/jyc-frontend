import Image from "next/image";
import { CalendarIcon, PinIcon } from "@/components/icons";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/** One event card. `href` (booking) and `mapHref` (location) are optional links. */
export type EventItem = {
  date: string;
  title: string;
  text: string;
  location: string;
  href?: string;
  mapHref?: string;
};

/**
 * "Upcoming Events": intro text and a grid of event cards over a photo.
 * `items` replaces the built-in events (e.g. events from a CMS).
 */
export default function Events({ dict, items }: { dict: Dictionary; items?: EventItem[] }) {
  const t = dict.home.events;
  const events: EventItem[] = items ?? t.items;

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/home/events-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy/45" />

      <div className={`${container} grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-24 lg:py-24`}>
        <div>
          <p className="text-xl font-semibold text-navy">{t.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-[44px] sm:leading-[1.05]">
            {t.title}
          </h2>
          <p className="mt-12 text-lg leading-relaxed sm:leading-[1.7]">{t.text}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event, index) => (
            <li
              key={index}
              className="flex flex-col overflow-hidden rounded-3xl bg-navy/85 shadow-xl shadow-black/20 backdrop-blur-sm"
            >
              <p className="flex items-center gap-4 bg-teal px-5 py-2.5">
                <CalendarIcon className="h-[26px] w-auto shrink-0" />
                <span>{event.date}</span>
              </p>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                <h3 className="text-[22px] font-bold leading-tight">
                  {event.href ? (
                    <a href={event.href} {...newTab(event.href)} className="hover:underline">
                      {event.title}
                    </a>
                  ) : (
                    event.title
                  )}
                </h3>
                <p className="mt-2 text-[15px] leading-snug text-white/90">{event.text}</p>
                <p className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-bold">
                  <PinIcon className="h-[15px] w-auto shrink-0" />
                  {event.mapHref ? (
                    <a href={event.mapHref} {...newTab(event.mapHref)} className="hover:underline">
                      {event.location}
                    </a>
                  ) : (
                    event.location
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Links to other websites open in a new tab. */
function newTab(href: string) {
  return /^https?:\/\//i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
