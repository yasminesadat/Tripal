import {axios} from "./axios";


export const createSeller = async (newSeller) => {
  try {
    const response = await axios.post(`/seller`, newSeller);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSellerDetails = async () => {
  try {
   console.log("hiiiiiiiiiiii");
    const response = await axios.get(`/seller`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateSeller = async (updatedData) => {
  try {
    console.log(updatedData)
    const response = await axios.put(`/seller`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export async function changeSellerPassword(oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    console.log(`/seller-change-pass`);
    const response = await axios.put(`seller-change-pass`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getNotifications = async () => {
  try {
    const response = await axios.get(`/seller/notificationList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications in service file:", error);
    throw error;
  }
};

export const markNotification = async () => {
  try {
    const response = await axios.patch(`/seller/markNotifications`);
    return response.data;
  } catch (error) {
    console.error("Error marking notifications in service file:", error);
    throw error;
  }
};
