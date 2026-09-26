"use client";
import { ReactNode, useState } from "react";
import Image from "next/image";

interface FaqAccordionProps {
  items: { id: string; question: string; answer: ReactNode }[];
}

/** Accordion shell; the answers are Portable Text rendered on the server. */
export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-y-[9px] laptop:gap-y-4">
      {items.map(({ id, question, answer }) => {
        const isOpen = openId === id;

        return (
          <li
            key={id}
            className="rounded-[11px] laptop:rounded-[20px] shadow-card bg-surface"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`blog-faq-${id}`}
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex items-center w-full px-5 py-4 laptop:px-8 laptop:py-6 text-left cursor-pointer outline-none focus-visible:brightness-125"
            >
              <Image
                src="/images/icons/question.svg"
                alt=""
                width="24"
                height="25"
                className="w-5 laptop:w-8 h-auto mr-3 laptop:mr-6 shrink-0"
              />
              <h3 className="mr-3 laptop:mr-5 text-12bold laptop:text-18bold">
                {question}
              </h3>
              <Image
                src="/images/icons/cross.svg"
                alt=""
                width="32"
                height="33"
                className={`w-[10px] laptop:w-5 h-auto ml-auto shrink-0 transition duration-500 ease-in-out ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              />
            </button>
            <div
              id={`blog-faq-${id}`}
              role="region"
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-4 laptop:px-8 laptop:pb-6 pl-[52px] laptop:pl-[88px]">
                  {answer}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
