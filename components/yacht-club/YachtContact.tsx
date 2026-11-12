import Image from "next/image";
import MailtoForm from "@/components/MailtoForm";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { button, container } from "@/components/ui";
import { MailIcon, PhoneIcon } from "@/components/yacht-club/icons";
import type { Dictionary } from "@/lib/dictionaries";

const PHONE = "+966 55 876 7482";

const field =
  "w-full border-b border-white/40 bg-transparent px-2 py-2 text-white placeholder:text-white/80 focus:border-teal focus:outline-none";

/** "Contact The Yacht Club": email form next to a photo with email and phone. */
export default function YachtContact({ dict }: { dict: Dictionary }) {
  const t = dict.yachtClub.contact;

  return (
    <section id="yacht-club-contact" className="scroll-mt-28 pb-20 pt-12 lg:pb-32 lg:pt-20">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-36`}>
        <div>
          <h2 className="text-3xl font-bold text-teal sm:text-[40px]">{t.title}</h2>
          <p className="mt-6 max-w-lg leading-relaxed sm:text-[17px]">{t.text}</p>

          <MailtoForm to={CONTACT_EMAIL} subject={t.subject} className="mt-6 max-w-lg space-y-8">
            <div>
              <label htmlFor="yacht-club-email" className="sr-only">
                {t.email}
              </label>
              <input
                id="yacht-club-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={`${t.email}*`}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="yacht-club-message" className="sr-only">
                {t.message}
              </label>
              <textarea
                id="yacht-club-message"
                name="message"
                rows={1}
                placeholder={t.message}
                className={`${field} resize-y`}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className={`${button.gold} w-full sm:w-[72%]`}>
                {t.send}
              </button>
            </div>
          </MailtoForm>
        </div>

        <div className="relative h-80 w-full overflow-hidden sm:h-auto sm:aspect-[659/400] rounded-3xl shadow-2xl shadow-black/30">
          <Image
            src="/images/yacht-club/contact.jpg"
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <dl className="absolute start-4 top-4 space-y-5 rounded-2xl bg-white/15 p-5 shadow-lg shadow-black/20 backdrop-blur-md sm:start-8 sm:top-8">
            {[
              { label: t.emailLabel, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: MailIcon },
              { label: t.phoneLabel, value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}`, Icon: PhoneIcon },
            ].map(({ label, value, href, Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-teal">
                  <Icon className="size-10" />
                </span>
                <div>
                  <dt className="text-lg font-bold leading-tight">{label}</dt>
                  <dd>
                    <a href={href} dir="ltr" className="text-white/90 hover:text-teal">
                      {value}
                    </a>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
