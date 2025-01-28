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
    <li>
      <Link href={path} className="text-12med laptop:text-18med">
        {title}
      </Link>
    </li>
  );
}
