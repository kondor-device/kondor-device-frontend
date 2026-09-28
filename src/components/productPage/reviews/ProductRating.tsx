"use client";
import { useTranslations } from "next-intl";
import StarRating from "@/components/shared/StarRating";
import { formatRating } from "@/utils/formatRating";
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

  const scrollToReviews = () =>
    document
      .getElementById(REVIEWS_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <button
      type="button"
      onClick={scrollToReviews}
      className="flex items-center gap-x-2 mb-5 desk:mb-9 text-12med desk:text-16med outline-none transition duration-300 ease-out laptop:hover:text-yellow focus-visible:text-yellow"
    >
      <StarRating
        value={avg}
        ariaLabel={t("ratingLabel", { value: avg })}
        starClassName="size-4 desk:size-5"
      />
      {ratingCount > 0 ? (
        <span className="font-bold">{avg.toFixed(1)}</span>
      ) : null}
      <span className="text-grey">({t("count", { count: ratingCount })})</span>
    </button>
  );
}
