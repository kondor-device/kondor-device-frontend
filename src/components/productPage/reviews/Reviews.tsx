"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/shared/buttons/Button";
import StarRating from "@/components/shared/StarRating";
import IconStar from "@/components/shared/icons/IconStar";
import { formatRating } from "@/utils/formatRating";
import { scrollToProductSection } from "@/utils/productSectionNavigation";
import { getInitials } from "@/utils/getInitials";
import { Review } from "@/types/productItem";
import WriteReviewForm from "./WriteReviewForm";

export const REVIEWS_ID = "reviews";
export const REVIEW_FORM_ID = "review-form";
const VISIBLE_COUNT = 3;
const STARS = [5, 4, 3, 2, 1];

interface ReviewsProps {
  itemId: string;
  reviews: Review[];
  ratingAvg?: number | null;
  ratingCount: number;
  ratingDistribution?: number[];
}

export default function Reviews({
  itemId, reviews, ratingAvg, ratingCount, ratingDistribution,
}: ReviewsProps) {
  const t = useTranslations("productPage.reviews");
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);
  const avg = formatRating(ratingAvg);
  const visible = showAll ? reviews : reviews.slice(0, VISIBLE_COUNT);
  const counts = ratingDistribution ?? STARS.map(star => reviews.filter(review => review.rating === star).length);
  const dateFormatter = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uk-UA", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv",
  });

  const onWriteReview = () => {
    scrollToProductSection(REVIEW_FORM_ID, REVIEWS_ID);
    document.getElementById(REVIEW_FORM_ID)?.focus({ preventScroll: true });
  };

  return (
    <section
      id={REVIEWS_ID}
      aria-labelledby="reviews-title"
      className="mt-5 tab:mt-8 rounded-[24px] bg-surface p-2 tab:p-6 desk:p-8 shadow-catalogCard scroll-mt-[128px] tabxl:scroll-mt-[180px]"
    >
      <div className="mb-5 tab:mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="reviews-title" className="text-[24px] leading-tight font-bold tab:text-[28px]">
          {t("title")}
        </h2>
        <Button onClick={onWriteReview} className="hidden laptop:flex !min-h-11 !py-3 !px-7">
          {t("write")}
        </Button>
      </div>

      <div className="grid items-start gap-5 laptop:grid-cols-[280px_minmax(0,1fr)_360px] desk:grid-cols-[300px_minmax(0,1fr)_380px]">
        <div className="min-w-0 rounded-[20px] bg-surface p-4 tab:p-5 shadow-catalogCard">
          <div className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-4 tab:grid-cols-[180px_minmax(0,1fr)] laptop:block">
            <div className="flex min-w-0 flex-col items-center laptop:mb-6">
              <p aria-label={ratingCount ? t("ratingLabel", { value: avg }) : t("noRating")}
                className="mb-2 text-[64px] tab:text-[80px] font-bold leading-none tracking-[-0.06em]">
                {ratingCount ? avg.toFixed(1).replace(".", ",") : "—"}
              </p>
              <StarRating value={avg} ariaLabel={t("ratingLabel", { value: avg })}
                starClassName="size-5 tab:size-7 laptop:size-6 desk:size-7" />
              <p className="mt-2 text-center text-[12px] tab:text-[15px] leading-5 text-fg/65">
                {t("count", { count: ratingCount })}
              </p>
            </div>
            <ul className="space-y-3" aria-label={t("distribution")}>
              {STARS.map((star, index) => {
                const count = counts[index] ?? 0;
                const percent = ratingCount ? Math.min(100, count / ratingCount * 100) : 0;
                return (
                  <li key={star} aria-label={t("distributionLabel", { stars: star, count })}
                    className="flex items-center gap-2 text-[13px] tab:text-[15px]">
                    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
                      {star}<IconStar className="size-4 text-yellow" />
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-fg/10" aria-hidden="true">
                      <span className="block h-full rounded-full bg-yellow" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="min-w-4 text-right tabular-nums text-fg/65" aria-hidden="true">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Button onClick={onWriteReview} className="w-full laptop:hidden !min-h-12 !py-3">
          {t("write")}
        </Button>

        <div className="min-w-0">
          {reviews.length === 0 ? (
            <div className="rounded-[20px] bg-surface p-5 tab:p-6 shadow-catalogCard">
              <p className="text-[15px] leading-6 text-fg/70">{t("empty")}</p>
            </div>
          ) : (
            <>
              <ul className="space-y-4" aria-label={t("listLabel")}>
                {visible.map(review => (
                  <li key={review.id} className="rounded-[20px] bg-surface p-5 tab:p-6 laptop:p-5 desk:p-6 shadow-catalogCard">
                    <article>
                      <div className="mb-3 flex items-start gap-3">
                        <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fg/10 text-[15px] font-bold text-fg/70">
                          {getInitials(review.author)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h3 className="min-w-0 break-words text-[18px] leading-6 font-bold">{review.author}</h3>
                            <time dateTime={review.date} className="text-[12px] leading-5 text-fg/60">
                              {dateFormatter.format(new Date(review.date))}
                            </time>
                          </div>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] leading-4 font-medium text-emerald-700 dark:text-emerald-400">
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
                              <circle cx="10" cy="10" r="9" />
                              <path d="m6 10 2.5 2.5L14 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t("confirmedPurchase")}
                          </span>
                          <div className="mt-2 leading-none">
                            <StarRating value={review.rating} ariaLabel={t("ratingLabel", { value: review.rating })}
                              starClassName="size-5 tab:size-6" />
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-line break-words text-[15px] tab:text-[16px] leading-[1.6]">{review.text}</p>
                      {review.reply?.text ? (
                        <div className="mt-4 rounded-r-xl border-l-2 border-yellow bg-yellow/5 py-3 pl-4 pr-3">
                          <p className="mb-1 text-[14px] font-bold">{t("storeReply")}</p>
                          <p className="whitespace-pre-line break-words text-[14px] leading-6">{review.reply.text}</p>
                        </div>
                      ) : null}
                    </article>
                  </li>
                ))}
              </ul>
              {reviews.length > VISIBLE_COUNT ? (
                <Button variant="secondary" onClick={() => setShowAll(prev => !prev)}
                  className="mt-4 w-full !min-h-11 !py-3">
                  {showAll ? t("showLess") : t("showMore")}
                </Button>
              ) : null}
            </>
          )}
        </div>

        <div id={REVIEW_FORM_ID} tabIndex={-1}
          className="min-w-0 rounded-[20px] bg-surface p-3 tab:p-6 laptop:p-5 desk:p-6 shadow-catalogCard scroll-mt-[128px] tabxl:scroll-mt-[180px] outline-none focus-visible:ring-2 focus-visible:ring-yellow">
          <WriteReviewForm itemId={itemId} />
        </div>
      </div>
    </section>
  );
}
