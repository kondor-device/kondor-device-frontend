"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";

export default function Backdrop() {
  const { closeModal, isOpen } = useModalStore();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeModal]);

  return (
    <div
      className={`fixed z-[70] inset-0 ${
        isOpen ? "opacity-100 no-doc-scroll" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeModal}
    >
      <Image
        src="/images/bgImages/backdrop.webp"
        alt="backdrop image"
        fill
        className="absolute inset-0 object-cover"
      />
    </div>
  );
}
