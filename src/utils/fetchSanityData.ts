import axios from "axios";

export const fetchSanityData = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL env variable");
  }

  try {
    const response = await axios.post(
      `${baseUrl}api/sanity`,
      {
        query,
        params,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { data: response.data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch Sanity data");
  }
};
