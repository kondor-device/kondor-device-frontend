import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface LogoLinkProps {
  className?: string;
}

export default function LogoLink({ className = "" }: LogoLinkProps) {
  const locale = useLocale();

  return (
    <Link href="/" locale={locale} className="group flex items-center">
      <Image
        src="/images/icons/logo.svg"
        priority
        alt="logo"
        width="203"
        height="81"
        className={`${className} h-auto group-active:brightness-110 group-focus:brightness-110 laptop:group-hover:brightness-110 transition duration-300 ease-out`}
      />
    </Link>
  );
}
