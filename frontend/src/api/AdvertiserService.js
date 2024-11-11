import { axios } from "./axios";

export async function createAdvertiser(newUser) {
  try {
    const response = await axios.post("/advertiser", newUser);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while creating the advertiser.");
  }
}
export async function getAdvertiser(id) {
  try {
    const response = await axios.get(`/advertiser/${id}`);
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
export async function updateAdvertiser(id, updatedUser) {
  try {
    const response = await axios.put(`/advertiser/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    throw error
  }
}
