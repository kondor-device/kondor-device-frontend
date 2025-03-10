import axios from "axios";
import { OrderData } from "@/types/orderData";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendDataToKeyCrm(data: OrderData) {
  const {
    orderDate,
    orderNumber,
    name,
    surname,
    phone,
    city,
    postOffice,
    promocode,
    discount,
    payment,
    totalSum,
    updatedCartItems,
  } = data;

  const products = updatedCartItems.map((item) => ({
    price: item.actualPrice,
    quantity: item.quantity,
    name: `${item.generalName} ${item.name}`,
    sku: item.code,
  }));

  const crmOrderData = {
    source_id: 2,
    source_uuid: orderNumber,
    orderedAt: orderDate,
    promocode,
    discount_percent: discount,
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
