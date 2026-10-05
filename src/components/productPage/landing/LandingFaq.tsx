import { useTranslations } from "next-intl";
import { LandingFaqBlock } from "@/types/productItem";
import LandingFaqItem from "./LandingFaqItem";
import { hasText } from "./utils";

// The accordion rows are client components (smooth open / close); the answers stay in the HTML
export default function LandingFaq({ faq }: { faq: LandingFaqBlock }) {
  const t = useTranslations("productPage.landing");

  const items = (faq.items ?? []).filter(
    (item) => hasText(item.question) && hasText(item.answer),
  );

  if (items.length === 0) return null;

  return (
    <div className="py-[60px] tab:py-[70px] laptop:py-[100px] text-fg">
      <div>
        <h2 className="text-center font-actay uppercase text-[18px] tab:text-[22px] laptop:text-[26px] leading-[normal]">
          {t("faqTitle")}
        </h2>
        <div className="mt-6 laptop:mt-8">
          {items.map((item, index) => (
            <LandingFaqItem
              key={index}
              question={item.question as string}
              answer={item.answer as string}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
