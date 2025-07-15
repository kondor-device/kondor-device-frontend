import { ComplectItem } from "@/types/productItem";
import ComplectationItem from "./ComplectationItem";
import PopUpTitle from "@/components/shared/titles/PopUpTitle";
import { useTranslations } from "next-intl";

interface ComplectProps {
  complectation: ComplectItem[];
}

export default function Complect({ complectation }: ComplectProps) {
  const t = useTranslations();
  return (
    <>
      {complectation.length > 0 ? (
        <div className="relative -z-20 mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <PopUpTitle>{t("homePage.catalog.set")}</PopUpTitle>
          <ul className="flex flex-col gap-y-5 laptop:gap-y-[8px]">
            {complectation.map((complectationItem, idx) => (
              <ComplectationItem key={idx} complectation={complectationItem} />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
