"use client";
import { useRef, useState } from "react";
import axios from "axios";
import MaskedInput from "react-text-mask";
import { Form, Formik, FormikHelpers } from "formik";
import { useLocale, useTranslations } from "next-intl";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RatingField from "@/components/shared/forms/formComponents/RatingField";
import Button from "@/components/shared/buttons/Button";
import PopUpTitle from "@/components/shared/titles/PopUpTitle";
import { useModalStore } from "@/store/modalStore";
import { PHONE_NUMBER_MASK } from "@/constants/constants";
import { reviewValidation, REVIEW_LIMITS } from "@/schemas/reviewValidation";

export const WRITE_REVIEW_MODAL = "writeReview";
export const WRITE_REVIEW_MODAL_STYLES =
  "laptop:!max-w-[600px] laptop:!w-[600px]";

interface ReviewFormValues {
  name: string;
  phone: string;
  rating: number;
  message: string;
}

type Status = "idle" | "success" | "error" | "duplicate" | "tooMany";

interface WriteReviewFormProps {
  itemId: string;
}

const initialValues: ReviewFormValues = {
  name: "",
  phone: "",
  rating: 0,
  message: "",
};

export default function WriteReviewForm({ itemId }: WriteReviewFormProps) {
  const t = useTranslations("productPage.reviews");
  const tForms = useTranslations("forms");
  const locale = useLocale();
  const closeModal = useModalStore((state) => state.closeModal);

  const [status, setStatus] = useState<Status>("idle");
  // Форма монтується заново при кожному відкритті модалки, тож це час початку заповнення
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  const validationSchema = reviewValidation({
    nameLength: tForms("errors.nameMinMaxSymbols"),
    nameChars: tForms("errors.nameAllowedSymbols"),
    phone: tForms("errors.wrongPhone"),
    phoneStartsWithZero: tForms("errors.startsWithZero"),
    rating: tForms("errors.ratingRequired"),
    messageLength: tForms("errors.reviewLength", {
      min: REVIEW_LIMITS.messageMin,
      max: REVIEW_LIMITS.messageMax,
    }),
    required: tForms("errors.required"),
  });

  const submit = async (
    values: ReviewFormValues,
    { resetForm }: FormikHelpers<ReviewFormValues>,
  ) => {
    try {
      await axios.post("/api/reviews", {
        itemId,
        ...values,
        locale,
        website: honeypot.current?.value ?? "",
        startedAt: startedAt.current,
      });
      resetForm();
      setStatus("success");
    } catch (error) {
      const code = axios.isAxiosError(error) ? error.response?.status : null;
      setStatus(
        code === 409 ? "duplicate" : code === 429 ? "tooMany" : "error",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center">
        <PopUpTitle>{t("successTitle")}</PopUpTitle>
        <p className="mb-6 text-12med laptop:text-18med">{t("successText")}</p>
        <Button onClick={closeModal} className="w-full max-w-[350px]">
          {t("close")}
        </Button>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {({ errors, touched, dirty, isValid, isSubmitting }) => (
        <Form className="flex flex-col gap-y-5" noValidate>
          <PopUpTitle>{t("form.title")}</PopUpTitle>
          <p className="text-12med laptop:text-14med">{t("form.intro")}</p>
          <CustomizedInput
            fieldName="name"
            label={tForms("name")}
            required
            placeholder={tForms("name")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="phone"
            inputType="tel"
            label={tForms("phone")}
            required
            placeholder={tForms("phone")}
            as={MaskedInput}
            mask={PHONE_NUMBER_MASK}
            errors={errors}
            touched={touched}
          />
          <RatingField />
          <CustomizedInput
            fieldName="message"
            as="textarea"
            label={t("form.message")}
            required
            placeholder={t("form.message")}
            errors={errors}
            touched={touched}
            wrapperClassName="before:!rounded-[20px]"
            fieldClassName="!rounded-[20px] !h-[140px] resize-none"
          />
          {/* Honeypot: невидиме для людей поле, яке заповнюють боти */}
          <input
            ref={honeypot}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] size-0 opacity-0"
          />
          {status !== "idle" ? (
            <p role="alert" className="text-12med text-inputError">
              {t(
                status === "duplicate"
                  ? "duplicate"
                  : status === "tooMany"
                    ? "tooMany"
                    : "errorText",
              )}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={!(dirty && isValid) || isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
          >
            {t("form.submit")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
