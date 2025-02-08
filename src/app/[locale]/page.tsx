import Hero from "@/components/homePage/hero/Hero";
import WeOffer from "@/components/homePage/weOffer/WeOffer";
import Catalog from "@/components/homePage/catalog/Catalog";
import Faq from "@/components/homePage/faq/Faq";
import Benefits from "@/components/homePage/benefits/Benefits";
import OrderConditions from "@/components/homePage/orderConditions/OrderConditions";
import { getProducts } from "@/utils/getProducts";
import { GET_ALL_DATA_QUERY } from "@/lib/datoCmsQueries";
import CheckoutPopUp from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import CartPopUp from "@/components/homePage/catalog/cart/CartPopUp";
import CartButton from "@/components/homePage/catalog/CartButton";
import Modal from "@/components/shared/modal/Modal";
import Backdrop from "@/components/shared/backdrop/Backdrop";

export default async function HomePage() {
  const res = await getProducts(GET_ALL_DATA_QUERY);

  const categories = res?.data?.allCategories;
  const shownOnMainProducts = res?.data?.shownOnMainProducts;
  const shownOnAddonsProducts = res?.data?.shownOnAddons;

  return (
    <>
      <Hero shownOnMainProducts={shownOnMainProducts} />
      <WeOffer />
      <Catalog
        categories={categories}
        shownOnAddonsProducts={shownOnAddonsProducts}
      />
      <OrderConditions />
      <Faq />
      <Benefits />
      <CartButton shownOnAddonsProducts={shownOnAddonsProducts} />
      <CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />
      <CheckoutPopUp />
      <Modal />
      <Backdrop />
    </>
  );
}
