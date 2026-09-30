import { Dispatch, SetStateAction } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getCatalogHref } from "./getCatalogList";

interface CatalogItemProps {
  catalogItem: { title: string; category: string; icon: string };
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogItem({
  catalogItem,
  setIsCatalogMenuOpened,
}: CatalogItemProps) {
  const { title, category, icon } = catalogItem;
  const href = getCatalogHref(category);

  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 py-3 px-2 text-left text-14bold outline-none transition duration-300 ease-out
        active:text-yellow focus-visible:text-yellow laptop:hover:text-yellow"
        onClick={() => setIsCatalogMenuOpened(false)}
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
  );
}
