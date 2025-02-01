"use client";
import Image from "next/image";
import React, { useEffect } from "react";

interface BackdropProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function Backdrop({
  isVisible = false,
  onClick,
}: BackdropProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClick();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClick]);

  return (
    <div
      className={`fixed z-40 inset-0 transition duration-[1000ms] ${
        isVisible
          ? "opacity-100 no-doc-scroll"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClick}
    >
      <Image
        src="/images/bgImages/backdrop.webp"
        alt="backdrop image"
        width={3840}
        height={2160}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
