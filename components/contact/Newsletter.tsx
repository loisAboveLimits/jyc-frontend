import Image from "next/image";
import { DownloadIcon } from "@/components/icons";
import MailtoForm from "@/components/MailtoForm";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { button } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * "Stay connected" newsletter band over a photo of the marina.
 * The "Download Our Latest News" link only shows once `newsHref` is set
 * (see app/[lang]/contact/page.tsx).
 */
export default function Newsletter({ dict, newsHref }: { dict: Dictionary; newsHref: string | null }) {
  const t = dict.contact.newsletter;

  return (
    <section className="relative isolate overflow-hidden py-14 sm:py-16">
      <Image src="/images/yacht-club/hero.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy-deep/45" />

      <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-bold sm:text-[40px]">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed sm:text-[17px]">{t.text}</p>
        {newsHref && (
          <a
            href={newsHref}
            download
            className="mt-3 inline-flex items-center gap-2 text-lg font-semibold transition-colors hover:text-gold"
          >
            <DownloadIcon className="h-4 w-auto" />
            {t.download}
          </a>
        )}

        <MailtoForm
          to={CONTACT_EMAIL}
          subject={t.subject}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label htmlFor="contact-newsletter-email" className="sr-only">
            {t.email}
          </label>
          <input
            id="contact-newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t.placeholder}
            className="min-h-12 w-full flex-1 rounded-full border border-white/30 bg-white/60 px-6 text-navy placeholder:text-navy/60 backdrop-blur-md focus:border-teal focus:outline-none"
          />
          <button type="submit" className={`${button.gold} min-h-12 sm:min-w-44`}>
            {t.send}
          </button>
        </MailtoForm>
      </div>
    </section>
  );
}
