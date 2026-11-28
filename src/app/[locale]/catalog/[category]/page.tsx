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
import { notFound, permanentRedirect, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import {
  LEGACY_CATEGORY_REDIRECTS,
  REMOVED_PRODUCT_REDIRECTS,
} from "@/constants/legacyRedirects";
import { getTranslations } from "next-intl/server";
import { buildMetadataFromSeo } from "@/lib/seo/pageSeo";
import SchemaJsonFromSeo from "@/components/seo/SchemaJsonFromSeo";
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
  searchParams: Promise<PageSearchParams>;
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
  const [{ locale, category }, query, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("breadcrumbs"),
  ]);
  const type = typeof query.type === "string" ? query.type : undefined;

  // Сама сторінка завжди належить категорії з URL, але фільтр у сайдбарі
  // (як і на /catalog) може тимчасово показувати товари й інших категорій
  // через ?type= — тоді список товарів беремо звідти.
  const categoryArray = type ? type.split(",") : [category];

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  const allCategories: CategoryItem[] = res?.data?.allCategories ?? [];
  const currentCategory = allCategories.find((cat) => cat.slug === category);
  const currentCategorySlugs = allCategories.map((cat) => cat.slug);

  if (!currentCategory) {
    // A category that was merged into another one: send its old address there.
    // Keep the language and everything after "?" (utm_*, gclid, fbclid).
    // This must stay before the product lookup below: some of the old category slugs are
    // also slugs of the home-page banner items, which are not products.
    const mergedInto = LEGACY_CATEGORY_REDIRECTS.get(category);
    if (mergedInto) {
      permanentRedirect(
        withQuery(
          getLocalizedPath(locale, `/catalog/${mergedInto}`),
          withCurrentCategoryFilter(query, currentCategorySlugs),
        ),
      );
    }

    // Не категорія — можливо, це старе посилання на товар без категорії в URL
    const itemRes = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
      slug: category,
    });

    const item = itemRes?.data?.allItems?.[0];
    if (item) {
      // The category that lists the product, else the one set on the product itself
      // (a product hidden from the catalog is in no list, but its page still exists).
      // The home-page banner items have neither and fall through to the 404.
      const categorySlug =
        findCategorySlugByProductSlug(itemRes?.data?.allCategories, category) ??
        item.ownCategorySlug;

      if (categorySlug) {
        // Keep the language and everything after "?" (color, utm_*, gclid, fbclid)
        permanentRedirect(
          withQuery(
            getLocalizedPath(locale, `/catalog/${categorySlug}/${category}`),
            query,
          ),
        );
      }
    }

    // A product that no longer exists: its category instead of a 404. Temporary, so the
    // target can be changed when the product returns or gets a successor.
    const removedProductCategory = REMOVED_PRODUCT_REDIRECTS.get(category);
    if (removedProductCategory) {
      redirect(
        withQuery(
          getLocalizedPath(locale, `/catalog/${removedProductCategory}`),
          query,
        ),
      );
    }

    notFound();
  }

  // An old filter link naming merged categories would show an empty list
  if (type && replaceMergedCategories(type, currentCategorySlugs) !== type) {
    permanentRedirect(
      withQuery(
        getLocalizedPath(locale, `/catalog/${category}`),
        withCurrentCategoryFilter(query, currentCategorySlugs),
      ),
    );
  }

  // Same request as in generateMetadata (cached for the render)
  const seoRes = await getProducts(GET_CATEGORY_SEO_QUERY, { slug: category });

  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <SchemaJsonFromSeo seo={seoRes?.data?.category?.seo} />
      <Breadcrumbs
        items={[
          { label: t("catalog"), href: "/catalog" },
          { label: currentCategory.name },
        ]}
        className="pt-4 laptop:pt-6"
      />
      <CategoryHeading
        pageKey={category}
        fallbackTitle={currentCategory.name}
      />
      <Suspense fallback={<Loader />}>
        <Catalog
          currentCategories={res.data.selectedCategories}
          allCategories={res.data.allCategories}
          shownOnAddons={res.data.shownOnAddons}
          defaultCategorySlug={category}
        />
      </Suspense>
      <CategorySeoText pageKey={category} />
    </div>
  );
}
