import Hero from "@/components/homePage/hero/Hero";
import WeOffer from "@/components/homePage/weOffer/WeOffer";
import Catalog from "@/components/homePage/catalog/Catalog";
import Faq from "@/components/homePage/faq/Faq";
import Benefits from "@/components/homePage/benefits/Benefits";
import OrderConditions from "@/components/homePage/orderConditions/OrderConditions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WeOffer />
      <OrderConditions />
      <Catalog />
      <Faq />
      <Benefits />
    </>
  );
}
