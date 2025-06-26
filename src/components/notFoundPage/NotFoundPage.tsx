import PageTitle from "../shared/titles/PageTitle";
import Button from "../shared/buttons/Button";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {
  const t = useTranslations("");
  const locale = useLocale();

  return (
    <div className="pt-[82px] tabxl:pt-[113px]">
      <PageTitle>{t("notFoundPage.info")}</PageTitle>
      <section className="container max-w-[1920px] py-[100px]">
        <Link href="/" locale={locale} className="block w-fit mx-auto">
          <Button>{t("buttons.goHome")}</Button>
        </Link>
      </section>
    </div>
  );
}
