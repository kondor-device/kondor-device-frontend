"use client";
import React, { useState } from "react";
import Image from "next/image";

interface FaqItemProps {
  faqItem: {
    title: string;
    description: string;
  };
}

export default function FaqItem({ faqItem }: FaqItemProps) {
  const [isShownMore, setIsShownMore] = useState(false);
  const toggleShowMore = () => setIsShownMore(!isShownMore);

  const { title, description } = faqItem;

  return (
    <li
      onClick={toggleShowMore}
      className="cursor-pointer px-[20px] py-[15px] laptop:px-[50px] laptop:py-[40px] rounded-[11px] laptop:rounded-[30px] shadow-card"
    >
      <div className={`flex items-center`}>
        <Image
          src={`/images/icons/question.svg`}
          alt="question icon"
          width="24"
          height="25"
          className="w-5 laptop:w-8 h-auto mr-3 laptop:mr-8"
        />
        <h3 className="mr-3 laptop:mr-5 text-12bold laptop:text-24bold">
          {title}
        </h3>
        <Image
          src={`/images/icons/cross.svg`}
          alt="cross icon"
          width="32"
          height="33"
          className={`w-[10px] laptop:w-6 h-auto ml-auto transition duration-500 ease-in-out ${
            isShownMore ? "rotate-45" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`pl-8 laptop:pl-[64px] overflow-hidden transition-[max-height] duration-700 ${
          isShownMore ? "max-h-[600px] ease-in" : "max-h-0 ease-out"
        }`}
      >
        <p className={`pt-[5px] laptop:pt-4 text-12med laptop:text-18med`}>
          {description}
        </p>
      </div>
    </li>
  );
}
