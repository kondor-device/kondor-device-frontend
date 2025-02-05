import { NextRequest, NextResponse } from "next/server";

import { sendDataToGoogleSheet } from "@/utils/sendDataToGoogleSheet";

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID || "";

const RANGE = "Аркуш1!A2:G2";

export async function POST(request: NextRequest) {
  const { name, surname, phone, city, postOffice, promocode, payment } =
    await request.json();

  if (request.method === "POST") {
    try {
      await sendDataToGoogleSheet(SPREADSHEET_ID, RANGE, [
        name,
        surname,
        phone,
        city,
        postOffice,
        promocode,
        payment,
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
