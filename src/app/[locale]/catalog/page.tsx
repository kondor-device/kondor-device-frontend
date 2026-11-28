import { GET_CATEGORIES_BY_SLUGS_QUERY } from "@/lib/queries";
import { getProducts } from "@/utils/getProducts";
import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { buildPageMetadata } from "@/lib/metadata";
import SitePageSeo from "@/components/seo/SitePageSeo";
import { getTranslations } from "next-intl/server";
import { permanentRedirect } from "next/navigation";
import { CategoryItem } from "@/types/categoryItem";
import { getLocalizedPath } from "@/utils/getLocalizedPath";
import { PageSearchParams, withQuery } from "@/utils/withQuery";
import {
  replaceMergedCategories,
  withCurrentCategoryFilter,
} from "@/utils/legacyCategoryFilter";
import {
  CategoryHeading,
  CategorySeoText,
} from "@/components/catalogPage/CategorySeo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

interface CatalogPageProps extends PageProps {
  searchParams: Promise<PageSearchParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata(locale, "catalog");
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const [{ locale }, query, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("breadcrumbs"),
  ]);
  const type = typeof query.type === "string" ? query.type : undefined;

  const categoryArray = type ? type.split(",") : [];

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  // An old filter link naming merged categories (/catalog?type=klaviaturi-orion&…) would
  // show an empty list. Keep the language and the rest of the query string.
  const currentCategorySlugs = (
    (res?.data?.allCategories ?? []) as CategoryItem[]
  ).map((cat) => cat.slug);
  if (type && replaceMergedCategories(type, currentCategorySlugs) !== type) {
    permanentRedirect(
      withQuery(
        getLocalizedPath(locale, "/catalog"),
        withCurrentCategoryFilter(query, currentCategorySlugs),
      ),
    );
  }

  // Без ?type= в URL (перший захід на /catalog) показуємо всі категорії —
  // `selectedCategories` для порожнього масиву слагів завжди порожній.
  const currentCategories = type
    ? res.data.selectedCategories
    : res.data.allCategories;

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs items={[{ label: t("catalog") }]} className="pt-4 laptop:pt-6" />
      <CategoryHeading pageKey="catalog" fallbackTitle={t("catalog")} />
      <Suspense fallback={<Loader />}>
        <Catalog
          currentCategories={currentCategories}
          allCategories={res.data.allCategories}
          shownOnAddons={res.data.shownOnAddons}
        />
      </Suspense>
      <CategorySeoText pageKey="catalog" />
      <SitePageSeo pageId="seoCatalogPage" />
    </div>
  );
}
