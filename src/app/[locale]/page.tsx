import Hero from "@/components/homePage/hero/Hero";
import WeOffer from "@/components/homePage/weOffer/WeOffer";
import Catalog from "@/components/homePage/catalog/Catalog";
import Faq from "@/components/homePage/faq/Faq";
import Benefits from "@/components/homePage/benefits/Benefits";
import OrderConditions from "@/components/homePage/orderConditions/OrderConditions";
import { getProducts } from "@/utils/getProducts";
import { GET_ALL_DATA_QUERY } from "@/lib/queries";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/shared/JsonLd";
import SitePageSeo from "@/components/seo/SitePageSeo";
import {
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonLd";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata(locale, "home", { absoluteTitle: true });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [res, t] = await Promise.all([
    getProducts(GET_ALL_DATA_QUERY),
    getTranslations({ locale, namespace: "homePage.faq" }),
  ]);

  // The same questions and answers the FAQ block shows
  const faq = faqJsonLd(
    Object.values(
      t.raw("list") as Record<string, { title: string; answer: string }>,
    ).map(({ title, answer }) => ({ question: title, answer })),
  );

  const categories = res?.data?.allCategories;
  const shownOnMainProducts = res?.data?.shownOnMainProducts;
  const shownOnAddonsProducts = res?.data?.shownOnAddons;

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(locale),
          ...(faq ? [faq] : []),
        ]}
      />
      <SitePageSeo pageId="seoHomePage" />
      <Hero shownOnMainProducts={shownOnMainProducts} categories={categories} />
      <WeOffer />
      <Catalog
        categories={categories}
        shownOnAddonsProducts={shownOnAddonsProducts}
      />
      <OrderConditions />
      <Faq />
      <Benefits />
    </div>
  );
}
