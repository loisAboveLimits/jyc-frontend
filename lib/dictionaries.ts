import type { Locale } from "./i18n";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  ar: () => import("@/dictionaries/ar.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

/** Server-side only: load the translations for a language. */
export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
