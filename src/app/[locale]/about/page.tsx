import { setRequestLocale } from "next-intl/server";
import About from "@/components/aboutPage/About";
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

  return buildPageMetadata(locale, "about");
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <About />
      <SitePageSeo pageId="seoAboutPage" />
    </div>
  );
}
