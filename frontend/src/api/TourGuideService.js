import { axios } from "./axios";

export const createTourGuide = async (newUser) => {
  try {
    const response = await axios.post("/tourGuide", newUser);
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateProfile = async (Data) => {
  try {
    const response = await axios.patch(`/tourGuide`, Data);
    return response;
  } catch (error) {
    console.error("Error updating your profile:", error);
    throw error;
  }
};

export const getProfileData = async () => {
  try {
    const response = await axios.get(`/tourGuide`);
    return response;
  } catch (error) {
    console.error("Error fetch your profile data:", error);
    throw error;
  }
};

export const getRatings = async (id) => {
  try {
    const response = await axios.get(`/tourGuide/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(`/tourGuide/notificationList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications in service file:", error);
    throw error;
  }
};

export const deleteNotifications = async (id) => {
  try {
    const response = await axios.delete(`/tourGuide/deleteNotificationList/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notifications in service file:", error);
    throw error;
  }
};

export const markNotification = async () => {
  try {
    const response = await axios.patch(`/tourGuide/markNotifications`);
    return response.data;
  } catch (error) {
    console.error("Error marking notifications in service file:", error);
    throw error;
  }
};

export const addRating = async (tourGuideID, ratingData) => {
  try {
    const response = await axios.post(
      `/tourGuide/${tourGuideID}/ratings`,
      ratingData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

export async function changeTourGuidePassword(oldPassword, newPassword) {
  try {
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    console.log(`/tourGuide-change-pass`);
    const response = await axios.put(`/tourGuide-change-pass`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}