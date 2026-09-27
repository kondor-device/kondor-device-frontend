import { getProducts } from "@/utils/getProducts";
import { GET_ITEM_BY_SLUG_QUERY } from "@/lib/queries";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import AddonsSlider from "@/components/productPage/AddonsSlider";
import SimilarProductsSlider from "@/components/productPage/SimilarProductsSlider";
import Manual from "@/components/productPage/Manual";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { CategoryItem } from "@/types/categoryItem";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import { notFound, permanentRedirect } from "next/navigation";
import { getDefaultMetadata, OG_LOCALES } from "@/utils/getDefaultMetadata";
import { getPageAlternates } from "@/utils/getPageAlternates";
import { Locale } from "@/types/locale";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ locale: Locale; category: string; product: string }>;
}

// Категорія товару могла з часом змінитись (переніс товару в іншу категорію
// в Sanity) — тоді URL з попередньою категорією в адресному рядку більше не
// канонічний і його треба 301-редіректнути на актуальний.
function findCategoryBySlug(categories: CategoryItem[], slug: string) {
  const category = categories?.find((cat) =>
    cat.items.some((item) => item.slug === slug),
  );

  if (!category) {
    return null;
  }

  const filteredItems = category.items
    .filter((item) => item.slug !== slug)
    .map((item) => ({ ...item, categorySlug: category.slug }));

  return {
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    items: filteredItems,
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, product } = await params;
  const t = await getTranslations("metadata");

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  const currentProduct = res?.data?.allItems[0];
  const category = findCategoryBySlug(res?.data?.allCategories, product);

  const defaultMetadata = getDefaultMetadata(t, locale);
  const title =
    currentProduct?.seoTitle || currentProduct?.name || defaultMetadata.title;
  const description =
    currentProduct?.seoDescription || defaultMetadata.description;

  return {
    title,
    description,
    alternates: getPageAlternates(
      locale,
      `/catalog/${category?.categorySlug ?? "unknown"}/${product}`,
    ),
    // openGraph of a page replaces the layout one, so it is filled in full
    openGraph: {
      title: title as string,
      description: description as string,
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: Object.values(OG_LOCALES).filter(
        (item) => item !== OG_LOCALES[locale],
      ),
      siteName: "Kondor Device",
      images: [
        {
          url:
            currentProduct?.seoImage?.url ||
            currentProduct?.coloropts[0]?.photos[0]?.url ||
            "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: "Kondor Device",
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [{ category, product }, t] = await Promise.all([
    params,
    getTranslations("breadcrumbs"),
  ]);

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  const currentProduct = res?.data?.allItems?.[0];

  if (!currentProduct) {
    notFound();
  }

  const similarProducts = findCategoryBySlug(res?.data?.allCategories, product);

  // Товар більше не належить категорії з URL (перенесений в адмінці) —
  // 301 на актуальний URL, щоб не втратити SEO-вагу старого посилання.
  if (similarProducts && similarProducts.categorySlug !== category) {
    permanentRedirect(`/catalog/${similarProducts.categorySlug}/${product}`);
  }

  return (
    <div className="pt-[60px] tabxl:pt-[113px] pb-[calc(104px+env(safe-area-inset-bottom,0px))] tabxl:pb-[88px]">
      <Breadcrumbs
        items={[
          { label: t("catalog"), href: "/catalog" },
          ...(similarProducts
            ? [
                {
                  label: similarProducts.categoryName,
                  href: `/catalog/${similarProducts.categorySlug}`,
                },
              ]
            : []),
          { label: currentProduct.name },
        ]}
        className="pt-4 laptop:pt-6"
      />
      <Suspense fallback={<Loader />}>
        <ProductInfo
          product={currentProduct}
          addons={res?.data?.shownOnAddons}
        />
        <AddonsSlider addons={res?.data?.shownOnAddons} />
        <SimilarProductsSlider
          similarProducts={similarProducts}
          addons={res?.data?.shownOnAddons}
        />
        <Manual product={currentProduct} />
      </Suspense>
    </div>
  );
}
