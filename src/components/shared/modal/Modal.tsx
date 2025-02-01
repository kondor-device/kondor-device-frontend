import React, { Dispatch, ReactNode, SetStateAction } from "react";

import IconButton from "../buttons/IconButton";
import IconClose from "../icons/IconCLose";

interface ModalProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  isError?: boolean;
}

export default function Modal({
  isPopUpShown,
  setIsPopUpShown,
  children,
  isError = false,
}: ModalProps) {
  return (
    <div
      className={`${
        isPopUpShown
          ? " -translate-y-[calc(50dvh-50%)] opacity-100"
          : "pointer-events-none opacity-0"
      } fixed left-1/2 bottom-0 transform -translate-x-1/2 transition duration-[600ms] ease-out z-50 min-w-[312px] max-w-[368px] tab:max-w-[496px] 
      w-[86.6%] tab:w-[496px] max-h-[100dvh] overflow-y-auto px-6 py-10 tab:px-12 tab:py-14 ${
        isError ? "bg-yellowLight" : "bg-white"
      } rounded-[16px]`}
    >
      <div className="absolute top-3 right-3 tab:top-6 tab:right-6 size-9 tab:size-10">
        <IconButton handleClick={() => setIsPopUpShown(false)}>
          {<IconClose className="size-full rotate-45" />}
        </IconButton>
      </div>
      {children}
    </div>
  );
}
