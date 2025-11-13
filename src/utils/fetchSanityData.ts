import axios from "axios";

export const fetchSanityData = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      console.error(
        `[fetchSanityData] Axios error`,
        JSON.stringify(
          {
            status,
            statusText,
            message,
            url: `${baseUrl}api/sanity`,
          },
          null,
          2
        )
      );
    } else {
      console.error("[fetchSanityData] Unknown error", error);
    }

    throw new Error("Failed to fetch Sanity data");
  }
};
