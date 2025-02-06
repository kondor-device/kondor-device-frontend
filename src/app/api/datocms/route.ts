import { NextResponse } from "next/server";
import axios from "axios";
import { DATOCMS_URL } from "@/constants/constants";

const NEXT_DATOCMS_API_TOKEN = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN || "";

export async function POST(req: Request) {
  try {
    const { query, variables, includeDrafts } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const response = await axios.post(
      DATOCMS_URL,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${NEXT_DATOCMS_API_TOKEN}`,
          "Content-Type": "application/json",
          ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
        },
      }
    );

    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch data from DatoCMS",
    });
  }
}
