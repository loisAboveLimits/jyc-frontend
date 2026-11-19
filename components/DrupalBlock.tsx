import type { ReactNode } from "react";
import DrupalHtml, { type DrupalHtmlWebform } from "@/components/DrupalHtml";
import { getBlock } from "@/lib/drupalBlock";
import type { Locale } from "@/lib/i18n";

type Props = {
  /** The content block's id (Block layout > Content blocks), or its UUID. null = always use the fallback. */
  id: number | string | null;
  lang: Locale;
  /** Shown when the block doesn't exist, is unpublished, has no body, or Drupal can't be reached. */
  fallback?: ReactNode;
  /**
   * Where a form in the block (one without an `action`) sends to: the
   * visitor's email app opens with the message filled in, like <MailtoForm>.
   * A form can set its own subject with data-subject="…".
   */
  mailto?: { to: string; subject: string };
  /**
   * Save a form in the block (one without an `action`) in this Drupal webform
   * instead, e.g. { id: "newsletter", lang, messages }. Takes priority over `mailto`.
   */
  webform?: DrupalHtmlWebform;
};

/**
 * A Drupal content block, by id: its body HTML is rendered as written in
 * Drupal (links open inside the site; figures in the CountUp markup count up).
 * The wrapper adds no box of its own, so the block's HTML sits directly in
 * the parent layout (e.g. as a column of the footer grid).
 *
 *   <DrupalBlock id={2} lang={lang} fallback={<QuickLinks … />} />
 */
export default async function DrupalBlock({ id, lang, fallback = null, mailto, webform }: Props) {
  const block = id === null ? null : await getBlock(id, lang);
  if (!block?.body) return <>{fallback}</>;
  return <DrupalHtml html={block.body} mailto={mailto} webform={webform} />;
}
