import { axios } from "./axios";

export async function getAllHistoricalPlaces() {
  try {
    const response = await axios.get("/historicalPlaces/");
    return response.data;
  } catch (error) {
    console.error("Can't fetch historical places", error);
    throw error;
  }
}
