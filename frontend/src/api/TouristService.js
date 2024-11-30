import { axios } from "./axios";

export async function createTourist(newUser) {
  try {
    const response = await axios.post("/createTourist", newUser);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
}

export async function changeTouristPassword(oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    const response = await axios.put(`/tourist-change-pass`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristInformation() {
  try {

    const response = await axios.get(`/getTouristInfo`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function updateTouristInformation(body) {
  try {
    const response = await axios.put(`/updateTourist`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function redeemPoints() {
  try {
    const response = await axios.post(`/redeem`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristItineraries() {
  try {
    const response = await axios.get(`/itineraries/booked-itineraries`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristActivities() {
  try {
    const response = await axios.get(`/booked-activities`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist activities:", error);
    throw error;
  }
}

export async function getTouristUserName() {
  try {
    const response = await axios.get(`/tourist-name-email`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist name and email:", error);
    throw error;
  }
}

export async function getTouristFlights() {
  try {
    const response = await axios.get(`/tourist/flights`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourists' flights':", error);
    throw error;
  }
}

export async function getTouristAge() {
  try {
    const response = await axios.get(`/tourist/age`);
    return response.data;
  } catch (error) {
    console.error("Error getting age", error);
    throw error;
  }
}

export async function getTouristTags() {
  try {
    const response = await axios.get(`/tourist/preferences`);
    return response.data;
  } catch (error) {
    console.error("Error getting tags", error);
    throw error;
  }
}

export async function getTouristCategories() {
  try {
    const response = await axios.get(`/tourist/categories`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error);
    throw error;
  }
}

export async function checkTouristExists() {
  try {
    const response = await axios.get(`/tourist/exists`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function bookmarkEvent(eventId, eventType) {
  try {
    const response = await axios.post('/tourist/bookmark', { eventId, eventType });
    return response.data;
  } catch (error) {
    console.error("Error bookmarking event:", error);
    throw error;
  }
}

export async function getBookmarkedEvents() {
  try {
    const response = await axios.get('/tourist/bookmarks');
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
