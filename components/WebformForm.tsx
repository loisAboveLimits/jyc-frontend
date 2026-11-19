"use client";

import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { submitWebform } from "@/lib/webform";

/** Hidden "leave empty" field; must match HONEYPOT_FIELD in lib/webform.ts. */
const HONEYPOT_FIELD = "website";

export type WebformMessages = {
  sending: string;
  success: string;
  invalid: string;
  error: string;
};

type Status = "idle" | "sending" | "success" | "invalid" | "error";

const SendingContext = createContext(false);

/**
 * A form that is saved in a Drupal webform (see lib/webform.ts).
 * Put the fields inside as children, named like the webform's elements
 * (e.g. name="email", name="message"), and use <WebformSubmit> as the button.
 *
 *   <WebformForm webformId="contact_jyc_marina" lang={lang} messages={…}>
 *     <input name="email" … />
 *     <textarea name="message" … />
 *     <WebformSubmit className="…">Send</WebformSubmit>
 *   </WebformForm>
 *
 * Shows "Sending…", then a thank-you (and clears the fields) or an error.
 * Fields Drupal rejects get aria-invalid="true".
 */
export default function WebformForm({
  webformId,
  lang,
  messages,
  className,
  children,
}: {
  webformId: string;
  lang: string;
  messages: WebformMessages;
  className?: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });

    for (const field of form.querySelectorAll("[aria-invalid]")) field.removeAttribute("aria-invalid");
    setStatus("sending");
    const result = await submitWebform(webformId, lang, data).catch(() => null);

    if (result?.ok) {
      form.reset();
      setStatus("success");
    } else if (result?.reason === "invalid") {
      for (const name of Object.keys(result.errors)) {
        form.querySelector(`[name="${CSS.escape(name)}"]`)?.setAttribute("aria-invalid", "true");
      }
      (form.querySelector("[aria-invalid]") as HTMLElement | null)?.focus();
      setStatus("invalid");
    } else {
      setStatus("error");
    }
  };

  const text =
    status === "sending"
      ? messages.sending
      : status === "success"
        ? messages.success
        : status === "invalid"
          ? messages.invalid
          : status === "error"
            ? messages.error
            : "";

  return (
    // method="post": if someone submits before the page's scripts have loaded,
    // the email must not end up in the address bar (as with the default GET).
    <form method="post" className="relative" onSubmit={onSubmit} onInput={() => status === "success" && setStatus("idle")}>
      {/* `className` (spacing etc.) applies to the fields, exactly as on a plain form. */}
      <div className={className}>
        <SendingContext.Provider value={status === "sending"}>{children}</SendingContext.Provider>
      </div>
      {/* Hidden from people; bots that fill it in are ignored. */}
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only pointer-events-none"
      />
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 empty:hidden ${status === "invalid" || status === "error" ? "text-red-300" : "text-teal"}`}
      >
        {text}
      </p>
    </form>
  );
}

/** The submit button of a <WebformForm>: disabled while sending. */
export function WebformSubmit({ className, children }: { className?: string; children: ReactNode }) {
  const sending = useContext(SendingContext);
  return (
    <button
      type="submit"
      disabled={sending}
      aria-disabled={sending}
      className={`${className ?? ""} disabled:cursor-wait disabled:opacity-70`}
    >
      {children}
    </button>
  );
}
