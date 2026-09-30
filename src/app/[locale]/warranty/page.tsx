import Warranty from "@/components/warrantyPage/Warranty";
import React from "react";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { buildPageMetadata } from "@/lib/metadata";
import SitePageSeo from "@/components/seo/SitePageSeo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata(locale, "warranty");
}

export default function WarrantyPage() {
  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Warranty />
      <SitePageSeo pageId="seoWarrantyPage" />
    </div>
  );
}
