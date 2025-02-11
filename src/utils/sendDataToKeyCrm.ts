import axios from "axios";
import { OrderData } from "@/types/orderData";

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
    price: item.price,
    purchased_price: item.actualPrice,
    quantity: item.quantity,
    name: `${item.generalName} ${item.name}`,
  }));

  const crmOrderData = {
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
    payments: { payment_method: payment, amount: totalSum },
  };
  try {
    const response = await axios.post("/api/keycrm", crmOrderData, {
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
