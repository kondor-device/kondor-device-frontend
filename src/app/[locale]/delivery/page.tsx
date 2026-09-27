import Delivery from "@/components/deliveryPage/Delivery";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
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
    alternates: getPageAlternates(locale, "/delivery"),
  };
}

export default async function DeliveryPage() {
  const t = await getTranslations("deliveryPage");

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs
        items={[{ label: t("title") }]}
        className="pt-4 laptop:pt-6"
      />
      <Delivery />
    </div>
  );
}
