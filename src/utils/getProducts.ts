import { performRequest } from "@/app/api/datocms/route";

export const getProducts = async (query: string) => {
  try {
    const data = await performRequest({
      query,
    });
    return data;
  } catch (error) {
    return error;
  }
};
