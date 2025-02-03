"use client";
import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] rounded-[4px] bg-yellow text-15med text-white 
        disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => setCount(count - 1)}
        disabled={count === 0}
        aria-label="minus"
      >
        -
      </button>
      <span className="text-14med">{count}</span>
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] rounded-[4px] bg-yellow text-15med text-white 
        disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={() => setCount(count + 1)}
        aria-label="plus"
      >
        +
      </button>
    </div>
  );
}
