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
      className={`flex items-center justify-center w-fit p-2 tabxl:py-5 tabxl:px-[25px] text-12med tabxl:text-16med deskxl:text-22med rounded-full text-white bg-dark 
        border border-white transition duration-300 ease-out enabled:active:scale-95 tabxl:enabled:hover:invert enabled:focus-visible:invert outline-none ${className}`}
    >
      {children}

      <Image
        src="/images/icons/arrow.svg"
        alt="arrow"
        width={14}
        height={8}
        className="w-[7px] tabxl:w-[14px] h-auto ml-3"
      />
    </button>
  );
}
