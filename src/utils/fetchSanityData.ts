import axios from "axios";

// Where /api/sanity is called:
// - in the browser: always the current origin;
// - on a Vercel preview deployment (server): the deployment itself. NEXT_PUBLIC_BASE_URL is
//   the production address, so a preview would otherwise read its data through the production
//   API (which runs the production code: no drafts, no unmerged features);
// - otherwise: NEXT_PUBLIC_BASE_URL.
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "/";

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/`;
  }

  return process.env.NEXT_PUBLIC_BASE_URL;
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
