"use client";

import { useEffect, useRef } from "react";
import { parse } from "@/components/CountUp";

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
 * The wrapper uses `display: contents`, so the HTML is laid out as if it
 * were placed directly in the parent.
 */
export default function DrupalHtml({ html, duration = 1800 }: { html: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counters = [...root.querySelectorAll<HTMLElement>("span.inline-grid.tabular-nums")]
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

  return <div ref={ref} className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}
