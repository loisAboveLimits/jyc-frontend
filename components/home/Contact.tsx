import Image from "next/image";
import MailtoForm from "@/components/MailtoForm";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

const field =
  "mt-1 w-full border-b border-white/60 bg-transparent py-2 text-white focus:border-teal focus:outline-none";

/** "Contact Jeddah Yacht Club & Marina": short form next to a photo. */
export default function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.home.contact;

  return (
    <section className="relative">
      {/* Panel that runs from the edge of the screen behind the form (large screens) */}
      <div className="absolute inset-y-0 start-0 hidden w-[60%] rounded-e-3xl bg-navy-soft lg:block" />

      <div className={`${container} relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16`}>
        <div className="rounded-3xl bg-navy-soft p-7 sm:p-10 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-12">
          <h2 className="max-w-lg text-3xl font-bold leading-tight text-gold sm:text-[42px] sm:leading-[1.25]">
            {t.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed sm:text-[23px] sm:leading-[1.6]">
            {t.text}
          </p>

          <MailtoForm to={CONTACT_EMAIL} subject={t.subject} className="mt-10 max-w-md space-y-7">
            <div>
              <label htmlFor="contact-email" className="text-white/80">
                {t.email}
                <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-white/80">
                {t.message}
              </label>
              <textarea id="contact-message" name="message" rows={2} className={field} />
            </div>
            <button type="submit" className={button.gold}>
              {t.send}
            </button>
          </MailtoForm>
        </div>

        <div className="relative aspect-[596/402] overflow-hidden rounded-3xl shadow-2xl shadow-black/30">
          <Image
            src="/images/home/contact-sails.jpg"
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
