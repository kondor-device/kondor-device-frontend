import { routing } from "@/i18n/routing";
import { Locale } from "@/types/locale";

// Path of a page in the given locale (the default locale has no prefix)
export const getLocalizedPath = (locale: Locale, path: string) =>
  locale === routing.defaultLocale
    ? path
    : `/${locale}${path === "/" ? "" : path}`;
