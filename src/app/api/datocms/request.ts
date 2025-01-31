import { DATOCMS_URL } from "@/constants/constants";

const NEXT_DATOCMS_API_TOKEN = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN || "";

export const performRequest = async ({
  query = "",
  variables = {},
  includeDrafts = false,
}) => {
  const response = await fetch(DATOCMS_URL, {
    headers: {
      Authorization: `Bearer ${NEXT_DATOCMS_API_TOKEN}`,
      ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
    },
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(
        responseBody
      )}`
    );
  }

  return responseBody;
};
