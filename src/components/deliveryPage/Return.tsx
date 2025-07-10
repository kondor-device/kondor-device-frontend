import { useTranslations } from "next-intl";
import {
  INSTAGRAM,
  INSTAGRAM_URL,
  TELEGRAM,
  TELEGRAM_URL,
  EMAIL_FIRST,
} from "@/constants/constants";

export default function Return() {
  const t = useTranslations("deliveryPage.return");

  return (
    <section className="flex flex-col gap-y-5 container max-w-[1920px] pb-5 laptop:pb-[100px]">
      <h2 className="text-14semi laptop:text-28semi">{t("title")}</h2>
      <p className="text-12reg laptop:text-24reg">
        {t("descOne")}
        <a
          href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t("law")}
        </a>
        {t("descTwo")}
      </p>
      <p className="text-12reg laptop:text-24reg">
        {t("descThree")}{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={INSTAGRAM}
          className=" text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
        >
          {INSTAGRAM}
        </a>{" "}
        {t("descFour")}{" "}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={TELEGRAM}
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
        >
          {TELEGRAM}
        </a>
        .
      </p>
      <h3 className="font-bold">{t("terms")}</h3>
      <p className="text-12reg laptop:text-24reg">
        {t("termsOne")}
        <span className="text-12semi laptop:text-24semi">{t("daysQty")}</span>
        {t("termsTwo")}
      </p>
      <p className="text-12reg laptop:text-24reg">
        <span className="text-12semi laptop:text-24semi">
          {t("termsThree")}
        </span>
        {t("termsFour")}
      </p>
      <h3 className="mt-8 font-bold">{t("conditionsOk")}</h3>
      <p className="text-12reg laptop:text-24reg">
        {t("conditionsOkOne")}{" "}
        <a
          href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t("law")}
        </a>
        {t("conditionsOkTwo")}
      </p>
      <ul className="flex flex-col gap-y-5 list-disc pl-4 laptop:pl-6">
        <li className="text-12reg laptop:text-24reg">
          {" "}
          {t("conditionsOkThree")}
        </li>
        <li className="text-12reg laptop:text-24reg">
          {" "}
          {t("conditionsOkFour")}
        </li>
      </ul>
      <p className="text-12reg laptop:text-24reg">{t("returnOkOne")}</p>
      <p className="text-12reg laptop:text-24reg">{t("returnOkTwo")}</p>
      <ul className="flex flex-col gap-y-5 list-disc pl-4 laptop:pl-6">
        <li className="text-12reg laptop:text-24reg"> {t("returnOkThree")}</li>
        <li className="text-12reg laptop:text-24reg">{t("returnOkFour")}</li>
        <li className="text-12reg laptop:text-24reg">{t("returnOkFive")}</li>
        <li className="text-12reg laptop:text-24reg">{t("returnOkSix")}</li>
      </ul>
      <p className="text-12reg laptop:text-24reg">{t("returnOkSeven")}</p>
      <p className="text-12reg laptop:text-24reg">{t("returnOkEight")}</p>
      <p className="text-12reg laptop:text-24reg">
        <span className="font-semibold">{t("returnOkNine")}</span>
        {t("returnOkTen")}
      </p>
      <h3 className="mt-8 font-bold">{t("conditionsNotOk")}</h3>
      <p className="text-12reg laptop:text-24reg">
        {t("conditionsNotOkOne")}{" "}
        <a
          href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t("law")}
        </a>
        {t("conditionsNotOkTwo")}
      </p>
      <ul className="flex flex-col gap-y-5 list-disc pl-4 laptop:pl-6">
        <li className="text-12reg laptop:text-24reg">
          {t("conditionsNotOkThree")}
        </li>
        <li className="text-12reg laptop:text-24reg">
          {t("conditionsNotOkFour")}
        </li>
        <li className="text-12reg laptop:text-24reg">
          {t("conditionsNotOkFive")}
        </li>
        <li className="text-12reg laptop:text-24reg">
          {t("conditionsNotOkSix")}{" "}
          <a
            href={`mailto:${EMAIL_FIRST}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          >
            {EMAIL_FIRST}
          </a>
          {t("conditionsNotOkSeven")}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={TELEGRAM}
            className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          >
            {TELEGRAM}
          </a>
          .
        </li>
      </ul>
      <p className="text-12reg laptop:text-24reg">
        {t("conditionsNotOkEight")}
      </p>
      <p className="text-12reg laptop:text-24reg">{t("conditionsNotOkNine")}</p>
      <p className="text-12reg laptop:text-24reg">
        <span className="font-semibold">{t("returnNotOkOne")}</span>
        {t("returnNotOkTwo")}
      </p>
      <p className="text-12reg laptop:text-24reg">
        {t("declineOne")}{" "}
        <a
          href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t("law")}
        </a>
        {t("declineTwo")}
        <a
          href="https://zakon.rada.gov.ua/laws/show/216-91-%D0%BF#Text"
          className="text-yellow laptop:hover:brightness-125 transition duration-300 ease-out"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {t("declineThree")}
        </a>
        .
      </p>
    </section>
  );
}
