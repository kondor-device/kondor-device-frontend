import { getProducts } from "@/utils/getProducts";
import { GET_ITEM_BY_SLUG_QUERY } from "@/lib/datoCmsQueries";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import AddonsSlider from "@/components/productPage/AddonsSlider";
import SimilarProductsSlider from "@/components/productPage/SimilarProductsSlider";
import Manual from "@/components/productPage/Manual";

interface ProductPageProps {
  params: Promise<{ product: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product } = await params;

  const res = await getProducts(GET_ITEM_BY_SLUG_QUERY, {
    slug: product,
  });

  return (
    <div className="pt-[82px] tabxl:pt-[113px]">
      <ProductInfo product={res.data.allItems[0]} />
      <AddonsSlider addons={res.data.shownOnAddons} />
      <SimilarProductsSlider />
      <Manual />
    </div>
  );
}
