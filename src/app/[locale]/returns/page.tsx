import Returns from "@/components/returnsPage/Returns";
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

  return buildPageMetadata(locale, "returns");
}

export default function ReturnsPage() {
  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Returns />
      <SitePageSeo pageId="seoReturnsPage" />
    </div>
  );
}
