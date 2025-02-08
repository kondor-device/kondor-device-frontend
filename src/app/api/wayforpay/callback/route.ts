import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!MERCHANT_SECRET_KEY) {
    throw new Error("MERCHANT_SECRET_KEY не визначено в середовищі!");
  }

  try {
    const body = await req.json();
    const {
      merchantAccount,
      orderReference,
      transactionStatus,
      amount,
      currency,
      merchantSignature,
    } = body;

    // Формуємо підпис для перевірки
    const signString = [
      merchantAccount,
      orderReference,
      amount,
      currency,
      transactionStatus,
      MERCHANT_SECRET_KEY,
    ].join(";");

    const hmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    hmac.update(signString, "utf8");
    const expectedSignature = hmac.digest("hex");

    if (merchantSignature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let statusMessage = "";
    let orderStatus = "";

    if (transactionStatus === "Approved") {
      statusMessage = `✅ Платіж успішний: Замовлення #${orderReference} оплачено на суму ${amount} ${currency}`;
      orderStatus = "success";
      console.log(`✅ Платіж успішний: ${orderReference}`);
    } else {
      statusMessage = `❌ Платіж неуспішний: Замовлення #${orderReference} не було оплачено`;
      orderStatus = "failed";
      console.log(`❌ Платіж неуспішний: ${orderReference}`);
    }

    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}api/telegram`, {
      text: statusMessage,
    });

    return NextResponse.json({ transactionStatus: orderStatus });
  } catch (error) {
    console.error("Помилка обробки платежу:", error);
    return NextResponse.json(
      { error: "Помилка обробки платежу" },
      { status: 500 }
    );
  }
}
