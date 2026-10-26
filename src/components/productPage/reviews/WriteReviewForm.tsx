"use client";
import { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import MaskedInput from "react-text-mask";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useLocale, useTranslations } from "next-intl";
import RatingField from "@/components/shared/forms/formComponents/RatingField";
import Button from "@/components/shared/buttons/Button";
import { PHONE_NUMBER_MASK } from "@/constants/constants";
import { reviewValidation, REVIEW_LIMITS } from "@/schemas/reviewValidation";

interface ReviewFormValues { name: string; phone: string; rating: number; message: string }
type Status = "idle" | "success" | "error" | "duplicate" | "tooMany";
interface WriteReviewFormProps { itemId: string }

const initialValues: ReviewFormValues = { name: "", phone: "", rating: 0, message: "" };
const fieldStyles = "w-full min-h-11 rounded-xl border border-fg/20 bg-surface px-3 py-3 text-[14px] leading-5 text-fg placeholder:text-fg/45 outline-none transition-colors focus:border-yellow focus:ring-2 focus:ring-yellow/30 aria-[invalid=true]:border-inputError";

export default function WriteReviewForm({ itemId }: WriteReviewFormProps) {
  const t = useTranslations("productPage.reviews");
  const tForms = useTranslations("forms");
  const locale = useLocale();
  const fieldPrefix = useId();
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") confirmation.current?.focus({ preventScroll: true });
  }, [status]);

  const validationSchema = reviewValidation({
    nameLength: tForms("errors.nameMinMaxSymbols"),
    nameChars: tForms("errors.nameAllowedSymbols"),
    phone: tForms("errors.wrongPhone"),
    phoneStartsWithZero: tForms("errors.startsWithZero"),
    rating: tForms("errors.ratingRequired"),
    messageLength: tForms("errors.reviewLength", { min: REVIEW_LIMITS.messageMin, max: REVIEW_LIMITS.messageMax }),
    required: tForms("errors.required"),
  });

  const submit = async (values: ReviewFormValues, { resetForm }: FormikHelpers<ReviewFormValues>) => {
    try {
      await axios.post("/api/reviews", {
        itemId, ...values, locale, website: honeypot.current?.value ?? "", startedAt: startedAt.current,
      });
      resetForm();
      setStatus("success");
    } catch (error) {
      const code = axios.isAxiosError(error) ? error.response?.status : null;
      setStatus(code === 409 ? "duplicate" : code === 429 ? "tooMany" : "error");
    }
  };

  if (status === "success") {
    return (
      <div ref={confirmation} role="status" tabIndex={-1} className="py-6 outline-none">
        <h3 className="mb-3 text-[20px] font-bold leading-tight">{t("successTitle")}</h3>
        <p className="text-[15px] leading-6 text-fg/70">{t("successText")}</p>
      </div>
    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submit} validateOnMount>
      {({ errors, touched, dirty, isValid, isSubmitting, values }) => (
        <Form className="relative space-y-4" noValidate aria-labelledby={`${fieldPrefix}-title`} aria-busy={isSubmitting}>
          <h3 id={`${fieldPrefix}-title`} className="text-[20px] leading-tight font-bold">{t("form.title")}</h3>
          <RatingField />
          <div>
            <label htmlFor={`${fieldPrefix}-name`} className="mb-2 block text-[14px] leading-5 font-medium">{tForms("name")} *</label>
            <Field id={`${fieldPrefix}-name`} name="name" type="text" autoComplete="name" required
              maxLength={REVIEW_LIMITS.nameMax} placeholder={t("form.namePlaceholder")} className={fieldStyles}
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? `${fieldPrefix}-name-error` : undefined} />
            {touched.name && errors.name ? <p id={`${fieldPrefix}-name-error`} className="mt-1 text-[12px] leading-4 text-inputError">{errors.name}</p> : null}
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-phone`} className="mb-2 block text-[14px] leading-5 font-medium">{tForms("phone")} *</label>
            <Field as={MaskedInput} mask={PHONE_NUMBER_MASK} id={`${fieldPrefix}-phone`} name="phone"
              type="tel" inputMode="tel" autoComplete="tel" required placeholder="+38 (0__) ___-__-__" className={fieldStyles}
              aria-invalid={!!(touched.phone && errors.phone)}
              aria-describedby={touched.phone && errors.phone ? `${fieldPrefix}-phone-error` : undefined} />
            {touched.phone && errors.phone ? <p id={`${fieldPrefix}-phone-error`} className="mt-1 text-[12px] leading-4 text-inputError">{errors.phone}</p> : null}
          </div>
          <div>
            <label htmlFor={`${fieldPrefix}-message`} className="mb-2 block text-[14px] leading-5 font-medium">{t("form.message")}</label>
            <Field as="textarea" id={`${fieldPrefix}-message`} name="message" required rows={4}
              maxLength={REVIEW_LIMITS.messageMax} placeholder={t("form.messagePlaceholder")}
              className={`${fieldStyles} min-h-[120px] resize-y`}
              aria-invalid={!!(touched.message && errors.message)}
              aria-describedby={touched.message && errors.message ? `${fieldPrefix}-message-error` : undefined} />
            <div className="mt-1 flex justify-between gap-2 text-[12px] leading-4">
              <span id={`${fieldPrefix}-message-error`} className="text-inputError">{touched.message ? errors.message : ""}</span>
              <span className="shrink-0 text-fg/55">{values.message.length}/{REVIEW_LIMITS.messageMax}</span>
            </div>
          </div>
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute -left-[9999px] size-0 opacity-0" />
          {status !== "idle" ? (
            <p role="alert" className="text-[14px] leading-5 text-inputError">
              {t(status === "duplicate" ? "duplicate" : status === "tooMany" ? "tooMany" : "errorText")}
            </p>
          ) : null}
          <Button type="submit" disabled={!(dirty && isValid) || isSubmitting} isLoading={isSubmitting}
            className="w-full !min-h-12 !py-3 !px-4 focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2">
            {t("form.submit")}
          </Button>
          <p className="text-[12px] leading-5 text-fg/60">{t("form.moderationNote")}</p>
        </Form>
      )}
    </Formik>
  );
}
