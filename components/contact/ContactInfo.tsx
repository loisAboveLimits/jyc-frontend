import Image from "next/image";
import { ClockIcon, MailIcon, MapIcon, PinIcon } from "@/components/icons";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { PhoneIcon } from "@/components/yacht-club/icons";
import type { Dictionary } from "@/lib/dictionaries";

/** The club's main phone line (as on the current site's Contact page). */
export const CLUB_PHONE = "920016134";

/**
 * "Stay connected": aerial photo next to the club's contact details
 * (location, coordinates, phone, email and a link that opens the
 * Opening Hours popup).
 */
export default function ContactInfo({ dict }: { dict: Dictionary }) {
  const t = dict.contact.info;
  const items = [
    { Icon: PinIcon, label: t.location, value: dict.footer.address },
    { Icon: MapIcon, label: t.coordinates, value: `${dict.footer.lat}\n${dict.footer.lon}` },
    { Icon: PhoneIcon, label: t.phone, value: CLUB_PHONE, href: `tel:${CLUB_PHONE}`, ltr: true, big: true },
    { Icon: MailIcon, label: t.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, ltr: true },
    // "#opening-hours" opens the popup from the header (components/OpeningHours.tsx).
    { Icon: ClockIcon, label: t.hours, value: t.hoursText, href: "#opening-hours" },
  ];

  return (
    <section className="pb-16 lg:pb-24">
      <div className="mx-auto grid w-full max-w-[1340px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-[671/554] overflow-hidden rounded-[20px] shadow-2xl shadow-black/30 lg:self-stretch lg:aspect-auto lg:min-h-[554px]">
          <Image
            src="/images/contact/marina-aerial.jpg"
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
          {/* Fades into the page on the side facing the details (large screens) */}
          <div className="absolute inset-y-0 end-0 hidden w-1/4 from-transparent to-navy lg:block ltr:bg-linear-to-r rtl:bg-linear-to-l" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gold sm:text-[40px]">{t.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed sm:text-[17px]">{t.text}</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:max-w-[492px]">
            {items.map(({ Icon, label, value, href, ltr, big }) => {
              const content = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/80 text-white">
                    <Icon className={big ? "size-10" : "size-5"} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-semibold">{label}</span>
                    <span
                      dir={ltr ? "ltr" : undefined}
                      className={`block whitespace-pre-line break-words text-white/85 ${ltr ? "rtl:text-end" : ""}`}
                    >
                      {value}
                    </span>
                  </span>
                </>
              );
              // Frosted glass, as in the design: see-through panel with a thin light
              // edge, a soft teal sheen and the page blurred behind it.
              const box =
                "flex items-center gap-4 rounded-xl border border-white/25 bg-linear-to-br from-white/[0.12] via-teal/[0.08] to-teal/[0.2] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_30px_rgba(255,255,255,0.04),0_10px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-colors";
              return (
                <li key={label} className="sm:last:col-span-2 lg:last:col-span-1">
                  {href ? (
                    <a href={href} className={`${box} hover:border-white/45 hover:from-white/[0.18]`}>
                      {content}
                    </a>
                  ) : (
                    <div className={box}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
