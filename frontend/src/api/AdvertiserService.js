import { axios } from "./axios";

export async function createAdvertiser(newUser) {
  try {
    const response = await axios.post("/advertiser", newUser);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while creating the advertiser.");
  }
}
export async function getAdvertiser() {
  try {
    const response = await axios.get(`/advertiser`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching advertiser:', error);
    throw error;
  }
}
export async function changeAdvertiserPassword(id, oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    console.log(`/advertiser-change-pass/${id}`);
    const response = await axios.put(`/advertiser-change-pass/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}
export async function updateAdvertiser( updatedUser) {
  try {
    const response = await axios.put(`/advertiser`, updatedUser);
    return response.data;
  } catch (error) {
    throw error
  }
}

export const getNotifications = async () => {
  try {
    const response = await axios.get(`/advertiser/notificationList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications in service file:", error);
    throw error;
  }
};


export const deleteNotifications = async (id) => {
  try {
    const response = await axios.delete(`/advertiser/deleteNotificationList/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notifications in service file:", error);
    throw error;
  }
};

export const markNotification = async () => {
  try {
    const response = await axios.patch(`/advertiser/markNotifications`);
    return response.data;
  } catch (error) {
    console.error("Error marking notifications in service file:", error);
    throw error;
  }
};
