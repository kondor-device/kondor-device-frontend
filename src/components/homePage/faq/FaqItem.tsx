import React from "react";
import Image from "next/image";

interface FaqItemProps {
  faqItem: {
    title: string;
    description: string;
  };
}

export default function FaqItem({ faqItem }: FaqItemProps) {
  const { title, description } = faqItem;

  return (
    <li className="px-[20px] py-[15px] laptop:px-[50px] laptop:py-[40px] rounded-[11px] laptop:rounded-[30px] shadow-card leading-none">
      <div className="flex items-center mb-[5px] laptop:mb-4">
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
          className="w-[10px] laptop:w-6 h-auto ml-auto"
        />
      </div>
      <p className="pl-8 laptop:pl-[64px] text-12med laptop:text-18med">
        {description}
      </p>
    </li>
  );
}
