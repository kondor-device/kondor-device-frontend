import { NextResponse } from "next/server";
import axios from "axios";

const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { cityRef, query } = await req.json();

    if (!cityRef) {
      return NextResponse.json(
        { error: "CityRef is required" },
        { status: 400 }
      );
    }

    const methodProperties = cityRef
      ? query && query.length
        ? { CityRef: cityRef, FindByString: query }
        : { CityRef: cityRef }
      : query && query.length
      ? { FindByString: query }
      : {};

    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties,
    });

    return NextResponse.json(response.data?.data || []);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}
