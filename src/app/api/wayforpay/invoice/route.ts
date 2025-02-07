import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MERCHANT_ACCOUNT = process.env.MERCHANT_ACCOUNT; // Акаунт мерчанта
const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY; // Тестовий секретний ключ

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderReference, orderDate, amount, currency, products } = body;

    const signString = [
      MERCHANT_ACCOUNT,
      orderReference,
      orderDate,
      amount,
      currency,
      products.name.join(";"),
      products.count.join(";"),
      products.price.join(";"),
      MERCHANT_SECRET_KEY,
    ].join(";");

    const merchantSignature = crypto
      .createHash("md5")
      .update(signString)
      .digest("hex");

    const paymentData = {
      merchantAccount: MERCHANT_ACCOUNT,
      merchantDomainName: "example.com",
      orderReference,
      orderDate,
      amount,
      currency,
      productName: products.name,
      productCount: products.count,
      productPrice: products.price,
      merchantSignature,
      apiVersion: 1,
    };

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("Error sending payment invoice:", error);
    return NextResponse.json(
      { error: "Error generating payment request" },
      { status: 500 }
    );
  }
}
