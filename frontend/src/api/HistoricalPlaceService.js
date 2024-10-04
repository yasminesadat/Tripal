import { axios } from "./axios";

export async function getAllHistoricalPlaces() {
  try {
    const response = await axios.get("/historicalPlaces/");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Can't fetch historical places", error);
    throw error;
  }
}
