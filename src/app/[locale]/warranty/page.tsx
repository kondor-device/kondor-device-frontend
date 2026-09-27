import Warranty from "@/components/warrantyPage/Warranty";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import React from "react";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { getPageAlternates } from "@/utils/getPageAlternates";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: getPageAlternates(locale, "/warranty"),
  };
}

export default async function WarrantyPage() {
  const t = await getTranslations("warrantyPage");

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs
        items={[{ label: t("title") }]}
        className="pt-4 laptop:pt-6"
      />
      <Warranty />
    </div>
  );
}
