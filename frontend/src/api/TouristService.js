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

export async function updateTouristInformation(id, body) {
  try {
    console.log("the body ", body)

    const response = await axios.put(`/updateTourist`, body);
    console.log("after update", response.data)
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function redeemPoints(id) {
  try {

    const response = await axios.post(`/redeem`);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getTouristItineraries(touristId) {
  try {


    const response = await axios.get(`/itineraries/booked-itineraries`);

    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristActivities(touristId) {
  try {

    const response = await axios.get(`/activities`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist activities:", error);
    throw error;
  }

}

export async function getTouristUserName(touristId) {
  try {

    const response = await axios.get(`/tourist-name-email`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist name and email:", error);
    throw error;
  }
}

export async function getTouristFlights(touristId) {
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

export async function getTouristTags(touristId) {
  try {

    const response = await axios.get(`/tourist/preferences`);
    return response.data;
  } catch (error) {
    console.error("Error getting tags", error);
    throw error;
  }
}

export async function getTouristCategories(touristId) {
  try {

    const response = await axios.get(`/tourist/categories`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error);
    throw error;
  }
}

export async function checkTouristExists(touristId) {
  try {

    const response = await axios.get(`/tourist/exists`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}