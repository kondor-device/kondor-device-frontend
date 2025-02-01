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
      className={`flex items-center justify-center w-[122px] laptop:w-[278px] p-x-[10px] py-[5px] laptop:py-[10px] laptop:px-[25px] text-12bold laptop:text-28bold rounded-full bg-white 
        border laptop:border-[3px] border-dark transition duration-300 ease-out enabled:active:scale-95 laptop:enabled:hover:invert enabled:focus-visible:invert outline-none ${className}`}
    >
      {children}
    </button>
  );
}
