import React from "react";

interface SectionProps {
  id?: string;
  className?: string;
}

export default function Section({ id, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`container max-w-[1920px] pt-[60px] laptop:pt-[100px] ${className}`}
    >
      Section
    </section>
  );
}
