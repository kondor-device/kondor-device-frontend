import IconStar from "@/components/shared/icons/IconStar";

interface StarRatingProps {
  /** 0–5, можна дробове (4.7) */
  value: number;
  ariaLabel: string;
  className?: string;
  starClassName?: string;
}

const STARS = [0, 1, 2, 3, 4];

// Лише відображення. Сірі зірки + жовті зверху, обрізані по ширині — так
// дробове значення (4.7) малюється без окремих "половинних" іконок.
export default function StarRating({
  value,
  ariaLabel,
  className = "",
  starClassName = "size-4 tab:size-5",
}: StarRatingProps) {
  const percent = Math.max(0, Math.min(5, value)) * 20;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`relative inline-flex ${className}`}
    >
      <span className="flex text-grey/40">
        {STARS.map((i) => (
          <IconStar key={i} className={`shrink-0 ${starClassName}`} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-yellow"
        style={{ width: `${percent}%` }}
      >
        {STARS.map((i) => (
          <IconStar key={i} className={`shrink-0 ${starClassName}`} />
        ))}
      </span>
    </span>
  );
}
