import { NextResponse } from "next/server";
import axios from "axios";

const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const methodProperties =
      query && query.length ? { FindByString: query } : {};

    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: methodProperties,
    });

    return NextResponse.json(response.data?.data || []);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
