import { axios } from "./axios";

export const getUsers = async () => {
  try {
    const response = await axios.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Can't return users", error);
    throw error;
  }
}

export async function changeAdminPassword(id, oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    console.log(`/admin-change-pass/${id}`);
    const response = await axios.put(`/admin-change-pass/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTotalUsers(){
  try {
   
    const response = await axios.get(`/admin/getTotalUsers`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function deleteUser(role, userId) {
  try {
    console.log("delete userr")
    const response = await axios.delete(`/admin/user/${role}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${userId}:`, error);
    throw error;
  }
}



export const createAdmin = async (name, password) => {
  const requestBody = {
    userName: name,
    password: password
  };
  try {
    const response = await axios.post(`/admin/addAdmin`, requestBody);
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    console.log("ERRPR MESSAGE", errorMessage)
    throw new Error(errorMessage);
  }
}

export const createGovernor = async (name, password) => {
  const requestBody = {
    userName: name,
    password: password
  };
  try {
    const response = await axios.post(`/governor`, requestBody);
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    console.log("ERRPR MESSAGE", errorMessage)
    throw new Error(errorMessage);
  }
}

export const flagItinerary = async (itineraryId,userData) => {
  try {
    const response = await axios.put(`/admin/flag-itinerary/${itineraryId}`,userData);
    return response.data;
  } catch (error) {
    console.error(`Error flagging itinerary with id ${itineraryId}`, error);
    throw error;
  }
};

export const getAdminItineraries = async () => {
  try {
    const response = await axios.get("/admin/itineraries");
    return response;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
};

export const getAdminActivities = async () => {
  try {
    const response = await axios.get("/admin/activities");
    return response;
  } catch (error) {
    console.error("Can't fetch activities", error);
    throw error;
  }
};

export const flagActivity = async (activityId,userData) => {
  try {
    const response = await axios.patch(`/admin/flag-activity/${activityId}`,userData);
    return response.data;
  } catch (error) {
    console.error(`Error flagging activity with id ${activityId}`, error);
    throw error;
  }
};

export const getEventOwnerData = async (userId) => {
  try {
    const response = await axios.get(`/admin/getDataForEventOwner/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting data for event owner with id ${userId}`, error);
    throw error;
  }
};