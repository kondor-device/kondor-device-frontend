import { Link } from "@/i18n/routing";
import React from "react";

interface FooterNavItemProps {
  navItem: {
    title: string;
    path: string;
  };
}

export default function FooterNavItem({ navItem }: FooterNavItemProps) {
  const { title, path } = navItem;
  return (
    <li className="leading-none">
      <Link
        href={path}
        className="text-12med laptop:text-18med leading-[22px] laptop:hover:text-yellow focus-visible:text-yellow active:text-yellow transition duration-300 ease-out"
      >
        {title}
      </Link>
    </li>
  );
}
