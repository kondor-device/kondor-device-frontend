"use client";
import { KeyboardEvent, useState } from "react";
import { ErrorMessage, useField } from "formik";
import { useTranslations } from "next-intl";
import IconStar from "@/components/shared/icons/IconStar";

const STARS = [1, 2, 3, 4, 5];

// Вибір оцінки зірками (Formik-поле "rating"): radiogroup із керуванням стрілками
export default function RatingField() {
  const t = useTranslations("productPage.reviews");
  const [field, , helpers] = useField<number>("rating");
  const [hovered, setHovered] = useState(0);

  const active = hovered || field.value;

  const select = (value: number) => {
    helpers.setValue(value);
    helpers.setTouched(true, false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = field.value || 0;

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      select(Math.min(5, current + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      select(Math.max(1, current - 1));
    }
  };

  return (
    <div className="relative">
      <p className="mb-2 text-12med laptop:text-14med">{t("form.rating")}</p>
      <div
        role="radiogroup"
        aria-label={t("form.rating")}
        className="flex gap-x-1"
        onMouseLeave={() => setHovered(0)}
      >
        {STARS.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={field.value === value}
            aria-label={t("ratingLabel", { value })}
            // roving tabindex: у фокусі лише обрана (або перша) зірка
            tabIndex={field.value === value || (!field.value && value === 1) ? 0 : -1}
            onClick={() => select(value)}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setHovered(value)}
            className={`rounded-full p-0.5 outline-none transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-yellow enabled:active:scale-90 ${
              value <= active ? "text-yellow" : "text-grey/40"
            }`}
          >
            <IconStar className="size-8 tab:size-9" />
          </button>
        ))}
      </div>
      <ErrorMessage
        name="rating"
        component="p"
        className="absolute -bottom-[14px] left-2 text-10med text-inputError"
      />
    </div>
  );
}
