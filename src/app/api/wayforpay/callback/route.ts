import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;

export async function POST(req: NextRequest) {
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

    const expectedSignature = crypto
      .createHash("md5")
      .update(signString)
      .digest("hex");

    if (merchantSignature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (transactionStatus === "Approved") {
      // Тут можна виконати додаткові дії: зберегти замовлення, відправити email тощо
      console.log(`✅ Платіж успішний: ${orderReference}`);
    } else {
      console.log(`❌ Платіж неуспішний: ${orderReference}`);
    }

    return NextResponse.json({ transactionStatus });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing callback" },
      { status: 500 }
    );
  }
}
