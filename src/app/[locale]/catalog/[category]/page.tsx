import {
  GET_CATEGORIES_BY_SLUGS_QUERY,
  GET_CATEGORY_SEO_QUERY,
  GET_ITEM_BY_SLUG_QUERY,
} from "@/lib/queries";
import { getProducts } from "@/utils/getProducts";
import Catalog from "@/components/catalogPage/Catalog";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { CategoryItem } from "@/types/categoryItem";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { getTranslations } from "next-intl/server";
import { buildMetadataFromSeo } from "@/lib/seo/pageSeo";

// Категорія за старим (до впровадження вкладеної URL-структури) посиланням
// /catalog/[product] могла бути товаром, а не категорією — 301-редіректимо
// на канонічний /catalog/[category]/[product], щоб не втратити SEO-вагу.
function findCategorySlugByProductSlug(
  categories: CategoryItem[],
  slug: string,
) {
  return categories?.find((cat) =>
    cat.items.some((item) => item.slug === slug),
  )?.slug;
}

interface CategoryPageProps {
  params: Promise<{ locale: Locale; category: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const [t, res] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getProducts(GET_CATEGORY_SEO_QUERY, { slug: category }),
  ]);

  const currentCategory = res?.data?.category;
  const name: string | undefined = currentCategory?.name;

  return buildMetadataFromSeo({
    seo: currentCategory?.seo,
    locale,
    path: `/catalog/${category}`,
    defaultTitle: name ? t("categoryTitle", { name }) : t("title"),
    defaultDescription: name
      ? t("categoryDescription", { name })
      : t("description"),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ category }, { type }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("breadcrumbs"),
  ]);

  // Сама сторінка завжди належить категорії з URL, але фільтр у сайдбарі
  // (як і на /catalog) може тимчасово показувати товари й інших категорій
  // через ?type= — тоді список товарів беремо звідти.
  const categoryArray = type ? type.split(",") : [category];

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  const currentCategory = (res?.data?.allCategories ?? []).find(
    (cat: { slug: string }) => cat.slug === category,
  );

  if (!currentCategory) {
    // Не категорія — можливо, це старе посилання на товар без категорії в URL
    const itemRes = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
      slug: category,
    });

    if (itemRes?.data?.allItems?.[0]) {
      const categorySlug = findCategorySlugByProductSlug(
        itemRes?.data?.allCategories,
        category,
      );

      if (categorySlug) {
        permanentRedirect(`/catalog/${categorySlug}/${category}`);
      }
    }

    notFound();
  }

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Breadcrumbs
        items={[
          { label: t("catalog"), href: "/catalog" },
          { label: currentCategory.name },
        ]}
        className="pt-4 laptop:pt-6"
      />
      <Suspense fallback={<Loader />}>
        <Catalog
          currentCategories={res.data.selectedCategories}
          allCategories={res.data.allCategories}
          shownOnAddons={res.data.shownOnAddons}
          defaultCategorySlug={category}
        />
      </Suspense>
    </div>
  );
}
