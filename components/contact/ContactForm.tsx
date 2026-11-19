import { button, container } from "@/components/ui";
import WebformForm, { WebformSubmit } from "@/components/WebformForm";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** Drupal webform that stores this form's messages (fields named like its elements). */
const WEBFORM_ID = "contact_page";

const field =
  "w-full rounded-md border border-white/80 bg-transparent px-5 py-5 text-white placeholder:text-white/70 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal aria-[invalid=true]:border-red-300";

/**
 * "Contact Jeddah Yacht Club & Marina": the full enquiry form.
 * Saved in the Drupal webform "contact_page" (first name, last name and
 * email are required there; the message is optional).
 */
export default function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.contact.form;

  return (
    <section id="contact-form" className="scroll-mt-28 py-16 lg:py-24">
      <div className={container}>
        <h2 className="text-3xl font-bold leading-tight text-teal sm:text-[40px]">{t.title}</h2>
        <p className="mt-5 max-w-5xl leading-relaxed sm:text-[17px]">{t.text}</p>

        <WebformForm
          webformId={WEBFORM_ID}
          lang={lang}
          messages={dict.common.formStatus}
          className="mt-10 grid gap-5 sm:grid-cols-[1.85fr_1fr] lg:mt-16"
        >
          <div>
            <label htmlFor="contact-first-name" className="sr-only">
              {t.firstName}
            </label>
            <input
              id="contact-first-name"
              name="first_name"
              required
              autoComplete="given-name"
              placeholder={`${t.firstNamePlaceholder}*`}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="contact-last-name" className="sr-only">
              {t.lastName}
            </label>
            <input
              id="contact-last-name"
              name="last_name"
              required
              autoComplete="family-name"
              placeholder={`${t.lastNamePlaceholder}*`}
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contact-page-email" className="sr-only">
              {t.email}
            </label>
            <input
              id="contact-page-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={`${t.emailPlaceholder}*`}
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contact-question" className="sr-only">
              {t.question}
            </label>
            <textarea
              id="contact-question"
              name="message"
              rows={5}
              placeholder={t.questionPlaceholder}
              className={`${field} resize-y`}
            />
          </div>
          <div className="mt-2 sm:col-span-2">
            <WebformSubmit className={`${button.gold} w-full sm:w-auto sm:min-w-[367px]`}>{t.send}</WebformSubmit>
          </div>
        </WebformForm>
      </div>
    </section>
  );
}
