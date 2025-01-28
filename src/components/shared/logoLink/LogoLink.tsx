import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function LogoLink() {
  const locale = useLocale();

  return (
    <Link href="/" locale={locale}>
      <Image
        src="/images/icons/logo.svg"
        priority
        alt="logo"
        width="203"
        height="81"
        className="cursor-pointer"
      />
    </Link>
  );
}
