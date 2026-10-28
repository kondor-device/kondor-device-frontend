export const REVIEW_PHOTO_LIMIT = 3;
export const REVIEW_PHOTO_MAX_BYTES = 750 * 1024;
export const REVIEW_BODY_MAX_BYTES = 3 * 1024 * 1024;
export const REVIEW_PAGE_SIZE = 3;
export const REVIEW_PHOTO_ORDER = `order((coalesce(count(photos[defined(asset._ref)]), 0) > 0) desc, submittedAt desc, _id asc)`;
export const PUBLIC_REVIEW_FIELDS = `"id":_id,author,rating,text,"date":submittedAt,"reply":reply{text,"date":publishedAt},"photos":photos[defined(asset._ref)][0...3]{"id":_key,"url":asset->url}`;

export function reviewImageUrl(source: string, width: number, thumbnail = false) {
  const url = new URL(source);
  if (url.origin !== "https://cdn.sanity.io" || !url.pathname.startsWith("/images/qmszlzqu/production/")) throw new Error("Invalid review image");
  url.search = "";
  url.searchParams.set("w", String(width));
  if (thumbnail) { url.searchParams.set("h", String(width)); url.searchParams.set("fit", "crop"); }
  else url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", thumbnail ? "75" : "85");
  return url.href;
}
