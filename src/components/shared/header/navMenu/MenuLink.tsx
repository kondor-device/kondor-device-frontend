import { useLocale } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { Link } from "@/i18n/routing";

interface MenuLinkProps {
  menuItem: {
    title: string;
    path: string;
  };
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export default function MenuLink({
  menuItem,
  setIsHeaderMenuOpened,
  setIsCatalogMenuOpened,
  className = "",
}: MenuLinkProps) {
  const locale = useLocale();
  const { title, path } = menuItem;

  return (
    <li className={`text-center ${className}`}>
      {path !== "catalog" ? (
        <Link
          href={locale === "uk" ? `/${path}` : `/${locale}${path}`}
          onClick={() => {
            if (setIsHeaderMenuOpened) setIsHeaderMenuOpened(false);
            if (path === "catalog") {
              setIsCatalogMenuOpened(true);
            }
          }}
          className={`transition duration-300 ease-out active:text-yellow focus-visible:text-yellow
         laptop:hover:text-yellow outline-none`}
        >
          {title}
        </Link>
      ) : (
        <p
          onClick={() => {
            if (setIsHeaderMenuOpened) setIsHeaderMenuOpened(false);

            setIsCatalogMenuOpened(true);
          }}
          className={`cursor-pointer transition duration-300 ease-out active:text-yellow focus-visible:text-yellow
         laptop:hover:text-yellow outline-none`}
        >
          {title}
        </p>
      )}
    </li>
  );
}
