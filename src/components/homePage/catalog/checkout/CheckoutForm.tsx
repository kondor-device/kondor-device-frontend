"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";

import { PHONE_NUMBER_MASK } from "@/constants/constants";
import { CheckoutValidation } from "@/schemas/checkoutFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";

import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import SubmitButton from "@/components/shared/forms/formComponents/SubmitButton";

export interface ValuesCheckoutFormType {
  name: string;
  surname: string;
  phone: string;
  city: string;
  postOffice: string;
  promocode: string;
  payment: string;
}

interface CheckoutFormProps {
  setIsError?: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown?: Dispatch<SetStateAction<boolean>>;
}

export default function CheckoutForm({
  setIsError,
  setIsNotificationShown,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const initialValues = {
    name: "",
    surname: "",
    phone: "",
    city: "",
    postOffice: "",
    promocode: "",
    payment: "Онлайн оплата (Wayforpay)",
  };

  const validationSchema = CheckoutValidation();

  const submitForm = async (
    values: ValuesCheckoutFormType,
    formikHelpers: FormikHelpers<ValuesCheckoutFormType>
  ) => {
    const data =
      `<b>Замовлення ""</b>\n` +
      `Ім'я: ${values.name.trim()}\n` +
      `Прізвище: ${values.surname.trim()}\n` +
      `Телефон: +38${values.phone.replace(/[^\d+]/g, "")}\n` +
      `Насeлений пункт: ${values.city.trim()}\n` +
      `Відділення Нової пошти: ${values.postOffice.trim() || ""}\n` +
      `Промокод: ${values.promocode?.trim()}\n` +
      `Оплата: ${values.payment.trim()}\n`;

    await handleSubmitForm<ValuesCheckoutFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsNotificationShown,
      data,
      values
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({ errors, touched, dirty, isValid }) => (
        <Form className="flex flex-col laptop:flex-row laptop:flex-wrap laptop:justify-between gap-y-4 w-full">
          <CustomizedInput
            fieldName="name"
            label={t("forms.name")}
            required={true}
            placeholder={t("forms.name")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="surname"
            label={t("forms.surname")}
            required={true}
            placeholder={t("forms.surname")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="phone"
            label={t("forms.phone")}
            required={true}
            placeholder={t("forms.phone")}
            errors={errors}
            touched={touched}
            as={MaskedInput}
            showPhonePrefix={true}
            mask={PHONE_NUMBER_MASK}
          />
          <CustomizedInput
            fieldName="city"
            label={t("forms.city")}
            required={true}
            placeholder={t("forms.city")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="postOffice"
            label={t("forms.postOffice")}
            required={true}
            placeholder={t("forms.postOffice")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="promocode"
            label={t("forms.promocode")}
            required={true}
            placeholder={t("forms.promocode")}
            errors={errors}
            touched={touched}
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
              errors={errors}
              touched={touched}
            />
            <RadioButtonInput
              fieldName="payment"
              label={
                <>
                  <span>{t("forms.postpaid")}</span>
                  <span className="text-yellow">{t("forms.comission")}</span>
                </>
              }
              value="Післяплата Нова пошта"
              placeholder={t("forms.postpaid")}
              errors={errors}
              touched={touched}
            />
            <p className="text-10med laptop:text-12med deskxl:text-16med text-grey">
              {t("forms.freeDelivery")}
            </p>
          </div>
          <SubmitButton dirty={dirty} isValid={isValid} isLoading={isLoading}>
            {t("buttons.makeOrder")}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
