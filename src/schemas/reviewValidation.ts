import * as yup from "yup";
import { nameRegex, phoneRegex } from "./regex";

export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 30,
  messageMin: 2,
  messageMax: 500,
};

export interface ReviewValidationMessages {
  nameLength: string;
  nameChars: string;
  phone: string;
  phoneStartsWithZero: string;
  rating: string;
  messageLength: string;
  required: string;
}

const DEFAULT_MESSAGES: ReviewValidationMessages = {
  nameLength: "Повинно містити від 2 до 30 символів",
  nameChars: "Допустимі літери та дефіс, апостроф, лапки",
  phone: "Вкажіть правильний номер телефону",
  phoneStartsWithZero: "Після +38 має бути цифра 0",
  rating: "Оберіть оцінку",
  messageLength: "Повинно містити від 2 до 500 символів",
  required: "Дане поле є обов'язковим до заповнення",
};

// Спільна схема для форми (з перекладеними повідомленнями) і для сервера
export const reviewValidation = (
  messages: ReviewValidationMessages = DEFAULT_MESSAGES,
) =>
  yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(REVIEW_LIMITS.nameMin, messages.nameLength)
      .max(REVIEW_LIMITS.nameMax, messages.nameLength)
      .matches(nameRegex, messages.nameChars)
      .required(messages.required),
    phone: yup
      .string()
      .matches(phoneRegex, messages.phone)
      .test(
        "sixth-char-zero",
        messages.phoneStartsWithZero,
        (value) => !!value && value.length >= 6 && value[5] === "0",
      )
      .required(messages.required),
    rating: yup
      .number()
      .integer(messages.rating)
      .min(1, messages.rating)
      .max(5, messages.rating)
      .required(messages.rating),
    message: yup
      .string()
      .trim()
      .min(REVIEW_LIMITS.messageMin, messages.messageLength)
      .max(REVIEW_LIMITS.messageMax, messages.messageLength)
      .required(messages.required),
  });
