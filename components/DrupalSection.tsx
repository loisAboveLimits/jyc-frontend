import type { ReactNode } from "react";
import DrupalHtml from "@/components/DrupalHtml";
import { getSection } from "@/lib/drupalSection";
import type { Locale } from "@/lib/i18n";

type Props = {
  /** The Drupal "Section" node's id. null = always use the fallback. */
  nodeId: number | null;
  lang: Locale;
  /** Shown when the node doesn't exist, is unpublished, has no field_content, or Drupal can't be reached. */
  fallback?: ReactNode;
  /**
   * Where a form in the section (one without an `action`) sends to: the
   * visitor's email app opens with the message filled in, like <MailtoForm>.
   */
  mailto?: { to: string; subject: string };
};

/**
 * Outputs a Drupal "Section" node's field_content (HTML written in Drupal),
 * by node id: links open inside the site and figures in the CountUp markup
 * count up. The wrapper adds no box of its own, so the HTML (e.g. a whole
 * <section>…</section>) sits directly in the page.
 *
 *   <DrupalSection nodeId={15} lang={lang} />
 *   <DrupalSection nodeId={15} lang={lang} fallback={<Experience lang={lang} dict={dict} />} />
 *
 * The node's other fields (title, field_main_title, field_main_image) are
 * available from getSection() in lib/drupalSection.ts for custom layouts.
 */
export default async function DrupalSection({ nodeId, lang, fallback = null, mailto }: Props) {
  const section = nodeId === null ? null : await getSection(nodeId, lang);
  if (!section?.content) return <>{fallback}</>;
  return <DrupalHtml html={section.content} mailto={mailto} />;
}
