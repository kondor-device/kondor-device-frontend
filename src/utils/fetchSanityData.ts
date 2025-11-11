import axios from "axios";

const ensureTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return ensureTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL);
  }

  if (process.env.VERCEL_URL) {
    return ensureTrailingSlash(`https://${process.env.VERCEL_URL}`);
  }

  return "http://localhost:3000/";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch Sanity data");
  }
};
