import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Path without locale, e.g. "/blog". Page 1 has no query, others get ?page=N. */
  basePath: string;
}

const getPageHref = (basePath: string, page: number) =>
  page === 1 ? basePath : `${basePath}?page=${page}`;

// 1 … current-1 current current+1 … last
const getPageItems = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 1; page <= currentPage + 1; page++) {
    if (page > 1 && page < totalPages) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: (number | "dots")[] = [];

  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) items.push("dots");
    items.push(page);
  });

  return items;
};

const ARROW_CLASS =
  "flex items-center justify-center size-9 laptop:size-12 shrink-0 rounded-full text-16bold transition duration-300 ease-out";

/** Server-rendered pagination: real links, so it works without JS and is crawlable. */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const t = useTranslations("blogPage");

  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label={t("pagination")}
      className="flex justify-center items-center gap-2 laptop:gap-4 mt-8 laptop:mt-[60px]"
    >
      {hasPrev ? (
        <Link
          href={getPageHref(basePath, currentPage - 1)}
          rel="prev"
          aria-label={t("prevPage")}
          className={`${ARROW_CLASS} bg-yellowGradient text-dark active:scale-95 laptop:hover:brightness-[115%] focus-visible:brightness-[115%]`}
        >
          ‹
        </Link>
      ) : (
        <span aria-hidden className={`${ARROW_CLASS} bg-grey text-white`}>
          ‹
        </span>
      )}

      <ul className="flex items-center gap-1 laptop:gap-2">
        {getPageItems(currentPage, totalPages).map((item, idx) =>
          item === "dots" ? (
            <li key={`dots-${idx}`} aria-hidden className="px-1 text-14med">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={getPageHref(basePath, item)}
                aria-label={t("page", { page: item })}
                aria-current={item === currentPage ? "page" : undefined}
                className={`flex items-center justify-center size-8 laptop:size-10 rounded-full text-14bold transition duration-300 ease-out active:scale-95 ${
                  item === currentPage
                    ? "bg-yellowGradient text-dark"
                    : "laptop:hover:bg-lightGrey focus-visible:bg-lightGrey"
                }`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {hasNext ? (
        <Link
          href={getPageHref(basePath, currentPage + 1)}
          rel="next"
          aria-label={t("nextPage")}
          className={`${ARROW_CLASS} bg-yellowGradient text-dark active:scale-95 laptop:hover:brightness-[115%] focus-visible:brightness-[115%]`}
        >
          ›
        </Link>
      ) : (
        <span aria-hidden className={`${ARROW_CLASS} bg-grey text-white`}>
          ›
        </span>
      )}
    </nav>
  );
}
