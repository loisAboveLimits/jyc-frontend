import Image from "next/image";
import Link from "next/link";
import MailtoForm from "@/components/MailtoForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapIcon,
  PinIcon,
  XIcon,
} from "@/components/icons";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedHref, type Locale } from "@/lib/i18n";

type Props = { lang: Locale; dict: Dictionary };

export const CONTACT_EMAIL = "info@jeddahyc.com";

// TODO: replace "#" with the real social media profile URLs.
const socials = [
  { name: "Facebook", href: "#", Icon: FacebookIcon },
  { name: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { name: "Instagram", href: "#", Icon: InstagramIcon },
  { name: "X", href: "#", Icon: XIcon },
];

/** Site-wide footer: logo, quick links, contact details and newsletter. */
export default function SiteFooter({ lang, dict }: Props) {
  const t = dict.footer;
  const quickLinks = [
    { label: t.links.yachtClub, path: "/yacht-club" },
    { label: t.links.marina, path: "/marina" },
    { label: t.links.academy, path: "/academy" },
    { label: t.links.leasing, path: "/leasing" },
    { label: t.links.about, path: "/about" },
    { label: t.links.blogs, path: "/blogs" },
    { label: t.links.contact, path: "/contact" },
  ];

  return (
    <footer className="mt-auto pb-10 pt-16 lg:pt-24">
      <div className="mx-auto w-full max-w-[1340px] px-5 sm:px-8">
        <div className="grid gap-10 rounded-2xl bg-white/10 p-7 sm:p-10 md:grid-cols-2 lg:grid-cols-[1.7fr_0.8fr_1fr_1.5fr] lg:gap-8 lg:p-11">
          {/* Logo + intro */}
          <div>
            <Link href={localizedHref(lang, "/")} className="inline-block">
              <Image
                src="/images/logo.svg"
                alt={dict.header.logoAlt}
                width={232}
                height={68}
                className="h-[68px] w-auto"
              />
            </Link>
            <p className="mt-6 max-w-sm font-semibold leading-relaxed">{t.about}</p>
            <ul aria-label={t.social} className="mt-6 flex gap-3">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    aria-label={name}
                    className="grid size-10 place-items-center rounded-full bg-teal text-white/75 transition-colors hover:bg-gold hover:text-white"
                  >
                    <Icon className="h-[17px] w-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-2xl font-semibold text-teal">{t.quickLinks}</h2>
            <ul className="mt-5 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={localizedHref(lang, link.path)}
                    className="text-white/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold text-teal">{t.contactTitle}</h2>
            <ul className="mt-5 space-y-5 text-white/90">
              <li className="flex gap-3">
                <PinIcon className="mt-1 h-[18px] w-auto shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className="flex gap-3">
                <MapIcon className="mt-1 h-[18px] w-auto shrink-0" />
                <span>
                  {t.lat}
                  <br />
                  {t.lon}
                </span>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-1.5 h-3 w-auto shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="hover:text-gold">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-2xl font-semibold text-teal">{t.newsletter}</h2>
            <p className="mt-5 text-white/90">{t.newsletterText}</p>
            <MailtoForm
              to={CONTACT_EMAIL}
              subject={t.newsletterSubject}
              className="mt-8 space-y-4"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t.emailLabel}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                className="h-11 w-full rounded-full bg-white/15 px-6 text-white placeholder:text-white/60 focus:outline-2 focus:outline-offset-2 focus:outline-teal"
              />
              <button
                type="submit"
                className="h-11 w-full rounded-full bg-gold font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-teal ltr:pt-[0.24em]"
              >
                {t.subscribe}
              </button>
            </MailtoForm>
          </div>
        </div>

        <p className="mt-9 text-center text-sm text-white/90">{t.copyright}</p>
      </div>
    </footer>
  );
}
