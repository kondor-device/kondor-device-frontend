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
  setIsCheckoutPopUpShown: Dispatch<SetStateAction<boolean>>,
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
      .map((cartItem) => `${cartItem.generalName} ${cartItem.name}`)
      .join(", ");

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
      `Ім'я: ${values.name.trim()}\n` +
      `Прізвище: ${values.surname.trim()}\n` +
      `Телефон: +38${values.phone.replace(/[^\d+]/g, "")}\n` +
      `Насeлений пункт: ${values.city.trim()}\n` +
      `Відділення Нової пошти: ${values.postOffice.trim() || ""}\n` +
      `Промокод: ${values.promocode?.trim()}\n` +
      `Оплата: ${values.payment.trim()}\n` +
      `Список товарів: ${orderedListProducts}\n` +
      `Сума замовлення: ${totalSum} грн\n`;

    const dataGoogle = {
      orderNumber,
      name: values.name.trim(),
      surname: values.surname.trim(),
      phone: values.phone.trim(),
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
