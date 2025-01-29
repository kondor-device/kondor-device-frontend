import { useLocale } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { Link } from "@/i18n/routing";

interface MenuLinkProps {
  menuItem: {
    title: string;
    path: string;
  };
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>> | undefined;
  className?: string;
}

export default function MenuLink({
  menuItem,
  setIsHeaderMenuOpened,
  className = "",
}: MenuLinkProps) {
  const locale = useLocale();
  const { title, path } = menuItem;

  return (
    <li className={`text-center ${className}`}>
      <Link
        href={locale === "uk" ? `/${path}` : `/${locale}${path}`}
        onClick={() => {
          if (setIsHeaderMenuOpened) setIsHeaderMenuOpened(false);
        }}
        className={`laptop:text-18med transition duration-300 ease-out active:text-yellow focus-visible:text-yellow
         laptop:hover:text-yellow outline-none`}
      >
        {title}
      </Link>
    </li>
  );
}
