import { axios } from "./axios";

export async function createAdvertiser(newUser) {
  try {
    await axios.post("/advertiser", newUser);
  } catch (error) {
    throw error;
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

export async function updateAdvertiser(id, updatedUser) {
  try {
    const response = await axios.put(`/advertiser/${id}`, updatedUser);
    return response.data; 
  } catch (error) {
    throw error; 
  }
}
