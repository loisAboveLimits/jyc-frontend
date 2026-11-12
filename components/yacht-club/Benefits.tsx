"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AcademyIcon,
  BeachIcon,
  BoutiqueIcon,
  GymIcon,
  RestaurantIcon,
  TicketIcon,
} from "@/components/yacht-club/icons";

// Icons in the same order as yachtClub.benefits.items in the dictionaries.
const icons = [TicketIcon, BeachIcon, GymIcon, RestaurantIcon, BoutiqueIcon, AcademyIcon];

/*
 * Animation keyframes live here (not in globals.css) so the section is
 * self-contained. React adds this <style> to the page head once.
 */
const keyframes = `
@keyframes yc-bob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(0.6deg); }
}
@keyframes yc-ripple {
  from { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; }
  to { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
}
@keyframes yc-shine {
  from { transform: translateX(-120%) skewX(-20deg); }
  to { transform: translateX(320%) skewX(-20deg); }
}
`;

/**
 * "Experience everything The Yacht Club has to offer".
 * When the section scrolls into view: the sea slowly zooms out, the yacht
 * sails up into place and then keeps gently bobbing with ripples at its bow,
 * and the six benefits glide in from the sides one after another, each with
 * its gold icon popping in. Visitors who prefer reduced motion see it all
 * straight away, without movement.
 *
 * States: "static" (server render / reduced motion: everything visible),
 * "idle" (waiting to scroll into view: hidden) and "in" (animated in).
 */
export default function Benefits({
  title,
  items,
  imageAlt,
}: {
  title: string;
  items: string[];
  imageAlt: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"static" | "idle" | "in">("static");

  useEffect(() => {
    const section = ref.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen (e.g. page reloaded here): just play it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    setState("idle");
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  const playing = state === "in";

  return (
    <section
      ref={ref}
      data-state={state}
      className="group/benefits relative isolate overflow-hidden pb-16 pt-28 lg:pb-20 lg:pt-44"
    >
      <style href="yacht-club-benefits" precedence="default">
        {keyframes}
      </style>

      {/* Sea with the yacht's wake; zooms out slowly as the section appears */}
      <div className="absolute inset-0 -z-10 transition-transform duration-[2600ms] ease-out group-data-[state=idle]/benefits:scale-[1.18]">
        <Image src="/images/yacht-club/sea.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy via-transparent via-30% to-navy-deep" />

      <div className="mx-auto w-full max-w-[1340px] px-5 sm:px-8">
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold leading-tight text-teal transition-all duration-1000 ease-out group-data-[state=idle]/benefits:translate-y-8 group-data-[state=idle]/benefits:opacity-0 sm:text-[40px] sm:leading-[1.5]">
          {title}
        </h2>

        <div className="mt-12 grid items-center gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)_minmax(0,1fr)] lg:gap-x-10">
          {/* Yacht (in the middle on large screens, on top on small ones) */}
          <div className="relative mx-auto w-44 sm:col-span-2 sm:w-56 lg:order-2 lg:col-span-1 lg:w-full">
            <div className="transition-[transform,opacity] duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=idle]/benefits:translate-y-[45%] group-data-[state=idle]/benefits:opacity-0">
              {/* Ripples spreading from the bow */}
              {[0, 1, 2].map((ring) => (
                <span
                  key={ring}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[94%] size-24 rounded-full border border-white/40 opacity-0"
                  style={
                    playing
                      ? { animation: `yc-ripple 3.6s ease-out ${1.6 + ring * 1.2}s infinite` }
                      : undefined
                  }
                />
              ))}
              <div style={playing ? { animation: "yc-bob 6s ease-in-out 1.8s infinite" } : undefined}>
                <Image
                  src="/images/yacht-club/yacht.png"
                  alt={imageAlt}
                  width={397}
                  height={718}
                  sizes="(min-width: 1024px) 360px, 224px"
                  className="relative h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
                />
              </div>
            </div>
          </div>

          {columns.map((column, side) => (
            <ul
              key={side}
              className={`grid gap-y-10 self-start lg:gap-y-24 lg:self-center lg:pb-48 ${
                side === 0 ? "lg:order-1" : "lg:order-3"
              }`}
            >
              {column.map((item, row) => {
                const index = side * half + row;
                const Icon = icons[index];
                // Start column glides in from the start edge, end column from the end edge.
                const from =
                  side === 0
                    ? "ltr:group-data-[state=idle]/benefits:-translate-x-24 rtl:group-data-[state=idle]/benefits:translate-x-24"
                    : "ltr:group-data-[state=idle]/benefits:translate-x-24 rtl:group-data-[state=idle]/benefits:-translate-x-24";
                const delay = 700 + row * 220 + side * 110;
                return (
                  <li
                    key={item}
                    className={`transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=idle]/benefits:opacity-0 ${from}`}
                    style={{ transitionDelay: playing ? `${delay}ms` : "0ms" }}
                  >
                    <div className="group/pill relative rounded-[10px] border border-white/15 bg-linear-to-b from-white/[0.16] to-white/[0.05] px-8 py-5 text-center shadow-[inset_0_-2px_0_#319cad,0_6px_18px_-4px_rgba(49,156,173,0.65),0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-md transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-teal/70">
                      {/* Light sweeping across the card once it has arrived */}
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
                        <span
                          className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0"
                          style={
                            playing
                              ? { animation: `yc-shine 1.4s ease-in-out ${(delay + 700) / 1000}s 1 both`, opacity: 1 }
                              : undefined
                          }
                        />
                      </span>
                      <span className="relative text-base leading-snug text-white/90 sm:text-[17px]">{item}</span>
                      {/* Gold icon badge on the top corner; pops in after the card */}
                      <span
                        className="absolute -top-5 end-10 grid size-10 place-items-center rounded-full bg-gold text-white shadow-lg shadow-black/30 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[state=idle]/benefits:-rotate-90 group-data-[state=idle]/benefits:scale-0 group-data-[state=idle]/benefits:opacity-0"
                        style={{ transitionDelay: playing ? `${delay + 450}ms` : "0ms" }}
                      >
                        <Icon className="size-10" />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
