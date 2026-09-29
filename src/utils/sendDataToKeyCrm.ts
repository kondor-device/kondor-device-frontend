import axios from "axios";
import { OrderData } from "@/types/orderData";
import { useUtmStore } from "@/store/utmStore";
import { expandItemsForCrm } from "@/utils/orderItems";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendDataToKeyCrm(data: OrderData) {
  const { utmData } = useUtmStore.getState();

  const {
    orderDate,
    orderedAtIso,
    orderNumber,
    name,
    surname,
    phone,
    city,
    postOffice,
    promocode,
    payment,
    totalSum,
    updatedCartItems,
  } = data;

  // Sets are expanded into their components: this is what makes the CRM write the real
  // products off the stock
  const products = expandItemsForCrm(updatedCartItems);

  const productsSum = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  if (productsSum !== totalSum) {
    console.error(
      `Сума позицій замовлення ${orderNumber} для KeyCRM (${productsSum}) не збігається із сумою оплати (${totalSum})`,
    );
  }

  const crmOrderData = {
    source_id: 2,
    source_uuid: orderNumber,
    // KeyCRM очікує UTC; локальний uk-рядок ігнорувався / підмінявся now.
    orderedAt: orderedAtIso || orderDate,
    promocode,
    buyer: { full_name: `${name} ${surname}`, phone },
    shipping: {
      shipping_service: "Нова пошта",
      shipping_address_city: city,
      shipping_receive_point: postOffice,
    },
    products,
    payments: [
      { payment_method: payment, amount: totalSum, status: "not_paid" },
    ],
    // Додаємо UTM-дані, якщо вони є
    ...(utmData && { marketing: utmData }),
  };

  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}api/keycrm`,
      data: crmOrderData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Помилка при відправці замовлення:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error || "Не вдалося створити замовлення"
      );
    }
    console.error("Невідома помилка:", error);
    throw new Error("Сталася невідома помилка");
  }
}
