import { container } from "@/components/ui";
import Reviews from "@/components/yacht-club/Reviews";
import Stats from "@/components/yacht-club/Stats";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * "Visitors' Experience" review slider (up to 5) and the club figures underneath.
 * The figures come from yachtClub.stats in the dictionaries (value, suffix, label).
 */
export default function Testimonials({ dict }: { dict: Dictionary }) {
  const t = dict.yachtClub;

  return (
    <section className="bg-linear-to-b from-navy-deep to-navy-deep/0 py-16 lg:py-24">
      <div className={container}>
        <Reviews
          title={t.reviews.title}
          text={t.reviews.text}
          items={t.reviews.items}
          labels={{
            previous: dict.common.previous,
            next: dict.common.next,
            rating: dict.common.ratingLabel,
            counter: dict.common.imageCounter,
          }}
        />

        <Stats stats={t.stats} />
      </div>
    </section>
  );
}
