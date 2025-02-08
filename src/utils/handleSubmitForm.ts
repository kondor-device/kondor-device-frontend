import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { generateOrderNumber } from "./generateOrderNumber";
import { getProductsByIds } from "@/utils/getProductsByIds";
import { GET_PRODUCTS_BY_IDS } from "@/lib/datoCmsQueries";
import { ProductItem } from "@/types/productItem";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsCheckoutPopUpShown: (value: boolean) => void,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  values: ValuesCheckoutFormType
) => {
  const { clearOrderData, setOrderData } = useOrderStore.getState();
  const { clearCart, cartItems } = useCartStore.getState();

  clearOrderData();

  //Формуємо номер замовлення
  const orderNumber = generateOrderNumber();

  setIsLoading(true);

  //Запитуємо з cms актуальні ціни на товари в кошику
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);
  const res = await getProductsByIds(GET_PRODUCTS_BY_IDS, cartItemsIds);

  //Оновлюємо ціни на товари в кошику
  const updatedCartItems = cartItems.filter((cartItem) => {
    const productFromCms = res.data?.allItems?.find(
      (product: ProductItem) => product.id === cartItem.id
    );

    if (productFromCms) {
      // Якщо товар знайдений, оновлюємо його ціни
      cartItem.price = productFromCms.price;
      cartItem.priceDiscount = productFromCms.priceDiscount;
      return true;
    }
    // Якщо товар не знайдений в CMS, виключаємо його з кошика
    return false;
  });

  //Розраховуємо суму замовлення з оновленими цінами
  const totalSum = updatedCartItems.reduce((total, item) => {
    const itemTotal =
      (item.priceDiscount && item.priceDiscount < item.price
        ? item.priceDiscount
        : item.price) * item.quantity;
    return total + itemTotal;
  }, 0);

  //Формуємо повну інформацію по замовленню
  const collectedOrderData = {
    orderNumber,
    name: values.name.trim(),
    surname: values.surname.trim(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    postOffice: values.postOffice.trim(),
    promocode: values.promocode.trim(),
    payment: values.payment.trim(),
    updatedCartItems,
    totalSum,
  };

  //Формуємо список товарів з переносами на новий рядок для Telegram та Google sheets
  const orderedListProducts = updatedCartItems
    .map(
      (cartItem) =>
        `- ${cartItem.generalName} ${cartItem.name}, колір: ${cartItem.color}`
    )
    .join("\n");

  const dataTelegram =
    `<b>Замовлення #${orderNumber}</b>\n` +
    `<b>Ім'я:</b> ${values.name.trim()}\n` +
    `<b>Прізвище:</b> ${values.surname.trim()}\n` +
    `<b>Телефон:</b> ${values.phone.replace(/[^\d+]/g, "")}\n` +
    `<b>Насeлений пункт:</b> ${values.city.trim()}\n` +
    `<b>Відділення Нової пошти:</b> ${values.postOffice.trim() || ""}\n` +
    `<b>Промокод:</b> ${values.promocode?.trim()}\n` +
    `<b>Оплата:</b> ${values.payment.trim()}\n` +
    `<b>Список товарів:</b>\n${orderedListProducts}\n` +
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

  console.log(collectedOrderData);

  setOrderData(collectedOrderData);

  const productName = updatedCartItems.map(
    (item) => `${item.generalName} ${item.name}, колір: ${item.color}`
  );
  const productPrice = updatedCartItems.map((item) =>
    Number(item.priceDiscount ?? item.price)
  );
  const productCount = updatedCartItems.map(() => 1);

  if (collectedOrderData.payment === "Онлайн оплата (Wayforpay)") {
    try {
      const { data } = await axios.post(`${BASE_URL}api/wayforpay/invoice`, {
        orderReference: `${orderNumber}`,
        orderDate: Math.floor(Date.now() / 1000),
        amount: 1, //Змінити потім на реальну суму
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
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
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
