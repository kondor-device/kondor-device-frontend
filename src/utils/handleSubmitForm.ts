import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { generateOrderNumber } from "./generateOrderNumber";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsCheckoutPopUpShown: (value: boolean) => void,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  values: ValuesCheckoutFormType
) => {
  try {
    setIsLoading(true);

    const { clearOrderData, setOrderData } = useOrderStore.getState();
    const { clearCart, cartItems, getTotalAmount } = useCartStore.getState();

    clearOrderData();

    const orderNumber = generateOrderNumber();
    const totalSum = getTotalAmount();
    const orderedListProducts = cartItems
      .map(
        (cartItem) =>
          `- ${cartItem.generalName} ${cartItem.name}, колір: ${cartItem.color}`
      )
      .join("\n");

    const orderData = {
      orderNumber,
      name: values.name.trim(),
      surname: values.surname.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      postOffice: values.postOffice.trim(),
      promocode: values.promocode.trim(),
      payment: values.payment.trim(),
      cartItems,
      totalSum,
    };

    setOrderData(orderData);

    const dataTelegram =
      `<b>Замовлення #${orderNumber}</b>\n` +
      `<b>Ім'я:</b> ${values.name.trim()}\n` +
      `<b>Прізвище:</b> ${values.surname.trim()}\n` +
      `<b>Телефон:</b> ${values.phone.replace(/[^\d+]/g, "")}\n` +
      `<b>Насeлений пункт:</b> ${values.city.trim()}\n` +
      `<b>Відділення Нової пошти:</b> ${values.postOffice.trim() || ""}\n` +
      `<b>Промокод:</b> ${values.promocode?.trim()}\n` +
      `<b>Оплата:</b> ${values.payment.trim()}\n` +
      `<b>Список товарів:</b>\n ${orderedListProducts}\n` +
      `<b>Сума замовлення:</b> ${totalSum} грн\n`;

    const dataGoogle = {
      orderNumber,
      name: values.name.trim(),
      surname: values.surname.trim(),
      phone: values.phone.replace(/[^\d+]/g, ""),
      city: values.city.trim(),
      postOffice: values.postOffice.trim(),
      promocode: values.promocode.trim(),
      payment: values.payment.trim(),
      orderedListProducts,
      totalSum: `${totalSum} грн`,
    };

    await axios({
      method: "post",
      url: `${BASE_URL}api/telegram`,
      data: dataTelegram,
      headers: {
        "Content-Type": "application/json",
      },
    });

    await axios({
      method: "post",
      url: `${BASE_URL}api/googlesheet`,
      data: dataGoogle,
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsCheckoutPopUpShown(false);

    setIsNotificationShown(true);

    resetForm();

    clearCart();
  } catch (error) {
    setIsError(true);
    setIsNotificationShown(true);
    return error;
  } finally {
    setIsLoading(false);
  }
};
