import Image from "next/image";
import React from "react";
import { ButtonProps } from "@/types/buttonProps";

export default function Button({
  children,
  ariaLabel = "",
  className = "",
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center min-h-[36px] tabxl:min-h-[64px] deskxl:min-h-[85px] px-8 laptop:px-[30px] py-[19px] laptop:py-[30px] text-14bold laptop:text-16bold 
        deskxl:text-24bold rounded-full transition duration-300 ease-out enabled:active:scale-95 outline-none ${
          variant === "primary"
            ? "enabled:bg-yellowGradient enabled:active:brightness-[115%] laptop:enabled:hover:brightness-[115%] enabled:focus-visible:brightness-[115%]"
            : "bg-lightGrey enabled:active:bg-grey laptop:enabled:hover:bg-grey enabled:focus-visible:bg-grey"
        }  
        
      disabled:bg-grey disabled:text-white
        ${className}`}
    >
      {children}
      {isLoading ? (
        <Image
          src="/images/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="size-5 ml-4 animate-rotation"
        />
      ) : (
        ""
      )}
    </button>
  );
}
