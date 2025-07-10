import { useTranslations } from "next-intl";

export default function DeliveryMethods() {
  const t = useTranslations("deliveryPage.deliveryMethods");

  return (
    <section className="flex flex-col gap-y-5 container max-w-[1920px] py-5 laptop:py-[100px]">
      <h2 className="text-14semi laptop:text-28semi">{t("title")}</h2>
      <ul className="flex flex-col gap-y-5 list-disc pl-4 laptop:pl-6">
        <li className="text-12reg laptop:text-24reg">{t("one")}</li>
        <li className="text-12reg laptop:text-24reg">{t("two")}</li>
      </ul>
    </section>
  );
}
