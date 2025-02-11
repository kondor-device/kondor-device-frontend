"use client";
import React from "react";
import { useOnScreen } from "@/hooks/useOnScreen";

interface HeroTitleWrapperProps {
  children: React.ReactNode;
  sectionId: string;
  commonStyles: string;
  visibleStyles: string;
  unVisibleStyles: string;
}

export default function AnimationWrapper({
  children,
  sectionId,
  commonStyles,
  visibleStyles,
  unVisibleStyles,
}: HeroTitleWrapperProps) {
  const { isVisible } = useOnScreen(sectionId);

  return (
    <div
      className={`${
        isVisible ? visibleStyles : unVisibleStyles
      } ${commonStyles}`}
    >
      {children}
    </div>
  );
}
