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

export async function changeTouristPassword(id, oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    console.log(`/tourist-change-pass/${id}`);
    const response = await axios.put(`/tourist-change-pass/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
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

export async function redeemPoints(id) {
  try {
    const response = await axios.post(`/redeem/${id}`);
    return response.data;
  } catch (error) {
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

export async function getTouristUserName(touristId) {
  try {
    const response = await axios.get(`/tourist-name-email/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist name and email:", error);
    throw error;
  }
}

export async function getTouristFlights(touristId) {
  try {
    const response = await axios.get(`/tourist/flights/${touristId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error getting tourists' flights':", error);
    throw error;
  }
}

export async function getTouristAge(touristId) {
  try {
    const response = await axios.get(`/tourist/age/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting age", error);
    throw error;
  }
}

export async function getTouristTags(touristId) {
  try {
    const response = await axios.get(`/tourist/preferences/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting tags", error);
    throw error;
  }
}

export async function getTouristCategories(touristId) {
  try {
    const response = await axios.get(`/tourist/categories/${touristId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error);
    throw error;
  }
}
