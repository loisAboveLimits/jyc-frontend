/**
 * Opening hours shown in the "Opening Hours" popup (top of every page).
 * SAMPLE HOURS: replace them with the club's real times (later from Drupal).
 *
 * `week` starts on Sunday (index 0 = Sunday … 6 = Saturday).
 * Times are 24-hour "HH:MM" in Jeddah time; "24:00" means midnight at the
 * end of that day. Use null for a day the club is closed.
 */
export type DayHours = { open: string; close: string } | null;

export const openingHours: DayHours[] = [
  { open: "08:00", close: "23:00" }, // Sunday
  { open: "08:00", close: "23:00" }, // Monday
  { open: "08:00", close: "23:00" }, // Tuesday
  { open: "08:00", close: "23:00" }, // Wednesday
  { open: "08:00", close: "24:00" }, // Thursday
  { open: "08:00", close: "24:00" }, // Friday
  { open: "08:00", close: "24:00" }, // Saturday
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

/** Whether the club is open at the given moment. */
export function isOpenNow(date = new Date()): boolean {
  const { day, minutes: now } = jeddahNow(date);
  const today = openingHours[day];
  return !!today && now >= minutes(today.open) && now < minutes(today.close);
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
