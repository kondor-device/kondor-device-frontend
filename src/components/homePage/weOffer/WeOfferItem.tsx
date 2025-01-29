import React from "react";
import Image from "next/image";

interface WeOfferItemProps {
  weOfferItem: {
    title: string;
    icon: string;
  };
}

export default function WeOfferItem({ weOfferItem }: WeOfferItemProps) {
  const { title, icon } = weOfferItem;

  return (
    <li className="flex items-center w-full max-w-[545px] px-[30px] deskxl:px-[39px] py-5 laptop:py-[30px] rounded-[20px] bg-yellowGradient">
      <Image
        src={`/images/icons/${icon}Black.svg`}
        alt={title}
        width="46"
        height="46"
        className="mr-[15px] laptop:mr-5"
      />
      <p className="text-14semi laptop:text-16semi deskxl:text-20semi">
        {title}
      </p>
    </li>
  );
}
