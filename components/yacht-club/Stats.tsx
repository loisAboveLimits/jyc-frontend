"use client";

import { useEffect, useRef, useState } from "react";

export type Stat = { value: number; suffix: string; label: string };

/**
 * The club figures under the reviews ("Members", "Member satisfaction",
 * "Events in 2024"). Numbers are outlined in gold, as in the design, and
 * count up from 0 when the cards scroll into view.
 * Set the real figures in yachtClub.stats in the dictionaries.
 */
export default function Stats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1800, 1);
          setProgress(1 - (1 - t) ** 3); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    setProgress(0);
    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl ref={ref} className="mt-6 grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-5 rounded-lg bg-[#34495a] px-6 py-6 shadow-[inset_0_-2px_0_#a8935e,0_6px_14px_-4px_rgba(168,147,94,0.7),0_10px_24px_rgba(0,0,0,0.3)] sm:gap-4 lg:gap-8 lg:px-7"
        >
          <dd
            dir="ltr"
            className="order-1 min-w-[3ch] text-5xl font-bold tabular-nums text-transparent [-webkit-text-stroke:1px_#a8935e] lg:text-[56px]"
          >
            {Math.round(stat.value * progress)}
            {stat.suffix}
          </dd>
          <dt className="order-2 text-lg font-semibold sm:text-base lg:text-xl">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
