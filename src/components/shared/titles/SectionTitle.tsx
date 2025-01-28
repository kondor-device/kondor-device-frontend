import React from "react";

interface SectionTitleProps {
  children: string;
  className?: string;
}

export default function SectionTitle({
  children,
  className,
}: SectionTitleProps) {
  return (
    <h2
      className={`mb-5 laptop:mb-[60px] text-22bold laptop:text-40bold ${className}`}
    >
      {children}
    </h2>
  );
}
