import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getProducts(query: string) {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}api/datocms`,
      data: {
        query,
        variables: {},
        includeDrafts: false,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}
