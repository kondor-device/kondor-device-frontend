import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";

export default function AvailabilityFilter() {
  const t = useTranslations("catalogPage");

  return <FilterLayout title={t("availability")}>TypeFilter</FilterLayout>;
}
