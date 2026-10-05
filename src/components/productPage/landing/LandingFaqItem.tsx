"use client";
import { useId, useState } from "react";
import Image from "next/image";

interface LandingFaqItemProps {
  question: string;
  answer: string;
}

// The whole row is clickable (the button inside keeps the keyboard and screen reader support).
// The answer stays in the HTML while collapsed (for search engines): the row is folded to
// 0 height with a grid-rows transition instead of being removed.
export default function LandingFaqItem({
  question,
  answer,
}: LandingFaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className="border-t border-fg/15 py-4 tab:py-6 cursor-pointer"
    >
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
        >
          <span className="font-semibold text-[16px] tab:text-[18px] laptop:text-[22px] leading-[normal]">
            {question}
          </span>
          <Image
            src="/images/landing/faq-chevron.svg"
            alt=""
            width={24}
            height={24}
            className={`shrink-0 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 laptop:pt-8 text-[14px] leading-[1.5] whitespace-pre-line">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
