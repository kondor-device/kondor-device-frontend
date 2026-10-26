"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { formatRating } from "@/utils/formatRating";
import StarRating from "./StarRating";

interface CardRatingProps {
  ratingAvg?: number | null;
  ratingCount?: number;
  href?: string;
  compact?: boolean;
  onDark?: boolean;
  className?: string;
}

export default function CardRating({
  ratingAvg, ratingCount = 0, href, compact = false, onDark = false, className = "",
}: CardRatingProps) {
  const t = useTranslations("productPage.reviews");
  const avg = formatRating(ratingAvg);
  const countLabel = t("count", { count: ratingCount });
  const label = ratingCount > 0 ? `${t("ratingLabel", { value: avg })}, ${countLabel}` : countLabel;
  const styles = `inline-flex w-fit max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 leading-5 ${onDark ? "text-white" : "text-fg"} ${compact ? "text-[10px]" : "text-[11px] desk:text-[14px]"} ${className}`;
  const content = (
    <>
      <StarRating value={ratingCount > 0 ? avg : 0}
        ariaLabel={ratingCount > 0 ? t("ratingLabel", { value: avg }) : t("noRating")}
        starClassName={compact ? "size-2.5" : "size-3 desk:size-4"} />
      <span className="font-bold">{ratingCount > 0 ? avg.toFixed(1).replace(".", ",") : "—"}</span>
      <span title={countLabel} className={`${onDark ? "text-white/65" : "text-fg/65"} ${href ? "underline underline-offset-2" : ""}`}>({ratingCount})</span>
    </>
  );

  return href ? (
    <Link href={href} aria-label={label}
      className={`${styles} rounded transition-colors hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 ${onDark ? "focus-visible:ring-offset-panel" : "focus-visible:ring-offset-surface"}`}>
      {content}
    </Link>
  ) : <div className={styles}>{content}</div>;
}
