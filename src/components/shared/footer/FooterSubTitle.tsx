import React from "react";

interface FooterSubTitleProps {
  children: string;
}

export default function FooterSubTitle({ children }: FooterSubTitleProps) {
  return (
    <h3 className="mb-[15px] laptop:mb-5 text-yellow text-14semi laptop:text-18semi">
      {children}
    </h3>
  );
}
