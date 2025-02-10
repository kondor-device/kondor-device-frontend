import React from "react";

interface TextButtonProps {
  children: string;
  onClick?: () => void;
  className?: string;
}

export default function TextButton({
  children,
  onClick,
  className = "",
}: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-12med tab:text-14med text-yellow laptop:hover:brightness-[115%] focus-visible:brightness-[115%] active:brightness-[115%] transition 
    duration-300 ease-out ${className}`}
    >
      {children}
    </button>
  );
}
