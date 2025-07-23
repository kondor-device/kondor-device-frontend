import Image from "next/image";
import { ButtonProps } from "@/types/buttonProps";

export default function CatalogCardButton({
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
      className={`flex items-center justify-between w-full h-[18px] laptop:h-[30px] px-[6px] laptop:px-3 text-8med desk:text-10med laptop:text-12med rounded-full text-dark bg-white 
        border border-dark transition duration-300 ease-out enabled:active:scale-95 tabxl:enabled:hover:invert enabled:focus-visible:invert outline-none ${className}`}
    >
      {children}

      <Image
        src="/images/icons/arrow.svg"
        alt="arrow"
        width={14}
        height={8}
        className="w-[7px] h-auto ml-3"
      />
    </button>
  );
}
