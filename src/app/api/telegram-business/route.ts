import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const MAX_MESSAGE_LENGTH = 4096;

type TelegramBusinessRequest = {
  business_connection_id?: unknown;
  chat_id?: unknown;
  text?: unknown;
};

function isAuthorized(request: NextRequest, expectedSecret: string) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const providedSecret = authorization.slice("Bearer ".length);
  const providedBuffer = Buffer.from(providedSecret);
  const expectedBuffer = Buffer.from(expectedSecret);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

function normalizePayload(body: TelegramBusinessRequest) {
  const chatId =
    typeof body.chat_id === "number" || typeof body.chat_id === "string"
      ? String(body.chat_id).trim()
      : "";
  const businessConnectionId =
    typeof body.business_connection_id === "string"
      ? body.business_connection_id.trim()
      : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!/^-?\d+$/.test(chatId)) {
    return null;
  }

  if (!businessConnectionId || businessConnectionId.length > 256) {
    return null;
  }

  if (!text || text.length > MAX_MESSAGE_LENGTH) {
    return null;
  }

  return {
    business_connection_id: businessConnectionId,
    chat_id: chatId,
    text,
  };
}

export async function POST(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BUSINESS_BOT_TOKEN;
  const proxySecret = process.env.TELEGRAM_BUSINESS_PROXY_SECRET;

  if (!botToken || !proxySecret) {
    return NextResponse.json(
      { error: "Telegram Business proxy is not configured" },
      { status: 503 }
    );
  }

  if (!isAuthorized(request, proxySecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TelegramBusinessRequest;
  try {
    body = (await request.json()) as TelegramBusinessRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = normalizePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Invalid Telegram Business payload" },
      { status: 400 }
    );
  }

  try {
    const telegramResponse = await fetch(
      `${TELEGRAM_API_BASE_URL}/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const telegramResult = (await telegramResponse.json()) as {
      description?: string;
      ok?: boolean;
      result?: { message_id?: number };
    };

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram Business send failed", {
        description: telegramResult.description,
        status: telegramResponse.status,
      });

      return NextResponse.json(
        { error: "Telegram rejected the message" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message_id: telegramResult.result?.message_id,
      ok: true,
    });
  } catch (error) {
    console.error("Telegram Business request failed", error);
    return NextResponse.json(
      { error: "Telegram request failed" },
      { status: 502 }
    );
  }
}
