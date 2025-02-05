import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { generateOrderNumber } from "./generateOrderNumber";

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsCheckoutPopUpShown: Dispatch<SetStateAction<boolean>>,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  values: ValuesCheckoutFormType,
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);

    const orderNumber = generateOrderNumber();

    const dataTelegram =
      `<b>Замовлення #${orderNumber}</b>\n` +
      `Ім'я: ${values.name.trim()}\n` +
      `Прізвище: ${values.surname.trim()}\n` +
      `Телефон: +38${values.phone.replace(/[^\d+]/g, "")}\n` +
      `Насeлений пункт: ${values.city.trim()}\n` +
      `Відділення Нової пошти: ${values.postOffice.trim() || ""}\n` +
      `Промокод: ${values.promocode?.trim()}\n` +
      `Оплата: ${values.payment.trim()}\n`;

    const dataGoogle = {
      orderNumber,
      name: values.name.trim(),
      surname: values.surname.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      postOffice: values.postOffice.trim(),
      promocode: values.promocode.trim(),
      payment: values.payment.trim(),
    };

    await Promise.all([
      axios({
        method: "post",
        url: "/api/telegram",
        data: dataTelegram,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      axios({
        method: "post",
        url: "/api/googlesheet",
        data: dataGoogle,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    resetForm();

    const { clearCart } = useCartStore.getState();
    clearCart();

    setIsCheckoutPopUpShown(false);

    if (setIsPopUpShown) {
      setIsPopUpShown(false);
    }
  } catch (error) {
    setIsError(true);
    return error;
  } finally {
    setIsLoading(false);
    setIsNotificationShown(true);
  }
};
