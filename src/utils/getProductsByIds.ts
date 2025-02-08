import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getProductsByIds(query: string, productIds: string[]) {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}api/datocms`,
      data: {
        query,
        variables: { ids: productIds },
        includeDrafts: true,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}
