import { axios } from "./axios";

export async function createTourist(newUser) {
  try {
    const response = await axios.post("/createTourist", newUser);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    console.log("ERRPR MESSAGE", errorMessage)
    throw new Error(errorMessage);

  }
}

export async function getTouristInformation(id) {
  try {
    const response = await axios.get(`/getTouristInfo/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function updateTouristInformation(id, body) {
  try {
    console.log("the body ", body)
    const response = await axios.put(`/updateTourist/${id}`, body);
    console.log("after update", response.data)
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function bookItinerary(itineraryId, touristId) {
  try {
    console.log("touristId iam here before failure", touristId);
    const response = await axios.post(`/itineraries/${itineraryId}/book`,  {touristId });
    console.log("response:", response.data);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function redeemPoints(id) {
  try {
    const response = await axios.post(`/redeem/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }}

export async function cancelBooking(itineraryId, touristId) {
  try {
    const response = await axios.post(`/itineraries/${itineraryId}/cancel`, { touristId });
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristItineraries(touristId) {
  try {
    const response = await axios.get(`/itineraries/booked-itineraries/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristActivities(touristId) {
  try {
    const response = await axios.get(`/activities/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist activities:", error);
    throw error;
  }
}