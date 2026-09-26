import { Metadata } from "next";
import { Locale } from "@/types/locale";

const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

export const OG_LOCALES: Record<Locale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
};

export function getDefaultMetadata(
  t: (key: string) => string,
  locale: Locale = "uk"
): Metadata {
  const alternateLocales = (Object.keys(OG_LOCALES) as Locale[])
    .filter((item) => item !== locale)
    .map((item) => OG_LOCALES[item]);

  return {
    ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${SITE_URL}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Kondor Device",
        },
      ],
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: alternateLocales,
      siteName: "Kondor Device",
    },
  };
}
