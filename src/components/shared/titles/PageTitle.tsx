import React from "react";
import Image from "next/image";

interface PageTitleProps {
  children: string;
  className?: string;
}

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <div className="relative w-full py-[39px] laptop:py-[88px] overflow-hidden">
      <Image
        src="/images/bgImages/titleBgMob.webp"
        alt="curves"
        width={1560}
        height={380}
        priority
        className="tab:hidden absolute -z-10 top-0 left-0 w-full h-auto object-cover"
      />
      <Image
        src="/images/bgImages/titleBg.webp"
        alt="curves"
        width={3840}
        height={450}
        priority
        className="hidden tab:block absolute -z-10 top-0 left-0 w-full h-full object-cover"
      />
      <h1 className={`text-center text-14bold laptop:text-40bold ${className}`}>
        {children}
      </h1>
    </div>
  );
}
