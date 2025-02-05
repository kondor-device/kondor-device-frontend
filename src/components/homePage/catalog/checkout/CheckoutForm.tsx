"use client";
import { Form, FormikProps } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import MaskedInput from "react-text-mask";

import { PHONE_NUMBER_MASK } from "@/constants/constants";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import { ValuesCheckoutFormType } from "./CheckoutPopUp";

interface CheckoutFormProps {
  formik: FormikProps<ValuesCheckoutFormType>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutForm({ formik }: CheckoutFormProps) {
  const t = useTranslations();

  return (
    <Form className="flex flex-col laptop:flex-row laptop:flex-wrap laptop:justify-between gap-y-4 w-full">
      <CustomizedInput
        fieldName="name"
        label={t("forms.name")}
        required={true}
        placeholder={t("forms.name")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="surname"
        label={t("forms.surname")}
        required={true}
        placeholder={t("forms.surname")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="phone"
        label={t("forms.phone")}
        required={true}
        placeholder={t("forms.phone")}
        errors={formik.errors}
        touched={formik.touched}
        as={MaskedInput}
        showPhonePrefix={true}
        mask={PHONE_NUMBER_MASK}
      />
      <CustomizedInput
        fieldName="city"
        label={t("forms.city")}
        required={true}
        placeholder={t("forms.city")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="postOffice"
        label={t("forms.postOffice")}
        required={true}
        placeholder={t("forms.postOffice")}
        errors={formik.errors}
        touched={formik.touched}
      />
      <CustomizedInput
        fieldName="promocode"
        label={t("forms.promocode")}
        required={true}
        placeholder={t("forms.promocode")}
        errors={formik.errors}
        touched={formik.touched}
      />

      <div
        role="group"
        aria-labelledby="radio-group"
        className="flex flex-col gap-4 deskxl:gap-[22px] deskxl:mt-6"
      >
        <p
          id="radio-group"
          className="text-inputLabel text-14bold laptop:text-16bold deskxl:text-20bold"
        >
          {t("forms.paymentMethods")}
        </p>
        <RadioButtonInput
          fieldName="payment"
          label={t("forms.online")}
          value="Онлайн оплата (Wayforpay)"
          placeholder={t("forms.online")}
          errors={formik.errors}
          touched={formik.touched}
        />
        <RadioButtonInput
          fieldName="payment"
          label={
            <>
              <span>{t("forms.postpaid")}</span>
              <span className="text-yellow">{t("forms.comission")}</span>
            </>
          }
          value="Оплата частинами (LiqPay)"
          placeholder={t("forms.postpaid")}
          errors={formik.errors}
          touched={formik.touched}
        />
      </div>
    </Form>
  );
}
