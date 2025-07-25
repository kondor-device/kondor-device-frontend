import { useTranslations } from "next-intl";
import PageTitle from "../shared/titles/PageTitle";
import DeliveryMethods from "./DeliveryMethods";
import PaymentMethods from "./PaymentMethods";

export default function Delivery() {
  const t = useTranslations("deliveryPage");

  return (
    <>
      <PageTitle>{t("title")}</PageTitle>
      <DeliveryMethods />
      <PaymentMethods />
    </>
  );
}
