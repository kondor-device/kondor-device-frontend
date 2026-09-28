/** Середня оцінка, округлена до 0.1 (4.666 → 4.7); 0, якщо відгуків немає */
export function formatRating(avg?: number | null): number {
  if (!avg) return 0;

  return Math.round(avg * 10) / 10;
}
