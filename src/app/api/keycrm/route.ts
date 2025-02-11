import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CRM_API_URL } from "@/constants/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const API_KEY = process.env.KEYCRM_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API ключ не налаштований" },
        { status: 500 }
      );
    }

    const response = await axios.post(CRM_API_URL, body, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Помилка при створенні замовлення в KeyCRM:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        { error: error.response?.data || "Помилка сервера" },
        { status: error.response?.status || 500 }
      );
    }
    console.error("Невідома помилка:", error);
    return NextResponse.json({ error: "Невідома помилка" }, { status: 500 });
  }
}
