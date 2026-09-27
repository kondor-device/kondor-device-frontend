import { useTranslations } from "next-intl";
import PageTitle from "../shared/titles/PageTitle";
import Breadcrumbs from "../shared/breadcrumbs/Breadcrumbs";
import DeliveryMethods from "./DeliveryMethods";
import PaymentMethods from "./PaymentMethods";

export default function Delivery() {
  const t = useTranslations("deliveryPage");

  return (
    <>
      <PageTitle>{t("title")}</PageTitle>
      <Breadcrumbs items={[{ label: t("title") }]} className="pt-4 laptop:pt-6" />
      <DeliveryMethods />
      <PaymentMethods />
    </>
  );
}
