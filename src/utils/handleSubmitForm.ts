import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";
import axios from "axios";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { generateOrderNumber } from "./generateOrderNumber";
import { getProductsByIds } from "@/utils/getProductsByIds";
import { GET_PRODUCTS_BY_IDS, GET_PROMOCODE_BY_CODE } from "@/lib/queries";
import { ProductItem } from "@/types/productItem";
import { useModalStore } from "@/store/modalStore";
import { useRouter } from "@/i18n/routing";
import { getPromocode } from "./getPromocode";
import { sendDataToKeyCrm } from "./sendDataToKeyCrm";
import { sendGTMEvent } from "@next/third-parties/google";
import { useUtmStore } from "@/store/utmStore";

export type SubmitFormResult =
  | { success: true }
  | { success: false; reason: "out_of_stock" }
  | { success: false; reason: "error" };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const handleSubmitForm = async <T>(
  { resetForm }: FormikHelpers<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>,
  values: ValuesCheckoutFormType,
  router: ReturnType<typeof useRouter>
): Promise<SubmitFormResult> => {
  const { clearOrderData, setOrderData } = useOrderStore.getState();
  const { clearCart, cartItems, promocode } = useCartStore.getState();
  const { closeModal } = useModalStore.getState();
  const { utmData, clearUtmData } = useUtmStore.getState();

  clearOrderData();

  //Формуємо номер замовлення
  const orderNumber = generateOrderNumber();

  setIsLoading(true);

  //Запитуємо з cms актуальні ціни на товари в кошику
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);

  const resProducts = await getProductsByIds(GET_PRODUCTS_BY_IDS, cartItemsIds);

  const productsFromCms: ProductItem[] = resProducts.data?.allItems ?? [];

  const { outOfStockCount } =
    useCartStore.getState().syncWithCmsProducts(productsFromCms);

  if (outOfStockCount > 0) {
    setIsLoading(false);
    return { success: false, reason: "out_of_stock" };
  }

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

  useCartStore
    .getState()
    .syncWithCmsProducts(productsFromCms, { discount: updatedDiscount });

  const updatedCartItems = useCartStore.getState().cartItems;

  //Розраховуємо суму замовлення з оновленими цінами
  const totalSum = updatedCartItems.reduce((total, item) => {
    const itemTotal = item.actualPrice * item.quantity;
    return total + itemTotal;
  }, 0);

  // Дата для Telegram / Sheets (локальний uk-формат) і для KeyCRM (UTC ISO)
  const now = new Date();
  const orderDate = `${now.toLocaleDateString("uk-UA")} ${now.toLocaleTimeString("uk-UA")}`;
  const orderedAtIso = now.toISOString();

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
    `<b>Сума замовлення:</b> ${totalSum} грн\n` +
    `<b>Utm source:</b> ${utmData?.utm_source}\n`;

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

  try {
    // 1) Telegram — операційне підтвердження для менеджерів
    await axios({
      method: "post",
      url: `${BASE_URL}api/telegram`,
      data: dataTelegram,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 2) KeyCRM — обов'язково ДО відкриття Wayforpay.
    // Раніше оплата відкривалась у новій вкладці до створення замовлення в CRM:
    // на мобільному браузер тротлить/вбиває фонову вкладку після Telegram,
    // і виклик KeyCRM (або Sheets перед ним) так і не виконувався.
    await sendDataToKeyCrm({ ...collectedOrderData, orderedAtIso });

    // Purchase / аналітика — після того, як замовлення прийнято в Telegram+CRM.
    // Не залежить від Google Sheets / Wayforpay.
    sendGTMEvent({
      event: "submit_order",
      order_number: orderNumber,
      value: totalSum,
      currency: "UAH",
      items: updatedCartItems.map((item) => ({
        item_id: item.code || item.id,
        item_name: `${item.generalName} ${item.name}`.trim(),
        item_variant: item.color,
        price: item.actualPrice,
        quantity: item.quantity,
      })),
      user_data: {
        phone: values.phone.replace(/[^\d+]/g, ""),
        first_name: values.name.trim(),
        last_name: values.surname.trim(),
        city: values.city.trim(),
      },
    });

    // 3) Google Sheets — best-effort: помилка не повинна зривати KeyCRM / оплату
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}api/googlesheet`,
        data: dataGoogle,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (sheetsError) {
      console.error("Помилка запису в Google Sheets:", sheetsError);
    }

    // 4) Wayforpay — тільки коли замовлення вже є в KeyCRM (callback зможе mark-as-paid)
    if (collectedOrderData.payment === "Онлайн оплата (Wayforpay)") {
      try {
        const productName = updatedCartItems.map(
          (item) => `${item.generalName} ${item.name} колір: ${item.color}`
        );
        const productPrice = updatedCartItems.map((item) =>
          Number(item.actualPrice)
        );
        const productCount = updatedCartItems.map((item) => item.quantity);

        const { data } = await axios.post(`${BASE_URL}api/wayforpay/invoice`, {
          orderReference: `${orderNumber}`,
          orderDate: Math.floor(Date.now() / 1000),
          amount: totalSum,
          currency: "UAH",
          productName,
          productPrice,
          productCount,
        });

        if (data?.status === "success" && typeof window !== "undefined") {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://secure.wayforpay.com/pay";
          form.target = "_blank";

          Object.entries(data.paymentData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = `${key}[]`;
                input.value = item.toString();
                form.appendChild(input);
              });
            } else {
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
      } catch (error) {
        console.error("Помилка запиту на оплату:", error);
      }
    }

    router.push("/order-confirmation");

    setTimeout(() => closeModal(), 1000);

    resetForm();

    clearCart();

    clearUtmData();

    return { success: true };
  } catch (error) {
    console.error("Помилка оформлення замовлення:", error);
    setIsError(true);
    setIsNotificationShown(true);
    return { success: false, reason: "error" };
  } finally {
    setIsLoading(false);
  }
};
