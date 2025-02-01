import React from "react";

interface PopUpTitleProps {
  children: string;
}

export default function PopUpTitle({ children }: PopUpTitleProps) {
  return (
    <h2 data-label={children} className={`text-16semi laptop:text-24bold`}>
      {children}
    </h2>
  );
}
