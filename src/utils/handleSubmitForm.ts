declare global {
  interface WayforpayData {
    orderReference: string;
    orderDate: number;
    amount: number;
    currency: string;
    productName: string[];
    productPrice: number[];
    productCount: number[];
  }

  interface Window {
    Wayforpay: {
      run: (data: WayforpayData) => void;
    };
  }
}

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
  const { clearOrderData, setOrderData, orderData } = useOrderStore.getState();
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

  const collectedOrderData = {
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

  setOrderData(collectedOrderData);

  const productName = cartItems.map(
    (item) => `${item.name} ${item.name}, колір: ${item.color}`
  );
  const productPrice = cartItems.map(
    (item) => item.priceDiscount ?? item.price
  );
  const productCount = cartItems.map(() => 1);

  if (values.payment.trim() === "Онлайн оплата (Wayforpay)") {
    console.log("старт оплати");
    try {
      const { data } = await axios.post(`${BASE_URL}api/wayforpay/invoice`, {
        orderReference: `#${orderNumber}`,
        orderDate: Math.floor(Date.now() / 1000),
        amount: totalSum,
        currency: "UAH",
        productName,
        productPrice,
        productCount,
      });

      if (data?.status === "success") {
        // Викликаємо платіжну форму WayForPay
        window.Wayforpay.run(data.paymentData);
      } else {
        console.error("Помилка створення платежу:", data.error);
      }
    } catch (error) {
      console.error("Помилка запиту на оплату:", error);
    }
  }

  try {
    setIsLoading(true);

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
