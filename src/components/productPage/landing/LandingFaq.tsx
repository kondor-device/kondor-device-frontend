import Image from "next/image";
import { useTranslations } from "next-intl";
import { LandingFaqBlock } from "@/types/productItem";
import { hasText } from "./utils";

// <details> keeps the accordion working without client JS and keeps the answers in the HTML
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
        <div className="mt-6">
          {items.map((item, index) => (
            <details
              key={index}
              className="group border-t border-fg/15 py-4 tab:py-6"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold text-[16px] tab:text-[18px] laptop:text-[22px] leading-[normal]">
                  {item.question}
                </h3>
                <Image
                  src="/images/landing/faq-chevron.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="shrink-0 rotate-180 group-open:rotate-0 transition-transform duration-300"
                />
              </summary>
              <p className="mt-4 laptop:mt-8 text-[14px] leading-[1.5] whitespace-pre-line">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
