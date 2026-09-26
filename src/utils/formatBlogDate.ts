import { Locale } from "@/types/locale";

const INTL_LOCALES: Record<Locale, string> = {
  uk: "uk-UA",
  ru: "ru-RU",
};

export const formatBlogDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
