import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";

export default function PriceFilter() {
  const t = useTranslations("catalogPage");

  return <FilterLayout title={t("price")}>TypeFilter</FilterLayout>;
}
