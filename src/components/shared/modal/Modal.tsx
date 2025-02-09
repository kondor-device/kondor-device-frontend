"use client";
import React from "react";
import IconButton from "../buttons/IconButton";
import IconClose from "../icons/IconCLose";
import { useModalStore } from "@/store/modalStore";
import { useShallow } from "zustand/react/shallow";

export default function Modal() {
  const { activeModal, closeModal } = useModalStore(
    useShallow((state) => ({
      activeModal: state.activeModal,
      closeModal: state.closeModal,
    }))
  );

  if (!activeModal.name) return null;

  return (
    <div
      className={`fixed z-[80] left-1/2 bottom-0 transform -translate-y-[calc(50dvh-50%)] -translate-x-1/2 min-w-[312px] max-w-[390px] tab:max-w-[496px] laptop:max-w-[950px]
      w-[95.5%] tab:w-[496px] laptop:w-[950px] max-h-[90dvh] overflow-y-auto px-4 py-[30px] laptop:px-[60px] laptop:py-14 rounded-[20px] laptop:rounded-[30px] bg-white
      scrollbar scrollbar-w-[3px] laptop:scrollbar-w-[8px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow scrollbar-track-transparent popup-scroll
      shadow-notification ${activeModal.modalStyles}`}
    >
      <div
        className={`absolute top-4 right-4 tab:top-8 tab:right-8 size-5 tab:size-[25px]`}
      >
        <IconButton
          handleClick={closeModal}
          className="enabled:active:scale-95 enabled:active:text-yellow laptop:enabled:hover:text-yellow enabled:focus-visible:text-yellow transition duration-300 ease-out"
        >
          {<IconClose className="size-full rotate-45" />}
        </IconButton>
      </div>
      {activeModal.content}
    </div>
  );
}
