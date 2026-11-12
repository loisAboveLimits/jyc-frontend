import Image from "next/image";
import { container } from "@/components/ui";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * Top of the About page: photo background with the page title, the
 * "Pioneering the future of watersports" intro, two photos and the key figures.
 */
export default function AboutHero({ dict }: { dict: Dictionary }) {
  const t = dict.about.hero;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      {/* Background photo, fading into navy under the menu and at the bottom */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[640px] sm:h-[760px] lg:h-[830px]">
        <Image
          src="/images/about/hero-pool.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        {/* Solid navy for the last few pixels, so no seam shows where the photo ends */}
        <div className="absolute inset-x-0 -bottom-px top-0 bg-linear-to-b from-navy/85 via-navy/35 to-navy to-[97%]" />
        <div className="absolute inset-0 bg-linear-to-r from-navy/50 to-transparent rtl:bg-linear-to-l" />
      </div>

      <div className={`${container} pb-16 pt-44 sm:pt-56 lg:pb-24 lg:pt-[340px]`}>
        <h1 className="text-5xl font-bold sm:text-6xl lg:text-[64px]">{t.title}</h1>
        <p className="mt-5 text-xl sm:text-[22px]">{t.subtitle}</p>

        <h2 className="mt-24 text-3xl font-bold leading-tight text-teal sm:mt-32 sm:text-[40px] lg:mt-[200px]">
          {t.introTitle}
        </h2>
        <p className="mt-4 max-w-6xl text-lg leading-relaxed sm:text-xl sm:leading-[1.65]">
          {t.introText}
        </p>

        {/* Photos and key figures */}
        <div className="mt-14 grid gap-4 lg:grid-cols-[580fr_717fr]">
          <div className="relative aspect-[580/376] overflow-hidden rounded-[20px] shadow-2xl shadow-black/30">
            <Image
              src="/images/about/yacht-deck.jpg"
              alt={t.imageAlts[0]}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <dl className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mx-6">
              {dict.about.stats.map((stat) => (
                <div
                  key={stat.label}
                  // Frosted glass, as in the design: see-through panel with a
                  // blurred background, a light edge and a soft glow at the bottom.
                  className="relative isolate flex flex-col items-center justify-center overflow-hidden rounded-[18px] border border-white/25 bg-linear-to-b from-white/[0.14] to-white/[0.04] px-2 pb-7 pt-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl after:pointer-events-none after:absolute after:inset-x-[18%] after:-bottom-6 after:-z-10 after:h-12 after:rounded-full after:bg-white/45 after:blur-xl after:content-['']"
                >
                  <dt className="order-2 mt-1 text-[15px] sm:text-base">{stat.label}</dt>
                  <dd dir="ltr" className="order-1 text-3xl font-bold text-gold sm:text-[34px]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="relative -mt-6 aspect-[717/290] flex-1 overflow-hidden rounded-[20px] shadow-2xl shadow-black/30 sm:-mt-8">
              <Image
                src="/images/about/crew-marina.jpg"
                alt={t.imageAlts[1]}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
