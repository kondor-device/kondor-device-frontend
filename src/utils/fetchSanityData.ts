import axios from "axios";

const ensureTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ensureTrailingSlash(window.location.origin);
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return ensureTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL);
  }

  if (process.env.VERCEL_URL) {
    return ensureTrailingSlash(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return ensureTrailingSlash(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`);
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/";
  }

  return "https://kondor-device-frontend.vercel.app/";
};

export const fetchSanityData = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  const baseUrl = getBaseUrl();

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
