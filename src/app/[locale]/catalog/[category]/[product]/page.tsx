import { getProducts } from "@/utils/getProducts";
import { GET_ITEM_BY_SLUG_QUERY } from "@/lib/queries";
import BundleInfo from "@/components/bundlePage/BundleInfo";
import { Bundle } from "@/types/bundle";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import AddonsSlider from "@/components/productPage/AddonsSlider";
import SimilarProductsSlider from "@/components/productPage/SimilarProductsSlider";
import Manual from "@/components/productPage/Manual";
import ProductLanding from "@/components/productPage/landing/ProductLanding";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import JsonLd from "@/components/shared/JsonLd";
import { bundleJsonLd, productJsonLd } from "@/lib/seo/jsonLd";
import { getLocalizedPath } from "@/utils/getLocalizedPath";
import { CategoryItem } from "@/types/categoryItem";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import { notFound, permanentRedirect } from "next/navigation";
import {
  absoluteUrl,
  buildMetadataFromSeo,
  truncateText,
} from "@/lib/seo/pageSeo";
import { toPlainDescription } from "@/lib/feed";
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

// "Мишка" + "Kondor Astra PRO" -> "Мишка Kondor Astra PRO"; the general name is skipped
// when the name already contains it
function getProductTitle(generalname: string | undefined, name: string) {
  const general = generalname?.replace(/\s+/g, " ").trim();
  const title = name.replace(/\s+/g, " ").trim();

  if (!general || title.toLowerCase().includes(general.toLowerCase())) {
    return title;
  }

  return `${general} ${title}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, category: categorySlug, product } = await params;
  const [t, res] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getProducts(GET_ITEM_BY_SLUG_QUERY, { slug: product }),
  ]);

  const currentProduct = res?.data?.allItems?.[0];
  // Not a product — maybe a bundle (set) with this slug (only available ones are returned)
  const currentBundle: Bundle | undefined = currentProduct
    ? undefined
    : res?.data?.bundle;
  const category = findCategoryBySlug(res?.data?.allCategories, product);

  const source = currentProduct ?? currentBundle;
  const title = currentProduct
    ? getProductTitle(currentProduct.generalname, currentProduct.name)
    : currentBundle?.name;

  const description = truncateText(
    toPlainDescription(source?.description ?? null),
  );

  return buildMetadataFromSeo({
    seo: source && {
      metaTitle: source.seoTitle,
      metaDescription: source.seoDescription,
      opengraphImage: source.seoImage,
    },
    locale,
    // Same URL the page redirects to when the category in the address is outdated
    path: `/catalog/${category?.categorySlug ?? categorySlug}/${product}`,
    defaultTitle: title || t("title"),
    defaultDescription: description || t("description"),
    fallbackImageUrl:
      currentProduct?.coloropts?.[0]?.photos?.[0]?.url ||
      currentBundle?.photos?.[0]?.url ||
      currentBundle?.components?.[0]?.colorOpt?.photos?.[0]?.url,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [{ locale, category, product }, t] = await Promise.all([
    params,
    getTranslations("breadcrumbs"),
  ]);

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  const currentProduct = res?.data?.allItems?.[0];
  const currentBundle: Bundle | undefined = res?.data?.bundle ?? undefined;

  // Neither a product nor an available bundle (a set disappears while any of its
  // components is out of stock: it cannot be bought)
  if (!currentProduct && !currentBundle) {
    notFound();
  }

  const similarProducts = findCategoryBySlug(res?.data?.allCategories, product);

  // Товар більше не належить категорії з URL (перенесений в адмінці) —
  // 301 на актуальний URL, щоб не втратити SEO-вагу старого посилання.
  if (similarProducts && similarProducts.categorySlug !== category) {
    permanentRedirect(`/catalog/${similarProducts.categorySlug}/${product}`);
  }

  // Canonical address of the page (the category in the URL was checked above)
  const pageUrl = absoluteUrl(
    getLocalizedPath(
      locale,
      `/catalog/${similarProducts?.categorySlug ?? category}/${product}`,
    ),
  );

  const breadcrumbs = (
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
        { label: (currentProduct ?? currentBundle)!.name },
      ]}
      className="pt-4 laptop:pt-6"
    />
  );

  if (!currentProduct && currentBundle) {
    // Similar to a set: the other sets of its category, then the products of the categories
    // its components belong to (the components themselves are already on the page)
    const componentIds = new Set(
      currentBundle.components.map((component) => component.itemId),
    );
    const componentCategories = new Set(
      currentBundle.components.map((component) => component.categorySlug),
    );
    const related = ((res?.data?.allCategories ?? []) as CategoryItem[])
      .filter((cat) => componentCategories.has(cat.slug))
      .flatMap((cat) =>
        cat.items
          .filter(
            (item) =>
              item.kind !== "bundle" &&
              item.showonmain !== true &&
              !componentIds.has(item.id),
          )
          .map((item) => ({ ...item, categorySlug: cat.slug })),
      );
    const bundleSimilarProducts = {
      categoryId: similarProducts?.categoryId ?? "",
      categoryName: similarProducts?.categoryName ?? "",
      items: [...(similarProducts?.items ?? []), ...related],
    };

    return (
      <div className="pt-[60px] tabxl:pt-[113px] pb-[calc(104px+env(safe-area-inset-bottom,0px))] tabxl:pb-[88px]">
        <JsonLd data={bundleJsonLd({ bundle: currentBundle, url: pageUrl })} />
        <Suspense fallback={<Loader />}>
          <BundleInfo
            bundle={currentBundle}
            addons={res?.data?.shownOnAddons}
            breadcrumbs={breadcrumbs}
          />
          <AddonsSlider addons={res?.data?.shownOnAddons} />
          <SimilarProductsSlider
            similarProducts={bundleSimilarProducts}
            addons={res?.data?.shownOnAddons}
          />
        </Suspense>
      </div>
    );
  }

  if (!currentProduct) {
    notFound();
  }

  return (
    <div className="pt-[60px] tabxl:pt-[113px] pb-[calc(40px+env(safe-area-inset-bottom,0px))] tabxl:pb-[88px]">
      <JsonLd
        data={productJsonLd({
          product: currentProduct,
          url: pageUrl,
          title: getProductTitle(currentProduct.generalname, currentProduct.name),
          categoryName: similarProducts?.categoryName,
        })}
      />
      <Suspense fallback={<Loader />}>
        <ProductInfo
          product={currentProduct}
          addons={res?.data?.shownOnAddons}
          breadcrumbs={breadcrumbs}
        />
        <AddonsSlider addons={res?.data?.shownOnAddons} />
        <SimilarProductsSlider
          similarProducts={similarProducts}
          addons={res?.data?.shownOnAddons}
        />
        <Manual product={currentProduct} />
        <ProductLanding landing={currentProduct.landing} />
      </Suspense>
    </div>
  );
}
