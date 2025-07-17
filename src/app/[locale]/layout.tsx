import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Montserrat } from "next/font/google";
import { Locale } from "@/types/locale";
import "./globals.css";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { generatePageMetaData } from "@/utils/generatePageMetaData";
import { GoogleTagManager } from "@next/third-parties/google";
import { getProducts } from "@/utils/getProducts";
import { GET_ALL_CATEGORIES_QUERY } from "@/lib/datoCmsQueries";
import CheckoutPopUp from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import CartPopUp from "@/components/homePage/catalog/cart/CartPopUp";
import CartButton from "@/components/homePage/catalog/CartButton";
import Modal from "@/components/shared/modal/Modal";
import Backdrop from "@/components/shared/backdrop/Backdrop";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = await params;
  return generatePageMetaData({
    locale,
    namespace: "metadata",
    canonical: "/",
  });
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
    <html lang={locale} className="scroll-smooth">
      <head>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      </head>
      <body
        className={`${montserrat.variable} flex min-h-screen flex-col antialiased text-12med laptop:text-24med`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header categories={res?.data?.allCategories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartButton shownOnAddonsProducts={res?.data?.shownOnAddons} />
          <CartPopUp shownOnAddonsProducts={res?.data?.shownOnAddons} />
          <CheckoutPopUp />
          <Modal />
          <Backdrop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
