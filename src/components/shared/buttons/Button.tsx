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
      className={`flex items-center justify-center w-[350px] deskxl:w-[437px] h-[54px] laptop:h-[82px] desk:h-[85px] px-3 text-14bold laptop:text-18bold 
        deskxl:text-24bold rounded-full transition duration-300 ease-out enabled:active:brightness-[115%] enabled:active:scale-95 
        laptop:enabled:hover:brightness-[115%] enabled:focus-visible:brightness-[115%] outline-none ${
          variant === "primary" ? "bg-yellowGradient" : "bg-lightGrey"
        }  
        
        ${isLoading ? "" : "disabled:bg-grey"} 
        ${className}`}
    >
      {children}
      {isLoading ? (
        <Image
          src="/images/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="ml-3 animate-rotation"
        />
      ) : (
        ""
      )}
    </button>
  );
}
