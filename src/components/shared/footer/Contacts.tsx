import React from "react";
import Image from "next/image";
import {
  EMAIL_FIRST,
  EMAIL_SECOND,
  INSTAGRAM,
  INSTAGRAM_URL,
  TELEGRAM,
  TELEGRAM_URL,
} from "@/constants/constants";
import FooterSubTitle from "./FooterSubTitle";
import { useTranslations } from "next-intl";

export default function Contacts() {
  const t = useTranslations();

  return (
    <div>
      <FooterSubTitle>{t("footer.contacts.title")}</FooterSubTitle>
      <ul className="flex flex-col gap-y-[10px] laptop:gap-y-[15px]">
        <li>
          <a
            href={`mailto:${EMAIL_FIRST}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex text-12med laptop:text-18med outline-none laptop:hover:text-yellow focus-visible:text-yellow active:text-yellow transition duration-300 ease-out"
          >
            <Image
              src="/images/icons/envelopeSmall.svg"
              alt="email"
              width="20"
              height="21"
              className="w-5 laptop:w-6 h-auto mr-[10px]"
            />
            {EMAIL_FIRST}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${EMAIL_SECOND}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex text-12med laptop:text-18med outline-none laptop:hover:text-yellow focus-visible:text-yellow active:text-yellow transition duration-300 ease-out"
          >
            <Image
              src="/images/icons/envelopeSmall.svg"
              alt="email"
              width="20"
              height="21"
              className="w-5 laptop:w-6 h-auto mr-[10px]"
            />{" "}
            {EMAIL_SECOND}
          </a>
        </li>
        <li>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={TELEGRAM}
            className="flex text-12med laptop:text-18med outline-none laptop:hover:text-yellow focus-visible:text-yellow active:text-yellow transition duration-300 ease-out"
          >
            <Image
              src="/images/icons/telegramSmall.svg"
              alt="email"
              width="20"
              height="21"
              className="w-5 laptop:w-6 h-auto mr-[10px]"
            />{" "}
            {TELEGRAM}
          </a>
        </li>
        <li>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={INSTAGRAM}
            className="flex text-12med laptop:text-18med outline-none laptop:hover:text-yellow focus-visible:text-yellow active:text-yellow transition duration-300 ease-out"
          >
            <Image
              src="/images/icons/instagramSmall.svg"
              alt="email"
              width="20"
              height="21"
              className="w-5 laptop:w-6 h-auto mr-[10px]"
            />
            {INSTAGRAM}
          </a>
        </li>
      </ul>
    </div>
  );
}
