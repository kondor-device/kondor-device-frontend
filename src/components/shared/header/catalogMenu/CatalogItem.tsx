import { Dispatch, SetStateAction } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface CatalogItemProps {
  catalogItem: { title: string; category: string; icon: string };
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogItem({
  catalogItem,
  setIsCatalogMenuOpened,
}: CatalogItemProps) {
  const { title, category, icon } = catalogItem;
  const searchParams =
    "&priceTo=4999&sort=price-ascending&priceFrom=599&availability=in-stock%2Cpre-order";

  return (
    <li className="w-[calc(50%-8px)] tab:w-[calc(25%-12px)] tabxl:w-[calc(50%-8px)] py-5 px-6 rounded-[22px] shadow-catalogItem bg-white min-h-full laptop:hover:scale-[102%] laptop:hover:-translate-y-1 transition duration-300 ease-out">
      <Link
        href={`/catalog?type=${category}${searchParams}`}
        className="flex flex-col justify-center items-center h-full"
        onClick={() => setIsCatalogMenuOpened(false)}
      >
        <div className="relative w-[102px] h-[105px] mb-[22px]">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <h3 className="flex items-center min-h-[34px] text-14bold text-center">
          {title}
        </h3>
      </Link>
    </li>
  );
}
