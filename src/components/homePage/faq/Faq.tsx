import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";
import FaqList from "./FaqList";

export default function Faq() {
  const t = useTranslations();

  return (
    <Section id="faq">
      <div className="flex items-end gap-x-5 laptop:gap-x-8 mb-5 laptop:mb-[60px]">
        <SectionTitle className="!mb-0 uppercase !text-left whitespace-pre-line">
          {t("homePage.faq.title")}
        </SectionTitle>
        <svg
          aria-hidden="true"
          width="100%"
          height="44"
          className="hidden sm:block flex-1 min-w-0 h-11 translate-y-2 laptop:translate-y-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="faq-dots-line-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
            >
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#FFB505" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="22"
            x2="100%"
            y2="22"
            stroke="url(#faq-dots-line-gradient)"
            strokeWidth="2"
            strokeDasharray="9 9"
          />
          {/* Origin moved to the right edge, so the circles stay pinned to it */}
          <svg x="100%" overflow="visible">
            <circle cx="-22" cy="22" r="22" fill="#FFB300" />
            <circle cx="-76" cy="22" r="16" fill="#FFB300" />
          </svg>
        </svg>
      </div>
      <FaqList />
    </Section>
  );
}
