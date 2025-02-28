import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { generateOrderNumber } from "./generateOrderNumber";
import { getProductsByIds } from "@/utils/getProductsByIds";
import {
  GET_PRODUCTS_BY_IDS,
  GET_PROMOCODE_BY_CODE,
} from "@/lib/datoCmsQueries";
import { ProductItem } from "@/types/productItem";
import { useModalStore } from "@/store/modalStore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getPromocode } from "./getPromocode";
import { sendDataToKeyCrm } from "./sendDataToKeyCrm";
import { sendGTMEvent } from "@next/third-parties/google";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  values: ValuesCheckoutFormType,
  router: AppRouterInstance
) => {
  const { clearOrderData, setOrderData } = useOrderStore.getState();
  const { clearCart, cartItems, promocode } = useCartStore.getState();
  const { closeModal } = useModalStore.getState();

  clearOrderData();

  //Формуємо номер замовлення
  const orderNumber = generateOrderNumber();

  setIsLoading(true);

  //Запитуємо з cms актуальні ціни на товари в кошику
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);

  const resProducts = await getProductsByIds(GET_PRODUCTS_BY_IDS, cartItemsIds);

  //Запитуємо з cms актуальний промокод
  const resPromo = promocode
    ? await getPromocode(GET_PROMOCODE_BY_CODE, promocode)
    : null;
  const updatedDiscount = resPromo
    ? resPromo.data.allPromocodes[0].discount
    : 0;
  const updatedPromocode = resPromo
    ? resPromo.data.allPromocodes[0].promocode
    : null;

  //Оновлюємо ціни на товари в кошику
  const updatedCartItems = cartItems.filter((cartItem) => {
    const productFromCms = resProducts.data?.allItems?.find(
      (product: ProductItem) => product.id === cartItem.id
    );

    if (productFromCms) {
      // Якщо товар знайдений, оновлюємо його ціни
      cartItem.price = productFromCms.price;
      cartItem.priceDiscount = productFromCms.priceDiscount;
      cartItem.actualPrice = Math.floor(
        (!!productFromCms.priceDiscount &&
        productFromCms.priceDiscount < productFromCms.price
          ? productFromCms.priceDiscount
          : productFromCms.price) *
          (1 - updatedDiscount / 100)
      );
      return true;
    }
    // Якщо товар не знайдений в CMS, виключаємо його з кошика
    return false;
  });

  //Розраховуємо суму замовлення з оновленими цінами
  const totalSum = updatedCartItems.reduce((total, item) => {
    const itemTotal = item.actualPrice * item.quantity;
    return total + itemTotal;
  }, 0);

  // Формуємо дату та час замовлення
  const now = new Date();

  // Форматуємо дату
  const formattedDate = now.toLocaleDateString("uk-UA");

  // Форматуємо час
  const formattedTime = now.toLocaleTimeString("uk-UA");

  // Об'єднуємо дату та час
  const orderDate = `${formattedDate} ${formattedTime}`;

  // Формуємо повну інформацію по замовленню
  const collectedOrderData = {
    orderDate,
    orderNumber,
    name: values.name.trim(),
    surname: values.surname.trim(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    postOffice: values.postOffice.trim(),
    payment: values.payment.trim(),
    updatedCartItems,
    promocode: updatedPromocode,
    discount: updatedDiscount,
    totalSum,
  };

  // Формуємо список товарів з переносами на новий рядок для Telegram та Google sheets
  const orderedListProducts = updatedCartItems
    .map(
      (cartItem) =>
        `- ${cartItem.preorder ? "Передзамовлення: " : ""}${
          cartItem.generalName
        } ${cartItem.name}, колір: ${cartItem.color}`
    )
    .join("\n");

  // Формуємо дані для telegram
  const dataTelegram =
    `<b>Замовлення #${orderNumber}</b>\n` +
    `<b>Дата замовлення:</b> ${orderDate}\n` +
    `<b>Ім'я:</b> ${values.name.trim()}\n` +
    `<b>Прізвище:</b> ${values.surname.trim()}\n` +
    `<b>Телефон:</b> ${values.phone.replace(/[^\d+]/g, "")}\n` +
    `<b>Насeлений пункт:</b> ${values.city.trim()}\n` +
    `<b>Відділення Нової пошти:</b> ${values.postOffice.trim() || ""}\n` +
    `<b>Промокод:</b> ${values.promocode?.trim()}\n` +
    `<b>Оплата:</b> ${values.payment.trim()}\n` +
    `<b>Список товарів:</b>\n${orderedListProducts}\n` +
    `<b>Сума замовлення:</b> ${totalSum} грн\n`;

  // Формуємо дані для googlesheets
  const dataGoogle = {
    orderDate,
    orderNumber,
    name: values.name.trim(),
    surname: values.surname.trim(),
    phone: values.phone.replace(/[^\d+]/g, ""),
    city: values.city.trim(),
    postOffice: values.postOffice.trim(),
    promocode: values.promocode.trim(),
    payment: values.payment.trim(),
    orderedListProducts,
    totalSum,
  };

  setOrderData(collectedOrderData);

  // Формуємо дані для інвойсу
  const productName = updatedCartItems.map(
    (item) => `${item.generalName} ${item.name} колір: ${item.color}`
  );
  const productPrice = updatedCartItems.map((item) => Number(item.actualPrice));
  const productCount = updatedCartItems.map(() => 1);

  if (collectedOrderData.payment === "Онлайн оплата (Wayforpay)") {
    try {
      const { data } = await axios.post(`${BASE_URL}api/wayforpay/invoice`, {
        orderReference: `${orderNumber}`,
        orderDate: Math.floor(Date.now() / 1000),
        amount: totalSum, //Змінити потім на реальну суму
        currency: "UAH",
        productName,
        productPrice,
        productCount,
      });

      if (data?.status === "success") {
        if (typeof window !== "undefined") {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://secure.wayforpay.com/pay";
          form.target = "_blank";

          Object.entries(data.paymentData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // Якщо значення - масив, додаємо окремий інпут для кожного елемента
              value.forEach((item) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = `${key}[]`; // Додаємо [] до імені
                input.value = item.toString();
                form.appendChild(input);
              });
            } else {
              // Якщо значення не масив, додаємо звичайний інпут
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = String(value);
              form.appendChild(input);
            }
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      }
    } catch (error) {
      console.error("Помилка запиту на оплату:", error);
    }
  }

  try {
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

    await sendDataToKeyCrm(collectedOrderData);

    router.push("/uk/order-confirmation");

    setTimeout(() => closeModal(), 1000);

    resetForm();

    clearCart();

    sendGTMEvent({ event: "submit_order" });
  } catch (error) {
    setIsError(true);
    setIsNotificationShown(true);
    return error;
  } finally {
    setIsLoading(false);
  }
};
