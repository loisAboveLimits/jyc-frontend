/**
 * The main pages of the site, in menu order.
 * `key` is the name used in dictionaries/*.json under "nav".
 * `path` is the English URL; Arabic is the same path under /ar.
 */
export const mainPages = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "yachtClub", path: "/yacht-club" },
  { key: "marina", path: "/marina" },
  { key: "academy", path: "/academy" },
  { key: "blogs", path: "/blogs" },
  { key: "leasing", path: "/leasing" },
  { key: "contact", path: "/contact" },
] as const;

export type MainPageKey = (typeof mainPages)[number]["key"];

export const getMainPage = (key: MainPageKey) =>
  mainPages.find((page) => page.key === key)!;
