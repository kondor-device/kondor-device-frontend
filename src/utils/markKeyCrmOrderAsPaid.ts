import axios from "axios";
import { CRM_API_URL } from "@/constants/constants";

const CRM_API_KEY = process.env.CRM_API_KEY;

interface KeyCrmPayment {
  id: number;
  status?: string;
}

interface KeyCrmOrder {
  id: number;
  source_uuid?: string;
  payments?: KeyCrmPayment[];
}

interface KeyCrmOrdersListResponse {
  data: KeyCrmOrder[];
}

/**
 * Позначає замовлення в KeyCRM як оплачене за номером замовлення (source_uuid),
 * який ми передаємо в KeyCRM при створенні замовлення (`sendDataToKeyCrm`) і
 * використовуємо як `orderReference` у Wayforpay.
 *
 * Викликається з колбека Wayforpay після успішної оплати (transactionStatus === "Approved").
 */
export async function markKeyCrmOrderAsPaid(orderReference: string) {
  if (!CRM_API_KEY) {
    console.error("CRM_API_KEY не визначено в середовищі!");
    return;
  }

  try {
    // 1. Знаходимо замовлення в KeyCRM за номером замовлення з сайту (source_uuid)
    const { data } = await axios.get<KeyCrmOrdersListResponse>(
      `${CRM_API_URL}/order`,
      {
        params: {
          "filter[source_uuid]": orderReference,
          include: "payments",
        },
        headers: {
          Authorization: `Bearer ${CRM_API_KEY}`,
        },
      }
    );

    const order = data?.data?.[0];

    if (!order) {
      console.error(
        `Не вдалося знайти замовлення в KeyCRM за source_uuid=${orderReference}`
      );
      return;
    }

    const payment =
      order.payments?.find((item) => item.status === "not_paid") ??
      order.payments?.[0];

    if (!payment) {
      console.error(
        `У замовленні KeyCRM #${order.id} (source_uuid=${orderReference}) не знайдено оплат для оновлення статусу`
      );
      return;
    }

    // 2. Оновлюємо статус конкретної оплати на "paid"
    await axios.put(
      `${CRM_API_URL}/order/${order.id}/payment/${payment.id}`,
      { status: "paid" },
      {
        headers: {
          Authorization: `Bearer ${CRM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Помилка оновлення статусу оплати в KeyCRM для замовлення ${orderReference}:`,
        error.response?.data || error.message
      );
      return;
    }
    console.error(
      `Невідома помилка оновлення статусу оплати в KeyCRM для замовлення ${orderReference}:`,
      error
    );
  }
}
