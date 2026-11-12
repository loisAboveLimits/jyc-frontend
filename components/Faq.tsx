"use client";

import { useId, useState } from "react";
import { container } from "@/components/ui";

type Props = {
  title: string;
  items: { question: string; answer: string }[];
  /** Kept for compatibility; only one answer is open at a time anyway. */
  group?: string;
};

/**
 * Question-and-answer accordion. Answers fade and slide open/closed, and
 * opening one closes the others. Each question is a real button with
 * aria-expanded, so it works with the keyboard and screen readers.
 * The answers are always in the page's HTML (good for search engines).
 */
export default function Faq({ title, items }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="py-20 lg:py-24">
      <div className={container}>
        <h2 className="text-3xl font-bold text-gold sm:text-[34px]">{title}</h2>

        <div className="mt-10 space-y-5">
          {items.map((item, index) => {
            const isOpen = open === index;
            const buttonId = `${baseId}-q${index}`;
            const panelId = `${baseId}-a${index}`;

            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[32px] bg-[linear-gradient(90deg,rgba(168,147,94,0.8)_0%,rgba(49,156,173,0.4)_32%,rgba(27,45,63,0.95)_100%)] px-6 py-3.5 text-start shadow-lg shadow-black/25 transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-7 sm:py-4 rtl:bg-[linear-gradient(270deg,rgba(168,147,94,0.8)_0%,rgba(49,156,173,0.4)_32%,rgba(27,45,63,0.95)_100%)]"
                  >
                    <span className="text-lg leading-snug sm:text-[22px] ltr:pt-[0.12em]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-[30px] shrink-0 place-items-center rounded-full bg-teal transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M8 2.5v11M2.5 8h11" />
                      </svg>
                    </span>
                  </button>
                </h3>

                {/*
                  Fade + slide: the row height animates between 0fr and 1fr
                  while the opacity goes 0 → 1, in both directions.
                */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-4xl px-6 pb-2 pt-4 text-base leading-relaxed text-white/85 sm:px-7 sm:text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
