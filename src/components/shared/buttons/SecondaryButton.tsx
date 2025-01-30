import Image from "next/image";
import React from "react";
import { ButtonProps } from "@/types/buttonProps";

export default function SecondaryButton({
  children,
  ariaLabel = "",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center w-fit p-2 laptop:py-5 laptop:px-[25px] text-12med laptop:text-22med deskxl:text-24bold rounded-full text-white bg-black 
        border border-white transition duration-300 ease-out enabled:active:brightness-[115%] enabled:active:scale-95 
        laptop:enabled:hover:invert-[85%] enabled:focus-visible:brightness-[115%] outline-none ${className}`}
    >
      {children}

      <Image
        src="/images/icons/arrow.svg"
        alt="arrow"
        width={14}
        height={8}
        className="w-[7px] laptop:w-[14px] h-auto ml-3"
      />
    </button>
  );
}
