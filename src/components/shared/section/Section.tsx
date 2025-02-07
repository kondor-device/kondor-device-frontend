import React from "react";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default function Section({
  id,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`container w-full max-w-[1920px] pt-[60px] laptop:pt-[100px] ${className}`}
    >
      {children}
    </section>
  );
}
