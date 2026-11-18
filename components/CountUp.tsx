"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** The figure as written in the dictionary, e.g. "+5K", "190.9K", "+440", "94". */
  value: string;
  /** Length of the animation in milliseconds. */
  duration?: number;
};

/**
 * Split "+190.9K" into "+", 190.9 (1 decimal) and "K".
 * Returns null (shown as-is, no animation) for things that aren't a single
 * amount, like "24/7" or "9:30".
 */
export function parse(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  if (/^[/:\d]/.test(suffix.trim())) return null;

  const target = Number(number.replace(/,/g, ""));
  // A year such as "2021" counts up from the start of its century (2000), not from 0.
  const isYear = !prefix && !suffix && /^\d{4}$/.test(number) && target >= 1800 && target <= 2100;
  return {
    prefix,
    suffix,
    target,
    start: isYear ? Math.floor(target / 100) * 100 : 0,
    decimals: number.split(".")[1]?.length ?? 0,
    grouped: number.includes(","),
  };
}

/**
 * A number that counts up (from 0, or from 2000 for a year) when it scrolls into view, keeping any
 * prefix/suffix ("+", "K", "%"…) and the number of decimals.
 * The server renders the final value, so it reads correctly without
 * JavaScript, and people who prefer reduced motion see it without animating.
 */
export default function CountUp({ value, duration = 1800 }: Props) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element || !parse(value)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setProgress(1 - (1 - t) ** 3); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    setProgress(0);
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  if (!parsed) return <>{value}</>;

  const amount = parsed.start + (parsed.target - parsed.start) * progress;
  const current = amount.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
    useGrouping: parsed.grouped,
  });

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      {/* Final value: read by screen readers and keeps the width steady */}
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {parsed.prefix}
        {current}
        {parsed.suffix}
      </span>
    </span>
  );
}
