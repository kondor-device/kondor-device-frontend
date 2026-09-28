"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import AnimationWrapper from "@/components/homePage/hero/AnimationWrapper";
import Button from "@/components/shared/buttons/Button";
import StarRating from "@/components/shared/StarRating";
import { useModalStore } from "@/store/modalStore";
import { formatRating } from "@/utils/formatRating";
import { Review } from "@/types/productItem";
import WriteReviewForm, {
  WRITE_REVIEW_MODAL,
  WRITE_REVIEW_MODAL_STYLES,
} from "./WriteReviewForm";

export const REVIEWS_ID = "reviews";

const VISIBLE_COUNT = 3;

interface ReviewsProps {
  itemId: string;
  reviews: Review[];
  ratingAvg?: number | null;
  ratingCount: number;
}

export default function Reviews({
  itemId,
  reviews,
  ratingAvg,
  ratingCount,
}: ReviewsProps) {
  const t = useTranslations("productPage.reviews");
  const locale = useLocale();
  const openModal = useModalStore((state) => state.openModal);
  const [showAll, setShowAll] = useState(false);

  const avg = formatRating(ratingAvg);
  const visible = showAll ? reviews : reviews.slice(0, VISIBLE_COUNT);

  // Явна часова зона, щоб дата збігалась на сервері й у браузері (гідрація)
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-RU" : "uk-UA",
    { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" },
  );

  const onWriteReview = () =>
    openModal(
      WRITE_REVIEW_MODAL,
      <WriteReviewForm itemId={itemId} />,
      WRITE_REVIEW_MODAL_STYLES,
    );

  return (
    <div
      id={REVIEWS_ID}
      className="mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[142px] tabxl:scroll-mt-[173px] bg-surface rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
    >
      <AnimationWrapper
        sectionId={REVIEWS_ID}
        commonStyles="transition duration-700 ease-slow"
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[24px]"
      >
        <div className="mb-5">
          <div>
            <h2 className="mb-2 text-14bold desk:text-24bold">{t("title")}</h2>
            {ratingCount > 0 ? (
              <div className="flex items-center gap-x-3">
                <span className="text-24bold leading-none">
                  {avg.toFixed(1)}
                </span>
                <StarRating
                  value={avg}
                  ariaLabel={t("ratingLabel", { value: avg })}
                  starClassName="size-5 desk:size-6"
                />
                <span className="text-12med desk:text-16med text-grey">
                  {t("count", { count: ratingCount })}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="pb-1 text-left text-12med desk:text-18med text-grey">
            {t("empty")}
          </p>
        ) : (
          <>
            <ul>
              {visible.map((review) => (
                <li
                  key={review.id}
                  className="py-4 not-last:border-b border-fg/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-2">
                    <div className="flex items-center gap-x-3">
                      <p className="text-14bold desk:text-18bold">
                        {review.author}
                      </p>
                      <StarRating
                        value={review.rating}
                        ariaLabel={t("ratingLabel", { value: review.rating })}
                        starClassName="size-4 desk:size-5"
                      />
                    </div>
                    <time
                      dateTime={review.date}
                      className="text-12med desk:text-14med text-grey"
                    >
                      {dateFormatter.format(new Date(review.date))}
                    </time>
                  </div>
                  <p className="whitespace-pre-line break-words text-12med desk:text-18med">
                    {review.text}
                  </p>
                </li>
              ))}
            </ul>
            {reviews.length > VISIBLE_COUNT ? (
              <Button
                variant="secondary"
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-4 w-full tab:w-auto"
              >
                {showAll ? t("showLess") : t("showMore")}
              </Button>
            ) : null}
          </>
        )}
        <Button
          onClick={onWriteReview}
          className="mt-5 w-full tab:w-fit !min-h-[44px] !py-2"
        >
          {t("write")}
        </Button>
      </AnimationWrapper>
    </div>
  );
}
