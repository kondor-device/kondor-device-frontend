import Delivery from "@/components/deliveryPage/Delivery";
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

  return buildPageMetadata(locale, "delivery");
}

export default function DeliveryPage() {
  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Delivery />
      <SitePageSeo pageId="seoDeliveryPage" />
    </div>
  );
}
