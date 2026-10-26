"use client";
import { KeyboardEvent, useId, useRef, useState } from "react";
import { useField } from "formik";
import { useTranslations } from "next-intl";
import IconStar from "@/components/shared/icons/IconStar";

const STARS = [1, 2, 3, 4, 5];

export default function RatingField() {
  const t = useTranslations("productPage.reviews");
  const [field, meta, helpers] = useField<number>("rating");
  const [hovered, setHovered] = useState(0);
  const labelId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const active = hovered || field.value;
  const select = (value: number) => {
    helpers.setValue(value);
    helpers.setTouched(true, false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: number) => {
    let next = value;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = value === 5 ? 1 : value + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = value === 1 ? 5 : value - 1;
    else if (event.key === "Home") next = 1;
    else if (event.key === "End") next = 5;
    else return;
    event.preventDefault();
    setHovered(0);
    select(next);
    buttons.current[next - 1]?.focus();
  };

  return (
    <div>
      <p id={labelId} className="mb-1 text-[14px] leading-5 font-medium">{t("form.rating")}</p>
      <div role="radiogroup" aria-labelledby={labelId} aria-required="true"
        aria-describedby={meta.touched && meta.error ? `${labelId}-error` : undefined}
        className="flex flex-wrap gap-0 tab:gap-1" onMouseLeave={() => setHovered(0)}>
        {STARS.map(value => (
          <button key={value} ref={node => { buttons.current[value - 1] = node; }}
            type="button" role="radio" aria-checked={field.value === value}
            aria-label={t("ratingLabel", { value })}
            tabIndex={field.value === value || (!field.value && value === 1) ? 0 : -1}
            onClick={() => select(value)} onKeyDown={event => onKeyDown(event, value)}
            onMouseEnter={() => setHovered(value)}
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-yellow outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
            <IconStar className="size-8" outlined={value > active} />
          </button>
        ))}
      </div>
      {meta.touched && meta.error ? <p id={`${labelId}-error`} className="mt-1 text-[12px] leading-4 text-inputError">{meta.error}</p> : null}
    </div>
  );
}
