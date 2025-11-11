import axios from "axios";

export const fetchSanityData = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const response = await axios.post(
      `${baseUrl}/api/sanity`,
      {
        query,
        params,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch Sanity data");
  }
};
