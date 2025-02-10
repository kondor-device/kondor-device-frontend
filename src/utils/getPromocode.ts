import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getPromocode(query: string, code: string) {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}api/datocms`,
      data: {
        query,
        variables: { code },
        includeDrafts: false,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}
