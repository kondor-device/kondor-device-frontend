import { useTranslations } from "next-intl";
import * as yup from "yup";
import { nameRegex, phoneRegex } from "./regex";

export const CheckoutValidation = () => {
  const t = useTranslations("forms.errors");

  const checkoutFormValidationSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, t("nameMinMaxSymbols"))
      .max(30, t("nameMinMaxSymbols"))
      .matches(nameRegex, t("nameAllowedSymbols"))
      .required(t("required")),
    surname: yup
      .string()
      .min(2, t("nameMinMaxSymbols"))
      .max(30, t("nameMinMaxSymbols"))
      .matches(nameRegex, t("nameAllowedSymbols"))
      .required(t("required")),
    phone: yup
      .string()
      .matches(phoneRegex, t("wrongPhone"))
      .test(
        "sixth-char-zero",
        t("startsWithZero"),
        (value) => !!value && value.length >= 6 && value[5] === "0"
      )
      .required(t("required")),
    city: yup.string().required(t("required")),
    postOffice: yup.string().required(t("required")),
    payment: yup.string().required(t("required")),
  });

  return checkoutFormValidationSchema;
};
