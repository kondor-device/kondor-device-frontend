import React from "react";
import { ButtonProps } from "@/types/buttonProps";

export default function SmallButton({
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
      className={`flex items-center justify-center w-[122px] tab:w-[182px] tabxl:w-[162px] laptop:w-[182px] deskxl:w-[278px] px-[10px] py-[5px] deskxl:py-[10px] deskxl:px-[25px] text-12bold tab:text-20bold tabxl:text-16bold laptop:text-20bold deskxl:text-28bold rounded-full bg-white 
        border laptop:border-[3px] border-dark transition duration-300 ease-out enabled:active:scale-95 enabled:active:border-yellow enabled:active:bg-yellow laptop:enabled:hover:bg-yellow laptop:enabled:hover:border-yellow 
        enabled:focus-visible:border-yellow enabled:focus-visible:bg-yellow outline-none ${className}`}
    >
      {children}
    </button>
  );
}
