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
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  className?: string;
}

export default function ModalNotification({
  isPopUpShown,
  setIsError,
  setIsPopUpShown,
  children,
  className = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handlePopUpClose = () => {
    setIsPopUpShown(false);
    setIsError(false);
  };

  return createPortal(
    <div
      className={`${
        isPopUpShown ? "opacity-100" : "pointer-events-none opacity-0"
      } fixed z-[80] left-1/2 bottom-0 transform -translate-y-[calc(50dvh-50%)] -translate-x-1/2 min-w-[312px] max-w-[390px] laptop:max-w-[628px]
      w-[95.5%] tab:w-[628px] max-h-[90dvh] overflow-y-auto px-4 py-[30px] laptop:px-[60px] laptop:py-14 rounded-[20px] laptop:rounded-[30px] bg-yellow
       scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-white scrollbar-track-transparent popup-scroll
       ${className}`}
    >
      <div
        className={`absolute top-4 right-4 tab:top-8 tab:right-8 size-5 tab:size-[25px]`}
      >
        <IconButton
          handleClick={handlePopUpClose}
          className="enabled:active:scale-95 enabled:active:text-white laptop:enabled:hover:text-white enabled:focus-visible:text-white transition duration-300 ease-out"
        >
          {<IconClose className="size-full rotate-45" />}
        </IconButton>
      </div>
      {children}
    </div>,
    document.body
  );
}
