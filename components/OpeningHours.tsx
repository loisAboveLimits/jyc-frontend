"use client";

import { useEffect, useRef, useState } from "react";
import { ClockIcon, CloseIcon, MapIcon, PinIcon } from "@/components/icons";
import { centerText } from "@/components/ui";
import {
  directionsUrl,
  formatTime,
  isOpenNow,
  jeddahNow,
  mapEmbedUrl,
  openingHours,
} from "@/lib/openingHours";

export type OpeningHoursLabels = {
  /** Text of the link in the header, and the popup title. */
  title: string;
  intro: string;
  /** Sunday … Saturday */
  days: string[];
  closed: string;
  today: string;
  openNow: string;
  closedNow: string;
  marinaNote: string;
  address: string;
  directions: string;
  mapTitle: string;
  close: string;
};

/**
 * "Opening Hours" link at the top of every page. It opens a popup with the
 * weekly hours (today highlighted, with an open/closed badge), the address
 * and a map. The popup is a native <dialog>: Escape closes it, focus stays
 * inside while it is open and returns to the link afterwards.
 * Linking to "#opening-hours" also opens it. The hours live in lib/openingHours.ts.
 */
export default function OpeningHours({ lang, labels }: { lang: string; labels: OpeningHoursLabels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  // Worked out when the popup opens (in Jeddah time), so it is always current.
  const [now, setNow] = useState<{ day: number; open: boolean } | null>(null);

  const open = () => {
    setNow({ day: jeddahNow().day, open: isOpenNow() });
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const onClosed = () => {
    document.documentElement.style.overflow = "";
    if (window.location.hash === "#opening-hours") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  // A link to "#opening-hours" (from any page) opens the popup straight away.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#opening-hours" && !dialog.current?.open) open();
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const close = () => {
    dialog.current?.close();
    onClosed();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={`flex min-h-11 items-center gap-2 hover:text-white ${centerText}`}
      >
        <ClockIcon className="size-4" />
        {labels.title}
      </button>

      <dialog
        ref={dialog}
        onClose={onClosed}
        // A click on the dark area around the panel closes the popup.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        aria-labelledby="opening-hours-title"
        // Lenis (smooth scrolling) leaves the popup's own scrolling alone.
        data-lenis-prevent
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-y-auto rounded-3xl border border-white/15 bg-navy-soft/95 p-0 text-start text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[opacity,translate,display,overlay] duration-300 transition-discrete backdrop:bg-navy-deep/70 backdrop:backdrop-blur-sm open:translate-y-0 open:opacity-100 starting:open:translate-y-4 starting:open:opacity-0 motion-reduce:transition-none"
      >
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Hours */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="opening-hours-title" className="flex items-center gap-3 text-2xl font-bold text-gold sm:text-3xl">
                  <ClockIcon className="size-6 shrink-0" />
                  {labels.title}
                </h2>
                <p className="mt-2 text-white/80">{labels.intro}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-gold md:hidden"
              >
                <CloseIcon />
              </button>
            </div>

            {now && (
              <p
                className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                  now.open ? "bg-teal/20 text-teal" : "bg-white/10 text-white/80"
                }`}
              >
                <span aria-hidden="true" className={`size-2 rounded-full ${now.open ? "bg-teal" : "bg-white/50"}`} />
                {now.open ? labels.openNow : labels.closedNow}
              </p>
            )}

            <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {openingHours.map((hours, day) => {
                const isToday = now?.day === day;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between gap-4 px-3 py-2.5 ${isToday ? "rounded-lg bg-white/10 font-semibold" : ""}`}
                  >
                    <dt className="flex items-center gap-2">
                      {labels.days[day]}
                      {isToday && (
                        <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">{labels.today}</span>
                      )}
                    </dt>
                    <dd className="text-white/85" dir="auto">
                      {hours ? `${formatTime(hours.open, lang)} – ${formatTime(hours.close, lang)}` : labels.closed}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <p className="mt-4 text-sm text-white/70">{labels.marinaNote}</p>

            <p className="mt-6 flex items-start gap-2 text-white/85">
              <PinIcon className="mt-0.5 size-5 shrink-0 text-teal" />
              {labels.address}
            </p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 font-semibold text-white transition-colors hover:bg-teal"
            >
              <MapIcon className="size-5 shrink-0" />
              <span className={centerText}>{labels.directions}</span>
            </a>
          </div>

          {/* Map (loaded only once the popup has been opened) */}
          <div className="relative min-h-72 md:min-h-full">
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="absolute end-4 top-4 z-10 hidden size-11 place-items-center rounded-full bg-navy-deep/80 transition-colors hover:bg-gold md:grid"
            >
              <CloseIcon />
            </button>
            {now && (
              <iframe
                title={labels.mapTitle}
                src={mapEmbedUrl(lang)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 md:rounded-e-3xl rtl:md:rounded-e-3xl"
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
