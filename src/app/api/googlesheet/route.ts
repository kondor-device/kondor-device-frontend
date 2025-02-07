import { NextRequest, NextResponse } from "next/server";

import { sendDataToGoogleSheet } from "@/utils/sendDataToGoogleSheet";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";

const RANGE = "Аркуш1!A2";

export async function POST(request: NextRequest) {
  const {
    orderNumber,
    name,
    surname,
    phone,
    city,
    postOffice,
    promocode,
    payment,
    orderedListProducts,
    totalSum,
  } = await request.json();

  if (request.method === "POST") {
    try {
      await sendDataToGoogleSheet(SPREADSHEET_ID, RANGE, [
        orderNumber,
        name,
        surname,
        phone,
        city,
        postOffice,
        promocode,
        payment,
        orderedListProducts,
        totalSum,
      ]);

      return NextResponse.json({ message: "Data appended successfully" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to append data to the sheet" },
        { status: 500 }
      );
    }
  }
}
