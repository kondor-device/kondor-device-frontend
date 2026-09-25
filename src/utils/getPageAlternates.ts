import { routing } from "@/i18n/routing";
import { Locale } from "@/types/locale";

// Path of a page in the given locale (the default locale has no prefix)
export const getLocalizedPath = (locale: Locale, path: string) =>
  locale === routing.defaultLocale
    ? path
    : `/${locale}${path === "/" ? "" : path}`;

// canonical + hreflang alternates for `alternates` in page metadata.
// `path` is the page path without locale, e.g. "/" or "/catalog/kondor-orion-2".
export const getPageAlternates = (locale: Locale, path: string) => ({
  canonical: getLocalizedPath(locale, path),
  languages: {
    ...Object.fromEntries(
      routing.locales.map((item) => [item, getLocalizedPath(item, path)]),
    ),
    "x-default": getLocalizedPath(routing.defaultLocale, path),
  },
});
