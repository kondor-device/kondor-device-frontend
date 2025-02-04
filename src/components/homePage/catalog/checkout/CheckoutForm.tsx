"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import MaskedInput from "react-text-mask";

import { PHONE_NUMBER_MASK } from "@/constants/constants";
import { ContactUsValidation } from "@/schemas/contactUsFormValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { parseUtmParams } from "@/utils/parseUtmPatams";

import CustomizedInput from "./formComponents/CustomizedInput";
import SecondaryRadioButtonInput from "./formComponents/SecondaryRadioButtonInput";
import SubmitButton from "./formComponents/SubmitButton";
import FormDescription from "./FormDescription";

export interface ValuesContactUsFormType {
  name: string;
  phone: string;
  city: string;
  equipment: string;
  message: string;
}

const APPLICATION_NAME = "Контактна форма з Facebook";

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
  const searchParams = useSearchParams().toString();

  const initialValues = {
    name: "",
    phone: "",
    city: "",
    equipment: "",
    message: "",
  };

  const validationSchema = ContactUsValidation();

  const utmParams = parseUtmParams(searchParams);

  const submitForm = async (
    values: ValuesContactUsFormType,
    formikHelpers: FormikHelpers<ValuesContactUsFormType>
  ) => {
    const data =
      `<b>Заявка "${APPLICATION_NAME}"</b>\n` +
      `Ім'я: ${values.name.trim()}\n` +
      `Телефон: +38${values.phone.replace(/[^\d+]/g, "")}\n` +
      `Насeлений пункт: ${values.city.trim()}\n` +
      `Де ви плануєте поставити обладнання?: ${
        values.equipment?.trim() || ""
      }\n` +
      `Повідомлення: ${values.message.trim()}\n` +
      `\n` +
      `${utmParams}`;

    await handleSubmitForm<ValuesContactUsFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsNotificationShown,
      data,
      values,
      APPLICATION_NAME
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
            required={false}
            placeholder={t("forms.cityPlaceholder")}
            errors={errors}
            touched={touched}
          />
          <p id="radio-group" className="text-inputLabel text-sm">
            {t("forms.equipment")}
          </p>
          <div
            role="group"
            aria-labelledby="radio-group"
            className="flex flex-wrap gap-4"
          >
            <SecondaryRadioButtonInput
              fieldName="equipment"
              label={t("forms.apartment")}
              value="Квартира"
              required={false}
              placeholder={t("forms.cityPlaceholder")}
              errors={errors}
              touched={touched}
            />
            <SecondaryRadioButtonInput
              fieldName="equipment"
              label={t("forms.house")}
              value="Будинок"
              required={false}
              placeholder={t("forms.cityPlaceholder")}
              errors={errors}
              touched={touched}
            />
            <SecondaryRadioButtonInput
              fieldName="equipment"
              label={t("forms.company")}
              value="Підприємство"
              required={false}
              placeholder={t("forms.cityPlaceholder")}
              errors={errors}
              touched={touched}
            />
          </div>
          <CustomizedInput
            fieldName="message"
            label={t("forms.comment")}
            required={false}
            placeholder={t("forms.commentPlaceholder")}
            errors={errors}
            touched={touched}
            as="textarea"
            wrapperClassName="h-[92px]"
            fieldClassName="min-h-[92px] resize-none"
          />
          <FormDescription title={t("buttons.sendMessage")} />
          <SubmitButton dirty={dirty} isValid={isValid} isLoading={isLoading}>
            {t("buttons.sendMessage")}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
