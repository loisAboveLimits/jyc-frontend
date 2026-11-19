"use client";

import { useRouter } from "next/navigation";
import { createElement, Fragment, useEffect, useMemo, useRef, type FormEvent, type MouseEvent } from "react";
import { parse } from "@/components/CountUp";
import type { WebformMessages } from "@/components/WebformForm";
import { splitHtmlRoots, toReactProps } from "@/lib/htmlRoots";
import { submitWebform } from "@/lib/webform";

export type DrupalHtmlWebform = { id: string; lang: string; messages: WebformMessages };

/**
 * Sends a form written in Drupal HTML to a webform and shows the outcome in a
 * status line placed right after the form (created on first use).
 */
async function sendToWebform(form: HTMLFormElement, webformId: string, webform: DrupalHtmlWebform) {
  if (form.dataset.sending) return;
  let status = form.nextElementSibling;
  if (!(status instanceof HTMLElement) || !status.matches("[data-webform-status]")) {
    status = document.createElement("p");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("data-webform-status", "");
    form.after(status);
  }
  const show = (text: string, error = false) => {
    (status as HTMLElement).textContent = text;
    (status as HTMLElement).className = `mt-3 text-sm ${error ? "text-red-300" : "text-teal"}`;
  };

  const data: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") data[key] = value;
  });
  const buttons = [...form.querySelectorAll<HTMLButtonElement>("button[type=submit], button:not([type])")];
  for (const field of form.querySelectorAll("[aria-invalid]")) field.removeAttribute("aria-invalid");

  form.dataset.sending = "1";
  form.setAttribute("aria-busy", "true");
  buttons.forEach((button) => (button.disabled = true));
  show(webform.messages.sending);

  const result = await submitWebform(webformId, webform.lang, data).catch(() => null);

  delete form.dataset.sending;
  form.removeAttribute("aria-busy");
  buttons.forEach((button) => (button.disabled = false));

  if (result?.ok) {
    form.reset();
    show(webform.messages.success);
  } else if (result?.reason === "invalid") {
    for (const name of Object.keys(result.errors)) {
      form.querySelector(`[name="${CSS.escape(name)}"]`)?.setAttribute("aria-invalid", "true");
    }
    (form.querySelector("[aria-invalid]") as HTMLElement | null)?.focus();
    show(webform.messages.invalid, true);
  } else {
    show(webform.messages.error, true);
  }
}

/**
 * Renders HTML written in Drupal (e.g. a page's field_content) as it is.
 * Only for content from trusted editors: the HTML is not sanitised here.
 *
 * Figures written in the CountUp markup —
 *   <span class="inline-grid tabular-nums">
 *     <span class="sr-only">+440</span>
 *     <span aria-hidden="true" class="invisible …">+440</span>
 *     <span aria-hidden="true" class="…">+440</span>
 *   </span>
 * — count up again when they scroll into view, like <CountUp>.
 *
 * Links to pages of this site open inside the app (no full page reload).
 * A form without an `action` opens the visitor's email app with the message
 * filled in (like <MailtoForm>), when `mailto` is given; the form can set its
 * own subject with data-subject="…". Fields are read by name: "email", and the
 * optional "firstName", "lastName" and "message".
 *
 * With `webform`, a form without an `action` is saved in that Drupal webform
 * instead (a form can name another one with data-webform="…"); its fields
 * must be named like the webform's elements. "Sending…", the thank-you or the
 * error appear in a status line right under the form.
 *
 * No wrapper element is added: each top-level element of the HTML (the
 * block's own <div>, a <section>, a <ul> …) is rendered as a real element,
 * with only its inner HTML inserted as-is.
 */
export default function DrupalHtml({
  html,
  duration = 1800,
  mailto,
  webform,
}: {
  html: string;
  duration?: number;
  mailto?: { to: string; subject: string };
  /** Save forms (without an `action`) in this Drupal webform; see sendToWebform below. */
  webform?: DrupalHtmlWebform;
}) {
  const roots = useMemo(() => splitHtmlRoots(html), [html]);
  const elements = useRef(new Set<HTMLElement>());
  const router = useRouter();

  // Internal links: navigate inside the app, like next/link.
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest?.("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return; // other sites, mailto:, tel:
    // Same page (#section links): let the browser / smooth scrolling handle it.
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    event.preventDefault();
    router.push(url.pathname + url.search + url.hash);
  };

  // Forms without an action: saved in a Drupal webform (`webform`, or the form's
  // own data-webform="…"), otherwise the email app opens (`mailto`).
  const onSubmit = (event: FormEvent<HTMLElement>) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.getAttribute("action")) return;
    const webformId = form.dataset.webform || webform?.id;
    if (webformId && webform) {
      event.preventDefault();
      void sendToWebform(form, webformId, webform);
      return;
    }
    if (!mailto) return;
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const name = [data.get("firstName"), data.get("lastName")]
      .map((part) => String(part ?? "").trim())
      .filter(Boolean)
      .join(" ");
    const body = [message, [name, email].filter(Boolean).join("\n")].filter(Boolean).join("\n\n");
    const subject = form.dataset.subject || mailto.subject;
    window.location.href = `mailto:${mailto.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const tops = [...elements.current].filter((el) => el.isConnected);
    if (tops.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counters = tops
      .flatMap((top) => [
        ...(top.matches("span.inline-grid.tabular-nums") ? [top] : []),
        ...top.querySelectorAll<HTMLElement>("span.inline-grid.tabular-nums"),
      ])
      .map((wrapper) => {
        const value = wrapper.querySelector(".sr-only")?.textContent?.trim() ?? "";
        const target = [...wrapper.children].at(-1) as HTMLElement | undefined;
        const parsed = parse(value);
        return parsed && target && !target.classList.contains("sr-only") ? { wrapper, target, value, parsed } : null;
      })
      .filter((counter) => counter !== null);
    if (counters.length === 0) return;

    const show = (counter: (typeof counters)[number], progress: number) => {
      const { parsed } = counter;
      const amount = parsed.start + (parsed.target - parsed.start) * progress;
      counter.target.textContent =
        parsed.prefix +
        amount.toLocaleString("en-US", {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
          useGrouping: parsed.grouped,
        }) +
        parsed.suffix;
    };

    const frames = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const counter = counters.find((c) => c.wrapper === entry.target);
          if (!counter) continue;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            show(counter, 1 - (1 - t) ** 3); // ease-out
            if (t < 1) frames.add(requestAnimationFrame(tick));
          };
          frames.add(requestAnimationFrame(tick));
        }
      },
      { threshold: 0.5 },
    );
    for (const counter of counters) {
      show(counter, 0);
      observer.observe(counter.wrapper);
    }

    return () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
      for (const counter of counters) counter.target.textContent = counter.value;
    };
  }, [html, duration]);

  return roots.map((root, index) =>
    root.type === "text"
      ? createElement(Fragment, { key: index }, root.text)
      : createElement(root.tag, {
          ...toReactProps(root.attrs),
          key: index,
          ref: (el: HTMLElement | null) => {
            if (!el) return;
            elements.current.add(el);
            return () => {
              elements.current.delete(el);
            };
          },
          onClick,
          onSubmit,
          ...(root.void ? {} : { dangerouslySetInnerHTML: { __html: root.inner } }),
        }),
  );
}
