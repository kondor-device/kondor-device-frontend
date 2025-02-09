"use client";
import Image from "next/image";
import React, { useEffect, useCallback } from "react";
import { useModalStore } from "@/store/modalStore";
import { useShallow } from "zustand/react/shallow";

export default function Backdrop() {
  const activeModalName = useModalStore(
    useShallow((state) => state.activeModal.name)
  );
  const closeModal = useModalStore(useShallow((state) => state.closeModal));

  const isOpen = activeModalName !== null;

  const handleCloseModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleCloseModal, isOpen]);

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
