/**
 * Opening hours shown in the "Opening Hours" popup (top of every page).
 * From the current site's Contact page: 9:00 AM – 2:30 AM, and until
 * 3:00 AM at the weekend (Friday and Saturday nights).
 *
 * The list starts on Sunday (index 0 = Sunday … 6 = Saturday).
 * Times are 24-hour "HH:MM" in Jeddah time. A closing time after midnight
 * is written past 24:00 ("26:30" = 2:30 AM the next morning).
 * Use null for a day the club is closed.
 */
export type DayHours = { open: string; close: string } | null;

export const openingHours: DayHours[] = [
  { open: "09:00", close: "26:30" }, // Sunday
  { open: "09:00", close: "26:30" }, // Monday
  { open: "09:00", close: "26:30" }, // Tuesday
  { open: "09:00", close: "26:30" }, // Wednesday
  { open: "09:00", close: "26:30" }, // Thursday
  { open: "09:00", close: "27:00" }, // Friday
  { open: "09:00", close: "27:00" }, // Saturday
];

/** The club's location (same as in the footer). */
export const CLUB_LOCATION = { lat: 21.648156, lng: 39.099211 };

export const CLUB_TIME_ZONE = "Asia/Riyadh";

/** Name Google Maps knows the club by (used to pin it on the map). */
export const CLUB_MAP_NAME = "Jeddah Yacht Club & Marina, Jeddah";

/** Map shown in the popup (Google Maps embed, no API key needed). */
export const mapEmbedUrl = (lang: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(CLUB_MAP_NAME)}&ll=${CLUB_LOCATION.lat},${CLUB_LOCATION.lng}&z=15&hl=${lang}&output=embed`;

/** Opens directions to the club in Google Maps. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CLUB_LOCATION.lat},${CLUB_LOCATION.lng}`;

const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** Day of the week (0 = Sunday) and minutes since midnight, in Jeddah. */
export function jeddahNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CLUB_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** Whether the club is open at the given moment (including after midnight). */
export function isOpenNow(date = new Date()): boolean {
  const { day, minutes: now } = jeddahNow(date);
  const today = openingHours[day];
  if (today && now >= minutes(today.open) && now < minutes(today.close)) return true;
  // Still open from the night before?
  const yesterday = openingHours[(day + 6) % 7];
  return !!yesterday && now < minutes(yesterday.close) - 24 * 60;
}

/** "8:00 AM" / "٨:٠٠ ص" style time for a "HH:MM" value. */
export function formatTime(time: string, lang: string): string {
  const total = minutes(time) % (24 * 60);
  const date = new Date(Date.UTC(2026, 0, 1, Math.floor(total / 60), total % 60));
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
