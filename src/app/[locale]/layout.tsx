export const revalidate = 3600;

import "react-image-gallery/styles/css/image-gallery.css";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Montserrat } from "next/font/google";
import { Locale } from "@/types/locale";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  OG_LOCALE,
  SITE_ALLOW_INDEXING,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/constants";
import { GoogleTagManager } from "@next/third-parties/google";
import { getProducts } from "@/utils/getProducts";
import { GET_ALL_CATEGORIES_QUERY } from "@/lib/queries";
import CheckoutPopUp from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import CartPopUp from "@/components/homePage/catalog/cart/CartPopUp";
import CartButton from "@/components/homePage/catalog/CartButton";
import Modal from "@/components/shared/modal/Modal";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import { HeroUIProvider } from "@heroui/react";

import type { Viewport } from "next";
import UtmTracker from "@/components/shared/utmTracker/UtmTracker";
import { themeScript } from "@/components/shared/themeToggle/themeScript";
import ThemeKeeper from "@/components/shared/themeToggle/ThemeKeeper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Needed for env(safe-area-inset-*) on iPhone (home indicator / notches)
  viewportFit: "cover",
};

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const ogImage = {
    url: `${SITE_URL}${DEFAULT_OG_IMAGE.path}`,
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
    alt: SITE_NAME,
  };

  // Defaults for every page; pages fill in their own title, description, canonical and OG
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s | ${SITE_NAME}` },
    description: t("description"),
    ...(!SITE_ALLOW_INDEXING ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: Object.entries(OG_LOCALE)
        .filter(([item]) => item !== locale)
        .map(([, value]) => value),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", images: [ogImage.url] },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  const res = await getProducts(GET_ALL_CATEGORIES_QUERY);

  return (
    // suppressHydrationWarning: themeScript sets the theme class on <html> before hydration
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
        <meta
          name="google-site-verification"
          content="PF3UWCHQJTaiK4kBuPmhHe3Q1cmpEV3lc2OgQhWMx2E"
        />
        <meta
          name="google-site-verification"
          content="s43RG0W3LUO7omqeGQND7_Chus6gpjZZRK9V5N6dzQM"
        />
      </head>
      <body
        className={`${montserrat.variable} relative z-[1] flex min-h-screen flex-col antialiased text-12med laptop:text-24med`}
      >
        <NextIntlClientProvider messages={messages}>
          <HeroUIProvider className="flex min-h-screen flex-col">
            <UtmTracker />
            <ThemeKeeper />
            <Header categories={res?.data?.allCategories} />
            <main className="flex-1">{children}</main>
            <Footer categories={res?.data?.allCategories} />
            <CartButton shownOnAddonsProducts={res?.data?.shownOnAddons} />
            <CartPopUp shownOnAddonsProducts={res?.data?.shownOnAddons} />
            <CheckoutPopUp shownOnAddonsProducts={res?.data?.shownOnAddons ?? []} />
            <Modal />
            <Backdrop />
          </HeroUIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
