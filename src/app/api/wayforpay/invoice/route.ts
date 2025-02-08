import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MERCHANT_ACCOUNT = process.env.MERCHANT_ACCOUNT;
const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
const MERCHANT_DOMAIN = "merchant.com.ua";

export async function POST(req: NextRequest) {
  if (!MERCHANT_SECRET_KEY) {
    throw new Error("MERCHANT_SECRET_KEY не визначено в середовищі!");
  }

  try {
    const body = await req.json();
    const {
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productPrice,
      productCount,
    } = body;

    // Формуємо рядок для підпису (СТРОГИЙ ПОРЯДОК!)
    const signString = [
      MERCHANT_ACCOUNT,
      MERCHANT_DOMAIN,
      orderReference,
      orderDate,
      Number(amount).toFixed(2),
      currency,
      productName.join(";"),
      productCount.join(";"),
      productPrice.map((item: string) => Number(item).toFixed(2)).join(";"),
    ].join(";");

    const hmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    hmac.update(signString, "utf8");
    const merchantSignature = hmac.digest("hex");

    const paymentData = {
      transactionType: "CREATE_INVOICE", // Вказуємо тип операції
      merchantAccount: MERCHANT_ACCOUNT,
      merchantDomainName: MERCHANT_DOMAIN,
      merchantAuthType: "SimpleSignature",
      merchantSignature,
      orderReference,
      amount: Number(amount).toFixed(2),
      orderDate,
      currency,
      productName,
      productCount,
      productPrice: productPrice.map((item: string) => Number(item).toFixed(2)),
      apiVersion: 1,
    };

    return NextResponse.json({ status: "success", paymentData });
  } catch (error) {
    console.error("Помилка генерації платежу:", error);
    return NextResponse.json(
      { error: "Помилка створення платежу" },
      { status: 500 }
    );
  }
}
