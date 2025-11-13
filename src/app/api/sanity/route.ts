import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";

export async function POST(req: NextRequest) {
  const { query, params } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid query" },
      { status: 400 }
    );
  }

  try {
    const data = await client.fetch(query, params || {});
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Sanity query failed" }, { status: 500 });
  }
}
