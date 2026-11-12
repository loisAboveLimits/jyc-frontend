import Image from "next/image";
import { DownloadIcon, LinkIcon } from "@/components/icons";
import { button, container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

// Photos in the same order as yachtClub.features in the dictionaries.
const photos = ["lounge", "marina", "concierge", "network"];

/** Puts the highlighted words (e.g. "Riva Privée") in teal where {highlight} is. */
function withHighlight(text: string, highlight: string) {
  if (!highlight || !text.includes("{highlight}")) return text;
  const [before, after] = text.split("{highlight}");
  return (
    <>
      {before}
      <span className="text-teal">{highlight}</span>
      {after}
    </>
  );
}

/**
 * The four membership features: text next to a photo, alternating sides.
 * The photo fades into the background on the side facing the text.
 * The second feature also has the "Become a Member" and brochure buttons.
 */
export default function FeatureRows({
  dict,
  brochureHref,
}: {
  dict: Dictionary;
  /** Link to the brochure PDF; the button is hidden while there is none. */
  brochureHref: string | null;
}) {
  const t = dict.yachtClub;

  return (
    <section className="py-10 lg:py-16">
      <div className={`${container} space-y-16 lg:space-y-20`}>
        {t.features.map((feature, index) => {
          const photoFirst = index % 2 === 1;
          return (
            <div
              key={feature.title}
              className={`grid items-center gap-8 lg:gap-14 ${
                photoFirst
                  ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
                  : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
              }`}
            >
              <div className={photoFirst ? "lg:order-2" : undefined}>
                <h2 className="text-3xl font-bold leading-tight text-gold sm:text-[40px] sm:leading-[1.4]">
                  {feature.title}
                </h2>
                <p className="mt-5 max-w-xl leading-relaxed sm:text-[17px] sm:leading-[1.75]">
                  {withHighlight(feature.text, feature.highlight)}
                </p>

                {index === 1 && (
                  <div className="mt-10 flex flex-wrap gap-4 sm:gap-9">
                    <a href="#yacht-club-contact" className={button.gold}>
                      {t.becomeMember}
                      <LinkIcon className="size-4 shrink-0" />
                    </a>
                    {brochureHref && (
                      <a href={brochureHref} download className={button.glass}>
                        {t.brochure}
                        <DownloadIcon className="h-3.5 w-auto shrink-0" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`relative aspect-[665/402] overflow-hidden rounded-[20px] shadow-2xl shadow-black/30 ${photoFirst ? "lg:order-1" : ""}`}
              >
                <Image
                  src={`/images/yacht-club/${photos[index]}.jpg`}
                  alt={feature.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* Fade towards the text (large screens, where they sit side by side) */}
                <div
                  className={`absolute inset-y-0 hidden w-2/5 from-navy via-navy/45 to-transparent lg:block ${
                    photoFirst
                      ? "end-0 bg-linear-to-l rtl:bg-linear-to-r"
                      : "start-0 bg-linear-to-r rtl:bg-linear-to-l"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
