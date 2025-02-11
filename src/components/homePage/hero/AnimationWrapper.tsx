import React from "react";
import { useOnScreen } from "@/hooks/useOnScreen";

interface HeroTitleWrapperProps {
  children: React.ReactNode;
  sectionId: string;
  visibleStyles: string;
  unVisibleStyles: string;
}

export default function HeroTitleWrapper({
  children,
  sectionId,
  visibleStyles,
  unVisibleStyles,
}: HeroTitleWrapperProps) {
  const { isVisible } = useOnScreen(sectionId);

  return (
    <div className={isVisible ? visibleStyles : unVisibleStyles}>
      {children}
    </div>
  );
}
