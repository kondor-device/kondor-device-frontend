import OrderConfirmation from "@/components/orderConfirmationPage/OrderConfirmation";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata(locale, "orderConfirmation");
}

export default async function OrderConfirmationPage() {
  const t = await getTranslations("notifications.successful");

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs
        items={[{ label: t("title") }]}
        className="pt-4 laptop:pt-6"
      />
      <OrderConfirmation />
    </div>
  );
}
