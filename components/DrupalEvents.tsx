import Events, { type EventItem } from "@/components/home/Events";
import type { Dictionary } from "@/lib/dictionaries";
import { type DrupalEvent, getUpcomingEvents } from "@/lib/events";
import { type Locale, localizedHref, stripLocale } from "@/lib/i18n";

/** Event dates and times are shown in Jeddah time. */
const TIME_ZONE = "Asia/Riyadh";

/**
 * "Upcoming Events" with the events from Drupal (content type "Events"):
 * only events that haven't ended yet, sorted by start date (earliest first).
 * The heading and intro text stay from the dictionary. Without upcoming
 * events in Drupal (or when Drupal can't be reached) the built-in events show.
 *
 *   <DrupalEvents lang={lang} dict={dict} />            all upcoming events
 *   <DrupalEvents lang={lang} dict={dict} limit={4} />  only the next 4
 */
export default async function DrupalEvents({
  lang,
  dict,
  limit = 0,
}: {
  lang: Locale;
  dict: Dictionary;
  limit?: number;
}) {
  const events = await getUpcomingEvents(lang, limit);
  if (events.length === 0) return <Events dict={dict} />;

  const items: EventItem[] = events.map((event) => ({
    date: formatEventDate(event, lang),
    title: event.title,
    text: event.text,
    location: event.address,
    href: link(lang, event.bookingLink),
    mapHref: link(lang, event.mapLink),
  }));

  return <Events dict={dict} items={items} />;
}

/**
 * Same day:   "9.01 - 9.30 PM | March 23, 2027"
 * Several days: "10.13 PM | January 21 - 22, 2027"  (start time | date range)
 * Arabic uses Arabic month names with Western digits, like the design.
 */
function formatEventDate(event: DrupalEvent, lang: Locale): string {
  const start = new Date(event.start);
  if (Number.isNaN(start.getTime())) return "";
  const end = Number.isNaN(Date.parse(event.end)) ? start : new Date(event.end);

  const locale = lang === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-US";
  const day = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, day: "numeric", month: "long", year: "numeric" });
  const time = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });
  const sameDay = day.format(start) === day.format(end);

  const clean = (text: string) => text.replace(/[   ]/g, " ").replace(/\s*[–—]\s*/g, " - ");
  const times = clean(sameDay ? time.formatRange(start, end) : time.format(start));
  const dates = clean(sameDay ? day.format(start) : day.formatRange(start, end));

  // English design writes times as "9.00", not "9:00".
  return `${lang === "en" ? times.replace(/(\d):(\d\d)/g, "$1.$2") : times} | ${dates}`;
}

/** field_booking_link / field_map_link: none for "" or "#"; site paths get the language prefix. */
function link(lang: Locale, value: string): string | undefined {
  const href = value.trim();
  if (!href || href === "#") return undefined;
  if (href.startsWith("/") && !href.startsWith("//")) return localizedHref(lang, stripLocale(href));
  return href;
}
