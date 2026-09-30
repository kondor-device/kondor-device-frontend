import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CategoryItem } from "@/types/categoryItem";
import { getCatalogHref, getCatalogList } from "./getCatalogList";

interface CatalogDropdownProps {
  categories: CategoryItem[];
  isOpened: boolean;
  onNavigate: () => void;
}

export default function CatalogDropdown({
  categories,
  isOpened,
  onNavigate,
}: CatalogDropdownProps) {
  const t = useTranslations("header.catalogMenu");
  const catalogList = getCatalogList(categories, {
    all: t("all"),
    new: t("new"),
  });

  const COLUMNS = 3;
  const perColumn = Math.ceil(catalogList.length / COLUMNS);
  const columns = Array.from({ length: COLUMNS }, (_, i) =>
    catalogList.slice(i * perColumn, (i + 1) * perColumn)
  ).filter((column) => column.length > 0);

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-full -mt-6 z-[70] transition duration-300 ease-out ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex w-[660px] p-4 rounded-[22px] shadow-catalogItem bg-surface dark:bg-page">
        {columns.map((column, idx) => (
          <ul
            key={idx}
            className="flex-1 flex flex-col gap-1 px-2"
          >
            {column.map(({ title, category, icon }) => (
              <li key={category}>
                <Link
                  href={getCatalogHref(category)}
                  onClick={onNavigate}
                  className="flex items-center gap-3 p-2 rounded-[14px] text-left text-14bold outline-none transition duration-300 ease-out
                  focus-visible:text-yellow laptop:hover:text-yellow laptop:hover:bg-page dark:laptop:hover:bg-surface"
                >
                  <span className="relative block shrink-0 w-[56px] h-[40px] dark:rounded-[8px] dark:bg-white dark:overflow-hidden">
                    <Image
                      src={icon || "/images/icons/logoSmall.svg"}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="56px"
                    />
                  </span>
                  <span className="flex-1 min-w-0">{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
