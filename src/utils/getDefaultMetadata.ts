import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function getDefaultMetadata(t: (key: string) => string): Metadata {
  return {
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
      locale: "uk_UA",
      siteName: "Kondor Device",
    },
  };
}
