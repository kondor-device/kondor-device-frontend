import { GET_CATEGORIES_BY_SLUGS_QUERY } from "@/lib/queries";
import { getProducts } from "@/utils/getProducts";
import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { getPageAlternates } from "@/utils/getPageAlternates";
import { getTranslations } from "next-intl/server";

interface CatalogPageProps {
  searchParams: Promise<{ type?: string }>;
}

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: getPageAlternates(locale, "/catalog"),
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [{ type }, t] = await Promise.all([
    searchParams,
    getTranslations("breadcrumbs"),
  ]);

  const categoryArray = type ? type.split(",") : [];

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs items={[{ label: t("catalog") }]} className="pt-4 laptop:pt-6" />
      <Suspense fallback={<Loader />}>
        <Catalog
          currentCategories={res.data.selectedCategories}
          allCategories={res.data.allCategories}
          shownOnAddons={res.data.shownOnAddons}
        />
      </Suspense>
    </div>
  );
}
