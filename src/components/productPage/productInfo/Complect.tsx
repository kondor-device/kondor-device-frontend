import { ComplectItem } from "@/types/productItem";
import ComplectationItem from "./ComplectationItem";
import PopUpTitle from "@/components/shared/titles/PopUpTitle";
import { useTranslations } from "next-intl";
import AnimationWrapper from "@/components/homePage/hero/AnimationWrapper";

interface ComplectProps {
  complectation: ComplectItem[];
}

const COMPLECT_ID = "complect";

export default function Complect({ complectation }: ComplectProps) {
  const t = useTranslations();
  return (
    <>
      {complectation.length > 0 ? (
        <div
          id={COMPLECT_ID}
          className="relative -z-20 mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px]  scroll-mt-[142px] tabxl:scroll-mt-[173px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
        >
          <AnimationWrapper
            sectionId={COMPLECT_ID}
            commonStyles={`transition duration-700 ease-slow `}
            visibleStyles="opacity-100 translate-x-0"
            unVisibleStyles="opacity-0 -translate-x-[50px]"
          >
            {" "}
            <PopUpTitle>{t("homePage.catalog.set")}</PopUpTitle>
          </AnimationWrapper>
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
