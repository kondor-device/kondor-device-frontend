import { getProducts } from "@/utils/getProducts";
import { GET_ITEM_BY_SLUG_QUERY } from "@/lib/datoCmsQueries";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import AddonsSlider from "@/components/productPage/AddonsSlider";
import SimilarProductsSlider from "@/components/productPage/SimilarProductsSlider";
import Manual from "@/components/productPage/Manual";
import { CategoryItem } from "@/types/categoryItem";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ product: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product } = await params;
  const t = await getTranslations("metadata");

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  const currentProduct = res?.data?.allItems[0];

  return {
    title:
      currentProduct?.seoTitle ||
      currentProduct?.name ||
      getDefaultMetadata(t).title,
    description:
      currentProduct?.seoDescription || getDefaultMetadata(t).description,
    openGraph: {
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
  const { product } = await params;

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  function findCategoryBySlug(categories: CategoryItem[], slug: string) {
    // Знаходимо категорію, де є товар з потрібним slug
    const category = categories.find((cat) =>
      cat.items.some((item) => item.slug === slug)
    );

    if (!category) {
      return null; // категорія не знайдена
    }

    // Відфільтровуємо товари без поточного
    const filteredItems = category.items.filter((item) => item.slug !== slug);

    return {
      categoryId: category.id,
      categoryName: category.name,
      items: filteredItems,
    };
  }

  const similarProducts = findCategoryBySlug(res?.data?.allCategories, product);

  return (
    <div className="pt-[82px] tabxl:pt-[113px] pb-8 tabxl:pb-[88px]">
      <Suspense fallback={<Loader />}>
        <ProductInfo
          product={res?.data?.allItems[0]}
          addons={res?.data?.shownOnAddons}
        />
        <AddonsSlider addons={res?.data?.shownOnAddons} />
        <SimilarProductsSlider
          similarProducts={similarProducts}
          addons={res?.data?.shownOnAddons}
        />
        <Manual product={res?.data?.allItems[0]} />
      </Suspense>
    </div>
  );
}
