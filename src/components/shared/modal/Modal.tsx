"use client";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import IconButton from "../buttons/IconButton";
import IconClose from "../icons/IconCLose";

interface ModalProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function Modal({
  isPopUpShown,
  setIsPopUpShown,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={`${
        isPopUpShown
          ? " -translate-y-[calc(50dvh-50%)] opacity-100"
          : "pointer-events-none opacity-0"
      } fixed z-50 left-1/2 bottom-0 transform -translate-x-1/2 transition duration-[600ms] ease-out min-w-[312px] max-w-[368px] tab:max-w-[496px] laptop:tab:max-w-[950px]
      w-[86.6%] tab:w-[496px] laptop:w-[950px] max-h-[90dvh] overflow-y-auto px-5 py-[30px] laptop:px-[75px] laptop:py-14 rounded-[20px] laptop:rounded-[30px] bg-white
       scrollbar scrollbar-w-[3px] laptop:scrollbar-w-[8px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow scrollbar-track-transparent popup-scroll`}
    >
      <div className="absolute top-4 right-4 tab:top-8 tab:right-8 size-5 tab:size-[25px]">
        <IconButton handleClick={() => setIsPopUpShown(false)}>
          {<IconClose className="size-full rotate-45" />}
        </IconButton>
      </div>
      <div> {children}</div>
    </div>,
    document.body
  );
}
