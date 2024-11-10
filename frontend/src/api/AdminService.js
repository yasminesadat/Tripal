import { axios } from "./axios";

export const getUsers = async () => {
  try {
    const response = await axios.get("/admin/users");
    console.log(response.data);
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

export const deleteUser = async (id) => {
  try {
    // Use backticks for template literals
    const response = await axios.delete(`/admin/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

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
  };
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

export const flagItinerary = async (itineraryId) => {
  try {
    const response = await axios.put(`/admin/flag-itinerary/${itineraryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error flagging itinerary with id ${itineraryId}`, error);
    throw error;
  }
};

export const getAdminItineraries = async () => {
  try {
    const response = await axios.get("/admin/itineraries");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
};

export const getPendingDeletionRequests = async () => {
  try {
    const response = await axios.get("/deletion-requests"); 
    console.log(response.data);
    return response.data;  
  } catch (error) {
    console.error("Error fetching pending deletion requests:", error);
    throw error;
  }
};

export const approveDeletionRequest = async (requestId) => {
  console.log(requestId, "in the service")
  try {
    const response = await axios.delete(`/deletion-request/approve/${requestId}`); 
    return response.data; 
  } catch (error) {
    console.error(`Error approving deletion request with ID ${requestId}:`, error);
    throw error;
  }
};

export const getAdminActivities = async () => {
  try {
    const response = await axios.get("/admin/activities");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Can't fetch activities", error);
    throw error;
  }
};

export const flagActivity = async (activityId) => {
  try {
    const response = await axios.put(`/admin/flag-activity/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error flagging activity with id ${activityId}`, error);
    throw error;
  }
};