import { useTranslations } from "next-intl";
import { ProductLanding } from "@/types/productItem";
import { hasText } from "./utils";

type Faq = NonNullable<ProductLanding["faq"]>;

// <details> keeps the accordion working without client JS and keeps the answers in the HTML
export default function LandingFaq({ faq }: { faq: Faq }) {
  const t = useTranslations("productPage.landing");

  const items = (faq.items ?? []).filter(
    (item) => hasText(item.question) && hasText(item.answer),
  );

  if (items.length === 0) return null;

  return (
    <div className="p-5 tab:p-10 desk:py-[60px] desk:px-[100px] bg-white text-dark">
      <h2 className="text-center text-16bold tab:text-20bold uppercase">
        {t("faqTitle")}
      </h2>
      <div className="mt-5 tab:mt-8 max-w-[900px] mx-auto divide-y divide-dark/15 border-y border-dark/15">
        {items.map((item, index) => (
          <details key={index} className="group py-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-12bold tab:text-16bold">{item.question}</h3>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className="shrink-0 transition-transform duration-300 group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-12med tab:text-14med opacity-70 whitespace-pre-line">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
