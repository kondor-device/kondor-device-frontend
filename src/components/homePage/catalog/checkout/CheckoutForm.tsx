"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";

import { PHONE_NUMBER_MASK } from "@/constants/constants";
import { ContactUsValidation } from "@/schemas/contactUsFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";

import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import RadioButtonInput from "@/components/shared/forms/formComponents/RadioButtonInput";
import SubmitButton from "@/components/shared/forms/formComponents/SubmitButton";

export interface ValuesContactUsFormType {
  name: string;
  surname: string;
  phone: string;
  city: string;
  postOffice: string;
  promocode: string;
  payment: string;
}

interface ContactUsFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
}

export default function ContactUsForm({
  setIsError,
  setIsNotificationShown,
}: ContactUsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const initialValues = {
    name: "",
    surname: "",
    phone: "",
    city: "",
    postOffice: "",
    promocode: "",
    payment: "",
  };

  const validationSchema = ContactUsValidation();

  const submitForm = async (
    values: ValuesContactUsFormType,
    formikHelpers: FormikHelpers<ValuesContactUsFormType>
  ) => {
    const data =
      `<b>Замовлення ""</b>\n` +
      `Ім'я: ${values.name.trim()}\n` +
      `Прізвище: ${values.surname.trim()}\n` +
      `Телефон: +38${values.phone.replace(/[^\d+]/g, "")}\n` +
      `Насeлений пункт: ${values.city.trim()}\n` +
      `Відділення Нової пошти: ${values.postOffice.trim() || ""}\n` +
      `Промокод: ${values.promocode?.trim()}\n` +
      `\n`;

    await handleSubmitForm<ValuesContactUsFormType>(
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
        <Form className="flex flex-col gap-y-4 w-full h-full tab:p-12 rounded-[24px] tab:bg-white tab:shadow-base">
          <CustomizedInput
            fieldName="name"
            label={t("forms.name")}
            required={true}
            placeholder={t("forms.namePlaceholder")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="surname"
            label={t("forms.surname")}
            required={true}
            placeholder={t("forms.namePlaceholder")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="phone"
            label={t("forms.phone")}
            required={true}
            placeholder={t("forms.phonePlaceholder")}
            errors={errors}
            touched={touched}
            as={MaskedInput}
            image="/images/icons/phonePrefix.svg"
            fieldClassName="pl-[70px]"
            mask={PHONE_NUMBER_MASK}
          />
          <CustomizedInput
            fieldName="city"
            label={t("forms.city")}
            required={true}
            placeholder={t("forms.cityPlaceholder")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="postOffice"
            label={t("forms.postOffice")}
            required={true}
            placeholder={t("forms.cityPlaceholder")}
            errors={errors}
            touched={touched}
          />
          <CustomizedInput
            fieldName="promocode"
            label={t("forms.promocode")}
            required={true}
            placeholder={t("forms.cityPlaceholder")}
            errors={errors}
            touched={touched}
          />
          <p id="radio-group" className="text-inputLabel text-sm">
            {t("forms.paymentMethods")}
          </p>
          <div
            role="group"
            aria-labelledby="radio-group"
            className="flex flex-wrap gap-4"
          >
            <RadioButtonInput
              fieldName="payment"
              label={t("forms.online")}
              value="Онлайн оплата (Wayforpay)"
              required={true}
              placeholder={t("forms.cityPlaceholder")}
              errors={errors}
              touched={touched}
            />
            <RadioButtonInput
              fieldName="payment"
              label={t("forms.postpaid")}
              value="Післяплата Нова пошта"
              required={false}
              placeholder={t("forms.cityPlaceholder")}
              errors={errors}
              touched={touched}
            />
          </div>
          <SubmitButton dirty={dirty} isValid={isValid} isLoading={isLoading}>
            {t("buttons.sendMessage")}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
