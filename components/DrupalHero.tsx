import type { ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import DrupalHtml from "@/components/DrupalHtml";
import HeroSlider from "@/components/home/HeroSlider";
import { container, heroIn } from "@/components/ui";
import { getBanners } from "@/lib/banners";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getPageContent } from "@/lib/pageContent";

type Props = {
  /** Drupal "Pages" node: its banners (field_reference) and its field_content. null = no Drupal page yet. */
  nodeId: number | null;
  lang: Locale;
  dict: Dictionary;
  /**
   * The page's original built-in hero, shown as it was before Drupal when
   * the node has no banners (or Drupal can't be reached).
   */
  fallback: ReactNode;
  /**
   * Breadcrumb above the slider (inner pages): this page's name and any
   * pages in between. Leave out on Home and About.
   */
  breadcrumb?: { current: string; parents?: { label: string; href: string }[] };
  /** Built-in content under the slider, used when the node has no field_content. */
  children?: ReactNode;
  /**
   * Colour of the section below, so the hero fades into it without a line:
   * "navy" (home) or "navy-deep" (the page background, default).
   */
  blendInto?: "navy" | "navy-deep";
};

/**
 * Page hero fed by Drupal, for a "Pages" node:
 *  - its banners (content type "banners" whose field_reference is the node):
 *    1 or more are shown in the same slider as the home page;
 *  - its field_content (HTML written in Drupal): shown inside the hero, under
 *    the slider.
 * Without banners (or Drupal, or for nodeId null) the page shows its original
 * built-in hero (`fallback`), exactly as before Drupal.
 *
 *   <DrupalHero nodeId={PAGE_NODE_IDS.marina} lang={lang} dict={dict}
 *     breadcrumb={{ current: dict.nav.marina }} fallback={<PageHero … />} />
 */
export default async function DrupalHero({
  nodeId,
  lang,
  dict,
  fallback,
  children,
  breadcrumb,
  blendInto = "navy-deep",
}: Props) {
  const slides = nodeId ? await getBanners(nodeId, lang) : [];
  if (slides.length === 0) return <>{fallback}</>;

  const page = nodeId ? await getPageContent(nodeId, lang) : null;
  const content = page?.content ? <DrupalHtml html={page.content} /> : null;

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      {/* Fades into the section below, so there is no visible line between them */}
      {blendInto === "navy-deep" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px -z-[5] h-1/3 bg-linear-to-b from-transparent to-navy-deep"
        />
      )}

      <div className={`${container} pt-44 sm:pt-52 lg:pt-64 ${content || children ? "pb-12 lg:pb-16" : "pb-20 lg:pb-28"}`}>
        {breadcrumb && (
          <Breadcrumb
            lang={lang}
            home={dict.common.breadcrumbHome}
            label={dict.common.breadcrumbLabel}
            parents={breadcrumb.parents}
            current={breadcrumb.current}
            className={`mb-6 ${heroIn("top", 0)}`}
          />
        )}
        {/* Background (behind the whole section) + the slide texts and controls */}
        <HeroSlider
          slides={slides}
          labels={{
            label: dict.home.hero.label,
            slide: dict.home.hero.slide,
            previous: dict.common.previous,
            next: dict.common.next,
          }}
        />
        {content ? <div className="mt-16 lg:mt-24 drp-view">{content}</div> : children}
      </div>
    </section>
  );
}
