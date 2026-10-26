"use client";
import { useTranslations } from "next-intl";
import StarRating from "@/components/shared/StarRating";
import { formatRating } from "@/utils/formatRating";
import { scrollToProductSection } from "@/utils/productSectionNavigation";
import { REVIEWS_ID } from "./Reviews";

interface ProductRatingProps {
  ratingAvg?: number | null;
  ratingCount: number;
}

// Рейтинг під назвою товару; клік прокручує до секції відгуків
export default function ProductRating({
  ratingAvg,
  ratingCount,
}: ProductRatingProps) {
  const t = useTranslations("productPage.reviews");
  const avg = formatRating(ratingAvg);

  const scrollToReviews = () => scrollToProductSection(REVIEWS_ID);

  return (
    <button
      type="button"
      onClick={scrollToReviews}
      className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5 desk:mb-9 min-h-11 text-[15px] leading-6 tab:text-[17px] outline-none rounded-lg transition-colors hover:text-yellow focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
    >
      <StarRating
        value={avg}
        ariaLabel={t("ratingLabel", { value: avg })}
        starClassName="size-6 tab:size-7"
      />
      {ratingCount > 0 ? (
        <span className="font-bold text-fg">{avg.toFixed(1).replace(".", ",")}</span>
      ) : null}
      <span aria-hidden="true" className="h-5 w-px bg-fg/20" />
      <span className="underline underline-offset-4">{t("count", { count: ratingCount })}</span>
    </button>
  );
}
