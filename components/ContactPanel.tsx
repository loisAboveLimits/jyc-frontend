import Image from "next/image";
import MailtoForm from "@/components/MailtoForm";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { button, container } from "@/components/ui";
import { MailIcon, PhoneIcon } from "@/components/yacht-club/icons";

export const CONTACT_PHONE = "+966 55 876 7482";

const field =
  "w-full border-b border-white/40 bg-transparent px-2 py-2 text-white placeholder:text-white/80 focus:border-teal focus:outline-none";

export type ContactPanelProps = {
  /** Section id, so buttons like "Apply Now" can link to #id. */
  id: string;
  title: string;
  text: string;
  /** Texts of the form and the info card. */
  labels: {
    email: string;
    message: string;
    send: string;
    subject: string;
    emailLabel: string;
    phoneLabel: string;
  };
  image: string;
  imageAlt: string;
  /** Shown in the info card; default to the club's main email and phone. */
  email?: string;
  phone?: string;
};

/**
 * "Contact The Yacht Club / The Marina": email form next to a photo with a
 * frosted card showing the email address and phone number.
 */
export default function ContactPanel({
  id,
  title,
  text,
  labels,
  image,
  imageAlt,
  email = CONTACT_EMAIL,
  phone = CONTACT_PHONE,
}: ContactPanelProps) {
  return (
    <section id={id} className="scroll-mt-28 pb-20 pt-12 lg:pb-32 lg:pt-20">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16 xl:gap-36`}>
        <div>
          <h2 className="text-3xl font-bold text-teal sm:text-[40px]">{title}</h2>
          <p className="mt-6 max-w-lg leading-relaxed sm:text-[17px]">{text}</p>

          <MailtoForm to={email} subject={labels.subject} className="mt-6 max-w-lg space-y-8">
            <div>
              <label htmlFor={`${id}-email`} className="sr-only">
                {labels.email}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={`${labels.email}*`}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={`${id}-message`} className="sr-only">
                {labels.message}
              </label>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={1}
                placeholder={labels.message}
                className={`${field} resize-y`}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className={`${button.gold} w-full sm:w-[72%]`}>
                {labels.send}
              </button>
            </div>
          </MailtoForm>
        </div>

        <div className="relative h-80 w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/30 sm:aspect-[659/400] sm:h-auto">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <dl className="absolute start-4 top-4 space-y-5 rounded-2xl bg-navy/30 p-5 shadow-lg shadow-black/20 backdrop-blur-md sm:start-8 sm:top-8">
            {[
              { label: labels.emailLabel, value: email, href: `mailto:${email}`, Icon: MailIcon },
              {
                label: labels.phoneLabel,
                value: phone,
                href: `tel:${phone.replace(/\s/g, "")}`,
                Icon: PhoneIcon,
              },
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
