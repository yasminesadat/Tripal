import { axios } from "./axios";

export async function viewItineraries() {
  try {
    const response = await axios.get("/itinerary/view");
    return response.data;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
}
