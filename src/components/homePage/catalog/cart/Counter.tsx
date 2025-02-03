"use client";
import IconClose from "@/components/shared/icons/IconCLose";
import IconMinus from "@/components/shared/icons/IconMinus";
import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-between laptop:w-[94px] deskxl:w-[164px]">
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] laptop:size-8 deskxl:size-[50px] p-1 rounded-[4px] deskxl:rounded-[11px] bg-yellow text-15med 
        deskxl:text-20med text-white disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => setCount(count - 1)}
        disabled={count === 0}
        aria-label="minus"
      >
        <IconMinus className="w-full h-auto" />
      </button>
      <span className="text-14med deskxl:text-20med">{count}</span>
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] laptop:size-8 deskxl:size-[50px] p-1 rounded-[4px] deskxl:rounded-[11px] bg-yellow text-15med deskxl:text-20med 
        text-white  disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => setCount(count + 1)}
        aria-label="plus"
      >
        <IconClose className="w-full h-auto" />
      </button>
    </div>
  );
}
