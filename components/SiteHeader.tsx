import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ChatIcon, GlobeIcon, SearchIcon } from "@/components/icons";
import MainNav from "@/components/MainNav";
import OpeningHours from "@/components/OpeningHours";
import type { Dictionary } from "@/lib/dictionaries";
import { centerText } from "@/components/ui";
import { localizedHref, type Locale } from "@/lib/i18n";
import { mainPages } from "@/lib/pages";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Site-wide header: utility links, logo and the main navigation.
 * It sits on top of the page (transparent), so pages start underneath it.
 */
export default function SiteHeader({ lang, dict }: Props) {
  const items = mainPages.map((page) => ({
    key: page.key,
    label: dict.nav[page.key],
    href: localizedHref(lang, page.path),
    path: page.path,
  }));
  // const contactHref = localizedHref(lang, "/contact");
  const contactHref = "https://wa.me";

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto w-full max-w-[1340px] px-5 sm:px-8">
        {/* Utility links */}
        <div className="flex items-center justify-end gap-4 pt-2.5 text-sm text-white/90 sm:gap-10">
          <OpeningHours
            lang={lang}
            labels={{
              ...dict.header.hours,
              title: dict.header.openingHours,
              address: dict.footer.address,
              close: dict.common.close,
            }}
          />
          <Link href={contactHref} className={`flex min-h-11 items-center gap-2 hover:text-white ${centerText}`} target="_new">
            <ChatIcon className="size-4" />
            {dict.header.chat}
          </Link>
        </div>

        {/* Logo + navigation */}
        <div className="mt-1 flex items-center justify-between gap-3 sm:gap-6 xl:gap-16">
          <Link href={localizedHref(lang, "/")} className="shrink-0">
            <Image
              src="/images/logo.svg"
              alt={dict.header.logoAlt}
              width={170}
              height={50}
              priority
              className="h-9 w-auto sm:h-[50px]"
            />
          </Link>

          <MainNav
            items={items}
            navLabel={dict.meta.navLabel}
            openLabel={dict.header.openMenu}
            closeLabel={dict.header.closeMenu}
          >
            <button
              type="button"
              aria-label={dict.header.search}
              className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10"
            >
              <SearchIcon />
            </button>
            <span aria-hidden="true" className="hidden h-6 w-px bg-white/60 sm:block" />
            <LanguageSwitcher
              lang={lang}
              ariaLabel={dict.switcher.ariaLabel}
              className="flex h-11 items-center gap-2 rounded-full px-2.5 pt-[0.24em] text-[15px] font-semibold text-white hover:bg-white/10 [&>svg]:-translate-y-[0.12em]"
            >
              <GlobeIcon />
              {dict.switcher.label}
            </LanguageSwitcher>
          </MainNav>
        </div>
      </div>
    </header>
  );
}
